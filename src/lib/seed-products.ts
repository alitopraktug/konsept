/**
 * Supabase henüz bağlanmamışken (yerel geliştirme / ilk önizleme) sitenin boş kalmaması için
 * kullanılan başlangıç verisi. `supabase/seed.sql` ile birebir aynıdır.
 * Supabase yapılandırıldığında BU DOSYA KULLANILMAZ; fiyatlar ve stok veritabanından gelir.
 */
import type { Product } from "./types";

const t = "2026-01-01T00:00:00.000Z";

type Seed = Omit<Product, "created_at" | "updated_at" | "active" | "images">;

const seeds: Seed[] = [
  {
    id: "00000000-0000-4000-8000-000000000001",
    name: "Avokado",
    slug: "avokado",
    short_description:
      "Kremamsı dokusu ve kendine özgü tadıyla kahvaltıdan salataya birçok tarifte kullanılabilir.",
    description:
      "Kremamsı dokusu ve kendine özgü tadıyla kahvaltıdan salataya birçok tarifte kullanılabilir.\nSipariş verirken tüketmek istediğiniz zamana göre olgunluk seçebilirsiniz: sert/ham, olgunlaşmaya yakın veya tüketime hazır.",
    price: 350,
    unit: "kg",
    stock_status: "in_stock",
    cover_image: "/images/products/avokado/avokado-cover.webp",
    featured: true,
    display_order: 10,
    ripeness_enabled: true,
  },
  {
    id: "00000000-0000-4000-8000-000000000002",
    name: "Mango",
    slug: "mango",
    short_description:
      "Yoğun aroması ve tatlı yapısıyla taze tüketim, tatlı ve içecekler için tercih edilen tropikal meyve.",
    description:
      "Yoğun aroması ve tatlı yapısıyla taze tüketim, tatlı ve içecekler için tercih edilen tropikal meyve.\nDilimlenerek taze tüketilebilir; smoothie, tatlı ve meyve tabaklarında kullanılabilir.",
    price: 350,
    unit: "kg",
    stock_status: "in_stock",
    cover_image: "/images/products/mango/mango-cover.webp",
    featured: true,
    display_order: 20,
    ripeness_enabled: false,
  },
  {
    id: "00000000-0000-4000-8000-000000000003",
    name: "Muz",
    slug: "muz",
    short_description: "Günlük tüketim, tatlı ve içecekler için pratik ve sevilen bir seçenek.",
    description:
      "Günlük tüketim, tatlı ve içecekler için pratik ve sevilen bir seçenek.\nKahvaltıda, atıştırmalık olarak, smoothie ve tatlılarda kullanılabilir.",
    price: 100,
    unit: "kg",
    stock_status: "in_stock",
    cover_image: "/images/products/muz/muz-cover.webp",
    featured: false,
    display_order: 30,
    ripeness_enabled: false,
  },
  {
    id: "00000000-0000-4000-8000-000000000004",
    name: "Mistik / Çarkıfelek",
    slug: "carkifelek",
    short_description:
      "Aromatik ve hafif ekşi-tatlı yapısıyla içeceklerde, tatlılarda ve sunumlarda öne çıkan egzotik meyve.",
    description:
      "Aromatik ve hafif ekşi-tatlı yapısıyla içeceklerde, tatlılarda ve sunumlarda öne çıkan egzotik meyve.\nİçindeki çekirdekli pulpu içeceklerde, tatlılarda, soslarda ve sunumlarda kullanılabilir.",
    price: 350,
    unit: "kg",
    stock_status: "in_stock",
    cover_image: "/images/products/carkifelek/carkifelek-cover.webp",
    featured: true,
    display_order: 40,
    ripeness_enabled: false,
  },
  {
    id: "00000000-0000-4000-8000-000000000005",
    name: "Limon",
    slug: "limon",
    short_description: "Mutfakta, içeceklerde ve günlük kullanımda tercih edilen taze limon.",
    description:
      "Mutfakta, içeceklerde ve günlük kullanımda tercih edilen taze limon.\nSalata, yemek, içecek ve sunumlarda kullanılabilir.",
    price: 120,
    unit: "kg",
    stock_status: "in_stock",
    cover_image: "/images/products/limon/limon-cover.webp",
    featured: false,
    display_order: 50,
    ripeness_enabled: false,
  },
  {
    id: "00000000-0000-4000-8000-000000000006",
    name: "Papaya",
    slug: "papaya",
    short_description: "Yumuşak dokusu ve tatlı aromasıyla taze tüketim, smoothie ve meyve tabakları için uygun tropikal meyve.",
    description:
      "Yumuşak dokusu ve tatlı aromasıyla taze tüketim, smoothie ve meyve tabakları için uygun tropikal meyve.\nİkiye bölünüp çekirdekleri alınarak kaşıkla tüketilebilir.",
    price: 350,
    unit: "kg",
    stock_status: "in_stock",
    cover_image: "/images/products/papaya/papaya-cover.webp",
    featured: false,
    display_order: 60,
    ripeness_enabled: false,
  },
  {
    id: "00000000-0000-4000-8000-000000000007",
    name: "Ejderha Meyvesi",
    slug: "ejderha-meyvesi",
    short_description:
      "Dikkat çekici görünümü ve hafif aromasıyla taze tüketim ve sunumlarda öne çıkan egzotik meyve.",
    description:
      "Dikkat çekici görünümü ve hafif aromasıyla taze tüketim ve sunumlarda öne çıkan egzotik meyve.\nOrtadan kesilip kaşıkla tüketilebilir; meyve tabaklarında, smoothie bowl ve sunumlarda kullanılabilir.",
    price: 320,
    unit: "kg",
    stock_status: "in_stock",
    cover_image: "/images/products/ejderha-meyvesi/ejderha-meyvesi-cover.webp",
    featured: true,
    display_order: 70,
    ripeness_enabled: false,
  },
];

export const seedProducts: Product[] = seeds.map((p) => ({
  ...p,
  images: [],
  active: true,
  created_at: t,
  updated_at: t,
}));
