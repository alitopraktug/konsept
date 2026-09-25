import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { wholesaleFeatures } from "@/components/home-sections";
import { Breadcrumbs, JsonLd } from "@/components/shared";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { breadcrumbJsonLd, buildMetadata } from "@/lib/seo";
import { WHOLESALE_MESSAGE } from "@/lib/whatsapp";

export const metadata: Metadata = buildMetadata({
  title: "Toptan Egzotik Meyve Tedariği",
  description:
    "Adana'da kafe, restoran, otel, pub, market ve manavlar için toplu egzotik meyve siparişi. Miktarınızı paylaşın, fiyat teklifini WhatsApp'tan alın.",
  path: "/toptan-satis",
});

const businesses = ["Kafe", "Restoran", "Otel", "Pub", "Market", "Manav", "Diğer işletmeler"];

const flow = [
  { title: "WhatsApp'tan yazın", text: "İşletme türünüzü ve ihtiyacınızı kısaca paylaşın." },
  { title: "Ürün ve miktarı iletin", text: "Hangi ürünlerden ne kadar gerektiğini belirtin." },
  { title: "Fiyat teklifini alın", text: "Teklif ve teslimat detayları WhatsApp üzerinden netleştirilir." },
];

export default function WholesalePage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Ana Sayfa", path: "/" },
          { name: "Toptan Satış", path: "/toptan-satis" },
        ])}
      />
      <section className="on-dark relative overflow-hidden bg-forest text-cream">
        <div className="container-x grid items-center gap-8 py-12 md:py-16 lg:grid-cols-2 lg:gap-14">
          <div>
            <p className="eyebrow">Toptan Satış</p>
            <h1 className="h-display mt-3 !text-cream md:!text-5xl lg:!text-[3.25rem]">
              İşletmeniz İçin Güvenilir Meyve Tedariği
            </h1>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-cream/85 sm:text-lg">
              Kafe, restoran, otel, pub, market, manav ve diğer işletmeler için toplu egzotik meyve siparişleri.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <WhatsAppButton size="lg" message={WHOLESALE_MESSAGE} location="wholesale_page_hero">
                WhatsApp&apos;tan Teklif Al
              </WhatsAppButton>
              <Link href="/urunler" className="btn btn-outline-light btn-lg">
                Ürünleri İncele
              </Link>
            </div>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl">
            <Image
              src="/images/hero/toptan-satis.webp"
              alt="Çarkıfelek, muz ve limon"
              fill
              priority
              sizes="(min-width: 1024px) 46vw, 92vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      <section className="section bg-paper">
        <div className="container-x">
          <Breadcrumbs items={[{ name: "Ana Sayfa", href: "/" }, { name: "Toptan Satış" }]} />
          <ul className="mt-8 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            {wholesaleFeatures.map(({ icon: Icon, title, text }) => (
              <li key={title} className="rounded-3xl bg-cream p-4 sm:p-6">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-paper text-forest">
                  <Icon size={22} />
                </span>
                <h2 className="mt-3 text-lg leading-snug font-semibold sm:mt-4 sm:text-xl">{title}</h2>
                <p className="mt-1 text-sm text-ink-soft">{text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section bg-cream">
        <div className="container-x grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <h2 className="h-section">Kimler için?</h2>
            <p className="mt-3 text-ink-soft sm:text-lg">
              Toplu egzotik meyve ihtiyacı olan her işletme bizimle iletişime geçebilir.
            </p>
            <ul className="mt-6 flex flex-wrap gap-2.5">
              {businesses.map((b) => (
                <li key={b} className="rounded-full bg-paper px-4 py-2.5 text-sm font-bold text-forest">
                  {b}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="h-section">Nasıl teklif alırım?</h2>
            <p className="mt-3 text-ink-soft sm:text-lg">Karmaşık form yok; birkaç mesajla teklifiniz hazır.</p>
            <ol className="mt-6 space-y-4">
              {flow.map((s, i) => (
                <li key={s.title} className="flex gap-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-forest font-serif text-lg font-semibold text-cream">
                    {i + 1}
                  </span>
                  <span>
                    <span className="block font-bold text-forest">{s.title}</span>
                    <span className="block text-sm text-ink-soft">{s.text}</span>
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section className="section on-dark bg-forest text-cream">
        <div className="container-x flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
          <div className="max-w-xl">
            <h2 className="h-section !text-cream">Miktarınızı paylaşın, teklifinizi alın</h2>
            <p className="mt-3 text-cream/85">Fiyat bilgisi ve teslimat detayları WhatsApp üzerinden paylaşılır.</p>
          </div>
          <WhatsAppButton size="lg" message={WHOLESALE_MESSAGE} location="wholesale_page_cta" className="w-full sm:w-auto">
            WhatsApp&apos;tan Teklif Al
          </WhatsAppButton>
        </div>
      </section>
    </>
  );
}
