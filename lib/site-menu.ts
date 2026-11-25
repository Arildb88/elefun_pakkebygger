import type { CatalogProduct } from "./catalog-types";
import { ACCESSORY_KINDS, CATEGORIES, builderHref } from "./store";

export type MenuLink={name:string;href:string};
export type MenuColumn={title:string;icon:string;links:MenuLink[]};
export type MenuCategory={slug:string;name:string;href:string;columns:MenuColumn[];footLabel?:string};

export const menuGroupSlug=(title:string)=>title.toLowerCase().replace(/æ/g,"ae").replace(/ø/g,"o").replace(/å/g,"a").replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");

/** Example products and category paths are all served by this prototype. */
function builderMenu(products:CatalogProduct[]):MenuCategory{
  const modelIds=["67191","63738","67428"];
  const models=modelIds.map(id=>products.find(p=>p.id===id)).filter((p):p is CatalogProduct=>!!p);
  return {
    slug:"pakkebygger",
    name:"Pakkebygger",
    href:"/",
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

const local=(ids:string[],products:CatalogProduct[])=>ids
  .map(id=>products.find(p=>p.id===id))
  .filter((p):p is CatalogProduct=>!!p)
  .map(p=>({name:p.name.replace(/\s+/g," ").trim(),href:`/produkt/${p.id}`}));

const column=(title:string,icon:string,links:MenuLink[]):MenuColumn=>({title,icon,links});
const shelf=(category:string,underkategori:string,id:string)=>`/sortiment/${category}/${underkategori}/${id}`;

function categoryExamples(slug:string,products:CatalogProduct[]):MenuColumn[]|null{
  if(slug==="biler") return [
    column("Buggy","car-side",local(["50807","47308"],products)),
    column("Crawlere","car-side",[{name:"Axial RBX10 Ryft Rock Bouncer",href:shelf("biler","alle-elektrobiler","51241")}]),
    column("Monstertruck","car-side",["74810","48057","55990"].map(id=>({name:({
      "74810":"MJX Hyper GO Monstertruck",
      "48057":"HSP Brontosaurus Monster",
      "55990":"FTX Tracer Monstertruck",
    } as Record<string,string>)[id],href:shelf("biler","alle-elektrobiler",id)}))),
    column("Truggy","car-side",local(["73081"],products)),
  ];
  if(slug==="baater") return [
    column("Racerbåter","ship",local(["63738","67353","73874","75083"],products)),
    column("Seilbåter","ship",[{name:"Joysway Focus V3 seilbåt",href:shelf("bater","seilbater","62802")}]),
    column("Redningsbåter","ship",[{name:"Snig Rescue Coast Guard",href:shelf("bater","elektrobater","69029")}]),
  ];
  if(slug==="fly") return [
    column("Sjøfly","plane",[{name:"Top RC Hobby TF-350 RTF",href:shelf("fly","komplette-flypakker","73180")}]),
    column("Sport","plane",[{name:"Seagull Magic Bird EF1 Racer Sport",href:shelf("fly","acro-3d","73842")}]),
    column("Indoor","plane",[{name:"E-Flite UMX Night Vapor RTF",href:shelf("fly","komplette-flypakker","51342")}]),
    column("EDF / Jet","plane",[
      {name:"E-Flite UMX Viper EDF",href:shelf("fly","alle-elektrofly","72539")},
      {name:"E-Flite UF-86 Sabre EDF",href:shelf("fly","alle-elektrofly","66222")},
    ]),
  ];
  if(slug==="droner") return [
    column("Kameradroner","drone",local(["70251","67428","70935"],products)),
  ];
  if(slug==="fpv") return [
    column("Whoop","drone",local(["73850","73234","70501"],products)),
    column("Freestyle","drone",local(["61677","70433"],products)),
    column("Longrange","drone",local(["67564"],products)),
  ];
  return null;
}

/** Category filters are local and keep the chosen category visible in the prototype. */
const filtered=(href:string,params:Record<string,string|number>)=>`${href}?${new URLSearchParams(Object.entries(params).map(([k,v])=>[k,String(v)]))}`;

function columnsFor(category:typeof CATEGORIES[number],href:string,products:CatalogProduct[]):MenuColumn[]{
  const examples=categoryExamples(category.slug,products);
  if(examples) return examples;

  if(category.slug==="batterier-og-ladere"){
    const kinds=ACCESSORY_KINDS.filter(([k])=>products.some(p=>p.kind===k));
    const cells=[...new Set(products.filter(p=>p.kind==="battery"&&p.cells).map(p=>p.cells!))].sort((a,b)=>a-b);
    const columns:MenuColumn[]=[
      {title:"Type",icon:"plug-circle-bolt",links:kinds.length>1?kinds.map(([type,name])=>({name,href:filtered(href,{type})})):[]},
      {title:"Batterier etter celler",icon:"battery-full",links:cells.length>1?cells.map(c=>({name:`${c}S-batterier`,href:filtered(href,{type:"battery",celler:c})})):[]},
    ].filter(c=>c.links.length>0);
    if(columns.length) return columns;
  }

  const popular=products.slice(0,5).map(p=>({name:p.name.replace(/\s+/g," ").trim(),href:`/produkt/${p.id}`}));
  return [column("Populære produkter","inbox-in",popular.length?popular:[{name:"Se kategoriutvalget",href}])];
}

/** Every top-level category opens a menu, including categories with a small sample set. */
export function siteMenu(products:CatalogProduct[]):MenuCategory[]{
  const categories=CATEGORIES.map(c=>{
    const items=products.filter(c.match);
    const href=`/kategori/${c.slug}`;
    return {slug:c.slug,name:c.label,href,columns:columnsFor(c,href,items)};
  });
  return [builderMenu(products),...categories];
}
