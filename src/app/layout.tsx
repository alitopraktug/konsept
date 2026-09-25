import type { Metadata, Viewport } from "next";
import { Manrope, Playfair_Display } from "next/font/google";
import { Analytics } from "@/components/analytics";
import { site } from "@/lib/site";
import "./globals.css";

const display = Playfair_Display({
  subsets: ["latin", "latin-ext"],
  variable: "--font-display",
  display: "swap",
});

const body = Manrope({
  subsets: ["latin", "latin-ext"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "Konsept | Adana Egzotik Meyve Siparişi",
    template: "%s | Konsept",
  },
  description:
    "Avokado, mango, çarkıfelek, ejderha meyvesi ve daha fazlası. Adana'da bireysel ve işletme siparişleri için egzotik meyveleri WhatsApp'tan kolayca sipariş edin.",
  applicationName: site.name,
  formatDetection: { telephone: false, email: false, address: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#173F35",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" data-scroll-behavior="smooth" className={`${display.variable} ${body.variable}`}>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
