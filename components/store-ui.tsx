import type { ReactNode } from "react";
import type { CatalogProduct } from "@/lib/catalog-types";
import { cleanName, displayBrand, money, productHref, specsFor } from "@/lib/store";

export function SpecRail({specs,size="sm"}:{specs:string[];size?:"sm"|"lg"}){
  if(!specs.length) return null;
  return <ul className={`spec-rail spec-rail-${size}`} aria-label="Nøkkelspesifikasjoner">{specs.map(s=><li key={s}>{s}</li>)}</ul>;
}

export function ProductCard({product,action,priority=false}:{product:CatalogProduct;action?:ReactNode;priority?:boolean}){
  const href=productHref(product);const name=cleanName(product.name);const brand=displayBrand(product);
  const showBrand=!name.toLowerCase().includes(brand.toLowerCase());
  return <article className="pcard">
    <a className={`pcard-media${product.kind==="vehicle"?" pcard-media-fill":""}`} href={href} tabIndex={-1} aria-hidden="true">
      {product.imageUrl&&<img src={product.imageUrl} alt="" loading={priority?"eager":"lazy"}/>}
    </a>
    <SpecRail specs={specsFor(product).slice(0,3)}/>
    <div className="pcard-body">
      <h3><a href={href}>{name}</a></h3>
      {showBrand&&<span className="pcard-brand">{brand}</span>}
      <div className="pcard-foot">
        <strong className="price">{money(product.price)}</strong>
        {action}
      </div>
    </div>
  </article>;
}
