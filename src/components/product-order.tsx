"use client";

import { createContext, useContext, useEffect, useId, useMemo, useState } from "react";
import { track } from "@/lib/analytics";
import { formatPrice } from "@/lib/format";
import { buildOrderMessage, buildStockInquiryMessage, RIPENESS_OPTIONS, type RipenessValue } from "@/lib/whatsapp";
import { MinusIcon, PlusIcon } from "./icons";
import { WhatsAppButton } from "./whatsapp-button";
import type { StockStatus } from "@/lib/types";

/**
 * Ürün detay sayfasındaki sipariş durumu (miktar + olgunluk). Sayfanın geri kalanı
 * (görsel, açıklama) sunucuda render edilir; yalnızca bu bölüm istemcidedir.
 */

export interface OrderProduct {
  slug: string;
  name: string;
  price: number;
  unit: string;
  stock: StockStatus;
  ripenessEnabled: boolean;
}

interface OrderState {
  product: OrderProduct;
  quantity: number;
  setQuantity: (n: number) => void;
  ripeness: RipenessValue | null;
  setRipeness: (v: RipenessValue) => void;
  message: string;
  soldOut: boolean;
}

const OrderContext = createContext<OrderState | null>(null);

const MIN_QTY = 1;
const MAX_QTY = 100;

export function ProductOrderProvider({ product, children }: { product: OrderProduct; children: React.ReactNode }) {
  const [quantity, setQuantityRaw] = useState(MIN_QTY);
  const [ripeness, setRipeness] = useState<RipenessValue | null>(null);
  const soldOut = product.stock === "out_of_stock";

  const value = useMemo<OrderState>(() => {
    const message = soldOut
      ? buildStockInquiryMessage(product.name)
      : buildOrderMessage({
          productName: product.name,
          unit: product.unit,
          quantity,
          ripeness: product.ripenessEnabled ? ripeness : null,
        });
    return {
      product,
      quantity,
      setQuantity: (n) => setQuantityRaw(Math.min(MAX_QTY, Math.max(MIN_QTY, Math.round(n) || MIN_QTY))),
      ripeness,
      setRipeness,
      message,
      soldOut,
    };
  }, [product, quantity, ripeness, soldOut]);

  useEffect(() => {
    track("product_view", { product: product.slug });
  }, [product.slug]);

  return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>;
}

function useOrder() {
  const ctx = useContext(OrderContext);
  if (!ctx) throw new Error("ProductOrderProvider bulunamadı");
  return ctx;
}

export function QuantitySelector() {
  const { quantity, setQuantity, product } = useOrder();
  const id = useId();
  const btn =
    "inline-flex h-12 w-12 items-center justify-center rounded-full border-[1.5px] border-forest text-forest transition-colors hover:bg-forest hover:text-cream disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-forest";
  return (
    <div>
      <p id={id} className="label">
        Miktar
      </p>
      <div role="group" aria-labelledby={id} className="inline-flex items-center gap-3">
        <button
          type="button"
          className={btn}
          aria-label="Miktarı azalt"
          disabled={quantity <= MIN_QTY}
          onClick={() => setQuantity(quantity - 1)}
        >
          <MinusIcon size={20} />
        </button>
        <output aria-live="polite" className="min-w-20 text-center font-serif text-2xl font-semibold text-forest">
          {quantity} {product.unit}
        </output>
        <button
          type="button"
          className={btn}
          aria-label="Miktarı artır"
          disabled={quantity >= MAX_QTY}
          onClick={() => setQuantity(quantity + 1)}
        >
          <PlusIcon size={20} />
        </button>
      </div>
    </div>
  );
}

export function RipenessSelector() {
  const { ripeness, setRipeness, product } = useOrder();
  const name = useId();
  if (!product.ripenessEnabled) return null;
  return (
    <fieldset>
      <legend className="label !mb-2 !text-base">Avokadonuzu nasıl istersiniz?</legend>
      <div className="grid gap-2.5">
        {RIPENESS_OPTIONS.map((o) => {
          const checked = ripeness === o.value;
          return (
            <label
              key={o.value}
              className={`flex cursor-pointer items-start gap-3 rounded-2xl border-[1.5px] p-3.5 transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-avocado-700 ${
                checked ? "border-forest bg-[#EEF2E1]" : "border-cream-200 bg-white hover:border-avocado"
              }`}
            >
              <input
                type="radio"
                name={name}
                value={o.value}
                checked={checked}
                onChange={() => setRipeness(o.value)}
                className="sr-only"
              />
              <span
                aria-hidden
                className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
                  checked ? "border-forest" : "border-earth/60"
                }`}
              >
                {checked ? <span className="h-2.5 w-2.5 rounded-full bg-forest" /> : null}
              </span>
              <span>
                <span className="block font-bold text-forest">{o.label}</span>
                <span className="block text-sm text-ink-soft">{o.description}</span>
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

export function OrderPanel() {
  const { product, quantity, message, soldOut } = useOrder();
  const total = product.price * quantity;
  return (
    <div className="space-y-6">
      {soldOut ? (
        <p className="rounded-2xl bg-cream px-4 py-3 text-sm text-ink-soft">
          Bu ürün şu anda tükendi. Yeniden stok bilgisi için bize WhatsApp&apos;tan yazabilirsiniz.
        </p>
      ) : (
        <>
          <QuantitySelector />
          <RipenessSelector />
          <div className="flex items-baseline justify-between rounded-2xl bg-cream px-4 py-3">
            <span className="text-sm text-ink-soft">Tahmini tutar</span>
            <span className="font-serif text-2xl font-semibold text-forest">{formatPrice(total)} TL</span>
          </div>
          <p className="-mt-3 text-xs text-ink-soft">
            Nihai tutar ve teslimat detayları WhatsApp üzerinden netleştirilir.
            {quantity >= 20 ? " Yüksek miktarlar için toptan fiyat teklifi alabilirsiniz." : ""}
          </p>
        </>
      )}
      <WhatsAppButton variant="wa" size="lg" className="w-full" productSlug={product.slug} location="product_detail" message={message}>
        {soldOut ? "Stok Bilgisi Al" : "WhatsApp'tan Sipariş Ver"}
      </WhatsAppButton>
    </div>
  );
}

/** Mobil: içeriğin sonunda "yapışan" çubuk. Footer'ın üstünde durur, içeriği kalıcı olarak kapatmaz. */
export function StickyOrderBar() {
  const { product, message, soldOut } = useOrder();
  return (
    <div
      className="sticky bottom-0 z-30 -mx-4 border-t border-cream-200 bg-paper/95 px-4 pt-3 backdrop-blur sm:-mx-6 sm:px-6 lg:hidden"
      style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
    >
      <div className="flex items-center gap-3">
        <p className="shrink-0 leading-tight">
          <span className="block font-serif text-xl font-semibold text-forest">{formatPrice(product.price)} TL</span>
          <span className="block text-xs text-ink-soft">/ {product.unit}</span>
        </p>
        <span aria-hidden className="h-8 w-px bg-cream-200" />
        <WhatsAppButton
          variant="wa"
          className="flex-1 !px-3"
          productSlug={product.slug}
          location="product_sticky"
          message={message}
        >
          {soldOut ? "Stok Bilgisi Al" : "WhatsApp Sipariş"}
        </WhatsAppButton>
      </div>
    </div>
  );
}
