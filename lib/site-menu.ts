import type { CatalogProduct } from "./catalog-types";
import { ACCESSORY_KINDS, CATEGORIES, builderHref } from "./store";

export type MenuLink={name:string;href:string};
export type MenuColumn={title:string;icon:string;links:MenuLink[]};
/** A category with no columns is shown as a plain link instead of a mega menu. */
export type MenuCategory={slug:string;name:string;href:string;columns:MenuColumn[];footLabel?:string};

/** Local product examples used in the category menus. */
const EXAMPLE_IDS:Record<string,string[]>={
  biler:["50807","67191","73081"],
  baater:["63738","67353","73874"],
  droner:["70251","67428","70935"],
};
const EXAMPLE_ICONS:Record<string,string>={biler:"car-side",baater:"ship",droner:"drone"};

function builderMenu(products:CatalogProduct[]):MenuCategory{
  const modelIds=["67191","63738","67428"];
  const models=modelIds.map(id=>products.find(p=>p.id===id)).filter((p):p is CatalogProduct=>!!p);
  return {
    slug:"pakkebygger",
    name:"Pakkebygger",
    href:"/",
    footLabel:"Åpne pakkebyggeren",
    columns:[
      {title:"Velg kjøretøy",icon:"inbox-in",links:[
        {name:"Elektrobiler",href:"/#car"},
        {name:"Elektrobåter",href:"/#boat"},
        {name:"Droner med kamera",href:"/#drone"},
        {name:"Elektrofly",href:"/#plane"},
      ]},
      {title:"Start med en modell",icon:"car-side",links:models.map(p=>({name:p.name.replace(/\s+/g," ").trim(),href:builderHref(p)}))},
    ],
  };
}

/** Links to a category page with its filters set, so each one shows exactly those products. */
const filtered=(href:string,params:Record<string,string|number>)=>`${href}?${new URLSearchParams(Object.entries(params).map(([k,v])=>[k,String(v)]))}`;

function columnsFor(category:typeof CATEGORIES[number],href:string,products:CatalogProduct[]):MenuColumn[]{
  const examples=EXAMPLE_IDS[category.slug];
  if(examples){
    const links=examples
      .map(id=>products.find(p=>p.id===id))
      .filter((p):p is CatalogProduct=>!!p)
      .map(p=>({name:p.name.replace(/\s+/g," ").trim(),href:`/produkt/${p.id}`}));
    return links.length?[{title:category.title,icon:EXAMPLE_ICONS[category.slug],links}]:[];
  }

  const kinds=ACCESSORY_KINDS.filter(([k])=>products.some(p=>p.kind===k));
  const cells=[...new Set(products.filter(p=>p.kind==="battery"&&p.cells).map(p=>p.cells!))].sort((a,b)=>a-b);
  const columns:MenuColumn[]=[
    {title:"Type",icon:"plug-circle-bolt",links:kinds.length>1?kinds.map(([type,name])=>({name,href:filtered(href,{type})})):[]},
    {title:"Batterier etter celler",icon:"battery-full",links:cells.length>1?cells.map(c=>({name:`${c}S-batterier`,href:filtered(href,{type:"battery",celler:c})})):[]},
  ].filter(c=>c.links.length>0);
  // A panel with a single link adds a click without adding a choice.
  return columns.reduce((n,c)=>n+c.links.length,0)>1?columns:[];
}

/** The category bar is built from local product data; every entry stays within this prototype. */
export function siteMenu(products:CatalogProduct[]):MenuCategory[]{
  const categories=CATEGORIES.flatMap(c=>{
    const items=products.filter(c.match);
    if(!items.length) return [];
    const href=`/kategori/${c.slug}`;
    return [{slug:c.slug,name:c.label,href,columns:columnsFor(c,href,items)}];
  });
  return [builderMenu(products),...categories];
}
