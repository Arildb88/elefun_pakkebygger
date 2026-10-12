import mappings from "@/data/model-accessories.json";
import type { CatalogProduct } from "./catalog-types";
/** How the model is controlled: a sender in the box, or sets (sender + receiver) to choose from. */
export type ControllerRule={included?:string;unconfirmed?:boolean;sets?:string[][];noneLabel?:string;noneFacts?:string;defaultNone?:boolean;note?:string};
export type ModelRule={batteryIds:string[];chargerIds:string[];leadIds:string[];includedCharger:boolean;chargingPending:boolean;needsPowerSupply:boolean;batteryPending:boolean;note:string;controller?:ControllerRule};
/** The controller a package starts with: the one in the box, "none" for Neo 2, otherwise the cheapest set. */
export const defaultControllerKey=(r:ModelRule|undefined)=>r?.controller?.sets&&!r.controller.included&&!r.controller.defaultNone?'0':'none';
export const controllerIdsFor=(r:ModelRule|undefined,key:string)=>key!=='none'?r?.controller?.sets?.[Number(key)]??[]:[];
export const defaultControllerIds=(r:ModelRule|undefined)=>controllerIdsFor(r,defaultControllerKey(r));
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
/** Package lines. `sets` buys extra full battery sets; `controllerIds` adds a sender (and receiver). */
export function packageLines(products:CatalogProduct[],vehicle:CatalogProduct,battery:CatalogProduct|undefined,charger:CatalogProduct|undefined,opts:{sets?:number;controllerIds?:string[]}={}){
 const r=rules[vehicle.id];const controllers=(opts.controllerIds??[]).flatMap(id=>{const p=products.find(p=>p.id===id);return p?[{product:p,quantity:1}]:[];});
 return [{product:vehicle,quantity:1},...(battery?[{product:battery,quantity:vehicle.batteryCount*(opts.sets??1)}]:[]),...controllers,...(charger?[{product:charger,quantity:1}]:[]),...(r?.leadIds??[]).flatMap(id=>{const p=products.find(p=>p.id===id);return p?[{product:p,quantity:vehicle.batteryCount}]:[];})];
}
