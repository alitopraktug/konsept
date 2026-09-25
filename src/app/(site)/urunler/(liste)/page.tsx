import type { Metadata } from "next";
import Link from "next/link";
import { ProductGrid } from "@/components/product-ui";
import { Breadcrumbs, JsonLd, PageHero } from "@/components/shared";
import { getActiveProducts } from "@/lib/products";
import { breadcrumbJsonLd, buildMetadata } from "@/lib/seo";

export const revalidate = 60;

export const metadata: Metadata = buildMetadata({
  title: "Egzotik Meyve Ürünleri",
  description:
    "Avokado, mango, muz, çarkıfelek, limon, papaya ve ejderha meyvesi. Güncel fiyatları görün, miktarı seçin ve WhatsApp'tan sipariş verin.",
  path: "/urunler",
});

export default async function ProductsPage() {
  const products = await getActiveProducts();
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Ana Sayfa", path: "/" },
          { name: "Ürünler", path: "/urunler" },
        ])}
      />
      <PageHero eyebrow="Ürünlerimiz" title="Taze Egzotik Meyveler">
        <p>Ürünü seçin, miktarı belirleyin; siparişinizi WhatsApp üzerinden birkaç adımda iletin.</p>
      </PageHero>
      <section className="section !pt-8 bg-paper">
        <div className="container-x">
          <Breadcrumbs items={[{ name: "Ana Sayfa", href: "/" }, { name: "Ürünler" }]} />
          <div className="mt-8">
            <ProductGrid products={products} priorityCount={4} />
          </div>
          <div className="mt-14 rounded-3xl bg-cream p-6 sm:flex sm:items-center sm:justify-between sm:gap-6 sm:p-8">
            <div>
              <h2 className="text-2xl font-semibold">İşletmeniz için toplu ürün mü arıyorsunuz?</h2>
              <p className="mt-1 text-ink-soft">Miktarınızı paylaşın, fiyat teklifini WhatsApp üzerinden alın.</p>
            </div>
            <Link href="/toptan-satis" className="btn btn-primary mt-4 sm:mt-0 sm:shrink-0">
              Toptan Teklif Al
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
