import type { MetadataRoute } from "next";
import { getActiveProducts } from "@/lib/products";
import { absoluteUrl } from "@/lib/site";

export const revalidate = 3600;

/** Yalnızca aktif ürünler dahil edilir; pasif ürünler sitemap'e girmez. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: absoluteUrl("/"), changeFrequency: "weekly", priority: 1 },
    { url: absoluteUrl("/urunler"), changeFrequency: "daily", priority: 0.9 },
    { url: absoluteUrl("/toptan-satis"), changeFrequency: "monthly", priority: 0.8 },
    { url: absoluteUrl("/teslimat"), changeFrequency: "monthly", priority: 0.6 },
    { url: absoluteUrl("/hakkimizda"), changeFrequency: "yearly", priority: 0.5 },
    { url: absoluteUrl("/iletisim"), changeFrequency: "yearly", priority: 0.6 },
  ];

  let products: MetadataRoute.Sitemap = [];
  try {
    const active = await getActiveProducts();
    products = active.map((p) => ({
      url: absoluteUrl(`/urunler/${p.slug}`),
      lastModified: p.updated_at ? new Date(p.updated_at) : undefined,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));
  } catch {
    // Veritabanına ulaşılamazsa statik sayfalar yine de yayınlanır.
  }
  return [...staticRoutes, ...products];
}
