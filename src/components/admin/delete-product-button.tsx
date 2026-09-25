"use client";

import { useRouter } from "next/navigation";
import { useRef, useState, useTransition } from "react";
import { deleteProductAction } from "@/app/admin/actions";
import { TrashIcon } from "@/components/icons";

/** Silmeden önce onay diyaloğu gösterir. Silme işlemi sunucuda yetki kontrolünden geçer. */
export function DeleteProductButton({
  id,
  name,
  variant = "button",
}: {
  id: string;
  name: string;
  variant?: "button" | "link";
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  const open = () => {
    setError(null);
    dialogRef.current?.showModal();
  };
  const close = () => dialogRef.current?.close();

  const confirm = () => {
    startTransition(async () => {
      const result = await deleteProductAction(id);
      if (result.ok) {
        close();
        router.push("/admin?ok=silindi");
        router.refresh();
      } else {
        setError(result.error);
      }
    });
  };

  return (
    <>
      <button
        type="button"
        onClick={open}
        className={
          variant === "link"
            ? "inline-flex min-h-11 cursor-pointer items-center rounded-full px-3 font-bold text-[#B42318] underline underline-offset-4 hover:bg-[#FBE9E7]"
            : "btn border-[1.5px] border-[#B42318] text-[#B42318] hover:bg-[#FBE9E7]"
        }
      >
        {variant === "button" ? <TrashIcon size={18} /> : null}
        Sil
      </button>

      <dialog
        ref={dialogRef}
        aria-labelledby={`sil-baslik-${id}`}
        className="m-auto w-[calc(100%-2rem)] max-w-md rounded-3xl bg-paper p-6 text-ink backdrop:bg-black/50"
      >
        <h2 id={`sil-baslik-${id}`} className="font-sans text-lg font-bold text-forest">
          {name} ürününü silmek istediğinizden emin misiniz?
        </h2>
        <p className="mt-2 text-sm text-ink-soft">Bu işlem geri alınamaz.</p>
        {error ? (
          <p role="alert" className="error-text !mt-3">
            {error}
          </p>
        ) : null}
        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button type="button" onClick={close} disabled={pending} className="btn btn-outline">
            Vazgeç
          </button>
          <button
            type="button"
            onClick={confirm}
            disabled={pending}
            className="btn bg-[#B42318] text-white hover:bg-[#8E1B12]"
          >
            {pending ? "Siliniyor…" : "Ürünü Sil"}
          </button>
        </div>
      </dialog>
    </>
  );
}
