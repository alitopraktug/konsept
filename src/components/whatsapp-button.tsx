"use client";

import type { ReactNode } from "react";
import { track, type AnalyticsEvent } from "@/lib/analytics";
import { site } from "@/lib/site";
import { whatsappUrl } from "@/lib/whatsapp";
import { WhatsAppIcon } from "./icons";

interface WhatsAppButtonProps {
  /** Hazır (Türkçe) mesaj metni. Boşsa yalnızca sohbet açılır. */
  message?: string;
  children: ReactNode;
  variant?: "wa" | "primary" | "outline" | "light" | "outline-light";
  size?: "md" | "lg";
  className?: string;
  /** Ürüne özel tıklamalarda whatsapp_product_click gönderilir */
  productSlug?: string;
  location?: string;
  icon?: boolean;
}

export function WhatsAppButton({
  message,
  children,
  variant = "wa",
  size = "md",
  className = "",
  productSlug,
  location,
  icon = true,
}: WhatsAppButtonProps) {
  const event: AnalyticsEvent = productSlug ? "whatsapp_product_click" : "whatsapp_click";
  return (
    <a
      href={whatsappUrl(message, site.whatsappNumber)}
      target="_blank"
      rel="noopener noreferrer"
      className={`btn btn-${variant} ${size === "lg" ? "btn-lg" : ""} ${className}`}
      onClick={() => track(event, { ...(productSlug ? { product: productSlug } : {}), ...(location ? { location } : {}) })}
    >
      {icon ? <WhatsAppIcon size={18} /> : null}
      {children}
    </a>
  );
}

interface TrackedLinkProps {
  href: string;
  event: AnalyticsEvent;
  children: ReactNode;
  className?: string;
  external?: boolean;
  label?: string;
  location?: string;
  "aria-label"?: string;
}

/** Telefon / Instagram / e-posta bağlantıları için olay takipli link */
export function TrackedLink({ href, event, children, className, external, location, ...rest }: TrackedLinkProps) {
  return (
    <a
      href={href}
      className={className}
      aria-label={rest["aria-label"]}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      onClick={() => track(event, location ? { location } : {})}
    >
      {children}
    </a>
  );
}
