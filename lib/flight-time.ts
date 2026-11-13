import specs from "@/data/fpv-specs.json";
import type { CatalogProduct } from "./catalog-types";

/** The three main FPV packages. The class decides how hard the drone is flown, and so how much power it uses per kilo. */
export type FpvClass="whoop"|"freestyle"|"longrange";
export const FPV_CLASSES:{id:FpvClass;label:string;blurb:string}[]=[
  {id:"whoop",label:"Whoop",blurb:"Liten og trygg 1S-drone for stua og kjelleren. Enkel å komme i gang med."},
  {id:"freestyle",label:"Freestyle",blurb:"5-tommers drone for triks og flyt utendørs. Mer kraft og mer å lære."},
  {id:"longrange",label:"Longrange",blurb:"7-tommers drone bygget for lang rekkevidde og lang flytid."},
];

type DroneSpec={class:FpvClass;weightG:number|null;videoSystem:string;statedFlightMinutes?:number;statedFlightNote?:string;weightNote?:string;connector?:string;cells?:number;source:string};
const drones=specs.drones as Record<string,DroneSpec>;
const batteryWeights=specs.batteries as Record<string,{weightG:number;source:string}>;

export const FLIGHT_ASSUMPTIONS=specs.assumptions;
export const fpvSpec=(id:string)=>drones[id];
export const fpvClassOf=(p:CatalogProduct):FpvClass|undefined=>p.vehicleType==="fpv"?drones[p.id]?.class:undefined;
export const videoSystemOf=(id:string)=>drones[id]?.videoSystem;
export const gogglesSystems=(id:string)=>(specs.goggles as Record<string,{systems:string[]}>)[id]?.systems??[];

export type TimeEstimate={
  minutes:number;
  /** "calculated" comes from the formula below. "stated" is a figure Elefun gives on the product page. */
  basis:"calculated"|"stated";
  note:string;
};

/**
 * Estimated flight time in minutes:  energy (Wh) × usable share ÷ (weight in kg × watts per kg for the class).
 * Needs a documented weight for both the drone and the battery. Without one there is no estimate, instead of a guess.
 * Pass no battery for a kit whose battery is in the box: then only Elefun's own stated time can be shown.
 */
export function flightTime(drone:CatalogProduct,battery?:CatalogProduct):TimeEstimate|null{
  const spec=drones[drone.id];
  if(!spec) return null;
  if(!battery){
    return spec.statedFlightMinutes?{minutes:spec.statedFlightMinutes,basis:"stated",note:`${spec.statedFlightNote??"Oppgitt av Elefun"}.`}:null;
  }
  const batteryWeight=batteryWeights[battery.id]?.weightG;
  if(spec.weightG==null||batteryWeight==null||!battery.capacityMah||!battery.cells) return null;
  const a=specs.assumptions;
  const watts=(spec.weightG+batteryWeight)/1000*a.wattsPerKgByClass[spec.class];
  const energy=battery.cells*a.cellVolts*battery.capacityMah/1000*a.usableBatteryShare;
  return {minutes:energy/watts*60,basis:"calculated",note:`Regnet ut fra batteri (${battery.cells}S ${battery.capacityMah} mAh) og vekt (${spec.weightG+batteryWeight} g).`};
}

export type FlightRow={product:CatalogProduct;battery?:CatalogProduct;estimate:TimeEstimate;selected:boolean};

/**
 * Every FPV drone with its flight time, longest first, so one package can be compared with the others.
 * `batteryFor` says which battery each drone is shown with. The selected drone uses the customer's current choice.
 */
export function flightComparison(products:CatalogProduct[],selected:{droneId:string;battery?:CatalogProduct},batteryFor:(drone:CatalogProduct)=>CatalogProduct|undefined):FlightRow[]{
  const rows:FlightRow[]=[];
  for(const product of products){
    if(product.kind!=="vehicle"||product.vehicleType!=="fpv") continue;
    const isSelected=product.id===selected.droneId;
    const battery=isSelected?selected.battery:batteryFor(product);
    const estimate=flightTime(product,battery);
    if(estimate) rows.push({product,battery,estimate,selected:isSelected});
  }
  return rows.sort((a,b)=>b.estimate.minutes-a.estimate.minutes);
}

type DriveSpec={usableBatteryShare:number;averageAmpsByScale:Record<string,number>;basis:string};
export const DRIVE_ASSUMPTIONS=specs.driveTime as DriveSpec;

/** Scale such as "1/14", read from the product name. Models without a scale in the name get no estimate. */
export const scaleOf=(name:string)=>name.match(/\b1\/(\d+)\b/)?.[0];

/** Estimated driving time in minutes for a car: capacity (Ah) × usable share ÷ assumed average current for its scale. */
export function driveTime(car:CatalogProduct,battery?:CatalogProduct):TimeEstimate|null{
  const scale=scaleOf(car.name);const amps=scale?DRIVE_ASSUMPTIONS.averageAmpsByScale[scale]:undefined;
  if(!amps||!battery?.capacityMah) return null;
  return {minutes:battery.capacityMah/1000*DRIVE_ASSUMPTIONS.usableBatteryShare/amps*60,basis:"calculated",note:`Regnet ut fra ${battery.capacityMah} mAh og et antatt snittforbruk på ${amps} A for skala ${scale}.`};
}

/** Rounded for display: "ca. 7 min", or "ca. 7,5 min" under ten minutes where half minutes matter. */
export function formatMinutes(minutes:number){
  const v=minutes<10?Math.round(minutes*2)/2:Math.round(minutes);
  return `ca. ${new Intl.NumberFormat("nb-NO",{maximumFractionDigits:1}).format(v)} min`;
}
