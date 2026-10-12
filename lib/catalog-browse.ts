import type { CatalogProduct } from './catalog-types';
import mappings from '@/data/model-accessories.json';
export type BrowseFilters={category:string;query:string;brands:string[];models:string[];kind:string;minPrice:string;maxPrice:string;sort:string;};
export const categoryNames:Record<string,string>={all:'Alle produkter',car:'Elektrobiler',boat:'Elektrobåter',drone:'Droner med kamera',plane:'Elektrofly',accessories:'Batterier, ladere og tilbehør'};
export function productBrand(p:CatalogProduct){return /CNHL/i.test(p.name)?'CNHL':/MJX/i.test(p.name)?'MJX':/Pro Boat/i.test(p.name)?'Pro Boat':/traxxas/i.test(p.name)?'Traxxas':/spektrum/i.test(p.name)?'Spektrum':/gens?\s*ace/i.test(p.name)?'Gens ace':/bronto/i.test(p.name)?'Bronto':p.brand;}
export function matchesCategory(p:CatalogProduct,category:string){return category==='all'?true:category==='accessories'?p.kind!=='vehicle':p.kind==='vehicle'&&p.vehicleType===category;}
export function matchesModel(p:CatalogProduct,id:string){if(p.kind==='vehicle')return p.id===id;const r=(mappings as Record<string,{batteryIds:string[];chargerIds:string[];leadIds:string[]}>)[id];return !!r&&[...r.batteryIds,...r.chargerIds,...r.leadIds].includes(p.id);}
export function filterProducts(products:CatalogProduct[],f:BrowseFilters,omit?:'brands'|'models'){
 const min=f.minPrice.trim()===''?0:Number(f.minPrice);const max=f.maxPrice.trim()===''?Infinity:Number(f.maxPrice);
 return products.filter(p=>matchesCategory(p,f.category)&&(!f.kind||p.kind===f.kind)&&`${p.name} ${productBrand(p)}`.toLocaleLowerCase('nb').includes(f.query.trim().toLocaleLowerCase('nb'))&&(omit==='brands'||!f.brands.length||f.brands.includes(productBrand(p)))&&(omit==='models'||!f.models.length||f.models.some(id=>matchesModel(p,id)))&&p.price>=min&&p.price<=max).sort((a,b)=>{
 const alpha=a.name.localeCompare(b.name,'nb',{numeric:true,sensitivity:'base'});
 return f.sort==='low'?a.price-b.price||alpha:f.sort==='high'?b.price-a.price||alpha:f.sort==='az'?alpha:f.sort==='za'?-alpha:0;
 });
}
export function routeCategory(hash:string){const [category,kind]=hash.replace(/^#/,'').split('/');return categoryNames[category]?{category,kind:['battery','charger','accessory'].includes(kind)?kind:''}:null;}
