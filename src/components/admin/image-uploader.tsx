"use client";

import Image from "next/image";
import { useId, useRef, useState } from "react";
import { CloseIcon, UploadIcon } from "@/components/icons";
import { ALLOWED_UPLOAD_TYPES, MAX_UPLOAD_BYTES } from "@/lib/validation";

async function uploadFile(file: File): Promise<string> {
  if (!(ALLOWED_UPLOAD_TYPES as readonly string[]).includes(file.type)) {
    throw new Error("Yalnızca JPG, JPEG, PNG veya WebP yükleyebilirsiniz.");
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    throw new Error("Dosya çok büyük. En fazla 4 MB yükleyebilirsiniz.");
  }
  const body = new FormData();
  body.append("file", file);
  let res: Response;
  try {
    res = await fetch("/admin/upload", { method: "POST", body });
  } catch {
    throw new Error("Görsel yüklenemedi. Bağlantınızı kontrol edip tekrar deneyin.");
  }
  const data = (await res.json().catch(() => ({}))) as { url?: string; error?: string };
  if (!res.ok || !data.url) throw new Error(data.error ?? "Görsel yüklenemedi. Lütfen tekrar deneyin.");
  return data.url;
}

interface Props {
  cover: string | null;
  images: string[];
  onCoverChange: (url: string | null) => void;
  onImagesChange: (urls: string[]) => void;
  coverError?: string;
}

export function ImageUploader({ cover, images, onCoverChange, onImagesChange, coverError }: Props) {
  const coverInput = useRef<HTMLInputElement>(null);
  const extraInput = useRef<HTMLInputElement>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [extraPreviews, setExtraPreviews] = useState<string[]>([]);
  const [busy, setBusy] = useState<"cover" | "extra" | null>(null);
  const [error, setError] = useState<string | null>(null);
  const coverId = useId();
  const extraId = useId();

  async function handleCover(file: File | undefined) {
    if (!file) return;
    setError(null);
    const preview = URL.createObjectURL(file);
    setCoverPreview(preview);
    setBusy("cover");
    try {
      onCoverChange(await uploadFile(file));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Görsel yüklenemedi.");
    } finally {
      setBusy(null);
      setCoverPreview(null);
      URL.revokeObjectURL(preview);
      if (coverInput.current) coverInput.current.value = "";
    }
  }

  async function handleExtra(files: FileList | null) {
    if (!files || files.length === 0) return;
    setError(null);
    const room = 8 - images.length;
    if (room <= 0) {
      setError("En fazla 8 ek görsel eklenebilir.");
      return;
    }
    const list = Array.from(files).slice(0, room);
    const previews = list.map((f) => URL.createObjectURL(f));
    setExtraPreviews(previews);
    setBusy("extra");
    const uploaded: string[] = [];
    try {
      for (const f of list) uploaded.push(await uploadFile(f));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Görsel yüklenemedi.");
    } finally {
      if (uploaded.length > 0) onImagesChange([...images, ...uploaded]);
      setBusy(null);
      setExtraPreviews([]);
      previews.forEach((p) => URL.revokeObjectURL(p));
      if (extraInput.current) extraInput.current.value = "";
    }
  }

  const shownCover = coverPreview ?? cover;
  const accept = "image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp";

  return (
    <div className="space-y-6">
      <div>
        <p className="label" id={coverId}>
          Ana görsel
        </p>
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative flex h-36 w-36 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-cream-200 ring-1 ring-cream-200">
            {shownCover ? (
              <Image src={shownCover} alt="Ana görsel önizlemesi" fill unoptimized sizes="144px" className="object-cover" />
            ) : (
              <span className="px-2 text-center text-xs text-ink-soft">Görsel yok</span>
            )}
            {busy === "cover" ? (
              <span role="status" className="absolute inset-0 flex items-center justify-center bg-forest/70 text-xs font-bold text-cream">
                Yükleniyor…
              </span>
            ) : null}
          </div>
          <div className="space-y-2">
            <input
              ref={coverInput}
              type="file"
              accept={accept}
              className="sr-only"
              aria-labelledby={coverId}
              id={`${coverId}-file`}
              disabled={busy !== null}
              onChange={(e) => handleCover(e.target.files?.[0])}
            />
            <label
              htmlFor={`${coverId}-file`}
              className={`btn btn-outline cursor-pointer ${busy ? "pointer-events-none opacity-60" : ""}`}
            >
              <UploadIcon size={18} />
              {cover ? "Fotoğrafı Değiştir" : "Fotoğraf Yükle"}
            </label>
            <p className="hint">JPG, JPEG, PNG veya WebP · en fazla 4 MB</p>
          </div>
        </div>
        {coverError ? <p className="error-text">{coverError}</p> : null}
      </div>

      <div>
        <p className="label" id={extraId}>
          Ek görseller <span className="font-normal text-ink-soft">({images.length}/8)</span>
        </p>
        <ul className="flex flex-wrap gap-3">
          {images.map((url) => (
            <li key={url} className="relative h-24 w-24 overflow-hidden rounded-xl bg-cream-200">
              <Image src={url} alt="Ek görsel önizlemesi" fill unoptimized sizes="96px" className="object-cover" />
              <button
                type="button"
                aria-label="Bu görseli kaldır"
                onClick={() => onImagesChange(images.filter((u) => u !== url))}
                className="absolute top-1 right-1 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full bg-forest/85 text-cream hover:bg-forest"
              >
                <CloseIcon size={14} />
              </button>
            </li>
          ))}
          {extraPreviews.map((p) => (
            <li key={p} className="relative h-24 w-24 overflow-hidden rounded-xl bg-cream-200">
              <Image src={p} alt="" fill unoptimized sizes="96px" className="object-cover" />
              <span role="status" className="absolute inset-0 flex items-center justify-center bg-forest/70 text-[0.7rem] font-bold text-cream">
                Yükleniyor…
              </span>
            </li>
          ))}
          {images.length + extraPreviews.length < 8 ? (
            <li>
              <input
                ref={extraInput}
                type="file"
                accept={accept}
                multiple
                className="sr-only"
                id={`${extraId}-file`}
                aria-labelledby={extraId}
                disabled={busy !== null}
                onChange={(e) => handleExtra(e.target.files)}
              />
              <label
                htmlFor={`${extraId}-file`}
                className={`flex h-24 w-24 cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border-[1.5px] border-dashed border-forest/40 text-xs font-bold text-forest hover:bg-cream-200 ${
                  busy ? "pointer-events-none opacity-60" : ""
                }`}
              >
                <UploadIcon size={20} />
                Görsel ekle
              </label>
            </li>
          ) : null}
        </ul>
      </div>

      {error ? (
        <p role="alert" className="error-text">
          {error}
        </p>
      ) : null}
    </div>
  );
}
