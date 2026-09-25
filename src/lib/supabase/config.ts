export function getSupabaseEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
  if (!url || !anonKey) return null;
  try {
    new URL(url);
  } catch {
    return null;
  }
  return { url, anonKey };
}

export const isSupabaseConfigured = () => getSupabaseEnv() !== null;

export const PRODUCT_IMAGE_BUCKET = "product-images";

/** Storage'daki herkese açık ürün görselleri için URL öneki (doğrulamada kullanılır) */
export function storagePublicPrefix(): string | null {
  const env = getSupabaseEnv();
  return env ? `${env.url.replace(/\/+$/, "")}/storage/v1/object/public/${PRODUCT_IMAGE_BUCKET}/` : null;
}
