import Link from "next/link";
import { jsonLdString } from "@/lib/seo";

export function JsonLd({ data }: { data: unknown }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString(data) }} />;
}

export function Breadcrumbs({ items }: { items: { name: string; href?: string }[] }) {
  return (
    <nav aria-label="Sayfa yolu" className="text-sm">
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-ink-soft">
        {items.map((item, i) => {
          const last = i === items.length - 1;
          return (
            <li key={item.name} className="flex items-center gap-2">
              {item.href && !last ? (
                <Link href={item.href} className="underline-offset-4 hover:text-forest hover:underline">
                  {item.name}
                </Link>
              ) : (
                <span aria-current={last ? "page" : undefined} className={last ? "font-semibold text-forest" : ""}>
                  {item.name}
                </span>
              )}
              {!last ? <span aria-hidden>/</span> : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

/** Alt sayfa üst başlığı */
export function PageHero({
  eyebrow,
  title,
  children,
}: {
  eyebrow?: string;
  title: string;
  children?: React.ReactNode;
}) {
  return (
    <section className="bg-cream">
      <div className="container-x py-12 md:py-16">
        {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
        <h1 className="h-section mt-2 max-w-3xl md:!text-5xl">{title}</h1>
        {children ? <div className="mt-4 max-w-2xl text-lg leading-relaxed text-ink-soft">{children}</div> : null}
      </div>
    </section>
  );
}
