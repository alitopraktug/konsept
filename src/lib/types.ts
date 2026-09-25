export const STOCK_STATUSES = ["in_stock", "limited", "out_of_stock"] as const;
export type StockStatus = (typeof STOCK_STATUSES)[number];

export const STOCK_LABELS: Record<StockStatus, string> = {
  in_stock: "Stokta",
  limited: "Sınırlı Stok",
  out_of_stock: "Tükendi",
};

export const UNITS = ["kg", "adet", "paket"] as const;
export type Unit = (typeof UNITS)[number];

export interface Product {
  id: string;
  name: string;
  slug: string;
  short_description: string;
  description: string;
  price: number;
  unit: string;
  stock_status: StockStatus;
  cover_image: string | null;
  images: string[];
  featured: boolean;
  active: boolean;
  display_order: number;
  ripeness_enabled: boolean;
  created_at: string;
  updated_at: string;
}

export const PLACEHOLDER_IMAGE = "/images/branding/placeholder-urun.webp";
