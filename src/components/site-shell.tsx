import { FloatingWhatsApp } from "./floating-whatsapp";
import { Footer } from "./footer";
import { AnnouncementBar, Header } from "./header";

export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <a
        href="#icerik"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[60] focus:rounded-full focus:bg-forest focus:px-4 focus:py-2 focus:text-cream"
      >
        İçeriğe geç
      </a>
      <AnnouncementBar />
      <Header />
      <main id="icerik">{children}</main>
      <Footer />
      <FloatingWhatsApp />
    </>
  );
}
