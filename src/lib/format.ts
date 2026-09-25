const priceFormatter = new Intl.NumberFormat("tr-TR", { minimumFractionDigits: 0, maximumFractionDigits: 2 });

export function formatPrice(value: number): string {
  return priceFormatter.format(value);
}

/** Tarayıcı ve sunucuda aynı sonucu veren, Türkçe karakterleri sadeleştiren slug üretici */
export function slugify(input: string): string {
  const map: Record<string, string> = { ç: "c", ğ: "g", ı: "i", ö: "o", ş: "s", ü: "u", â: "a", î: "i", û: "u" };
  return input
    .replace(/İ/g, "i")
    .toLowerCase()
    .replace(/[çğıöşüâîû]/g, (c) => map[c] ?? c)
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}
