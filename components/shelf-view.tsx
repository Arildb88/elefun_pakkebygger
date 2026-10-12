"use client";
import { useMemo, useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import { productHref, type Shelf, type ShelfCategory, type ShelfProduct } from "@/lib/shelf-types";
import { ShelfCard } from "./shelf-ui";

function toggle<T>(list:T[],value:T){return list.includes(value)?list.filter(v=>v!==value):[...list,value];}
const brandOf=(p:ShelfProduct)=>p.brand??"Øvrige";

export default function ShelfView({category,shelf}:{category:Pick<ShelfCategory,"slug">;shelf:Pick<Shelf,"slug"|"products">}){
  const products=shelf.products;
  const [brands,setBrands]=useState<string[]>([]);
  const [inStock,setInStock]=useState(false);
  const [onSale,setOnSale]=useState(false);
  const [sort,setSort]=useState("default");

  const brandOptions=useMemo(()=>[...new Set(products.map(brandOf))].sort((a,b)=>a.localeCompare(b,"nb")),[products]);
  const count=(fn:(p:ShelfProduct)=>boolean)=>products.filter(fn).length;
  const saleCount=count(p=>!!p.previousPrice);

  const shown=products
    .filter(p=>!brands.length||brands.includes(brandOf(p)))
    .filter(p=>!inStock||p.stock.inStock)
    .filter(p=>!onSale||!!p.previousPrice)
    .sort((a,b)=>sort==="low"?a.price-b.price:sort==="high"?b.price-a.price:sort==="reviews"?b.reviews-a.reviews:0);
  const active=brands.length+(inStock?1:0)+(onSale?1:0);
  const reset=()=>{setBrands([]);setInStock(false);setOnSale(false);};

  return <div className="catalog-layout">
    <details className="filters" open>
      <summary><SlidersHorizontal size={18} aria-hidden/> Filtrer{active>0&&<span className="filter-count">{active}</span>}</summary>
      <div className="filters-body">
        <fieldset>
          <legend>Tilgjengelighet</legend>
          <label className="check"><input type="checkbox" checked={inStock} onChange={()=>setInStock(!inStock)}/><span>Kun på lager</span><small>{count(p=>p.stock.inStock)}</small></label>
          {saleCount>0&&<label className="check"><input type="checkbox" checked={onSale} onChange={()=>setOnSale(!onSale)}/><span>På tilbud</span><small>{saleCount}</small></label>}
        </fieldset>
        {brandOptions.length>1&&<fieldset><legend>Merke</legend>{brandOptions.map(b=><label key={b} className="check"><input type="checkbox" checked={brands.includes(b)} onChange={()=>setBrands(toggle(brands,b))}/><span>{b}</span><small>{count(p=>brandOf(p)===b)}</small></label>)}</fieldset>}
        {active>0&&<button type="button" className="link-button" onClick={reset}>Nullstill filtre</button>}
      </div>
    </details>

    <section aria-label="Produkter">
      <div className="toolbar">
        <p><strong>{shown.length}</strong> av {products.length} utvalgte produkter <span>· Prisene er øyeblikksbilder fra elefun.no</span></p>
        <label className="select"><span>Sorter</span><select value={sort} onChange={e=>setSort(e.target.value)}><option value="default">Anbefalt</option><option value="low">Pris: lav til høy</option><option value="high">Pris: høy til lav</option><option value="reviews">Flest omtaler</option></select></label>
      </div>
      {shown.length===0?<div className="empty"><h2>Ingen produkter passer filtrene</h2><p>Fjern et filter for å se flere produkter.</p><button type="button" className="btn-secondary" onClick={reset}>Nullstill filtre</button></div>:
      <div className="product-grid">{shown.map((p,i)=><ShelfCard key={p.id} product={p} href={productHref(category,shelf,p)} priority={i<4}/>)}</div>}
    </section>
  </div>;
}
