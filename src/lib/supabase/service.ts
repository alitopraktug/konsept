import { createClient } from "@supabase/supabase-js";

/**
 * SERVICE ROLE istemcisi — yalnızca sunucuda, yalnızca giriş denemesi sınırlaması
 * (rate limit) için. RLS'i aşar; bu yüzden ürün/veri işlemleri için ASLA kullanılmaz.
 * Anahtar NEXT_PUBLIC_ önekiyle tanımlanmadığı için tarayıcı paketine girmez.
 */
export function createServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}
