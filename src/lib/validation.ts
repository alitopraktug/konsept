import { z } from "zod";
import { STOCK_STATUSES, UNITS } from "./types.ts";

/**
 * Hem tarayıcıda (React Hook Form) hem sunucuda (server action) kullanılan ortak şema.
 * Asıl doğrulama sunucudadır; istemci tarafı yalnızca kullanıcı deneyimi içindir.
 */

export const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const LOCAL_IMAGE_RE = /^\/images\/[A-Za-z0-9/_\-.]+\.(?:webp|jpe?g|png)$/;

/** Kabul edilen görsel kaynakları: sitenin kendi /images klasörü veya kendi Supabase Storage bucket'ı */
export function isAllowedImageRef(value: string): boolean {
  if (value.length > 600 || value.includes("..")) return false;
  if (LOCAL_IMAGE_RE.test(value)) return true;
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim().replace(/\/+$/, "");
  if (!base) return false;
  const prefix = `${base}/storage/v1/object/public/product-images/`;
  return value.startsWith(prefix) && /^[A-Za-z0-9/_\-.]+\.(?:webp|jpe?g|png)$/.test(value.slice(prefix.length));
}

const imageRef = z.string().refine(isAllowedImageRef, "Geçersiz görsel adresi.");

export const productSchema = z.object({
  name: z
    .string({ error: "Ürün adı gereklidir." })
    .trim()
    .min(1, "Ürün adı boş olamaz.")
    .max(120, "Ürün adı en fazla 120 karakter olabilir."),
  slug: z
    .string({ error: "Slug gereklidir." })
    .trim()
    .toLowerCase()
    .min(1, "Slug boş olamaz.")
    .max(80, "Slug en fazla 80 karakter olabilir.")
    .regex(SLUG_RE, "Slug yalnızca küçük harf, rakam ve tire içerebilir (örn. ejderha-meyvesi)."),
  short_description: z.string().trim().max(300, "Kısa açıklama en fazla 300 karakter olabilir."),
  description: z.string().trim().max(5000, "Açıklama en fazla 5000 karakter olabilir."),
  price: z
    .number({ error: "Fiyat sayı olmalıdır." })
    .refine(Number.isFinite, "Fiyat sayı olmalıdır.")
    .min(0, "Fiyat negatif olamaz.")
    .max(1_000_000, "Fiyat çok yüksek."),
  unit: z.enum(UNITS, { error: "Geçerli bir birim seçin." }),
  stock_status: z.enum(STOCK_STATUSES, { error: "Geçerli bir stok durumu seçin." }),
  cover_image: imageRef.nullable(),
  images: z.array(imageRef).max(8, "En fazla 8 ek görsel eklenebilir."),
  featured: z.boolean(),
  active: z.boolean(),
  display_order: z
    .number({ error: "Sıra sayı olmalıdır." })
    .int("Sıra tam sayı olmalıdır.")
    .min(0, "Sıra negatif olamaz.")
    .max(100000),
  ripeness_enabled: z.boolean(),
});

export type ProductInput = z.infer<typeof productSchema>;

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email().max(254),
  password: z.string().min(1).max(200),
});

export const uuidSchema = z.string().uuid();

export const MAX_UPLOAD_BYTES = 4 * 1024 * 1024;
export const ALLOWED_UPLOAD_TYPES = ["image/jpeg", "image/png", "image/webp"] as const;
