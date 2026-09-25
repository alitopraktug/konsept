/**
 * Analitik altyapısı. GA4 / GTM / Meta Pixel ID'leri tanımlı değilse hiçbir script yüklenmez
 * ve track() sessizce hiçbir şey yapmaz.
 *
 * Olaylar: whatsapp_click, whatsapp_product_click, phone_click, instagram_click, product_view
 */

export type AnalyticsEvent =
  | "whatsapp_click"
  | "whatsapp_product_click"
  | "phone_click"
  | "instagram_click"
  | "product_view";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
  }
}

export function track(event: AnalyticsEvent, params: Record<string, string | number | boolean> = {}): void {
  if (typeof window === "undefined") return;
  try {
    window.dataLayer?.push({ event, ...params });
    window.gtag?.("event", event, params);
    if (window.fbq) {
      if (event === "whatsapp_click" || event === "whatsapp_product_click" || event === "phone_click") {
        window.fbq("track", "Contact", params);
      } else if (event === "product_view") {
        window.fbq("track", "ViewContent", params);
      } else {
        window.fbq("trackCustom", event, params);
      }
    }
  } catch {
    // Analitik hatası kullanıcı akışını asla bozmamalı.
  }
}
