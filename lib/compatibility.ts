import mappings from "@/data/model-accessories.json";
import evidenceLinks from "@/data/compatibility-evidence.json";
import type { CatalogProduct } from "./catalog-types";
/** How the model is controlled: a sender in the box, or sets (sender + receiver) to choose from. */
export type ControllerRule={included?:string;unconfirmed?:boolean;sets?:string[][];noneLabel?:string;noneFacts?:string;defaultNone?:boolean;note?:string};
/** FPV extras: `gogglesIds` are the goggles documented for the drone's video system, `includedBattery` names a battery in the box, `cautions` are open points that make the package conditional. */
export type ModelRule={batteryIds:string[];chargerIds:string[];leadIds:string[];includedCharger:boolean;chargingPending:boolean;needsPowerSupply:boolean;batteryPending:boolean;note:string;controller?:ControllerRule;gogglesIds?:string[];includedBattery?:string;cautions?:string[]};
/** The controller a package starts with: the one in the box, "none" for Neo 2, otherwise the cheapest set. */
export const defaultControllerKey=(r:ModelRule|undefined)=>r?.controller?.sets&&!r.controller.included&&!r.controller.defaultNone?'0':'none';
export const controllerIdsFor=(r:ModelRule|undefined,key:string)=>key!=='none'?r?.controller?.sets?.[Number(key)]??[]:[];
export const defaultControllerIds=(r:ModelRule|undefined)=>controllerIdsFor(r,defaultControllerKey(r));
export const rules=mappings as Record<string,ModelRule>;
const UNDOCUMENTED_BATTERY='Dette batteriet er ikke dokumentert for denne modellen.';
const DEMO_BATTERY='Kun til visning: Dette batteriet er ikke kontrollert for modellen. Kontakt, størrelse og lader kan avvike.';

/** LiPo voltage from Elefun's "3s 2200mAh" naming (3.7 V per cell), or an explicit "7.4V". */
export function batteryVolts(p:CatalogProduct){
  const cells=Number(p.name.replace(/\s+/g," ").trim().match(/^(\d)s\b/i)?.[1]);
  if(cells) return cells*3.7;
  const v=p.name.match(/(\d+(?:\.\d)?)V\b/)?.[1];
  return v?Number(v):null;
}

/** Prototype-only rule: an unreviewed battery at the model's own voltage may be picked for display. Ready-made packages never use it. */
export function isDemoBattery(vehicle:CatalogProduct,battery:CatalogProduct,products:CatalogProduct[]){
  const rule=rules[vehicle.id];
  if(!rule||battery.kind!=='battery'||rule.batteryIds.includes(battery.id)) return false;
  const reference=products.find(p=>p.id===rule.batteryIds[0]);
  const volts=reference?batteryVolts(reference):null;
  return !!volts&&batteryVolts(battery)===volts;
}

export function batteryReasons(vehicle:CatalogProduct,battery:CatalogProduct):string[]{
  const rule=rules[vehicle.id];
  if(!rule||!rule.batteryIds.includes(battery.id)) return [UNDOCUMENTED_BATTERY];
  if(rule.batteryPending) return ['Batteriet trenger kontaktadapter til modellen. Riktig adapter må bekreftes.'];
  return [];
}
export function chargingReasons(vehicle:CatalogProduct,battery:CatalogProduct|undefined,charger:CatalogProduct|undefined):string[]{
  const rule=rules[vehicle.id];
  if(!rule) return ['Modellen mangler dokumentert ladeoppsett.'];
  if(!battery&&!rule.includedBattery) return ['Velg et dokumentert batteri.'];
  const reasons=battery?batteryReasons(vehicle,battery):[];
  if(rule.chargingPending) reasons.push('Ladeoppsett eller nødvendig overgang må bekreftes.');
  if(!charger&&!rule.includedCharger) reasons.push('Velg en modellspesifikk lader.');
  if(charger&&!rule.chargerIds.includes(charger.id)) reasons.push('Laderen er ikke dokumentert for dette oppsettet.');
  if(rule.needsPowerSupply) reasons.push('Ladehuben krever separat USB-C strømforsyning. Effekt og kabel må bekreftes.');
  return [...new Set(reasons)];
}

export type PackageStatus='CONFIRMED'|'RULE_DERIVED'|'CONDITIONAL'|'UNKNOWN'|'INCOMPATIBLE';
export type EvidenceKind='manufacturer'|'elefun'|'review'|'demo';
export type EvidenceLink={part:string;kind:EvidenceKind;url:string|null};
export type PackageEvaluation={status:PackageStatus;reasons:string[];evidence:EvidenceLink[];canAddToCart:boolean};

export const STATUS_LABELS:Record<PackageStatus,{label:string;help:string;tone:'ok'|'warn'}>={
  CONFIRMED:{label:'Bekreftet av kilde',help:'Alle delene er oppgitt for denne modellen av Elefun eller produsenten.',tone:'ok'},
  RULE_DERIVED:{label:'Gjennomgått oppsett',help:'Delene er gjennomgått i dette studentprosjektet. Minst én kobling er ikke oppgitt direkte av Elefun eller produsenten.',tone:'ok'},
  CONDITIONAL:{label:'Passer med forbehold',help:'Pakken kan brukes, men noe må du sjekke selv.',tone:'warn'},
  UNKNOWN:{label:'Ikke bekreftet',help:'Vi har ikke nok opplysninger til å si om dette passer.',tone:'warn'},
  INCOMPATIBLE:{label:'Passer ikke',help:'Minst én del er ikke dokumentert for denne modellen.',tone:'warn'},
};
export const EVIDENCE_LABELS:Record<EvidenceKind,string>={manufacturer:'Oppgitt av produsenten',elefun:'Oppgitt av Elefun',review:'Gjennomgått av studentgruppa',demo:'Ikke kontrollert, kun til visning'};

const evidenceFor=(vehicle:CatalogProduct,id:string,part:string,fallback:EvidenceKind):EvidenceLink=>{
  const link=(evidenceLinks as Record<string,{kind:EvidenceKind;url?:string}>)[`${vehicle.id}:${id}`];
  const kind=link?.kind??fallback;
  return {part,kind,url:link?.url??(kind==='review'?null:vehicle.sourceUrl)};
};

/**
 * Evaluates a package for any model against the reviewed relationships in model-accessories.json.
 * Unknown combinations fail closed instead of being guessed from product text.
 * Passing `demoCatalog` also allows the display-only batteries from isDemoBattery, with a caveat.
 */
export function evaluatePackage(
  vehicle:CatalogProduct,
  battery:CatalogProduct|undefined,
  charger:CatalogProduct|undefined,
  controllerIds:string[]=[],
  demoCatalog?:CatalogProduct[],
  goggles?:CatalogProduct
):PackageEvaluation{
  const rule=vehicle.kind==='vehicle'?rules[vehicle.id]:undefined;
  if(!rule) return {status:'UNKNOWN',reasons:['Modellen mangler gjennomgåtte kompatibilitetsdata.'],evidence:[],canAddToCart:false};

  const reasons:string[]=[];const evidence:EvidenceLink[]=[];
  let problem:'INCOMPATIBLE'|'UNKNOWN'|'CONDITIONAL'|undefined;
  // Only a harder problem may replace an earlier one.
  const raise=(next:NonNullable<typeof problem>)=>{const order=['CONDITIONAL','UNKNOWN','INCOMPATIBLE'];if(!problem||order.indexOf(next)>order.indexOf(problem))problem=next;};

  const demo=!!battery&&!!demoCatalog&&isDemoBattery(vehicle,battery,demoCatalog);
  const charging=chargingReasons(vehicle,battery,charger).filter(r=>!(demo&&r===UNDOCUMENTED_BATTERY));
  const chargerPart=()=>{
    if(charging.length){
      reasons.push(...charging);
      const definiteChargerFailure=(!charger&&!rule.includedCharger)||(!!charger&&!rule.chargerIds.includes(charger.id));
      raise(definiteChargerFailure?'INCOMPATIBLE':'CONDITIONAL');
    }
    if(charger) evidence.push(evidenceFor(vehicle,charger.id,'Lader','review'));
    else if(rule.includedCharger) evidence.push({part:'Lader som følger med',kind:'elefun',url:vehicle.sourceUrl});
    evidence.push(...rule.leadIds.map(id=>evidenceFor(vehicle,id,'Kabel','review')));
  };
  if(!battery&&rule.includedBattery){
    evidence.push({part:'Batteri som følger med',kind:'elefun',url:vehicle.sourceUrl});
    chargerPart();
  }else if(!battery||(!demo&&!rule.batteryIds.includes(battery.id))){
    raise('INCOMPATIBLE');
    reasons.push(!battery?'Velg et dokumentert batteri.':'Dette batteriet er ikke dokumentert for modellen.');
  }else{
    if(demo){raise('CONDITIONAL');reasons.push(DEMO_BATTERY);evidence.push({part:'Batteri',kind:'demo',url:null});}
    else evidence.push(evidenceFor(vehicle,battery.id,'Batteri','elefun'));
    chargerPart();
  }

  const radio=rule.controller;
  if(controllerIds.length){
    const documented=radio?.sets?.some(set=>set.length===controllerIds.length&&set.every(id=>controllerIds.includes(id)));
    if(!documented){
      raise('INCOMPATIBLE');
      reasons.push('Sender- og mottakersettet er ikke dokumentert som kompatibelt med modellen.');
    }else evidence.push(...controllerIds.map(id=>evidenceFor(vehicle,id,'Kontroll','review')));
  }else if(radio?.included){
    if(radio.unconfirmed){
      raise('CONDITIONAL');
      reasons.push('Det er ikke bekreftet hvilken sender og mottaker som følger med modellen.');
    }else evidence.push({part:'Kontroll som følger med',kind:'elefun',url:vehicle.sourceUrl});
  }else if(radio?.defaultNone){
    evidence.push({part:'Bruk uten kontroll',kind:'elefun',url:vehicle.sourceUrl});
  }else if(radio?.noneLabel){
    raise('CONDITIONAL');
    reasons.push('Du oppgir at du har senderutstyr fra riktig system. Den konkrete senderen og mottakeren er ikke kontrollert.');
  }else{
    raise('UNKNOWN');
    reasons.push('Modellen mangler dokumentert sender- og mottakeroppsett.');
  }

  // FPV: the goggles must match the drone's video system, and open points keep the package conditional.
  if(rule.gogglesIds){
    if(!goggles){raise('INCOMPATIBLE');reasons.push('Velg FPV-briller. Uten briller ser du ikke hva dronen ser.');}
    else if(!rule.gogglesIds.includes(goggles.id)){raise('INCOMPATIBLE');reasons.push('Brillene er ikke dokumentert for dronens videosystem.');}
    else evidence.push(evidenceFor(vehicle,goggles.id,'Briller','review'));
  }
  for(const caution of rule.cautions??[]){raise('CONDITIONAL');reasons.push(caution);}

  const status:PackageStatus=problem??(evidence.every(e=>e.kind!=='review')?'CONFIRMED':'RULE_DERIVED');
  return {status,reasons:[...new Set(reasons)],evidence,canAddToCart:status!=='INCOMPATIBLE'&&status!=='UNKNOWN'&&charging.length===0};
}

/** Package lines. `sets` buys extra full battery sets; `controllerIds` adds a sender (and receiver). */
export function packageLines(products:CatalogProduct[],vehicle:CatalogProduct,battery:CatalogProduct|undefined,charger:CatalogProduct|undefined,opts:{sets?:number;controllerIds?:string[];goggles?:CatalogProduct}={}){
 const r=rules[vehicle.id];const controllers=(opts.controllerIds??[]).flatMap(id=>{const p=products.find(p=>p.id===id);return p?[{product:p,quantity:1}]:[];});
 return [{product:vehicle,quantity:1},...(battery?[{product:battery,quantity:vehicle.batteryCount*(opts.sets??1)}]:[]),...controllers,...(opts.goggles?[{product:opts.goggles,quantity:1}]:[]),...(charger?[{product:charger,quantity:1}]:[]),...(r?.leadIds??[]).flatMap(id=>{const p=products.find(p=>p.id===id);return p?[{product:p,quantity:vehicle.batteryCount}]:[];})];
}
