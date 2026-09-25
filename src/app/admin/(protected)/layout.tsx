import Link from "next/link";
import { logoutAction } from "@/app/admin/actions";
import { requireAdmin } from "@/lib/auth";

/** Bu layout altındaki HER sayfa, render öncesinde sunucuda admin doğrulamasından geçer. */
export default async function ProtectedAdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();

  const link = "inline-flex min-h-11 items-center rounded-full px-4 text-sm font-bold text-forest hover:bg-cream-200";
  return (
    <>
      <header className="border-b border-cream-200 bg-paper">
        <div className="container-x flex flex-wrap items-center justify-between gap-x-6 gap-y-1 py-2">
          <p className="font-serif text-lg font-semibold tracking-[0.12em] text-forest">
            KONSEPT <span className="font-sans text-xs font-bold tracking-normal text-ink-soft">Yönetim</span>
          </p>
          <nav aria-label="Yönetim menüsü" className="-mx-2 flex flex-wrap items-center">
            <Link href="/admin" className={link}>
              Ürünler
            </Link>
            <Link href="/admin/urunler/yeni" className={link}>
              Yeni Ürün
            </Link>
            <Link href="/" className={link}>
              Siteye Dön
            </Link>
            <form action={logoutAction}>
              <button type="submit" className={`${link} cursor-pointer`}>
                Çıkış
              </button>
            </form>
          </nav>
        </div>
      </header>
      <main className="container-x py-8">{children}</main>
    </>
  );
}
