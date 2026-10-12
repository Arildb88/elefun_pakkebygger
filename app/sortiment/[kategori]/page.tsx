import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight, ChevronRight } from "lucide-react";
import { SHELF_CATEGORIES, findCategory, formatFetchedAt, productCount } from "@/lib/elefun-shelves";
import { ShelfNav, ShelfSection } from "@/components/shelf-ui";
import { CategoryIcon } from "@/components/category-icons";

type Params={params:Promise<{kategori:string}>};

export function generateStaticParams(){return SHELF_CATEGORIES.map(c=>({kategori:c.slug}));}

export async function generateMetadata({params}:Params):Promise<Metadata>{
  const category=findCategory((await params).kategori);
  return category?{title:`${category.name} – Elefun`}:{};
}

export default async function ShelfCategoryPage({params}:Params){
  const category=findCategory((await params).kategori);
  if(!category) notFound();
  return <main className="store-main">
    <nav className="crumbs" aria-label="Brødsmuler">
      <Link href="/">Forside</Link><ChevronRight size={14} aria-hidden/>
      <Link href="/sortiment">Sortiment</Link><ChevronRight size={14} aria-hidden/>
      <span aria-current="page">{category.name}</span>
    </nav>
    <header className="page-head shelf-head">
      <span className="shelf-head-icon"><CategoryIcon name={category.icon} size={30}/></span>
      <div>
        <h1>{category.name}</h1>
        <p>{productCount(category)} utvalgte varer fra {category.subs.length} underkategorier. Priser og lagerstatus er hentet fra elefun.no {formatFetchedAt()}.</p>
      </div>
    </header>
    <ShelfNav category={category}/>
    {category.subs.map(s=><ShelfSection key={s.id} category={category} shelf={s}/>)}
    <aside className="shelf-more">
      <p>Elefun har mange flere varer innen {category.name.toLowerCase()} enn utvalget her.</p>
      <a className="btn-secondary" href={category.sourceUrl} target="_blank" rel="noreferrer">Hele sortimentet hos Elefun <ArrowUpRight size={16} aria-hidden/></a>
    </aside>
  </main>;
}
