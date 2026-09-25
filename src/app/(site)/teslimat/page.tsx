import type { Metadata } from "next";
import { MapPinIcon } from "@/components/icons";
import { Breadcrumbs, JsonLd, PageHero } from "@/components/shared";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { breadcrumbJsonLd, buildMetadata } from "@/lib/seo";
import { site } from "@/lib/site";
import { DELIVERY_MESSAGE } from "@/lib/whatsapp";

export const metadata: Metadata = buildMetadata({
  title: "Teslimat: Türkiye ve Dünyanın Her Yerine",
  description:
    "Konsept egzotik meyveleri Türkiye’nin ve dünyanın her yerine teslim eder. Teslimat detayları için WhatsApp üzerinden iletişime geçebilirsiniz.",
  path: "/teslimat",
});

export default function DeliveryPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Ana Sayfa", path: "/" },
          { name: "Teslimat", path: "/teslimat" },
        ])}
      />
      <PageHero eyebrow="Teslimat" title="Tazelik Kapınıza Gelsin">
        <p>
          Türkiye’nin ve dünyanın her yerine teslimat var. Teslimat detayları için WhatsApp üzerinden iletişime
          geçebilirsiniz.
        </p>
      </PageHero>
      <section className="section !pt-8 bg-paper">
        <div className="container-x">
          <Breadcrumbs items={[{ name: "Ana Sayfa", href: "/" }, { name: "Teslimat" }]} />
          <h2 className="h-section mt-8">Teslimat bölgeleri</h2>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {site.regions.map((r) => (
              <li key={r} className="flex items-center gap-3 rounded-2xl bg-cream px-5 py-4">
                <MapPinIcon size={22} className="shrink-0 text-avocado-700" />
                <span className="font-serif text-xl font-semibold text-forest">{r}</span>
              </li>
            ))}
          </ul>
          <div className="mt-10 rounded-3xl bg-forest p-6 text-cream sm:p-8">
            <h2 className="font-serif text-2xl font-semibold text-cream">Teslimat bilgisi almak için</h2>
            <p className="mt-2 max-w-xl text-cream/85">
              Bulunduğunuz şehri veya ülkeyi ve sipariş detaylarınızı WhatsApp üzerinden paylaşın; teslimat konusunda size
              oradan dönüş yapalım.
            </p>
            <WhatsAppButton size="lg" message={DELIVERY_MESSAGE} location="delivery_page" className="mt-5 w-full sm:w-auto">
              WhatsApp&apos;tan Teslimat Bilgisi Al
            </WhatsAppButton>
          </div>
        </div>
      </section>
    </>
  );
}
