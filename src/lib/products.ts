import { cache } from "react";
import { createPublicClient } from "./supabase/public";
import { seedProducts } from "./seed-products";
import { STOCK_STATUSES, type Product, type StockStatus } from "./types";

/**
 * Public ürün verisi. Supabase yapılandırılmışsa YALNIZCA veritabanından (RLS: active = true) okunur.
 * Yapılandırılmamışsa (yerel önizleme) seed verisi kullanılır. Veritabanı hatasında sessizce
 * seed'e dönülmez — hata yükselir ve error.tsx gösterilir.
 */

/** DB satırını güvenli tipe çevirir (numeric → number, null'lar için varsayılanlar) */
export function normalizeProduct(row: Record<string, unknown>): Product {
  const stock = String(row.stock_status);
  return {
    id: String(row.id),
    name: String(row.name ?? ""),
    slug: String(row.slug ?? ""),
    short_description: String(row.short_description ?? ""),
    description: String(row.description ?? ""),
    price: Number(row.price ?? 0),
    unit: String(row.unit ?? "kg"),
    stock_status: (STOCK_STATUSES as readonly string[]).includes(stock) ? (stock as StockStatus) : "in_stock",
    cover_image: typeof row.cover_image === "string" && row.cover_image ? row.cover_image : null,
    images: Array.isArray(row.images) ? row.images.filter((v): v is string => typeof v === "string") : [],
    featured: Boolean(row.featured),
    active: Boolean(row.active),
    display_order: Number(row.display_order ?? 0),
    ripeness_enabled: Boolean(row.ripeness_enabled),
    created_at: String(row.created_at ?? ""),
    updated_at: String(row.updated_at ?? ""),
  };
}

const byOrder = (a: Product, b: Product) => a.display_order - b.display_order || a.name.localeCompare(b.name, "tr");

export const getActiveProducts = cache(async (): Promise<Product[]> => {
  const supabase = createPublicClient();
  if (!supabase) return seedProducts.filter((p) => p.active).sort(byOrder);

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("active", true)
    .order("display_order", { ascending: true })
    .order("name", { ascending: true });
  if (error) throw new Error(`Ürünler alınamadı: ${error.message}`);
  return (data ?? []).map(normalizeProduct);
});

export async function getFeaturedProducts(limit = 4): Promise<Product[]> {
  const all = await getActiveProducts();
  const featured = all.filter((p) => p.featured);
  return (featured.length > 0 ? featured : all).slice(0, limit);
}

export const getProductBySlug = cache(async (slug: string): Promise<Product | null> => {
  const all = await getActiveProducts();
  return all.find((p) => p.slug === slug) ?? null;
});

export async function getRelatedProducts(current: Product, limit = 4): Promise<Product[]> {
  const all = await getActiveProducts();
  return all.filter((p) => p.id !== current.id).slice(0, limit);
}
