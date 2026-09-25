import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/admin/login-form";
import { Logo } from "@/components/logo";
import { getAdmin } from "@/lib/auth";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export const metadata: Metadata = { title: "Giriş" };

export default async function AdminLoginPage() {
  const configured = isSupabaseConfigured();
  if (configured && (await getAdmin())) redirect("/admin");

  return (
    <main className="flex min-h-dvh items-center justify-center px-4 py-10">
      <div className="w-full max-w-sm rounded-3xl bg-paper p-6 shadow-sm sm:p-8">
        <div className="flex justify-center"><Logo /></div>
        <h1 className="mt-4 text-center text-xl font-semibold">Yönetim Paneli</h1>
        {configured ? (
          <LoginForm />
        ) : (
          <p role="alert" className="mt-6 rounded-2xl bg-amber-soft px-4 py-3 text-sm text-amber-ink">
            Yönetim paneli için Supabase bağlantısı henüz yapılandırılmadı. <code>.env.local</code> dosyasındaki
            Supabase değerlerini doldurun (bkz. README).
          </p>
        )}
      </div>
    </main>
  );
}
