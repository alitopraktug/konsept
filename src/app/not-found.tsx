import type { Metadata } from "next";
import { NotFoundContent } from "@/components/not-found-content";
import { SiteShell } from "@/components/site-shell";

export const metadata: Metadata = {
  title: "Sayfa bulunamadı",
  robots: { index: false, follow: false },
};

/** Eşleşmeyen tüm adresler için (site kabuğuyla birlikte) */
export default function RootNotFound() {
  return (
    <SiteShell>
      <NotFoundContent />
    </SiteShell>
  );
}
