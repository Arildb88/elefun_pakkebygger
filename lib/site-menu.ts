import type { CatalogProduct } from "./catalog-types";
import { ACCESSORY_KINDS, CATEGORIES } from "./store";

export type MenuLink={name:string;href:string};
export type MenuColumn={title:string;icon:string;links:MenuLink[]};
/** A category with no columns is shown as a plain link instead of a mega menu. */
export type MenuCategory={slug:string;name:string;href:string;columns:MenuColumn[]};

/** Links to the category page with its filters set, so each one shows exactly those products. */
const filtered=(href:string,params:Record<string,string|number>)=>`${href}?${new URLSearchParams(Object.entries(params).map(([k,v])=>[k,String(v)]))}`;

function columnsFor(href:string,products:CatalogProduct[]):MenuColumn[]{
  const kinds=ACCESSORY_KINDS.filter(([k])=>products.some(p=>p.kind===k));
  const cells=[...new Set(products.filter(p=>p.kind==="battery"&&p.cells).map(p=>p.cells!))].sort((a,b)=>a-b);
  const columns:MenuColumn[]=[
    {title:"Type",icon:"plug-circle-bolt",links:kinds.length>1?kinds.map(([type,name])=>({name,href:filtered(href,{type})})):[]},
    {title:"Batterier etter celler",icon:"battery-full",links:cells.length>1?cells.map(c=>({name:`${c}S-batterier`,href:filtered(href,{type:"battery",celler:c})})):[]},
  ].filter(c=>c.links.length>0);
  // A panel with a single link adds a click without adding a choice.
  return columns.reduce((n,c)=>n+c.links.length,0)>1?columns:[];
}

/** The category bar, built from the products in the database: empty categories are left out. */
export function siteMenu(products:CatalogProduct[]):MenuCategory[]{
  return CATEGORIES.flatMap(c=>{
    const items=products.filter(c.match);
    if(!items.length) return [];
    const href=`/kategori/${c.slug}`;
    return [{slug:c.slug,name:c.label,href,columns:columnsFor(href,items)}];
  });
}
