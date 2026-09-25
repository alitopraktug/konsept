import Link from "next/link";

export default function AdminNotFound() {
  return (
    <div className="rounded-3xl bg-paper p-8 text-center">
      <h1 className="text-2xl font-semibold">Ürün bulunamadı.</h1>
      <p className="mt-2 text-ink-soft">Bu ürün silinmiş olabilir.</p>
      <Link href="/admin" className="btn btn-primary mt-5">
        Ürünlere Dön
      </Link>
    </div>
  );
}
