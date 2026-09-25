"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { navLinks } from "@/lib/site";

export function isActivePath(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}

export function NavLinks() {
  const pathname = usePathname();
  return (
    <ul className="flex items-center gap-5 xl:gap-7">
      {navLinks.map((link) => {
        const active = isActivePath(pathname, link.href);
        return (
          <li key={link.href}>
            <Link
              href={link.href}
              aria-current={active ? "page" : undefined}
              className={`relative py-2 text-sm font-semibold transition-colors hover:text-avocado-700 ${
                active ? "text-forest" : "text-ink-soft"
              }`}
            >
              {link.label}
              <span
                aria-hidden
                className={`absolute inset-x-0 -bottom-0.5 h-0.5 rounded-full bg-avocado transition-opacity ${
                  active ? "opacity-100" : "opacity-0"
                }`}
              />
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
