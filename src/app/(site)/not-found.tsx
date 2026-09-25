import type { Metadata } from "next";
import { NotFoundContent } from "@/components/not-found-content";

export const metadata: Metadata = {
  title: "Sayfa bulunamadı",
  robots: { index: false, follow: false },
};

/** notFound() çağrıları için (ör. pasif veya olmayan ürün) — layout zaten site kabuğunu sağlar */
export default function SiteNotFound() {
  return <NotFoundContent />;
}
