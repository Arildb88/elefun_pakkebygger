import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { loadCatalog } from "@/lib/catalog";
import { CATEGORIES } from "@/lib/store";
import CategoryView from "@/components/category-view";

export const dynamic = "force-dynamic";

const list=(v:string|string[]|undefined)=>(Array.isArray(v)?v:v?[v]:[]).flatMap(s=>s.split(","));

export default async function CategoryPage({params,searchParams}:{params:Promise<{slug:string}>;searchParams:Promise<Record<string,string|string[]|undefined>>}){
  const {slug}=await params;const query=await searchParams;
  const category=CATEGORIES.find(c=>c.slug===slug);
  if(!category) notFound();
  const products=(await loadCatalog()).filter(category.match);
  // ?type=battery&celler=3 from the menu: keep only values that match products on this page.
  const kinds=list(query.type).filter(k=>products.some(p=>p.kind===k));
  const cells=list(query.celler).map(Number).filter(n=>products.some(p=>p.cells===n));
  return <main className="store-main">
    <nav className="crumbs" aria-label="Brødsmuler"><Link href="/">Forside</Link><ChevronRight size={14} aria-hidden/><span aria-current="page">{category.title}</span></nav>
    <header className="page-head">
      <h1>{category.title}</h1>
      <p>{category.intro}</p>
    </header>
    <CategoryView key={`${kinds}|${cells}`} products={products} accessories={category.slug==="batterier-og-ladere"} initialKinds={kinds} initialCells={cells}/>
  </main>;
}
