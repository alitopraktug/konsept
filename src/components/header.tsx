import { site } from "@/lib/site";
import { GENERAL_ORDER_MESSAGE, whatsappUrl } from "@/lib/whatsapp";
import { InstagramIcon, WhatsAppIcon } from "./icons";
import { Logo } from "./logo";
import { MobileMenu } from "./mobile-menu";
import { NavLinks } from "./nav-links";
import { TrackedLink, WhatsAppButton } from "./whatsapp-button";

export function AnnouncementBar() {
  return (
    <div className="bg-forest px-4 py-2 text-center text-xs font-medium tracking-wide text-cream sm:text-sm">
      Taze egzotik meyveler <span aria-hidden>•</span> Bireysel &amp; işletme siparişleri
    </div>
  );
}

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-cream-200 bg-paper/95 backdrop-blur supports-[backdrop-filter]:bg-paper/85">
      <div className="container-x flex h-16 items-center justify-between gap-4 lg:h-[4.5rem]">
        <Logo />

        <nav aria-label="Ana menü" className="hidden lg:block">
          <NavLinks />
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          {site.instagramUrl ? (
            <TrackedLink
              href={site.instagramUrl}
              event="instagram_click"
              external
              location="header"
              aria-label="Instagram"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full text-forest hover:bg-cream-200"
            >
              <InstagramIcon size={22} />
            </TrackedLink>
          ) : null}
          <WhatsAppButton message={GENERAL_ORDER_MESSAGE} location="header" variant="wa">
            <span className="hidden xl:inline">WhatsApp&apos;tan Sipariş Ver</span>
            <span className="xl:hidden">Sipariş Ver</span>
          </WhatsAppButton>
        </div>

        <div className="flex items-center gap-1 lg:hidden">
          <TrackedLink
            href={whatsappUrl(GENERAL_ORDER_MESSAGE, site.whatsappNumber)}
            event="whatsapp_click"
            external
            location="header_mobile"
            aria-label="WhatsApp'tan sipariş ver"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-wa text-[#08261a]"
          >
            <WhatsAppIcon size={22} />
          </TrackedLink>
          <MobileMenu />
        </div>
      </div>
    </header>
  );
}
