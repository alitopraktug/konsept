import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { OrderPanel, ProductOrderProvider, StickyOrderBar } from "@/components/product-order";
import { ProductGallery } from "@/components/product-gallery";
import { PriceDisplay, ProductGrid, StockBadge } from "@/components/product-ui";
import { Breadcrumbs, JsonLd } from "@/components/shared";
import { getActiveProducts, getProductBySlug, getRelatedProducts } from "@/lib/products";
import { breadcrumbJsonLd, buildMetadata, productJsonLd } from "@/lib/seo";
import { PLACEHOLDER_IMAGE } from "@/lib/types";

export const revalidate = 60;

type Params = Promise<{ slug: string }>;

export async function generateStaticParams() {
  try {
    const products = await getActiveProducts();
    return products.map((p) => ({ slug: p.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Ürün bulunamadı", robots: { index: false, follow: false } };

  const base = product.short_description || product.description;
  const description = `${base} Adana'da WhatsApp'tan kolayca sipariş verin.`.slice(0, 200);
  return buildMetadata({
    title: `${product.name} Siparişi – Adana`,
    description,
    path: `/urunler/${product.slug}`,
    image: product.cover_image,
  });
}

export default async function ProductPage({ params }: { params: Params }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const related = await getRelatedProducts(product, 4);
  const gallery = Array.from(new Set([product.cover_image ?? PLACEHOLDER_IMAGE, ...product.images]));
  const paragraphs = product.description.split(/\n+/).filter(Boolean);

  return (
    <>
      <JsonLd data={productJsonLd(product)} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Ana Sayfa", path: "/" },
          { name: "Ürünler", path: "/urunler" },
          { name: product.name, path: `/urunler/${product.slug}` },
        ])}
      />
      <ProductOrderProvider
        product={{
          slug: product.slug,
          name: product.name,
          price: product.price,
          unit: product.unit,
          stock: product.stock_status,
          ripenessEnabled: product.ripeness_enabled,
        }}
      >
        <div className="container-x pt-6 md:pt-8">
          <Breadcrumbs
            items={[
              { name: "Ana Sayfa", href: "/" },
              { name: "Ürünler", href: "/urunler" },
              { name: product.name },
            ]}
          />

          <div className="mt-6 grid gap-8 lg:grid-cols-2 lg:gap-14">
            <ProductGallery images={gallery} name={product.name} />

            <div>
              <div className="flex flex-wrap items-center gap-3">
                <StockBadge status={product.stock_status} />
              </div>
              <h1 className="mt-3 text-4xl font-semibold md:text-5xl">{product.name}</h1>
              <div className="mt-3">
                <PriceDisplay price={product.price} unit={product.unit} size="lg" />
              </div>

              <div className="prose-konsept mt-5 text-base leading-relaxed text-ink-soft">
                {paragraphs.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>

              <div className="mt-8 border-t border-cream-200 pt-8">
                <OrderPanel />
              </div>

              <ul className="mt-8 space-y-2 text-sm text-ink-soft">
                <li>
                  Teslimat bölgeleri ve detaylar için{" "}
                  <Link href="/teslimat" className="font-semibold text-forest underline underline-offset-4">
                    Teslimat sayfasına
                  </Link>{" "}
                  göz atın.
                </li>
                <li>
                  İşletmeniz için toplu sipariş:{" "}
                  <Link href="/toptan-satis" className="font-semibold text-forest underline underline-offset-4">
                    Toptan Teklif Al
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {related.length > 0 ? (
            <section className="mt-16 pb-14 md:mt-20" aria-labelledby="diger-urunler">
              <h2 id="diger-urunler" className="h-section">
                Diğer Ürünlerimiz
              </h2>
              <div className="mt-6">
                <ProductGrid products={related} />
              </div>
            </section>
          ) : (
            <div className="pb-14" />
          )}

          <StickyOrderBar />
        </div>
      </ProductOrderProvider>
    </>
  );
}
