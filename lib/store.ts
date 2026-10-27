import type { CatalogProduct } from "./catalog-types";
import { chargingReasons, controllerIdsFor, defaultControllerKey, packageLines, rules } from "./compatibility";

export const money=(n:number)=>new Intl.NumberFormat("nb-NO",{style:"currency",currency:"NOK",maximumFractionDigits:0}).format(n);

export type StoreCategory={slug:string;label:string;title:string;intro:string;match:(p:CatalogProduct)=>boolean};

export const CATEGORIES:StoreCategory[]=[
  {slug:"biler",label:"Biler",title:"Elektrobiler",intro:"Buggyer og truggyer fra 1/14 til 1/8, klare til kjøring.",match:p=>p.kind==="vehicle"&&p.vehicleType==="car"},
  {slug:"baater",label:"Båter",title:"Elektrobåter",intro:"Fra lette deep-vee-båter til raske katamaraner på 4S og 6S.",match:p=>p.kind==="vehicle"&&p.vehicleType==="boat"},
  {slug:"droner",label:"Droner",title:"Droner med kamera",intro:"Kameradroner fra DJI, med originale batterier og ladehuber.",match:p=>p.kind==="vehicle"&&p.vehicleType==="drone"},
  {slug:"fly",label:"Fly",title:"Elektrofly",intro:"Warbirds og skalafly i BNF- og PNP-utgaver.",match:p=>p.kind==="vehicle"&&p.vehicleType==="plane"},
  {slug:"batterier-og-ladere",label:"Batteri & ladere",title:"Batterier, ladere og kabler",intro:"LiPo-batterier, computerladere og overganger som passer modellene i utvalget.",match:p=>p.kind!=="vehicle"&&p.kind!=="controller"},
  {slug:"kontrollere",label:"Kontrollere",title:"Sendere og kontrollere",intro:"Sendere og mottakere for fly som leveres uten radio, og kontroller til drone.",match:p=>p.kind==="controller"},
];

export const categoryOf=(p:CatalogProduct)=>CATEGORIES.find(c=>c.match(p))??CATEGORIES[CATEGORIES.length-1];
export const productHref=(p:CatalogProduct)=>`/produkt/${p.id}`;
export const builderHref=(p:CatalogProduct)=>`/?modell=${p.id}#${p.vehicleType}`;

export const cleanName=(name:string)=>name.replace(/\s+/g," ").trim();

const KNOWN_BRANDS=["Spektrum","Traxxas","CNHL","Gens Ace","MJX","WLToys","DJI","Bronto","SkyRC"];
export function displayBrand(p:CatalogProduct){
  if(p.brand==="Pro") return "Pro Boat";
  if(!/^\d+s$/i.test(p.brand)) return p.brand;
  return KNOWN_BRANDS.find(b=>p.name.toLowerCase().includes(b.toLowerCase()))??"LiPo";
}

const num=(n:number,digits=0)=>new Intl.NumberFormat("nb-NO",{maximumFractionDigits:digits}).format(n);

/** LiPo voltage from Elefun's "3s 2200mAh" naming (3.7 V per cell), or an explicit "7.4V". */
export function batteryVolts(p:CatalogProduct){
  const cells=Number(cleanName(p.name).match(/^(\d)s\b/i)?.[1]);
  if(cells) return cells*3.7;
  const v=p.name.match(/(\d+(?:\.\d)?)V\b/)?.[1];
  return v?Number(v):null;
}

/** Short option title for the package builder: brand plus the size that matters. */
export function shortTitle(p:CatalogProduct){
  const n=cleanName(p.name);
  if(p.kind==="battery"&&p.capacityMah&&batteryVolts(p)){
    const v=batteryVolts(p);const cells=n.match(/^(\d)s\b/i)?.[1]??(v?String(Math.round(v/3.7)):undefined);
    return `${displayBrand(p)} ${cells?`${cells}S `:""}${num(p.capacityMah)} mAh`;
  }
  if(p.kind==="charger") return n.replace(/\s*(\d+A\s)?(NiMh|Dobbel|Computerlader|Lader)\b.*$/i,"").trim()||n;
  return n;
}

/** Power, watts and size for a builder option, without the full product spec. */
export function optionFacts(p:CatalogProduct){
  if(p.kind==="battery"){
    const v=batteryVolts(p);const out:string[]=[];
    if(v) out.push(`${num(v,1)} V`);
    if(v&&p.capacityMah) out.push(`${num(v*p.capacityMah/1000)} Wh`);
    if(p.capacityMah) out.push(`${num(p.capacityMah)} mAh`);
    if(p.connector) out.push(p.connector);
    return out.length?out.join(" · "):"Originalbatteri til modellen";
  }
  return specsFor(p).join(" · ")||kindLabel(p);
}

export const kindLabel=(p:CatalogProduct)=>p.kind==="vehicle"?(p.tags[0]??"Modell"):p.kind==="battery"?"Batteri":p.kind==="charger"?"Lader":p.kind==="controller"?(p.tags[1]??"Kontroller"):"Kabel og tilbehør";

/** Spec chips derived from the catalog fields and Elefun's own product names. */
export function specsFor(p:CatalogProduct):string[]{
  const n=cleanName(p.name);const out:string[]=[];
  const push=(v:string|undefined|null)=>{if(v&&!out.includes(v))out.push(v);};
  if(p.kind==="vehicle"){
    push(n.match(/\b1\/\d+\b/)?.[0]);
    push(n.match(/\b[24]WD\b/i)?.[0].toUpperCase());
    push(n.match(/\b(\d)s\b/i)?.[1]?`${n.match(/\b(\d)s\b/i)![1]}S`:null);
    push(n.match(/\b\d+(?:\.\d+)?\s?(?:mm|cm|m)\b/)?.[0].replace(/\s/,""));
    push(n.match(/\b\d+km\/t\b/)?.[0]);
    push(n.match(/\b(RC-N3|RC 2)\b/)?.[0]?`Med ${n.match(/\b(RC-N3|RC 2)\b/)![0]}`:null);
    if(/brushless|\bBLX\b/i.test(n)) push("Børsteløs");
    push(n.match(/\b(RTR|ARTR|BNF|PNP)\b/)?.[0]??(/komplett/i.test(n)?"Komplett":null));
  }else if(p.kind==="battery"){
    push(p.cells?`${p.cells}S`:null);
    push(p.capacityMah?`${new Intl.NumberFormat("nb-NO").format(p.capacityMah)} mAh`:null);
    push(p.connector);
    push(n.match(/\b(\d+)C\b/)?.[0]);
    if(!out.length) push("Originalbatteri");
  }else if(p.kind==="charger"){
    push(n.match(/AC(\d+)W/)?.[1]?`${n.match(/AC(\d+)W/)![1]} W AC`:n.match(/\b(\d+)W\b/)?.[0].replace("W"," W"));
    push(n.match(/DC(\d+)W/)?.[1]?`${n.match(/DC(\d+)W/)![1]} W DC`:null);
    push(n.match(/\b\d+A\b/)?.[0]);
    if(/dobbel|dual|two-way|parallel/i.test(n)) push(/two-way|parallel/i.test(n)?"Ladehub":"2 kanaler");
    if(/usb-c/i.test(n)) push("USB-C");
    push(p.connector);
  }else if(p.kind==="controller"){
    for(const t of p.tags.slice(1)) push(t);
  }else{
    const pair=n.match(/(XT60|XT90|EC3|EC5|T-Plugg)\D+(XT60|XT90|EC3|EC5|T-Plugg)/);
    if(pair) push(`${pair[1]} → ${pair[2]}`);
    push(n.match(/\(\d+x\d+x\d+mm\)/)?.[0].slice(1,-1));
    push(n.match(/\b\d+W\b/)?.[0].replace("W"," W"));
  }
  return out.slice(0,4);
}

/** Accessories documented for one model in data/model-accessories.json. */
export function accessoriesFor(products:CatalogProduct[],vehicle:CatalogProduct){
  const r=rules[vehicle.id];const pick=(ids:string[]=[])=>ids.map(id=>products.find(p=>p.id===id)).filter((p):p is CatalogProduct=>!!p);
  return {rule:r,batteries:pick(r?.batteryIds),chargers:pick(r?.chargerIds),leads:pick(r?.leadIds)};
}

/** Models whose documented package uses this battery, charger or cable. */
export function modelsUsing(products:CatalogProduct[],item:CatalogProduct){
  return products.filter(v=>{const r=rules[v.id];return v.kind==="vehicle"&&!!r&&[...r.batteryIds,...r.chargerIds,...r.leadIds].includes(item.id);});
}

/** The documented default package for a model: first battery, first charger (or the included one), required cables. */
export function defaultPackage(products:CatalogProduct[],vehicle:CatalogProduct,controllerKey?:string){
  const r=rules[vehicle.id];
  const battery=r?products.find(p=>p.id===r.batteryIds[0]):undefined;
  const charger=r&&!r.includedCharger?products.find(p=>p.id===r.chargerIds[0]):undefined;
  const key=controllerKey??defaultControllerKey(r);
  const controllerIds=controllerIdsFor(r,key);
  const lines=packageLines(products,vehicle,battery,charger,{controllerIds});
  return {vehicle,battery,charger,controllerKey:key,controllerIds,controllerIncluded:key==='none'&&!!r?.controller?.included&&!r.controller.unconfirmed,includedCharger:!!r?.includedCharger,lines,total:lines.reduce((s,l)=>s+l.quantity*l.product.price,0),reasons:chargingReasons(vehicle,battery,charger)};
}
export type DefaultPackage=ReturnType<typeof defaultPackage>;

/** Package discount on a ready-made package bought exactly as shown. A proposal in this prototype, not an Elefun offer. */
export const PACKAGE_DISCOUNT=0.15;
export const discountFor=(total:number)=>Math.round(total*PACKAGE_DISCOUNT);
export const discountLine=(amount:number)=>({id:"pakkerabatt",name:"Pakkerabatt 15 %",quantity:1,price:-amount});

export const TIERS=[
  {id:"budsjett",name:"Budsjett",level:1,blurb:"Lavest totalpris. Et rimelig sted å begynne."},
  {id:"medium",name:"Medium",level:2,blurb:"Midt i prisklassen, når du vil ha litt mer."},
  {id:"premium",name:"Premium",level:3,blurb:"Toppmodellen i utvalget, med høyest totalpris."},
] as const;

/** Budget, medium and premium = cheapest, middle and most expensive complete package in a category. */
export function tierPackages(products:CatalogProduct[],vehicleType:string){
  const ready=products.filter(p=>p.kind==="vehicle"&&p.vehicleType===vehicleType)
    .map(v=>defaultPackage(products,v)).filter(p=>p.reasons.length===0).sort((a,b)=>a.total-b.total);
  if(!ready.length) return [];
  const picks=[ready[0],ready[Math.floor((ready.length-1)/2)],ready[ready.length-1]];
  // Each tier also gets the controller at its price level: cheapest, middle or most expensive choice.
  return TIERS.map((t,i)=>({tier:t,pkg:defaultPackage(products,picks[i].vehicle,tierControllerKey(products,picks[i].vehicle,i))}))
    .filter((x,i,all)=>all.findIndex(y=>y.pkg.vehicle.id===x.pkg.vehicle.id)===i);
}

/** Controller choice for tier 0, 1 or 2. "Jeg har allerede…" is never picked; the radio in the box is. */
export function tierControllerKey(products:CatalogProduct[],vehicle:CatalogProduct,tier:number){
  const c=rules[vehicle.id]?.controller;
  if(!c?.sets) return defaultControllerKey(rules[vehicle.id]);
  const price=(key:string)=>controllerIdsFor(rules[vehicle.id],key).reduce((s,id)=>s+(products.find(p=>p.id===id)?.price??0),0);
  const keys=[...(c.included||c.defaultNone?["none"]:[]),...c.sets.map((_,i)=>String(i))].sort((a,b)=>price(a)-price(b));
  return keys[[0,Math.floor((keys.length-1)/2),keys.length-1][tier]];
}
