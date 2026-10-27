import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { loadCatalog } from "@/lib/catalog";
import { CATEGORIES } from "@/lib/store";
import CategoryView from "@/components/category-view";

export const dynamic = "force-dynamic";

export default async function CategoryPage({params}:{params:Promise<{slug:string}>}){
  const {slug}=await params;
  const category=CATEGORIES.find(c=>c.slug===slug);
  if(!category) notFound();
  const products=(await loadCatalog()).filter(category.match);
  return <main className="store-main">
    <nav className="crumbs" aria-label="Brødsmuler"><Link href="/">Forside</Link><ChevronRight size={14} aria-hidden/><span aria-current="page">{category.title}</span></nav>
    <header className="page-head">
      <h1>{category.title}</h1>
      <p>{category.intro}</p>
    </header>
    <CategoryView products={products} accessories={category.slug==="batterier-og-ladere"}/>
  </main>;
}
