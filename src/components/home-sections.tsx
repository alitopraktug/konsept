import Image from "next/image";
import Link from "next/link";
import { site } from "@/lib/site";
import { DELIVERY_MESSAGE, RIPENESS_OPTIONS, WHOLESALE_MESSAGE } from "@/lib/whatsapp";
import {
  ArrowRightIcon,
  BoxIcon,
  ChatIcon,
  CheckIcon,
  HomeIcon,
  InstagramIcon,
  LeafIcon,
  MapPinIcon,
  PhoneIcon,
  RepeatIcon,
  SparkIcon,
  StoreIcon,
  TagIcon,
} from "./icons";
import { TrackedLink, WhatsAppButton } from "./whatsapp-button";

export function SectionHeading({
  id,
  eyebrow,
  title,
  children,
  center = false,
}: {
  id?: string;
  eyebrow?: string;
  title: string;
  children?: React.ReactNode;
  center?: boolean;
}) {
  return (
    <div className={center ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
      <h2 id={id} className="h-section mt-2">{title}</h2>
      {children ? <div className="mt-3 text-base leading-relaxed text-ink-soft sm:text-lg">{children}</div> : null}
    </div>
  );
}

/* 4. Güven göstergeleri — yalnızca doğrulanabilir, marka tarafından verilen ifadeler */
const trust = [
  { icon: LeafIcon, title: "Özenle seçilmiş ürünler", text: "Egzotik ve seçili taze meyveler" },
  { icon: ChatIcon, title: "WhatsApp ile kolay sipariş", text: "Ürün, miktar, mesaj hazır" },
  { icon: HomeIcon, title: "Bireysel & işletme", text: "Ev ve iş yeri siparişleri" },
  { icon: MapPinIcon, title: "Her yere teslimat", text: "Türkiye ve tüm dünya" },
];

export function TrustBar() {
  return (
    <section aria-label="Neden Konsept" className="border-b border-cream-200 bg-paper">
      <ul className="container-x grid grid-cols-2 gap-x-4 gap-y-5 py-6 lg:grid-cols-4">
        {trust.map(({ icon: Icon, title, text }) => (
          <li key={title} className="flex items-start gap-3">
            <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#E7EFD6] text-forest">
              <Icon size={20} />
            </span>
            <span>
              <span className="block text-sm leading-snug font-bold text-forest">{title}</span>
              <span className="mt-0.5 block text-xs leading-snug text-ink-soft sm:text-[0.8125rem]">{text}</span>
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}

/* 6. Avokado özel bölümü — olgunluk aşamaları (ikon; gerçek olgunluk fotoğrafı yok) */
const AVO_PATH =
  "M0,-200 C46,-200 68,-130 92,-62 C122,20 142,62 132,108 C120,168 66,200 0,200 C-66,200 -120,168 -132,108 C-142,62 -122,20 -92,-62 C-68,-130 -46,-200 0,-200 Z";

const stageColors: Record<string, { skin: string; flesh: string; edge: string; tile: string }> = {
  "sert-ham": { skin: "#4E7F2A", flesh: "#E3EDB2", edge: "#A6C561", tile: "#E9EFD6" },
  "olgunlasmaya-yakin": { skin: "#3E5221", flesh: "#E0E37E", edge: "#B4CC58", tile: "#EEEBCB" },
  "tuketime-hazir": { skin: "#2B2323", flesh: "#F0E58A", edge: "#8FA43A", tile: "#F4EBC4" },
};

function AvocadoStage({ stage }: { stage: string }) {
  const c = stageColors[stage];
  return (
    <svg viewBox="-160 -215 320 430" aria-hidden focusable="false" className="h-full max-h-40 w-auto sm:max-h-52">
      <path d={AVO_PATH} fill={c.skin} />
      <path d={AVO_PATH} transform="scale(0.92)" fill={c.flesh} />
      <path d={AVO_PATH} transform="scale(0.92)" fill="none" stroke={c.edge} strokeWidth="14" opacity="0.7" />
      <circle cx="0" cy="58" r="64" fill="#7B4B28" />
      <ellipse cx="-20" cy="34" rx="20" ry="11" fill="#fff" opacity="0.3" transform="rotate(-28 -20 34)" />
    </svg>
  );
}

export function AvocadoRipeness({ avocadoHref }: { avocadoHref: string }) {
  return (
    <section className="section bg-cream" aria-labelledby="avokado-olgunluk">
      <div className="container-x">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="eyebrow">Avokado</p>
            <h2 id="avokado-olgunluk" className="h-section mt-2">
              Avokadonuzu Doğru Olgunlukta Seçin
            </h2>
            <p className="mt-3 text-base leading-relaxed text-ink-soft sm:text-lg">
              Ne zaman tüketeceğinize göre olgunluğu siz belirleyin; seçiminiz WhatsApp siparişine otomatik eklenir.
            </p>
          </div>
          <Link href={avocadoHref} className="btn btn-primary btn-lg self-start md:self-auto">
            Avokado Sipariş Ver
            <ArrowRightIcon size={18} />
          </Link>
        </div>

        <ol className="mt-9 grid gap-3 sm:grid-cols-3 sm:gap-5">
          {RIPENESS_OPTIONS.map((o, i) => (
            <li key={o.value} className="flex items-stretch overflow-hidden rounded-3xl bg-paper sm:block">
              <div
                className="flex w-[38%] shrink-0 items-center justify-center py-5 sm:h-56 sm:w-full"
                style={{ backgroundColor: stageColors[o.value].tile }}
              >
                <AvocadoStage stage={o.value} />
              </div>
              <div className="flex flex-col justify-center p-4 sm:block sm:p-5">
                <p className="text-xs font-bold tracking-widest text-avocado-700 uppercase">{i + 1}. aşama</p>
                <h3 className="mt-1 text-xl font-semibold">{o.label}</h3>
                <p className="mt-1 text-sm text-ink-soft">{o.description}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* 7. Bireysel / İşletme */
export function AudienceSplit() {
  return (
    <section className="section bg-paper" aria-label="Bireysel ve işletme siparişleri">
      <div className="container-x grid gap-5 md:grid-cols-2 lg:gap-8">
        <article className="overflow-hidden rounded-3xl bg-cream">
          <div className="relative aspect-[4/3]">
            <Image
              src="/images/hero/bireysel-kullanim.webp"
              alt="Yarım kesilmiş taze avokado ve mango"
              fill
              sizes="(min-width: 768px) 46vw, 92vw"
              className="object-cover"
            />
          </div>
          <div className="p-6 sm:p-8">
            <h2 className="text-2xl font-semibold sm:text-3xl">Eviniz İçin</h2>
            <p className="mt-2 text-ink-soft">
              Taze egzotik meyveleri kolayca seçin ve WhatsApp üzerinden sipariş verin.
            </p>
            <Link href="/urunler" className="btn btn-primary mt-5">
              Ürünleri İncele
              <ArrowRightIcon size={18} />
            </Link>
          </div>
        </article>

        <article className="overflow-hidden rounded-3xl bg-cream">
          <div className="relative aspect-[4/3]">
            <Image
              src="/images/hero/toptan-satis.webp"
              alt="Çarkıfelek, muz ve limon"
              fill
              sizes="(min-width: 768px) 46vw, 92vw"
              className="object-cover"
            />
          </div>
          <div className="p-6 sm:p-8">
            <h2 className="text-2xl font-semibold sm:text-3xl">İşletmeniz İçin</h2>
            <p className="mt-2 text-ink-soft">
              Kafe, restoran, otel, market, manav ve diğer işletmeler için toplu ürün talepleri.
            </p>
            <Link href="/toptan-satis" className="btn btn-outline mt-5">
              Toptan Teklif Al
              <ArrowRightIcon size={18} />
            </Link>
          </div>
        </article>
      </div>
    </section>
  );
}

/* 8. Toptan satış */
export const wholesaleFeatures = [
  { icon: BoxIcon, title: "Toplu Sipariş", text: "İşletmenizin ihtiyacına uygun miktarlarda sipariş oluşturun." },
  { icon: RepeatIcon, title: "Düzenli Tedarik", text: "Tekrarlayan ürün ihtiyaçlarınız için bizimle iletişim kurun." },
  { icon: TagIcon, title: "Fiyat Teklifi", text: "Sipariş miktarınızı paylaşarak fiyat bilgisi alın." },
  { icon: ChatIcon, title: "Hızlı İletişim", text: "WhatsApp üzerinden kolayca ulaşın." },
];

export function WholesaleBand() {
  return (
    <section className="section on-dark bg-forest text-cream" aria-labelledby="toptan-baslik">
      <div className="container-x">
        <div className="max-w-2xl">
          <p className="eyebrow">Toptan Satış</p>
          <h2 id="toptan-baslik" className="h-section mt-2 !text-cream">
            İşletmeniz İçin Güvenilir Meyve Tedariği
          </h2>
          <p className="mt-3 text-base leading-relaxed text-cream/85 sm:text-lg">
            Kafe, restoran, otel, pub, market, manav ve diğer işletmeler için toplu egzotik meyve siparişleri.
          </p>
        </div>
        <ul className="mt-9 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {wholesaleFeatures.map(({ icon: Icon, title, text }) => (
            <li key={title} className="rounded-2xl bg-white/[0.06] p-4 sm:p-5">
              <Icon size={24} className="text-sage" />
              <h3 className="mt-3 font-sans text-base font-bold !text-cream">{title}</h3>
              <p className="mt-1 text-sm text-cream/80">{text}</p>
            </li>
          ))}
        </ul>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <WhatsAppButton message={WHOLESALE_MESSAGE} size="lg" location="wholesale_band">
            WhatsApp&apos;tan Teklif Al
          </WhatsAppButton>
          <Link href="/toptan-satis" className="btn btn-outline-light btn-lg">
            Toptan Satış Detayları
          </Link>
        </div>
      </div>
    </section>
  );
}

/* 9. Nasıl çalışır */
export const steps = [
  { title: "Ürününü Seç", text: "Ürünleri incele." },
  { title: "Miktarı Belirle", text: "Sipariş miktarını seç." },
  { title: "WhatsApp'a Gönder", text: "Ürün bilgileri otomatik mesaj oluşturur." },
  { title: "Siparişini Netleştir", text: "Teslimat ve sipariş detaylarını WhatsApp üzerinden görüş." },
];

export function HowItWorks() {
  return (
    <section className="section bg-paper" aria-labelledby="nasil-calisir">
      <div className="container-x">
        <SectionHeading id="nasil-calisir" eyebrow="Nasıl çalışır?" title="Sipariş Vermek Çok Kolay" center />
        <ol className="mt-10 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {steps.map((s, i) => (
            <li key={s.title} className="relative rounded-3xl bg-cream p-4 sm:p-6">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-forest font-serif text-xl font-semibold text-cream">
                {i + 1}
              </span>
              <h3 className="mt-3 text-lg leading-snug font-semibold sm:mt-4 sm:text-xl">{s.title}</h3>
              <p className="mt-1 text-sm text-ink-soft">{s.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* 10. Neden Konsept */
const reasons = [
  { icon: SparkIcon, title: "Özenle Seçilen Ürünler", text: "Ürün seçiminde kalite ve tazelik ön planda tutulur." },
  { icon: ChatIcon, title: "Kolay Sipariş", text: "WhatsApp üzerinden birkaç adımda iletişime geçin." },
  { icon: HomeIcon, title: "Bireysel & İşletme", text: "Hem ev hem işletme siparişleri." },
  { icon: StoreIcon, title: "Toplu Sipariş", text: "İşletmeler için toplu ürün talepleri." },
];

export function WhyKonsept() {
  return (
    <section className="section bg-cream" aria-labelledby="neden-konsept">
      <div className="container-x">
        <SectionHeading id="neden-konsept" eyebrow="Neden Konsept?" title="Seçilmiş meyve, kolay sipariş" center />
        <ul className="mt-10 grid grid-cols-2 gap-x-4 gap-y-8 lg:grid-cols-4 lg:gap-x-8">
          {reasons.map(({ icon: Icon, title, text }) => (
            <li key={title}>
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-paper text-forest">
                <Icon size={24} />
              </span>
              <h3 className="mt-3 text-lg leading-snug font-semibold sm:mt-4 sm:text-xl">{title}</h3>
              <p className="mt-1 text-sm text-ink-soft">{text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* 11. Teslimat */
export function DeliverySection() {
  return (
    <section className="section bg-paper" aria-labelledby="teslimat-baslik">
      <div className="container-x grid items-center gap-8 lg:grid-cols-2 lg:gap-14">
        <div>
          <p className="eyebrow">Teslimat</p>
          <h2 id="teslimat-baslik" className="h-section mt-2">
            Tazelik Kapınıza Gelsin
          </h2>
          <p className="mt-3 text-base leading-relaxed text-ink-soft sm:text-lg">
            Teslimat detayları için WhatsApp üzerinden iletişime geçebilirsiniz.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <WhatsAppButton message={DELIVERY_MESSAGE} location="delivery_section">
              Teslimat Bilgisi Al
            </WhatsAppButton>
            <Link href="/teslimat" className="btn btn-outline">
              Teslimat Bölgeleri
            </Link>
          </div>
        </div>
        <div className="rounded-3xl bg-cream p-6 sm:p-8">
          <p className="text-sm font-bold text-forest">Teslimat bölgeleri</p>
          <ul className="mt-4 flex flex-wrap gap-2.5">
            {site.regions.map((r) => (
              <li
                key={r}
                className="inline-flex items-center gap-2 rounded-full bg-paper px-4 py-2.5 text-sm font-bold text-forest"
              >
                <MapPinIcon size={16} className="text-avocado-700" />
                {r}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

/* 12. Instagram — sahte takipçi/beğeni/yorum yok */
const igImages = Array.from({ length: 6 }, (_, i) => `/images/hero/instagram-${i + 1}.webp`);

export function InstagramSection() {
  return (
    <section className="section bg-cream" aria-labelledby="instagram-baslik">
      <div className="container-x">
        <SectionHeading id="instagram-baslik" title="Bizi Instagram’da Takip Edin" center />
        <ul className="mx-auto mt-9 grid max-w-4xl grid-cols-3 gap-2 sm:gap-3">
          {igImages.map((src, i) => (
            <li key={src} className="relative aspect-square overflow-hidden rounded-xl sm:rounded-2xl">
              <Image
                src={src}
                alt={`Konsept egzotik meyve görseli ${i + 1}`}
                fill
                sizes="(min-width: 896px) 290px, 32vw"
                className="object-cover"
              />
            </li>
          ))}
        </ul>
        <div className="mt-8 flex flex-col items-center gap-3">
          {site.instagramUrl ? (
            <TrackedLink
              href={site.instagramUrl}
              event="instagram_click"
              external
              location="instagram_section"
              className="btn btn-primary btn-lg"
            >
              <InstagramIcon size={20} />
              Instagram’da Takip Et
            </TrackedLink>
          ) : (
            <p className="text-sm text-ink-soft">
              Yeni ürünler ve duyurular için bize WhatsApp&apos;tan ulaşabilirsiniz.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

/* 13. İletişim CTA */
export function ContactCTA() {
  return (
    <section className="section on-dark bg-forest text-cream" aria-labelledby="iletisim-cta">
      <div className="container-x flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
        <div className="max-w-xl">
          <h2 id="iletisim-cta" className="h-section !text-cream">
            Siparişiniz İçin Bize Ulaşın
          </h2>
          <p className="mt-3 text-cream/85 sm:text-lg">
            Ürün, miktar ve teslimat detaylarını WhatsApp üzerinden hızlıca netleştirelim.
          </p>
        </div>
        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
          <WhatsAppButton size="lg" location="contact_cta" message="Merhaba Konsept, web sitenizden ulaşıyorum. Sipariş vermek istiyorum.">
            WhatsApp&apos;tan Sipariş Ver
          </WhatsAppButton>
          <TrackedLink href={site.phoneHref} event="phone_click" location="contact_cta" className="btn btn-outline-light btn-lg">
            <PhoneIcon size={18} />
            {site.phoneDisplay}
          </TrackedLink>
        </div>
      </div>
    </section>
  );
}

export function CheckList({ items, tone = "dark" }: { items: string[]; tone?: "dark" | "light" }) {
  return (
    <ul className="space-y-2.5">
      {items.map((it) => (
        <li key={it} className={`flex items-start gap-2.5 ${tone === "light" ? "text-cream/90" : "text-ink-soft"}`}>
          <CheckIcon size={18} className="mt-1 shrink-0 text-avocado" />
          <span>{it}</span>
        </li>
      ))}
    </ul>
  );
}
