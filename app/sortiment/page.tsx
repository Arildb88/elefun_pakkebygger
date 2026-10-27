import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ChevronRight } from "lucide-react";
import { SHELF_CATEGORIES, categoryHref, formatFetchedAt, productCount } from "@/lib/elefun-shelves";
import { CategoryIcon } from "@/components/category-icons";

export const metadata:Metadata={title:"Sortiment – Elefun",description:"Et utvalg fra Elefuns kategorier, fra 3D-print til modelljernbane."};

export default function AssortmentPage(){
  return <main className="store-main">
    <nav className="crumbs" aria-label="Brødsmuler"><Link href="/">Forside</Link><ChevronRight size={14} aria-hidden/><span aria-current="page">Sortiment</span></nav>
    <header className="page-head">
      <h1>Sortiment</h1>
      <p>Et håndplukket utvalg fra {SHELF_CATEGORIES.length} av Elefuns kategorier. Varene og prisene er hentet fra elefun.no {formatFetchedAt()}.</p>
    </header>
    <ul className="cat-tiles">
      {SHELF_CATEGORIES.map(c=>{
        return <li key={c.id}>
          <Link className="cat-tile" href={categoryHref(c)}>
            <span className="cat-tile-icon"><CategoryIcon name={c.icon} size={24}/></span>
            <span className="cat-tile-body">
              <strong>{c.name}</strong>
              <small>{c.subs.map(s=>s.name).join(" · ")}</small>
            </span>
            <span className="cat-tile-count">{productCount(c)} varer <ArrowRight size={15} aria-hidden/></span>
          </Link>
        </li>;
      })}
    </ul>
  </main>;
}
