import type { Metadata } from "next";
import { absoluteUrl, site } from "./site";
import type { Product } from "./types";

const OG_DEFAULT = "/images/branding/og-default.jpg";

interface PageMeta {
  title: string;
  description: string;
  path: string;
  image?: string | null;
  noIndex?: boolean;
}

/** Her public sayfa için title, description, canonical ve Open Graph üretir */
export function buildMetadata({ title, description, path, image, noIndex }: PageMeta): Metadata {
  const url = absoluteUrl(path);
  const img = image ? (image.startsWith("http") ? image : absoluteUrl(image)) : absoluteUrl(OG_DEFAULT);
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      locale: "tr_TR",
      siteName: site.name,
      title,
      description,
      url,
      images: [{ url: img, alt: `${site.name} — egzotik meyveler` }],
    },
    twitter: { card: "summary_large_image", title, description, images: [img] },
    ...(noIndex ? { robots: { index: false, follow: false } } : {}),
  };
}

const AVAILABILITY: Record<Product["stock_status"], string> = {
  in_stock: "https://schema.org/InStock",
  limited: "https://schema.org/LimitedAvailability",
  out_of_stock: "https://schema.org/OutOfStock",
};

export function productJsonLd(p: Product) {
  const images = [p.cover_image, ...p.images].filter((v): v is string => Boolean(v));
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.name,
    description: p.short_description || p.description,
    url: absoluteUrl(`/urunler/${p.slug}`),
    image: images.map((i) => (i.startsWith("http") ? i : absoluteUrl(i))),
    brand: { "@type": "Brand", name: site.name },
    offers: {
      "@type": "Offer",
      url: absoluteUrl(`/urunler/${p.slug}`),
      priceCurrency: "TRY",
      price: p.price,
      availability: AVAILABILITY[p.stock_status],
      itemCondition: "https://schema.org/NewCondition",
      ...(p.unit === "kg"
        ? {
            priceSpecification: {
              "@type": "UnitPriceSpecification",
              price: p.price,
              priceCurrency: "TRY",
              referenceQuantity: { "@type": "QuantitativeValue", value: 1, unitCode: "KGM" },
            },
          }
        : {}),
    },
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: absoluteUrl(it.path),
    })),
  };
}

/** Adres, koordinat ve çalışma saatleri bilinmediği için eklenmez. */
export function localBusinessJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: site.name,
    description: "Egzotik ve seçili taze meyvelerin bireysel müşterilere ve işletmelere satışı.",
    url: site.url,
    image: absoluteUrl(OG_DEFAULT),
    logo: absoluteUrl("/images/branding/logo-stacked.webp"),
    telephone: `+${site.whatsappNumber}`,
    ...(site.email ? { email: site.email } : {}),
    areaServed: [
      { "@type": "Country", name: "Türkiye" },
      { "@type": "Place", name: "Dünya geneli" },
    ],
    ...(site.instagramUrl ? { sameAs: [site.instagramUrl] } : {}),
  };
}

/** JSON-LD içinde `</script>` kaçışını önlemek için `<` karakterini kaçırır */
export function jsonLdString(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
