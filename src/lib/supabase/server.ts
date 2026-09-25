import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { getSupabaseEnv } from "./config";

const TWELVE_HOURS = 60 * 60 * 12;

/**
 * Admin oturumu için sunucu istemcisi. Çerezler: HttpOnly, Secure (prod), SameSite=Lax,
 * yalnızca /admin yoluna gönderilir ve en fazla 12 saat yaşar.
 * Tarayıcı tarafında Supabase istemcisi kullanılmadığı için HttpOnly güvenle açıktır.
 */
export async function createSupabaseServerClient() {
  const env = getSupabaseEnv();
  if (!env) throw new Error("Supabase yapılandırılmamış.");
  const cookieStore = await cookies();
  return createServerClient(env.url, env.anonKey, {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll: (list) => {
        try {
          for (const { name, value, options } of list) {
            cookieStore.set(name, value, hardenCookie(options));
          }
        } catch {
          // Server Component içinden çağrıldığında set edilemez; proxy oturumu yeniler.
        }
      },
    },
  });
}

export function hardenCookie<T extends { maxAge?: number }>(options: T) {
  return {
    ...options,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/admin",
    ...(typeof options.maxAge === "number" && options.maxAge > 0
      ? { maxAge: Math.min(options.maxAge, TWELVE_HOURS) }
      : {}),
  };
}
