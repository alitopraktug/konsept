import Image from "next/image";
import Link from "next/link";

/**
 * Marka logosu (şeffaf zeminli). `tone="light"` koyu zeminler (footer) için krem sürümü kullanır.
 * Dosyalar `npm run photos` ile assets/photos/logo.webp'den üretilir.
 */
export function Logo({
  tone = "dark",
  className = "",
  priority = false,
}: {
  tone?: "dark" | "light";
  className?: string;
  priority?: boolean;
}) {
  return (
    <Link href="/" aria-label="Konsept — Egzotik Meyveler, Ana Sayfa" className={`inline-flex items-center ${className}`}>
      <Image
        src={tone === "dark" ? "/images/branding/logo-horizontal.webp" : "/images/branding/logo-horizontal-light.webp"}
        alt="Konsept Egzotik Meyveler"
        width={Math.round(160 * 3.85)}
        height={160}
        priority={priority}
        sizes="180px"
        className="h-10 w-auto sm:h-11"
      />
    </Link>
  );
}
