import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight, ChevronRight } from "lucide-react";
import { SHELF_CATEGORIES, categoryHref, findCategory, findShelf, formatFetchedAt } from "@/lib/elefun-shelves";
import { ShelfNav } from "@/components/shelf-ui";
import ShelfView from "@/components/shelf-view";

type Params={params:Promise<{kategori:string;underkategori:string}>};

export function generateStaticParams(){
  return SHELF_CATEGORIES.flatMap(c=>c.subs.map(s=>({kategori:c.slug,underkategori:s.slug})));
}

async function resolve(params:Params["params"]){
  const {kategori,underkategori}=await params;
  const category=findCategory(kategori);
  const shelf=category&&findShelf(category,underkategori);
  return category&&shelf?{category,shelf}:null;
}

export async function generateMetadata({params}:Params):Promise<Metadata>{
  const found=await resolve(params);
  return found?{title:`${found.shelf.name} – ${found.category.name} – Elefun`}:{};
}

export default async function ShelfPage({params}:Params){
  const found=await resolve(params);
  if(!found) notFound();
  const {category,shelf}=found;
  return <main className="store-main">
    <nav className="crumbs" aria-label="Brødsmuler">
      <Link href="/">Forside</Link><ChevronRight size={14} aria-hidden/>
      <Link href="/sortiment">Sortiment</Link><ChevronRight size={14} aria-hidden/>
      <Link href={categoryHref(category)}>{category.name}</Link><ChevronRight size={14} aria-hidden/>
      <span aria-current="page">{shelf.name}</span>
    </nav>
    <header className="page-head">
      {shelf.column&&<p className="eyebrow">{shelf.column}</p>}
      <h1>{shelf.name}</h1>
      <p>
        Et utvalg på {shelf.products.length} varer fra Elefuns kategori, med varer på lager først. Hentet {formatFetchedAt()}.{" "}
        <a href={shelf.sourceUrl} target="_blank" rel="noreferrer" className="inline-ext">Se alle hos Elefun <ArrowUpRight size={14} aria-hidden/></a>
      </p>
    </header>
    <ShelfNav category={category} current={shelf}/>
    <ShelfView category={category} shelf={shelf}/>
  </main>;
}
