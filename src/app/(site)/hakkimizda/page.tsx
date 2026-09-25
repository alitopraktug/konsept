import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Breadcrumbs, JsonLd, PageHero } from "@/components/shared";
import { breadcrumbJsonLd, buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Hakkımızda",
  description:
    "Konsept, seçilmiş meyveleri bireysel müşteriler ve işletmelerle buluşturan modern bir meyve markasıdır. Avokadodan mangoya, çarkıfelekten ejderha meyvesine.",
  path: "/hakkimizda",
});

export default function AboutPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Ana Sayfa", path: "/" },
          { name: "Hakkımızda", path: "/hakkimizda" },
        ])}
      />
      <PageHero eyebrow="Hakkımızda" title="Seçilmiş meyveler, kolay sipariş" />
      <section className="section !pt-8 bg-paper">
        <div className="container-x">
          <Breadcrumbs items={[{ name: "Ana Sayfa", href: "/" }, { name: "Hakkımızda" }]} />
          <div className="mt-8 grid items-center gap-8 lg:grid-cols-2 lg:gap-14">
            <div className="prose-konsept text-lg leading-relaxed text-ink-soft">
              <p>
                Konsept, seçilmiş meyveleri bireysel müşteriler ve işletmelerle buluşturan modern bir meyve markasıdır.
                Avokadodan mangoya, çarkıfelekten ejderha meyvesine kadar farklı ürünleri kolay sipariş deneyimiyle
                sunmayı amaçlıyoruz.
              </p>
              <p>Amacımız doğru ürünü bulmayı ve sipariş vermeyi mümkün olduğunca kolay hale getirmek.</p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link href="/urunler" className="btn btn-primary btn-lg">
                  Ürünleri İncele
                </Link>
                <Link href="/iletisim" className="btn btn-outline btn-lg">
                  İletişime Geç
                </Link>
              </div>
            </div>
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl">
              <Image
                src="/images/hero/bireysel-kullanim.webp"
                alt="Yarım kesilmiş taze avokado ve mango"
                fill
                sizes="(min-width: 1024px) 46vw, 92vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
