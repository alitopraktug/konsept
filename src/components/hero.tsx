import { getImageProps } from "next/image";
import Link from "next/link";
import { GENERAL_ORDER_MESSAGE } from "@/lib/whatsapp";
import { ArrowRightIcon } from "./icons";
import { WhatsAppButton } from "./whatsapp-button";

const HERO_ALT = "Avokado, ejderha meyvesi, mango, muz, çarkıfelek ve limondan oluşan taze egzotik meyve seçkisi";

export function Hero() {
  // Art direction: masaüstü ve mobil için ayrı görsel; yalnızca eşleşen görsel indirilir.
  const desktop = getImageProps({
    src: "/images/hero/hero-desktop.webp",
    alt: HERO_ALT,
    width: 1600,
    height: 1100,
    sizes: "60vw",
    quality: 75,
  });
  const mobile = getImageProps({
    src: "/images/hero/hero-mobile.webp",
    alt: HERO_ALT,
    width: 1000,
    height: 900,
    sizes: "(min-width: 640px) 90vw, 100vw",
    quality: 75,
    fetchPriority: "high",
    loading: "eager",
  });

  return (
    <section className="relative overflow-hidden bg-[#F1EADB]">
      <div className="container-x relative z-10 lg:min-h-[38rem] lg:content-center">
        <div className="pt-9 pb-6 lg:max-w-[32rem] lg:py-20">
          <p className="eyebrow">Türkiye ve dünyanın her yerine teslimat</p>
          <h1 className="h-display mt-3">Doğanın En Özel Tatları</h1>
          <p className="mt-4 max-w-md text-base leading-relaxed text-ink-soft sm:text-lg">
            Taze ve özenle seçilmiş egzotik meyveleri eviniz ve işletmeniz için kolayca sipariş edin.
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Link href="/urunler" className="btn btn-primary btn-lg">
              Ürünleri Keşfet
              <ArrowRightIcon size={18} />
            </Link>
            <WhatsAppButton message={GENERAL_ORDER_MESSAGE} size="lg" location="hero">
              WhatsApp&apos;tan Sipariş Ver
            </WhatsAppButton>
          </div>
          <p className="mt-5 text-sm font-semibold text-forest">
            Taze ürün <span aria-hidden className="mx-1 text-avocado">•</span>Kolay sipariş
            <span aria-hidden className="mx-1 text-avocado">•</span>Bireysel &amp; işletme siparişleri
          </p>
        </div>
      </div>

      {/* Mobil: metnin altında görsel kartı. Masaüstü: sağa yaslı, sol kenarı zemine karışan görsel. */}
      <div className="container-x pb-8 lg:absolute lg:inset-y-0 lg:right-0 lg:left-auto lg:w-[60%] lg:max-w-none lg:!p-0">
        <picture>
          <source media="(min-width: 1024px)" srcSet={desktop.props.srcSet} sizes="60vw" />
          <source media="(max-width: 1023px)" srcSet={mobile.props.srcSet} sizes="(min-width: 640px) 90vw, 100vw" />
          <img
            {...mobile.props}
            alt={HERO_ALT}
            className="aspect-[10/9] w-full rounded-3xl object-cover lg:hero-fade lg:aspect-auto lg:h-full lg:rounded-none lg:object-[80%_center]"
          />
        </picture>
      </div>
    </section>
  );
}
