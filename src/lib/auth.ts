import { cache } from "react";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "./supabase/server";
import { isSupabaseConfigured } from "./supabase/config";

/**
 * Sunucu tarafı admin doğrulaması.
 *  1) auth.getUser() JWT'yi Supabase Auth sunucusuna doğrulatır (çerezdeki veriye körü körüne güvenmez).
 *  2) is_admin() (SECURITY DEFINER) kullanıcının admin_users tablosunda olup olmadığına bakar.
 * Hesap açılışı kapalı olmalıdır; açık olsa bile admin_users'a eklenmemiş biri yetki alamaz.
 */
export const getAdmin = cache(async () => {
  if (!isSupabaseConfigured()) return null;
  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) return null;
    const { data: isAdmin, error: adminError } = await supabase.rpc("is_admin");
    if (adminError || isAdmin !== true) return null;
    return { supabase, user: data.user };
  } catch {
    return null;
  }
});

export async function requireAdmin() {
  const admin = await getAdmin();
  if (!admin) redirect("/admin/giris");
  return admin;
}
