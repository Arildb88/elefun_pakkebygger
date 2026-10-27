import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, ArrowUpRight, ChevronRight } from "lucide-react";
import {
  SHELF_CATEGORIES, categoryHref, findCategory, findProduct, findShelf, formatFetchedAt, productHref, shelfHref,
} from "@/lib/elefun-shelves";
import { discountPercent } from "@/lib/shelf-types";
import { cleanName, money } from "@/lib/store";
import { AddToCart } from "@/components/cart-controls";
import { ShelfCard, StockLine } from "@/components/shelf-ui";

type Params={params:Promise<{kategori:string;underkategori:string;vare:string}>};

export function generateStaticParams(){
  return SHELF_CATEGORIES.flatMap(c=>c.subs.flatMap(s=>s.products.map(p=>({kategori:c.slug,underkategori:s.slug,vare:p.id}))));
}

async function resolve(params:Params["params"]){
  const {kategori,underkategori,vare}=await params;
  const category=findCategory(kategori);
  const shelf=category&&findShelf(category,underkategori);
  const product=category&&shelf?findProduct(category,shelf,vare):undefined;
  return category&&shelf&&product?{category,shelf,product}:null;
}

export async function generateMetadata({params}:Params):Promise<Metadata>{
  const found=await resolve(params);
  return found?{title:`${cleanName(found.product.name)} – Elefun`}:{};
}

export default async function ShelfProductPage({params}:Params){
  const found=await resolve(params);
  if(!found) notFound();
  const {category,shelf,product}=found;
  const name=cleanName(product.name);
  const off=discountPercent(product);
  const related=shelf.products.filter(p=>String(p.id)!==String(product.id)).slice(0,4);

  return <main className="store-main">
    <nav className="crumbs" aria-label="Brødsmuler">
      <Link href="/">Forside</Link><ChevronRight size={14} aria-hidden/>
      <Link href="/sortiment">Sortiment</Link><ChevronRight size={14} aria-hidden/>
      <Link href={categoryHref(category)}>{category.name}</Link><ChevronRight size={14} aria-hidden/>
      <Link href={shelfHref(category,shelf)}>{shelf.name}</Link><ChevronRight size={14} aria-hidden/>
      <span aria-current="page">{name}</span>
    </nav>

    <article className="product">
      <div className="product-media">
        {product.imageUrl&&<img src={product.imageUrl} alt={name}/>}
        {off>0&&<span className="scard-badge">−{off} %</span>}
      </div>
      <div className="product-info">
        {product.brand&&<p className="scard-brand">{product.brand}</p>}
        <h1>{name}</h1>
        <div className="scard-meta product-meta">
          <StockLine stock={product.stock}/>
          {product.reviews>0&&<span className="scard-reviews">{product.reviews} omtaler hos Elefun</span>}
        </div>
        <p className="product-note">Utvalg fra {shelf.name} i {category.name}. Pris og lagerstatus er et øyeblikksbilde fra elefun.no {formatFetchedAt()}.</p>
        <div className="buy-box">
          <div className="buy-price">
            <div className="scard-price">
              <strong className="price price-xl">{money(product.price)}</strong>
              {product.previousPrice&&<s className="price">{money(product.previousPrice)}</s>}
            </div>
            <small>Inkl. mva. Demo-handlevogn – ingen bestilling sendes.</small>
          </div>
          <div className="buy-actions">
            {product.stock.inStock
              ?<AddToCart product={{id:`elefun-${product.id}`,name:product.name,price:product.price}} variant="full"/>
              :<a className="btn-secondary" href={product.url} target="_blank" rel="noreferrer">Se hos Elefun <ArrowUpRight size={16} aria-hidden/></a>}
          </div>
          <a className="source-link" href={product.url} target="_blank" rel="noreferrer">Åpne varen hos Elefun <ArrowUpRight size={15} aria-hidden/></a>
        </div>
      </div>
    </article>

    {related.length>0&&<section className="related" aria-labelledby="related-title">
      <div className="section-head section-head-row">
        <h2 id="related-title">Flere fra {shelf.name}</h2>
        <Link href={shelfHref(category,shelf)}>Se utvalget <ArrowRight size={16} aria-hidden/></Link>
      </div>
      <div className="product-grid shelf-grid">{related.map(p=><ShelfCard key={p.id} product={p} href={productHref(category,shelf,p)}/>)}</div>
    </section>}
  </main>;
}
