import type { Metadata } from "next";
import { emptyProduct, ProductForm } from "@/components/admin/product-form";
import { requireAdmin } from "@/lib/auth";

export const metadata: Metadata = { title: "Yeni Ürün" };

export default async function NewProductPage() {
  await requireAdmin();
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <h1 className="text-3xl font-semibold">Yeni Ürün</h1>
      <ProductForm mode="create" defaults={emptyProduct} />
    </div>
  );
}
