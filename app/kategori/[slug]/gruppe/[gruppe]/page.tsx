import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ChevronRight } from "lucide-react";
import { loadCatalog } from "@/lib/catalog";
import { menuGroupSlug, siteMenu } from "@/lib/site-menu";
import { SHELF_CATEGORIES } from "@/lib/elefun-shelves";
import { productHref as shelfProductHref } from "@/lib/shelf-types";
import { ProductCard } from "@/components/store-ui";
import { ShelfCard } from "@/components/shelf-ui";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ slug: string; gruppe: string }> };

async function resolve(params: Params["params"]) {
  const { slug, gruppe } = await params;
  const products = await loadCatalog();
  const category = siteMenu(products).find((item) => item.slug === slug);
  const column = category?.columns.find((item) => menuGroupSlug(item.title) === gruppe);
  return category && column ? { category, column, products } : null;
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const found = await resolve(params);
  return found
    ? { title: `${found.column.title} – ${found.category.name} – Elefun` }
    : {};
}

export default async function MenuGroupPage({ params }: Params) {
  const found = await resolve(params);
  if (!found) notFound();

  const { category, column, products } = found;
  const shelfProducts = SHELF_CATEGORIES.flatMap((shelfCategory) =>
    shelfCategory.subs.flatMap((shelf) =>
      shelf.products.map((product) => ({
        id: String(product.id),
        product,
        href: shelfProductHref(shelfCategory, shelf, product),
      })),
    ),
  );

  const entries = column.links.map((link) => {
    const id = link.href.match(/\/(?:produkt|sortiment\/[^/]+\/[^/]+)\/([^/?#]+)/)?.[1];
    return {
      link,
      catalogProduct: id ? products.find((product) => product.id === id) : undefined,
      shelfProduct: id ? shelfProducts.find((item) => item.id === id) : undefined,
    };
  });

  return (
    <main className="store-main">
      <nav className="crumbs" aria-label="Brødsmuler">
        <Link href="/">Forside</Link><ChevronRight size={14} aria-hidden />
        <Link href={category.href}>{category.name}</Link><ChevronRight size={14} aria-hidden />
        <span aria-current="page">{column.title}</span>
      </nav>

      <header className="page-head">
        <p className="eyebrow">{category.name}</p>
        <h1>{column.title}</h1>
        <p>{entries.length} produkter i denne menyoversikten fra prototypens produktutvalg.</p>
      </header>

      {entries.length > 0 ? (
        <div className="product-grid shelf-grid">
          {entries.map(({ link, catalogProduct, shelfProduct }) => {
            if (catalogProduct) return <ProductCard key={link.href} product={catalogProduct} />;
            if (shelfProduct) return <ShelfCard key={link.href} product={shelfProduct.product} href={link.href} />;
            return (
              <article className="pcard" key={link.href}>
                <div className="pcard-body">
                  <h3><Link href={link.href}>{link.name}</Link></h3>
                  <p>{category.name}</p>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <p>Det finnes ingen eksempelprodukter i denne menygruppen ennå.</p>
      )}

      <p className="back-link"><Link href={category.href}><ArrowLeft size={16} aria-hidden /> Tilbake til {category.name}</Link></p>
    </main>
  );
}
