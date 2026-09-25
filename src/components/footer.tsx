import Link from "next/link";
import { getActiveProducts } from "@/lib/products";
import { navLinks, site } from "@/lib/site";
import type { Product } from "@/lib/types";
import { InstagramIcon, MailIcon, PhoneIcon, WhatsAppIcon } from "./icons";
import { Logo } from "./logo";
import { TrackedLink } from "./whatsapp-button";

async function safeProducts(): Promise<Product[]> {
  try {
    return await getActiveProducts();
  } catch {
    return [];
  }
}

export async function Footer() {
  const products = await safeProducts();
  const linkCls = "inline-flex min-h-9 items-center text-sm text-cream/80 transition-colors hover:text-white";

  return (
    <footer className="on-dark bg-forest text-cream">
      <div className="container-x grid gap-10 py-12 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr] lg:py-16">
        <div>
          <Logo tone="light" />
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-cream/80">
            Taze ve seçilmiş meyveleri eviniz ve işletmeniz için kolayca sipariş edin.
          </p>
        </div>

        <nav aria-label="Alt menü bağlantıları">
          <h2 className="font-sans text-xs font-bold tracking-[0.16em] text-sage uppercase">Bağlantılar</h2>
          <ul className="mt-3">
            {navLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className={linkCls}>
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Ürün bağlantıları">
          <h2 className="font-sans text-xs font-bold tracking-[0.16em] text-sage uppercase">Ürünler</h2>
          <ul className="mt-3">
            {products.map((p) => (
              <li key={p.id}>
                <Link href={`/urunler/${p.slug}`} className={linkCls}>
                  {p.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="font-sans text-xs font-bold tracking-[0.16em] text-sage uppercase">İletişim</h2>
          <ul className="mt-3 space-y-1">
            <li>
              <TrackedLink href={site.phoneHref} event="phone_click" location="footer" className={linkCls}>
                <PhoneIcon size={16} className="mr-2 text-sage" />
                {site.phoneDisplay}
              </TrackedLink>
            </li>
            <li>
              <TrackedLink href={site.whatsappHref} event="whatsapp_click" external location="footer" className={linkCls}>
                <WhatsAppIcon size={16} className="mr-2 text-sage" />
                WhatsApp
              </TrackedLink>
            </li>
            {site.instagramUrl ? (
              <li>
                <TrackedLink href={site.instagramUrl} event="instagram_click" external location="footer" className={linkCls}>
                  <InstagramIcon size={16} className="mr-2 text-sage" />
                  Instagram
                </TrackedLink>
              </li>
            ) : null}
            {site.email ? (
              <li>
                <a href={`mailto:${site.email}`} className={linkCls}>
                  <MailIcon size={16} className="mr-2 text-sage" />
                  {site.email}
                </a>
              </li>
            ) : null}
          </ul>
          <p className="mt-4 text-sm text-cream/70">Teslimat: {site.deliveryText}</p>
        </div>
      </div>

      <div className="border-t border-white/10">
        <p className="container-x py-5 pr-20 text-xs text-cream/70 sm:pr-8">© 2026 Konsept. Tüm hakları saklıdır.</p>
      </div>
    </footer>
  );
}
