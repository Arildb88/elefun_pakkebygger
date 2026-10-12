"use client";
import { useMemo, useState } from "react";
import { ArrowRight, SlidersHorizontal } from "lucide-react";
import type { CatalogProduct } from "@/lib/catalog-types";
import { builderHref, displayBrand } from "@/lib/store";
import { ProductCard } from "./store-ui";
import { AddToCart } from "./cart-controls";

const KINDS=[["battery","Batterier"],["charger","Ladere"],["accessory","Kabler og tilbehør"]] as const;

function toggle<T>(list:T[],value:T){return list.includes(value)?list.filter(v=>v!==value):[...list,value];}

export default function CategoryView({products,accessories}:{products:CatalogProduct[];accessories:boolean}){
  const [brands,setBrands]=useState<string[]>([]);
  const [kinds,setKinds]=useState<string[]>([]);
  const [cells,setCells]=useState<number[]>([]);
  const [sort,setSort]=useState("default");

  const brandOptions=useMemo(()=>[...new Set(products.map(displayBrand))].sort((a,b)=>a.localeCompare(b,"nb")),[products]);
  const cellOptions=useMemo(()=>[...new Set(products.filter(p=>p.kind==="battery"&&p.cells).map(p=>p.cells!))].sort((a,b)=>a-b),[products]);
  const count=(fn:(p:CatalogProduct)=>boolean)=>products.filter(fn).length;

  const shown=products
    .filter(p=>!brands.length||brands.includes(displayBrand(p)))
    .filter(p=>!kinds.length||kinds.includes(p.kind))
    .filter(p=>!cells.length||(p.cells!=null&&cells.includes(p.cells)))
    .sort((a,b)=>sort==="low"?a.price-b.price:sort==="high"?b.price-a.price:0);
  const active=brands.length+kinds.length+cells.length;
  const reset=()=>{setBrands([]);setKinds([]);setCells([]);};

  return <div className="catalog-layout">
    <details className="filters" open>
      <summary><SlidersHorizontal size={18} aria-hidden/> Filtrer{active>0&&<span className="filter-count">{active}</span>}</summary>
      <div className="filters-body">
        {accessories&&<fieldset><legend>Type</legend>{KINDS.map(([k,l])=><label key={k} className="check"><input type="checkbox" checked={kinds.includes(k)} onChange={()=>setKinds(toggle(kinds,k))}/><span>{l}</span><small>{count(p=>p.kind===k)}</small></label>)}</fieldset>}
        {cellOptions.length>0&&<fieldset><legend>Celler</legend><div className="chips">{cellOptions.map(c=><button type="button" key={c} className="chip" aria-pressed={cells.includes(c)} onClick={()=>setCells(toggle(cells,c))}>{c}S</button>)}</div></fieldset>}
        <fieldset><legend>Merke</legend>{brandOptions.map(b=><label key={b} className="check"><input type="checkbox" checked={brands.includes(b)} onChange={()=>setBrands(toggle(brands,b))}/><span>{b}</span><small>{count(p=>displayBrand(p)===b)}</small></label>)}</fieldset>
        {active>0&&<button type="button" className="link-button" onClick={reset}>Nullstill filtre</button>}
      </div>
    </details>

    <section aria-label="Produkter">
      <div className="toolbar">
        <p><strong>{shown.length}</strong> av {products.length} produkter <span>· Prisene er øyeblikksbilder fra elefun.no</span></p>
        <label className="select"><span>Sorter</span><select value={sort} onChange={e=>setSort(e.target.value)}><option value="default">Anbefalt</option><option value="low">Pris: lav til høy</option><option value="high">Pris: høy til lav</option></select></label>
      </div>
      {shown.length===0?<div className="empty"><h2>Ingen produkter passer filtrene</h2><p>Fjern et filter for å se flere produkter.</p><button type="button" className="btn-secondary" onClick={reset}>Nullstill filtre</button></div>:
      <div className="product-grid">{shown.map((p,i)=><ProductCard key={p.id} product={p} priority={i<4} action={p.kind==="vehicle"?<a className="btn-build btn-build-compact" href={builderHref(p)}>Bygg pakke <ArrowRight size={16} aria-hidden/></a>:<AddToCart product={p}/>}/>)}</div>}
    </section>
  </div>;
}
