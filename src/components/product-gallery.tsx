"use client";

import Image from "next/image";
import { useState } from "react";

export function ProductGallery({ images, name }: { images: string[]; name: string }) {
  const [active, setActive] = useState(0);
  const current = images[active] ?? images[0];

  return (
    <div className="space-y-3">
      <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-cream lg:aspect-[6/7]">
        <Image
          key={current}
          src={current}
          alt={`${name} ürün görseli${images.length > 1 ? ` (${active + 1}/${images.length})` : ""}`}
          fill
          priority
          sizes="(min-width: 1024px) 46vw, 100vw"
          className="object-cover"
        />
      </div>
      {images.length > 1 ? (
        <ul className="grid grid-cols-5 gap-2.5 sm:gap-3" aria-label="Ürün görselleri">
          {images.map((src, i) => (
            <li key={src}>
              <button
                type="button"
                onClick={() => setActive(i)}
                aria-label={`${i + 1}. görseli göster`}
                aria-pressed={i === active}
                className={`relative block aspect-square w-full overflow-hidden rounded-xl bg-cream ring-2 transition ${
                  i === active ? "ring-forest" : "ring-transparent hover:ring-sage"
                }`}
              >
                <Image src={src} alt="" fill loading="eager" sizes="120px" className="object-cover" />
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
