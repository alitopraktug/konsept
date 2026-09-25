import type { Metadata } from "next";
import { InstagramIcon, MailIcon, MapPinIcon, PhoneIcon, WhatsAppIcon } from "@/components/icons";
import { Breadcrumbs, JsonLd, PageHero } from "@/components/shared";
import { TrackedLink, WhatsAppButton } from "@/components/whatsapp-button";
import { breadcrumbJsonLd, buildMetadata, localBusinessJsonLd } from "@/lib/seo";
import { site } from "@/lib/site";
import { CONTACT_MESSAGE, whatsappUrl } from "@/lib/whatsapp";

export const metadata: Metadata = buildMetadata({
  title: "İletişim",
  description: `Konsept ile iletişime geçin: ${site.phoneDisplay}. Adana'da bireysel ve işletme siparişleri için WhatsApp'tan yazın.`,
  path: "/iletisim",
});

export default function ContactPage() {
  const card = "flex items-start gap-4 rounded-3xl bg-cream p-5 sm:p-6";
  const iconWrap = "flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-paper text-forest";
  const label = "text-xs font-bold tracking-[0.12em] text-avocado-700 uppercase";
  const value = "mt-1 block break-words font-serif text-xl font-semibold text-forest hover:underline";

  return (
    <>
      <JsonLd data={localBusinessJsonLd()} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Ana Sayfa", path: "/" },
          { name: "İletişim", path: "/iletisim" },
        ])}
      />
      <PageHero eyebrow="İletişim" title="Bize Ulaşın">
        <p>Sipariş, ürün ve teslimat için en hızlı yol WhatsApp&apos;tır.</p>
      </PageHero>
      <section className="section !pt-8 bg-paper">
        <div className="container-x">
          <Breadcrumbs items={[{ name: "Ana Sayfa", href: "/" }, { name: "İletişim" }]} />
          <ul className="mt-8 grid gap-4 md:grid-cols-2">
            <li className={card}>
              <span className={iconWrap}>
                <PhoneIcon size={22} />
              </span>
              <div>
                <p className={label}>Telefon</p>
                <TrackedLink href={site.phoneHref} event="phone_click" location="contact_page" className={value}>
                  {site.phoneDisplay}
                </TrackedLink>
              </div>
            </li>
            <li className={card}>
              <span className={iconWrap}>
                <WhatsAppIcon size={22} />
              </span>
              <div>
                <p className={label}>WhatsApp</p>
                <TrackedLink
                  href={whatsappUrl(CONTACT_MESSAGE, site.whatsappNumber)}
                  event="whatsapp_click"
                  external
                  location="contact_page"
                  className={value}
                >
                  {site.phoneDisplay}
                </TrackedLink>
              </div>
            </li>
            {site.instagramUrl ? (
              <li className={card}>
                <span className={iconWrap}>
                  <InstagramIcon size={22} />
                </span>
                <div>
                  <p className={label}>Instagram</p>
                  <TrackedLink
                    href={site.instagramUrl}
                    event="instagram_click"
                    external
                    location="contact_page"
                    className={value}
                  >
                    Instagram&apos;da bizi takip edin
                  </TrackedLink>
                </div>
              </li>
            ) : null}
            {site.email ? (
              <li className={card}>
                <span className={iconWrap}>
                  <MailIcon size={22} />
                </span>
                <div>
                  <p className={label}>E-posta</p>
                  <a href={`mailto:${site.email}`} className={value}>
                    {site.email}
                  </a>
                </div>
              </li>
            ) : null}
            <li className={card}>
              <span className={iconWrap}>
                <MapPinIcon size={22} />
              </span>
              <div>
                <p className={label}>Teslimat bölgesi</p>
                <p className="mt-1 font-serif text-xl font-semibold text-forest">{site.deliveryText}</p>
              </div>
            </li>
          </ul>
          <div className="mt-10">
            <WhatsAppButton size="lg" message={CONTACT_MESSAGE} location="contact_page_cta" className="w-full sm:w-auto">
              WhatsApp&apos;tan İletişime Geç
            </WhatsAppButton>
          </div>
        </div>
      </section>
    </>
  );
}
