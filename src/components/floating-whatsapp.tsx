"use client";

import { usePathname } from "next/navigation";
import { track } from "@/lib/analytics";
import { site } from "@/lib/site";
import { GENERAL_ORDER_MESSAGE, whatsappUrl } from "@/lib/whatsapp";
import { WhatsAppIcon } from "./icons";

/** Sağ altta sabit WhatsApp butonu. Ürün detayında mobilde kendi sticky çubuğu olduğu için gizlenir. */
export function FloatingWhatsApp() {
  const pathname = usePathname();
  const onProductDetail = /^\/urunler\/[^/]+/.test(pathname);

  return (
    <a
      href={whatsappUrl(GENERAL_ORDER_MESSAGE, site.whatsappNumber)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="WhatsApp'tan sipariş ver"
      onClick={() => track("whatsapp_click", { location: "floating" })}
      className={`fixed right-3 z-30 items-center justify-center gap-2 rounded-full bg-wa text-[#08261a] shadow-lg shadow-black/25 ring-2 ring-white/80 transition-colors hover:bg-wa-dark md:right-6 md:bottom-6 md:flex md:h-14 md:px-5 ${
        onProductDetail ? "hidden" : "flex h-12 w-12 md:w-auto"
      }`}
      style={{ bottom: "max(1rem, env(safe-area-inset-bottom))" }}
    >
      <WhatsAppIcon size={26} />
      <span className="hidden text-sm font-bold md:inline">WhatsApp</span>
    </a>
  );
}
