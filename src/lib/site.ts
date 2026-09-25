/**
 * Marka ve iletişim bilgileri tek yerde. Bilinmeyen bilgiler (Instagram, e-posta)
 * environment'tan gelir; tanımlı değilse arayüzde gösterilmez — asla uydurulmaz.
 */

const DEFAULT_WHATSAPP = "905069055651";
const DEFAULT_INSTAGRAM = "https://www.instagram.com/konseptegzotik/";

function cleanNumber(raw: string | undefined): string {
  const digits = (raw ?? "").replace(/\D/g, "");
  return digits.length >= 10 ? digits : DEFAULT_WHATSAPP;
}

function cleanHttpsUrl(raw: string | undefined): string | null {
  if (!raw) return null;
  try {
    const url = new URL(raw.trim());
    return url.protocol === "https:" ? url.toString() : null;
  } catch {
    return null;
  }
}

function cleanEmail(raw: string | undefined): string | null {
  const v = raw?.trim();
  return v && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? v : null;
}

function siteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  return (explicit || "https://www.konseptegzotikmeyveler.com").replace(/\/+$/, "");
}

const whatsappNumber = cleanNumber(process.env.NEXT_PUBLIC_WHATSAPP_NUMBER);

/** 905069055651 → "0506 905 56 51" */
function displayPhone(intl: string): string {
  const national = intl.startsWith("90") ? `0${intl.slice(2)}` : intl;
  if (national.length === 11) {
    return `${national.slice(0, 4)} ${national.slice(4, 7)} ${national.slice(7, 9)} ${national.slice(9)}`;
  }
  return national;
}

export const site = {
  name: "Konsept",
  tagline: "Egzotik Meyveler",
  url: siteUrl(),
  whatsappNumber,
  phoneDisplay: displayPhone(whatsappNumber),
  phoneHref: `tel:+${whatsappNumber}`,
  whatsappHref: `https://wa.me/${whatsappNumber}`,
  instagramUrl: cleanHttpsUrl(process.env.NEXT_PUBLIC_INSTAGRAM_URL || DEFAULT_INSTAGRAM),
  email: cleanEmail(process.env.NEXT_PUBLIC_CONTACT_EMAIL),
  /** Teslimat kapsamı: Türkiye ve tüm dünya */
  regions: ["Türkiye’nin her yeri", "Dünyanın her yeri"],
  deliveryText: "Türkiye ve dünyanın her yerine",
} as const;

export const navLinks = [
  { href: "/", label: "Ana Sayfa" },
  { href: "/urunler", label: "Ürünler" },
  { href: "/toptan-satis", label: "Toptan Satış" },
  { href: "/hakkimizda", label: "Hakkımızda" },
  { href: "/teslimat", label: "Teslimat" },
  { href: "/iletisim", label: "İletişim" },
] as const;

export function absoluteUrl(path: string): string {
  return `${site.url}${path.startsWith("/") ? path : `/${path}`}`;
}
