import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { getSupabaseEnv } from "@/lib/supabase/config";
import { hardenCookie } from "@/lib/supabase/server";

/**
 * /admin altında: (1) Supabase oturumunu yeniler, (2) oturumsuz istekleri girişe yönlendirir.
 * Bu bir "ilk savunma"dır; asıl yetkilendirme layout, server action ve route handler'larda
 * (requireAdmin / getAdmin → auth.getUser + is_admin) ayrıca yapılır.
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const env = getSupabaseEnv();
  if (!env) return NextResponse.next(); // Supabase yok: giriş sayfası yapılandırma uyarısını gösterir

  let response = NextResponse.next({ request });

  const supabase = createServerClient(env.url, env.anonKey, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (list) => {
        for (const { name, value } of list) request.cookies.set(name, value);
        response = NextResponse.next({ request });
        for (const { name, value, options } of list) {
          response.cookies.set(name, value, hardenCookie(options));
        }
      },
    },
  });

  const { data } = await supabase.auth.getUser();

  const isLogin = pathname === "/admin/giris";
  const isUpload = pathname === "/admin/upload"; // route handler kendi 401 yanıtını verir
  if (!data.user && !isLogin && !isUpload) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/giris";
    url.search = "";
    return NextResponse.redirect(url);
  }

  response.headers.set("Cache-Control", "no-store, max-age=0");
  response.headers.set("X-Robots-Tag", "noindex, nofollow, noarchive");
  return response;
}

export const config = {
  matcher: ["/admin/:path*"],
};
