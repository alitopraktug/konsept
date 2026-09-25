import type { Metadata } from "next";
import Link from "next/link";
import { Hero } from "@/components/hero";
import {
  AudienceSplit,
  AvocadoRipeness,
  ContactCTA,
  DeliverySection,
  HowItWorks,
  InstagramSection,
  SectionHeading,
  TrustBar,
  WholesaleBand,
  WhyKonsept,
} from "@/components/home-sections";
import { ProductGrid } from "@/components/product-ui";
import { JsonLd } from "@/components/shared";
import { getActiveProducts, getFeaturedProducts } from "@/lib/products";
import { localBusinessJsonLd, buildMetadata } from "@/lib/seo";

export const revalidate = 60;

const title = "Konsept | Adana Egzotik Meyve Siparişi";

export const metadata: Metadata = {
  ...buildMetadata({
    title,
    description:
      "Adana'da avokado, mango, çarkıfelek, ejderha meyvesi ve papaya gibi egzotik meyveleri bireysel ve işletme siparişleri için WhatsApp'tan kolayca sipariş edin.",
    path: "/",
  }),
  title: { absolute: title },
};

export default async function HomePage() {
  const [featured, all] = await Promise.all([getFeaturedProducts(4), getActiveProducts()]);
  const avocado = all.find((p) => p.ripeness_enabled);

  return (
    <>
      <JsonLd data={localBusinessJsonLd()} />
      <Hero />
      <TrustBar />

      <section className="section bg-paper" aria-labelledby="one-cikan">
        <div className="container-x">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <SectionHeading id="one-cikan" eyebrow="Ürünler" title="Öne Çıkan Ürünler" />
            <Link href="/urunler" className="btn btn-outline self-start sm:self-auto">
              Tüm Ürünleri Gör
            </Link>
          </div>
          <div className="mt-8">
            <ProductGrid products={featured} priorityCount={0} />
          </div>
        </div>
      </section>

      <AvocadoRipeness avocadoHref={avocado ? `/urunler/${avocado.slug}` : "/urunler"} />
      <AudienceSplit />
      <WholesaleBand />
      <HowItWorks />
      <WhyKonsept />
      <DeliverySection />
      <InstagramSection />
      <ContactCTA />
    </>
  );
}
