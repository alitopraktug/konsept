"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { createProductAction, updateProductAction } from "@/app/admin/actions";
import { slugify } from "@/lib/format";
import { STOCK_LABELS, STOCK_STATUSES, UNITS } from "@/lib/types";
import { productSchema, type ProductInput } from "@/lib/validation";
import { DeleteProductButton } from "./delete-product-button";
import { ImageUploader } from "./image-uploader";

export const emptyProduct: ProductInput = {
  name: "",
  slug: "",
  short_description: "",
  description: "",
  price: 0,
  unit: "kg",
  stock_status: "in_stock",
  cover_image: null,
  images: [],
  featured: false,
  active: true,
  display_order: 100,
  ripeness_enabled: false,
};

function FieldError({ name, message }: { name: string; message?: string }) {
  return message ? (
    <p id={`${name}-hata`} className="error-text">
      {message}
    </p>
  ) : null;
}

type Status = { kind: "success" | "error"; text: string } | null;

export function ProductForm({
  mode,
  productId,
  defaults,
}: {
  mode: "create" | "edit";
  productId?: string;
  defaults: ProductInput;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [status, setStatus] = useState<Status>(null);
  const [slugTouched, setSlugTouched] = useState(mode === "edit");

  const {
    register,
    handleSubmit,
    control,
    setValue,
    setError,
    formState: { errors },
  } = useForm<ProductInput>({ resolver: zodResolver(productSchema), defaultValues: defaults });

  const nameField = register("name");

  const onSubmit = handleSubmit((values) => {
    setStatus(null);
    startTransition(async () => {
      const result = mode === "create" ? await createProductAction(values) : await updateProductAction(productId!, values);
      if (result.ok) {
        if (mode === "create") {
          router.push("/admin?ok=eklendi");
          router.refresh();
        } else {
          setStatus({ kind: "success", text: "Ürün güncellendi." });
          router.refresh();
        }
        return;
      }
      for (const [field, message] of Object.entries(result.fieldErrors ?? {})) {
        setError(field as keyof ProductInput, { message });
      }
      setStatus({
        kind: "error",
        text: mode === "edit" && !result.fieldErrors ? "Değişiklikler kaydedilemedi. Lütfen tekrar deneyin." : result.error,
      });
    });
  });

  const err = (name: keyof ProductInput) => errors[name]?.message as string | undefined;
  const fieldProps = (name: keyof ProductInput) => ({
    "aria-invalid": errors[name] ? (true as const) : undefined,
    "aria-describedby": errors[name] ? `${name}-hata` : undefined,
  });

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-8">
      <section className="space-y-5 rounded-3xl bg-paper p-5 sm:p-7">
        <h2 className="font-sans text-base font-bold">Ürün bilgileri</h2>
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="name" className="label">
              Ürün adı
            </label>
            <input
              id="name"
              className="field"
              {...nameField}
              {...fieldProps("name")}
              onChange={(e) => {
                nameField.onChange(e);
                if (!slugTouched) setValue("slug", slugify(e.target.value), { shouldValidate: false });
              }}
            />
            <FieldError name="name" message={err("name")} />
          </div>
          <div>
            <label htmlFor="slug" className="label">
              Slug (adres)
            </label>
            <input
              id="slug"
              className="field"
              autoCapitalize="none"
              spellCheck={false}
              {...register("slug", { onChange: () => setSlugTouched(true) })}
              {...fieldProps("slug")}
            />
            <p className="hint">Sitede /urunler/… olarak görünür. Küçük harf, rakam ve tire.</p>
            <FieldError name="slug" message={err("slug")} />
          </div>
        </div>

        <div>
          <label htmlFor="short_description" className="label">
            Kısa açıklama
          </label>
          <textarea id="short_description" rows={2} className="field" {...register("short_description")} {...fieldProps("short_description")} />
          <FieldError name="short_description" message={err("short_description")} />
        </div>
        <div>
          <label htmlFor="description" className="label">
            Açıklama
          </label>
          <textarea id="description" rows={5} className="field" {...register("description")} {...fieldProps("description")} />
          <p className="hint">Düz metin. HTML desteklenmez.</p>
          <FieldError name="description" message={err("description")} />
        </div>
      </section>

      <section className="space-y-5 rounded-3xl bg-paper p-5 sm:p-7">
        <h2 className="font-sans text-base font-bold">Fiyat ve stok</h2>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <label htmlFor="price" className="label">
              Fiyat (TL)
            </label>
            <input
              id="price"
              type="number"
              inputMode="decimal"
              step="0.01"
              min="0"
              className="field"
              {...register("price", { valueAsNumber: true })}
              {...fieldProps("price")}
            />
            <FieldError name="price" message={err("price")} />
          </div>
          <div>
            <label htmlFor="unit" className="label">
              Birim
            </label>
            <select id="unit" className="field" {...register("unit")} {...fieldProps("unit")}>
              {UNITS.map((u) => (
                <option key={u} value={u}>
                  {u}
                </option>
              ))}
            </select>
            <FieldError name="unit" message={err("unit")} />
          </div>
          <div>
            <label htmlFor="stock_status" className="label">
              Stok durumu
            </label>
            <select id="stock_status" className="field" {...register("stock_status")} {...fieldProps("stock_status")}>
              {STOCK_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {STOCK_LABELS[s]}
                </option>
              ))}
            </select>
            <FieldError name="stock_status" message={err("stock_status")} />
          </div>
          <div>
            <label htmlFor="display_order" className="label">
              Sıra
            </label>
            <input
              id="display_order"
              type="number"
              step="1"
              min="0"
              className="field"
              {...register("display_order", { valueAsNumber: true })}
              {...fieldProps("display_order")}
            />
            <p className="hint">Küçük sayı önce gösterilir.</p>
            <FieldError name="display_order" message={err("display_order")} />
          </div>
        </div>
      </section>

      <section className="rounded-3xl bg-paper p-5 sm:p-7">
        <h2 className="mb-5 font-sans text-base font-bold">Fotoğraflar</h2>
        <Controller
          control={control}
          name="cover_image"
          render={({ field: cover }) => (
            <Controller
              control={control}
              name="images"
              render={({ field: extra }) => (
                <ImageUploader
                  cover={cover.value}
                  images={extra.value}
                  onCoverChange={cover.onChange}
                  onImagesChange={extra.onChange}
                  coverError={err("cover_image") ?? err("images")}
                />
              )}
            />
          )}
        />
      </section>

      <section className="rounded-3xl bg-paper p-5 sm:p-7">
        <h2 className="mb-4 font-sans text-base font-bold">Yayın ayarları</h2>
        <div className="grid gap-3 sm:grid-cols-3">
          {(
            [
              ["active", "Aktif", "Kapalıysa sitede ve sitemap'te görünmez."],
              ["featured", "Öne çıkan", "Ana sayfada öne çıkan ürünlerde gösterilir."],
              ["ripeness_enabled", "Olgunluk seçimi", "Avokado gibi ürünlerde olgunluk seçeneği sunar."],
            ] as const
          ).map(([name, label, hint]) => (
            <label key={name} className="flex cursor-pointer items-start gap-3 rounded-2xl bg-cream p-4">
              <input type="checkbox" className="mt-1 h-5 w-5 accent-[#173F35]" {...register(name)} />
              <span>
                <span className="block font-bold text-forest">{label}</span>
                <span className="block text-xs text-ink-soft">{hint}</span>
              </span>
            </label>
          ))}
        </div>
      </section>

      <div className="sticky bottom-0 z-20 -mx-4 flex flex-wrap items-center gap-3 border-t border-cream-200 bg-cream/95 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6">
        <button type="submit" disabled={pending} className="btn btn-primary btn-lg">
          {pending ? "Kaydediliyor…" : mode === "create" ? "Ürün Ekle" : "Değişiklikleri Kaydet"}
        </button>
        {mode === "edit" && productId ? <DeleteProductButton id={productId} name={defaults.name} /> : null}
        {status ? (
          <p
            role={status.kind === "error" ? "alert" : "status"}
            className={`text-sm font-bold ${status.kind === "success" ? "text-[#2F4A12]" : "text-[#B42318]"}`}
          >
            {status.text}
          </p>
        ) : null}
      </div>
    </form>
  );
}
