"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function SiteError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    // Hassas bilgi loglanmaz; yalnızca hata özeti kimliği (digest) yazılır.
    if (error.digest) console.error("Sayfa hatası:", error.digest);
  }, [error]);

  return (
    <section className="bg-cream">
      <div className="container-x flex flex-col items-center py-20 text-center md:py-28">
        <h1 className="text-3xl font-semibold md:text-4xl">Bir sorun oluştu.</h1>
        <p className="mt-3 max-w-md text-ink-soft">Lütfen sayfayı yenileyerek tekrar deneyin.</p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <button type="button" onClick={reset} className="btn btn-primary btn-lg">
            Sayfayı Yenile
          </button>
          <Link href="/" className="btn btn-outline btn-lg">
            Ana Sayfaya Dön
          </Link>
        </div>
      </div>
    </section>
  );
}
