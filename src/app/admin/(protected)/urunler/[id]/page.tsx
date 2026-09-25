import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductForm } from "@/components/admin/product-form";
import { requireAdmin } from "@/lib/auth";
import { normalizeProduct } from "@/lib/products";
import { uuidSchema, type ProductInput } from "@/lib/validation";

export const metadata: Metadata = { title: "Ürünü Düzenle" };

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { supabase } = await requireAdmin();
  const { id } = await params;
  if (!uuidSchema.safeParse(id).success) notFound();

  const { data } = await supabase.from("products").select("*").eq("id", id).maybeSingle();
  if (!data) notFound();
  const p = normalizeProduct(data);

  const defaults: ProductInput = {
    name: p.name,
    slug: p.slug,
    short_description: p.short_description,
    description: p.description,
    price: p.price,
    unit: (["kg", "adet", "paket"] as const).find((u) => u === p.unit) ?? "kg",
    stock_status: p.stock_status,
    cover_image: p.cover_image,
    images: p.images,
    featured: p.featured,
    active: p.active,
    display_order: p.display_order,
    ripeness_enabled: p.ripeness_enabled,
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <h1 className="text-3xl font-semibold">Ürünü Düzenle: {p.name}</h1>
      <ProductForm mode="edit" productId={p.id} defaults={defaults} />
    </div>
  );
}
