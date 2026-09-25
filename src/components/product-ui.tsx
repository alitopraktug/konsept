import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/format";
import { PLACEHOLDER_IMAGE, STOCK_LABELS, type Product, type StockStatus } from "@/lib/types";
import { buildOrderMessage, buildStockInquiryMessage } from "@/lib/whatsapp";
import { WhatsAppButton } from "./whatsapp-button";

const badgeStyles: Record<StockStatus, { wrap: string; dot: string }> = {
  in_stock: { wrap: "bg-[#E7EFD6] text-[#2F4A12]", dot: "bg-avocado" },
  limited: { wrap: "bg-amber-soft text-amber-ink", dot: "bg-[#C88A12]" },
  out_of_stock: { wrap: "bg-[#EDE6DC] text-earth-700", dot: "bg-earth" },
};

export function StockBadge({ status, className = "" }: { status: StockStatus; className?: string }) {
  const s = badgeStyles[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold ${s.wrap} ${className}`}
    >
      <span aria-hidden className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
      {STOCK_LABELS[status]}
    </span>
  );
}

export function PriceDisplay({
  price,
  unit,
  size = "md",
  tone = "dark",
}: {
  price: number;
  unit: string;
  size?: "md" | "lg";
  tone?: "dark" | "light";
}) {
  return (
    <p className={`flex items-baseline gap-1.5 ${tone === "dark" ? "text-forest" : "text-cream"}`}>
      <span className={`font-serif font-semibold ${size === "lg" ? "text-4xl" : "text-xl sm:text-2xl"}`}>
        {formatPrice(price)} TL
      </span>
      <span className={`font-medium ${size === "lg" ? "text-base" : "text-sm"} opacity-70`}>/ {unit}</span>
    </p>
  );
}

export function ProductCard({ product, priority = false }: { product: Product; priority?: boolean }) {
  const soldOut = product.stock_status === "out_of_stock";
  const href = `/urunler/${product.slug}`;
  return (
    <article className="group flex h-full flex-col">
      <Link href={href} className="relative block aspect-[4/5] overflow-hidden rounded-2xl bg-cream" tabIndex={-1} aria-hidden>
        <Image
          src={product.cover_image || PLACEHOLDER_IMAGE}
          alt=""
          fill
          priority={priority}
          sizes="(min-width: 1024px) 24vw, (min-width: 640px) 45vw, 46vw"
          className={`object-cover transition-transform duration-500 group-hover:scale-[1.03] ${soldOut ? "opacity-70 saturate-50" : ""}`}
        />
      </Link>
      <div className="flex flex-1 flex-col pt-3">
        <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-1">
          <StockBadge status={product.stock_status} />
        </div>
        <h3 className="mt-2 text-lg leading-snug font-semibold sm:text-xl">
          <Link href={href} className="hover:text-avocado-700">
            {product.name}
          </Link>
        </h3>
        <p className="mt-1 line-clamp-2 text-[0.8125rem] leading-relaxed text-ink-soft sm:text-sm">
          {product.short_description}
        </p>
        <div className="mt-auto pt-3">
          <PriceDisplay price={product.price} unit={product.unit} />
          <div className="mt-3 grid gap-2">
            <WhatsAppButton
              variant="wa"
              productSlug={product.slug}
              location="product_card"
              message={
                soldOut
                  ? buildStockInquiryMessage(product.name)
                  : buildOrderMessage({ productName: product.name, unit: product.unit })
              }
              className="!min-h-11 !gap-1.5 !px-2 !text-[0.8125rem] whitespace-nowrap sm:!px-3 sm:!text-sm"
            >
              {soldOut ? "Stok Bilgisi Al" : "WhatsApp Sipariş"}
            </WhatsAppButton>
            <Link href={href} className="btn btn-outline !min-h-11 !px-2 !text-[0.8125rem] whitespace-nowrap sm:!px-3 sm:!text-sm">
              Ürünü İncele
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}

export function ProductGrid({ products, priorityCount = 0 }: { products: Product[]; priorityCount?: number }) {
  if (products.length === 0) {
    return (
      <p className="rounded-2xl bg-cream px-6 py-12 text-center text-ink-soft">
        Şu anda gösterilecek aktif ürün bulunmuyor.
      </p>
    );
  }
  return (
    <ul className="grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-5 lg:grid-cols-4 lg:gap-x-6">
      {products.map((p, i) => (
        <li key={p.id}>
          <ProductCard product={p} priority={i < priorityCount} />
        </li>
      ))}
    </ul>
  );
}
