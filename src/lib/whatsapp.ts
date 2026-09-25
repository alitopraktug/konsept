/**
 * WhatsApp mesaj/URL üretimi. Numara tek yerden (site.ts → env) gelir.
 * Türkçe karakterler encodeURIComponent ile UTF-8 olarak encode edilir.
 */
import { site } from "./site.ts";

export type RipenessValue = "sert-ham" | "olgunlasmaya-yakin" | "tuketime-hazir";

export const RIPENESS_OPTIONS: ReadonlyArray<{
  value: RipenessValue;
  label: string;
  /** WhatsApp mesajında görünen metin */
  messageLabel: string;
  description: string;
}> = [
  {
    value: "sert-ham",
    label: "Sert / Ham",
    messageLabel: "Sert / Ham",
    description: "Birkaç gün sonra tüketmek isteyenler için.",
  },
  {
    value: "olgunlasmaya-yakin",
    label: "Olgunlaşmaya Yakın",
    messageLabel: "Olgunlaşmaya yakın",
    description: "Yakın zamanda tüketmek isteyenler için.",
  },
  {
    value: "tuketime-hazir",
    label: "Tüketime Hazır",
    messageLabel: "Tüketime hazır",
    description: "Bugün tüketmek isteyenler için.",
  },
];

export function ripenessMessageLabel(value: RipenessValue | null | undefined): string | null {
  return RIPENESS_OPTIONS.find((o) => o.value === value)?.messageLabel ?? null;
}

export function whatsappUrl(message?: string, number: string = site.whatsappNumber): string {
  const base = `https://wa.me/${number}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

export interface OrderMessageInput {
  productName: string;
  unit?: string;
  quantity?: number | null;
  ripeness?: RipenessValue | null;
}

export function buildOrderMessage({ productName, unit = "kg", quantity, ripeness }: OrderMessageInput): string {
  const lines = ["Merhaba Konsept,", "Web siteniz üzerinden sipariş vermek istiyorum.", `Ürün: ${productName}`];
  if (quantity && quantity > 0) lines.push(`Miktar: ${quantity} ${unit}`);
  const ripe = ripenessMessageLabel(ripeness);
  if (ripe) lines.push(`Olgunluk: ${ripe}`);
  lines.push("Sipariş hakkında bilgi verebilir misiniz?");
  return lines.join("\n");
}

export function buildStockInquiryMessage(productName: string): string {
  return [
    "Merhaba Konsept,",
    `Web sitenizde ${productName} ürününün stok durumunu görüyorum.`,
    "Stok bilgisi alabilir miyim?",
  ].join("\n");
}

export const GENERAL_ORDER_MESSAGE = [
  "Merhaba Konsept,",
  "Web siteniz üzerinden sipariş vermek istiyorum.",
  "Ürünler ve fiyatlar hakkında bilgi verebilir misiniz?",
].join("\n");

export const WHOLESALE_MESSAGE = [
  "Merhaba Konsept,",
  "İşletmem için toplu sipariş / fiyat teklifi almak istiyorum.",
  "İşletme türü:",
  "İhtiyaç duyduğum ürün ve miktarlar:",
  "Teslimat bölgesi:",
].join("\n");

export const DELIVERY_MESSAGE = [
  "Merhaba Konsept,",
  "Teslimat detayları hakkında bilgi almak istiyorum.",
  "Teslimat yapılacak şehir / ülke:",
].join("\n");

export const CONTACT_MESSAGE = ["Merhaba Konsept,", "Web sitenizden ulaşıyorum. Bilgi almak istiyorum."].join("\n");
