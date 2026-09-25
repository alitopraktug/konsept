import type { Metadata } from "next";

/** Yönetim sayfaları ASLA statik üretilmez / önbelleğe alınmaz: her istek sunucuda yetki kontrolünden geçer. */
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: { default: "Yönetim Paneli", template: "%s | Konsept Yönetim" },
  robots: { index: false, follow: false, nocache: true },
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-dvh bg-cream">{children}</div>;
}
