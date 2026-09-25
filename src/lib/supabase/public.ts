import { createClient } from "@supabase/supabase-js";
import { getSupabaseEnv } from "./config";

/**
 * Oturumsuz (anon) istemci: public site verisi için. RLS gereği yalnızca active = true ürünler okunur.
 * Çerez kullanmaz, bu yüzden sayfalar statik/ISR olarak üretilebilir.
 */
export function createPublicClient() {
  const env = getSupabaseEnv();
  if (!env) return null;
  return createClient(env.url, env.anonKey, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  });
}
