import mappings from "@/data/model-accessories.json";
import type { CatalogProduct } from "./catalog-types";
export type ModelRule={batteryIds:string[];chargerIds:string[];leadIds:string[];includedCharger:boolean;chargingPending:boolean;needsPowerSupply:boolean;batteryPending:boolean;note:string};
export const rules=mappings as Record<string,ModelRule>;
export function batteryReasons(vehicle:CatalogProduct,battery:CatalogProduct):string[]{
  const rule=rules[vehicle.id];
  if(!rule||!rule.batteryIds.includes(battery.id)) return ['Dette batteriet er ikke dokumentert for denne modellen.'];
  if(rule.batteryPending) return ['Batteriet trenger kontaktadapter til modellen. Riktig adapter må bekreftes.'];
  return [];
}
export function chargingReasons(vehicle:CatalogProduct,battery:CatalogProduct|undefined,charger:CatalogProduct|undefined):string[]{
  const rule=rules[vehicle.id];
  if(!rule) return ['Modellen mangler dokumentert ladeoppsett.'];
  if(!battery) return ['Velg et dokumentert batteri.'];
  const reasons=batteryReasons(vehicle,battery);
  if(rule.chargingPending) reasons.push('Ladeoppsett eller nødvendig overgang må bekreftes.');
  if(!charger&&!rule.includedCharger) reasons.push('Velg en modellspesifikk lader.');
  if(charger&&!rule.chargerIds.includes(charger.id)) reasons.push('Laderen er ikke dokumentert for dette oppsettet.');
  if(rule.needsPowerSupply) reasons.push('Ladehuben krever separat USB-C strømforsyning. Effekt og kabel må bekreftes.');
  return [...new Set(reasons)];
}
export function packageLines(products:CatalogProduct[],vehicle:CatalogProduct,battery:CatalogProduct|undefined,charger:CatalogProduct|undefined){
 const r=rules[vehicle.id];
 return [{product:vehicle,quantity:1},...(battery?[{product:battery,quantity:vehicle.batteryCount}]:[]),...(charger?[{product:charger,quantity:1}]:[]),...(r?.leadIds??[]).flatMap(id=>{const p=products.find(p=>p.id===id);return p?[{product:p,quantity:vehicle.batteryCount}]:[];})];
}
