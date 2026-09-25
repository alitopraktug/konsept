"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { track } from "@/lib/analytics";
import { navLinks, site } from "@/lib/site";
import { GENERAL_ORDER_MESSAGE, whatsappUrl } from "@/lib/whatsapp";
import { CloseIcon, InstagramIcon, MenuIcon, PhoneIcon, WhatsAppIcon } from "./icons";
import { Logo } from "./logo";
import { isActivePath } from "./nav-links";

/**
 * Erişilebilir tam ekran mobil menü: Esc ile kapanır, odak menü içinde kalır, arka plan kaydırılmaz.
 * Panel document.body'ye taşınır (portal): header'daki backdrop-filter, `fixed` çocukları kendi kutusuna
 * hapsettiği için menü aksi halde ekran yerine 64px'lik header içinde açılır ve linklere dokunulamaz.
 */
export function MobileMenu() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const [prevPath, setPrevPath] = useState(pathname);

  // Sayfa değişince menüyü kapat (render sırasında durum eşitleme)
  if (prevPath !== pathname) {
    setPrevPath(pathname);
    setOpen(false);
  }

  const close = useCallback(() => {
    setOpen(false);
    buttonRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const focusables = () =>
      Array.from(panelRef.current?.querySelectorAll<HTMLElement>("a[href], button:not([disabled])") ?? []);
    focusables()[0]?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        close();
      } else if (e.key === "Tab") {
        const items = focusables();
        if (items.length === 0) return;
        const first = items[0];
        const last = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener("keydown", onKey);
    };
  }, [open, close]);

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Menüyü aç"
        aria-expanded={open}
        aria-controls="mobil-menu"
        className="inline-flex h-11 w-11 items-center justify-center rounded-full text-forest hover:bg-cream-200"
      >
        <MenuIcon size={26} />
      </button>

      {open
        ? createPortal(
        <div
          id="mobil-menu"
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-label="Ana menü"
          className="fixed inset-0 z-50 flex flex-col overflow-y-auto bg-paper"
        >
          <div className="flex h-16 shrink-0 items-center justify-between px-4">
            <Logo />
            <button
              type="button"
              onClick={close}
              aria-label="Menüyü kapat"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full text-forest hover:bg-cream-200"
            >
              <CloseIcon size={26} />
            </button>
          </div>

          <nav aria-label="Mobil menü" className="flex-1 px-4 pt-4">
            <ul className="divide-y divide-cream-200">
              {navLinks.map((link) => {
                const active = isActivePath(pathname, link.href);
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      aria-current={active ? "page" : undefined}
                      className={`flex min-h-14 items-center font-serif text-2xl ${
                        active ? "text-avocado-700" : "text-forest"
                      }`}
                    >
                      {link.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="space-y-3 px-4 pt-6 pb-8" style={{ paddingBottom: "max(2rem, env(safe-area-inset-bottom))" }}>
            <a
              href={whatsappUrl(GENERAL_ORDER_MESSAGE, site.whatsappNumber)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => track("whatsapp_click", { location: "mobile_menu" })}
              className="btn btn-wa btn-lg w-full"
            >
              <WhatsAppIcon size={20} />
              WhatsApp&apos;tan Sipariş Ver
            </a>
            <div className="grid grid-cols-2 gap-3">
              <a
                href={site.phoneHref}
                onClick={() => track("phone_click", { location: "mobile_menu" })}
                className="btn btn-outline !px-3 whitespace-nowrap"
              >
                <PhoneIcon size={18} />
                {site.phoneDisplay}
              </a>
              {site.instagramUrl ? (
                <a
                  href={site.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => track("instagram_click", { location: "mobile_menu" })}
                  className="btn btn-outline !px-3 whitespace-nowrap"
                >
                  <InstagramIcon size={18} />
                  Instagram
                </a>
              ) : null}
            </div>
          </div>
        </div>,
        document.body,
      )
        : null}
    </>
  );
}
