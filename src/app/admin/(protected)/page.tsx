import Link from "next/link";
import { DeleteProductButton } from "@/components/admin/delete-product-button";
import { StockBadge } from "@/components/product-ui";
import { requireAdmin } from "@/lib/auth";
import { formatPrice } from "@/lib/format";
import { normalizeProduct } from "@/lib/products";

const messages: Record<string, string> = {
  eklendi: "Ürün eklendi.",
  silindi: "Ürün silindi.",
};

export default async function AdminDashboard({ searchParams }: { searchParams: Promise<{ ok?: string }> }) {
  const { supabase } = await requireAdmin();
  const { ok } = await searchParams;

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("display_order", { ascending: true })
    .order("name", { ascending: true });
  const products = (data ?? []).map(normalizeProduct);

  const total = products.length;
  const inStock = products.filter((p) => p.stock_status !== "out_of_stock" && p.active).length;
  const soldOut = products.filter((p) => p.stock_status === "out_of_stock").length;

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-3xl font-semibold">Konsept Yönetim Paneli</h1>
        <Link href="/admin/urunler/yeni" className="btn btn-primary">
          Yeni Ürün
        </Link>
      </div>

      {ok && messages[ok] ? (
        <p role="status" className="rounded-2xl bg-[#E7EFD6] px-4 py-3 text-sm font-bold text-[#2F4A12]">
          {messages[ok]}
        </p>
      ) : null}
      {error ? (
        <p role="alert" className="rounded-2xl bg-[#FBE9E7] px-4 py-3 text-sm font-bold text-[#8A1C12]">
          Ürünler yüklenemedi. Lütfen sayfayı yenileyerek tekrar deneyin.
        </p>
      ) : null}

      <dl className="grid grid-cols-3 gap-3">
        {[
          ["Toplam Ürün", total],
          ["Stokta Olan", inStock],
          ["Tükenen", soldOut],
        ].map(([label, value]) => (
          <div key={label} className="rounded-2xl bg-paper p-4 sm:p-5">
            <dt className="text-xs font-bold text-ink-soft sm:text-sm">{label}</dt>
            <dd className="mt-1 font-serif text-3xl font-semibold text-forest">{value}</dd>
          </div>
        ))}
      </dl>

      <div className="overflow-x-auto rounded-2xl bg-paper">
        <table className="w-full min-w-[34rem] text-left text-sm">
          <caption className="sr-only">Ürün listesi</caption>
          <thead>
            <tr className="border-b border-cream-200 text-xs tracking-wide text-ink-soft uppercase">
              <th scope="col" className="px-4 py-3 font-bold">
                Ürün
              </th>
              <th scope="col" className="px-4 py-3 font-bold">
                Fiyat
              </th>
              <th scope="col" className="px-4 py-3 font-bold">
                Stok
              </th>
              <th scope="col" className="px-4 py-3 text-right font-bold">
                İşlem
              </th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-b border-cream-200 last:border-0">
                <td className="px-4 py-3">
                  <span className="font-bold text-forest">{p.name}</span>
                  {!p.active ? (
                    <span className="ml-2 rounded-full bg-[#EDE6DC] px-2 py-0.5 text-xs font-bold text-earth-700">
                      Pasif
                    </span>
                  ) : null}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  {formatPrice(p.price)} TL / {p.unit}
                </td>
                <td className="px-4 py-3">
                  <StockBadge status={p.stock_status} />
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1">
                    <Link
                      href={`/admin/urunler/${p.id}`}
                      className="inline-flex min-h-11 items-center rounded-full px-3 font-bold text-forest underline underline-offset-4 hover:bg-cream-200"
                    >
                      Düzenle
                    </Link>
                    <DeleteProductButton id={p.id} name={p.name} variant="link" />
                  </div>
                </td>
              </tr>
            ))}
            {products.length === 0 && !error ? (
              <tr>
                <td colSpan={4} className="px-4 py-10 text-center text-ink-soft">
                  Henüz ürün yok. &quot;Yeni Ürün&quot; ile ilk ürünü ekleyin.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
