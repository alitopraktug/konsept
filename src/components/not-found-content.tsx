import Link from "next/link";

export function NotFoundContent() {
  return (
    <section className="bg-cream">
      <div className="container-x flex flex-col items-center py-20 text-center md:py-28">
        <p className="font-serif text-6xl font-semibold text-avocado md:text-7xl">404</p>
        <h1 className="mt-4 text-3xl font-semibold md:text-4xl">Aradığınız sayfayı bulamadık.</h1>
        <p className="mt-3 max-w-md text-ink-soft">
          Sayfa taşınmış veya kaldırılmış olabilir. Ana sayfadan devam edebilir ya da ürünlerimize göz atabilirsiniz.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link href="/" className="btn btn-primary btn-lg">
            Ana Sayfaya Dön
          </Link>
          <Link href="/urunler" className="btn btn-outline btn-lg">
            Ürünleri İncele
          </Link>
        </div>
      </div>
    </section>
  );
}
