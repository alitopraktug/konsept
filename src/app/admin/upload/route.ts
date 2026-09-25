import { randomUUID } from "node:crypto";
import { getAdmin } from "@/lib/auth";
import { detectImageType } from "@/lib/image-type";
import { checkRateLimit, hashKey } from "@/lib/rate-limit";
import { PRODUCT_IMAGE_BUCKET } from "@/lib/supabase/config";
import { ALLOWED_UPLOAD_TYPES, MAX_UPLOAD_BYTES } from "@/lib/validation";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const json = (body: Record<string, unknown>, status: number) =>
  Response.json(body, { status, headers: { "Cache-Control": "no-store" } });

/**
 * Ürün görseli yükleme. Sunucu tarafında: aynı-origin kontrolü → admin doğrulaması →
 * hız sınırı → boyut/tip/içerik (magic byte) kontrolü → kullanıcı oturumuyla Storage'a yazma
 * (Storage RLS ayrıca is_admin() ister).
 */
export async function POST(request: Request) {
  // CSRF: aynı origin dışındaki istekleri reddet (SameSite=Lax çerezine ek olarak)
  const fetchSite = request.headers.get("sec-fetch-site");
  if (fetchSite && fetchSite !== "same-origin") return json({ error: "İstek reddedildi." }, 403);
  const origin = request.headers.get("origin");
  if (origin) {
    try {
      if (new URL(origin).host !== request.headers.get("host")) return json({ error: "İstek reddedildi." }, 403);
    } catch {
      return json({ error: "İstek reddedildi." }, 403);
    }
  }

  const admin = await getAdmin();
  if (!admin) return json({ error: "Bu işlem için yetkiniz yok. Lütfen tekrar giriş yapın." }, 401);

  if (!(await checkRateLimit(`upload:${hashKey(admin.user.id)}`, 60, 600))) {
    return json({ error: "Çok fazla yükleme denemesi. Lütfen biraz bekleyin." }, 429);
  }

  const declared = Number(request.headers.get("content-length") ?? 0);
  if (declared > MAX_UPLOAD_BYTES + 256 * 1024) {
    return json({ error: "Dosya çok büyük. En fazla 4 MB yükleyebilirsiniz." }, 413);
  }

  const form = await request.formData().catch(() => null);
  const file = form?.get("file");
  if (!(file instanceof File) || file.size === 0) return json({ error: "Geçerli bir dosya seçin." }, 400);
  if (file.size > MAX_UPLOAD_BYTES) return json({ error: "Dosya çok büyük. En fazla 4 MB yükleyebilirsiniz." }, 413);
  if (!(ALLOWED_UPLOAD_TYPES as readonly string[]).includes(file.type)) {
    return json({ error: "Yalnızca JPG, PNG veya WebP yükleyebilirsiniz." }, 415);
  }

  const bytes = new Uint8Array(await file.arrayBuffer());
  const detected = detectImageType(bytes);
  if (!detected) return json({ error: "Dosya geçerli bir görsel değil. JPG, PNG veya WebP yükleyin." }, 415);

  // Dosya adı kullanıcıdan alınmaz; tahmin edilemez, benzersiz bir ad üretilir.
  const path = `products/${randomUUID()}.${detected.ext}`;
  const { error } = await admin.supabase.storage.from(PRODUCT_IMAGE_BUCKET).upload(path, bytes, {
    contentType: detected.mime,
    cacheControl: "31536000",
    upsert: false,
  });
  if (error) {
    console.error("Görsel yüklenemedi:", error.message);
    return json({ error: "Görsel yüklenemedi. Lütfen tekrar deneyin." }, 500);
  }

  const { data } = admin.supabase.storage.from(PRODUCT_IMAGE_BUCKET).getPublicUrl(path);
  return json({ url: data.publicUrl }, 201);
}
