"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getAdmin } from "@/lib/auth";
import { checkRateLimit, clientIp, hashKey } from "@/lib/rate-limit";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isSupabaseConfigured, PRODUCT_IMAGE_BUCKET, storagePublicPrefix } from "@/lib/supabase/config";
import { loginSchema, productSchema, uuidSchema, type ProductInput } from "@/lib/validation";

export type LoginState = { error: string; email?: string } | null;

export type ActionResult =
  | { ok: true; id?: string }
  | { ok: false; error: string; fieldErrors?: Record<string, string> };

const LOGIN_FAILED = "E-posta veya şifre hatalı.";
const NOT_AUTHORIZED = "Bu işlem için yetkiniz yok. Lütfen tekrar giriş yapın.";
const SAVE_FAILED = "Değişiklikler kaydedilemedi. Lütfen tekrar deneyin.";

/* ------------------------------------------------------------------ auth */

export async function loginAction(_prev: LoginState, formData: FormData): Promise<LoginState> {
  if (!isSupabaseConfigured()) return { error: "Yönetim paneli henüz yapılandırılmadı." };

  const rawEmail = typeof formData.get("email") === "string" ? (formData.get("email") as string).slice(0, 254) : "";
  const parsed = loginSchema.safeParse({ email: rawEmail, password: formData.get("password") });
  if (!parsed.success) return { error: LOGIN_FAILED, email: rawEmail };
  const { email, password } = parsed.data;

  // Brute force azaltma: IP başına ve IP+e-posta başına 15 dakikada sınırlı deneme.
  const ip = await clientIp();
  const [ipOk, pairOk] = await Promise.all([
    checkRateLimit(`login:ip:${hashKey(ip)}`, 20, 900),
    checkRateLimit(`login:pair:${hashKey(ip, email)}`, 5, 900),
  ]);
  if (!ipOk || !pairOk) return { error: "Çok fazla deneme yapıldı. Lütfen birkaç dakika sonra tekrar deneyin.", email };

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  // Kullanıcının var olup olmadığını açığa çıkarmamak için her başarısızlıkta aynı mesaj.
  if (error || !data.user) return { error: LOGIN_FAILED, email };

  const { data: isAdmin } = await supabase.rpc("is_admin");
  if (isAdmin !== true) {
    await supabase.auth.signOut();
    return { error: LOGIN_FAILED, email };
  }

  redirect("/admin");
}

export async function logoutAction() {
  if (isSupabaseConfigured()) {
    const supabase = await createSupabaseServerClient();
    await supabase.auth.signOut(); // oturumu Supabase tarafında da geçersiz kılar, çerezleri siler
  }
  redirect("/admin/giris");
}

/* -------------------------------------------------------------- products */

function toRow(input: ProductInput) {
  return {
    name: input.name,
    slug: input.slug,
    short_description: input.short_description,
    description: input.description,
    price: Math.round(input.price * 100) / 100,
    unit: input.unit,
    stock_status: input.stock_status,
    cover_image: input.cover_image,
    images: input.images,
    featured: input.featured,
    active: input.active,
    display_order: input.display_order,
    ripeness_enabled: input.ripeness_enabled,
  };
}

function validationFailure(error: import("zod").ZodError): ActionResult {
  const fieldErrors: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "form");
    fieldErrors[key] ??= issue.message;
  }
  return { ok: false, error: "Lütfen işaretli alanları kontrol edin.", fieldErrors };
}

function dbFailure(error: { code?: string; message: string }): ActionResult {
  if (error.code === "23505") {
    return { ok: false, error: "Bu slug başka bir üründe kullanılıyor.", fieldErrors: { slug: "Bu slug başka bir üründe kullanılıyor." } };
  }
  console.error("Veritabanı hatası:", error.code ?? "", error.message);
  return { ok: false, error: SAVE_FAILED };
}

function refreshPublicPages() {
  revalidatePath("/", "layout");
}

/** Sahibi olduğumuz bucket'taki dosyaları (varsa) temizler. Başarısızlık akışı bozmaz. */
async function removeStorageFiles(supabase: NonNullable<Awaited<ReturnType<typeof getAdmin>>>["supabase"], urls: string[]) {
  const prefix = storagePublicPrefix();
  if (!prefix) return;
  const paths = urls.filter((u) => u.startsWith(prefix)).map((u) => u.slice(prefix.length));
  if (paths.length === 0) return;
  const { error } = await supabase.storage.from(PRODUCT_IMAGE_BUCKET).remove(paths);
  if (error) console.error("Eski görseller silinemedi:", error.message);
}

export async function createProductAction(input: unknown): Promise<ActionResult> {
  const admin = await getAdmin();
  if (!admin) return { ok: false, error: NOT_AUTHORIZED };

  const parsed = productSchema.safeParse(input);
  if (!parsed.success) return validationFailure(parsed.error);

  const { data, error } = await admin.supabase.from("products").insert(toRow(parsed.data)).select("id").single();
  if (error) return dbFailure(error);

  refreshPublicPages();
  return { ok: true, id: data.id as string };
}

export async function updateProductAction(id: string, input: unknown): Promise<ActionResult> {
  const admin = await getAdmin();
  if (!admin) return { ok: false, error: NOT_AUTHORIZED };
  if (!uuidSchema.safeParse(id).success) return { ok: false, error: SAVE_FAILED };

  const parsed = productSchema.safeParse(input);
  if (!parsed.success) return validationFailure(parsed.error);

  const { data: before } = await admin.supabase.from("products").select("cover_image, images").eq("id", id).maybeSingle();

  const { data, error } = await admin.supabase.from("products").update(toRow(parsed.data)).eq("id", id).select("id").maybeSingle();
  if (error) return dbFailure(error);
  if (!data) return { ok: false, error: SAVE_FAILED }; // RLS engeli veya kayıt yok

  if (before) {
    const kept = new Set([parsed.data.cover_image, ...parsed.data.images]);
    const old = [before.cover_image as string | null, ...((before.images as string[]) ?? [])].filter(
      (u): u is string => Boolean(u) && !kept.has(u),
    );
    await removeStorageFiles(admin.supabase, old);
  }

  refreshPublicPages();
  return { ok: true, id };
}

export async function deleteProductAction(id: string): Promise<ActionResult> {
  const admin = await getAdmin();
  if (!admin) return { ok: false, error: NOT_AUTHORIZED };
  if (!uuidSchema.safeParse(id).success) return { ok: false, error: "Ürün silinemedi. Lütfen tekrar deneyin." };

  const { data: before } = await admin.supabase.from("products").select("cover_image, images").eq("id", id).maybeSingle();
  const { data, error } = await admin.supabase.from("products").delete().eq("id", id).select("id").maybeSingle();
  if (error || !data) {
    if (error) console.error("Ürün silinemedi:", error.code ?? "", error.message);
    return { ok: false, error: "Ürün silinemedi. Lütfen tekrar deneyin." };
  }

  if (before) {
    await removeStorageFiles(
      admin.supabase,
      [before.cover_image as string | null, ...((before.images as string[]) ?? [])].filter((u): u is string => Boolean(u)),
    );
  }

  refreshPublicPages();
  return { ok: true };
}
