import type { CatalogProduct } from "./catalog-types";
import type { ModelRule } from "./compatibility";

export type GlossaryEntry={term:string;match:RegExp;text:string};

/** Plain-language explanations, shown only for terms that appear in the package at hand. */
export const GLOSSARY:GlossaryEntry[]=[
  {term:"RTR",match:/\bRTR\b/,text:"Ready to Run. Modellen er ferdig montert og radio følger med. Batteri og lader kan likevel komme i tillegg."},
  {term:"ARTR",match:/\bARTR\b/,text:"Almost Ready to Run. Modellen er nesten klar, men noe utstyr eller montering kan mangle."},
  {term:"BNF",match:/\bBNF\b/,text:"Bind-N-Fly. Flyet har mottaker, men du trenger en sender som bruker samme radiosystem."},
  {term:"PNP",match:/\bPNP\b/,text:"Plug-N-Play. Flyet leveres uten sender og mottaker, så du må ha begge deler."},
  {term:"Celler (2S, 3S, 4S, 6S)",match:/\b\d[sS]\s+\d+\s*mAh/i,text:"Antall battericeller koblet etter hverandre. Flere celler gir høyere spenning: 3S er omtrent 11,1 V. Modellen tåler bare det celletallet den er laget for."},
  {term:"mAh",match:/mAh/i,text:"Hvor mye energi batteriet rommer. Høyere tall gir vanligvis lengre kjøre- eller flytid."},
  {term:"C-tall",match:/\b\d+C\b/,text:"Hvor mye strøm batteriet kan levere om gangen. Kraftige modeller trenger et høyt nok C-tall."},
  {term:"LiPo",match:/lipo/i,text:"Batteritypen de fleste RC-modeller bruker. Den må lades med riktig lader og aldri uten tilsyn."},
  {term:"Kontakt (XT60, EC5, IC3, Deans)",match:/\b(XT60|XT90|EC3|EC5|IC2|IC3|IC5|Deans|T-Plugg)\b/i,text:"Pluggen mellom batteri og modell eller lader. Den må passe nøyaktig, eller så trengs det en overgang. Overganger modellen trenger legges i pakken."},
  {term:"Børsteløs motor",match:/brushless|\bBLX\b/i,text:"Motortype med mer kraft og mindre slitasje. Modellene går ofte fortere og krever mer kontroll."},
  {term:"Computerlader",match:/computerlader/i,text:"Lader som balanserer cellene i batteriet, slik at de lades jevnt og trygt."},
  {term:"ELRS",match:/ELRS/,text:"ExpressLRS, radiosystemet mellom senderen og dronen. Radioen og dronen må bruke ELRS på samme frekvens, her 2,4 GHz."},
  {term:"FPV-briller og videosystem",match:/FPV Briller|Goggles|O4|Analog/i,text:"Dronens kamera sender bildet direkte til brillene. Analogt og digitalt (DJI O4) kan ikke blandes: brillene må passe til dronens videosystem."},
  {term:"Whoop, freestyle og longrange",match:/whoop|freestyle|longrange|CineLR/i,text:"Whoop er liten og trygg for innendørs. Freestyle er 5 tommer for triks utendørs. Longrange er 7 tommer for lang rekkevidde og lang flytid."},
  {term:"Sender og mottaker",match:/sender|mottaker|DSMX|DSMR/i,text:"Senderen er kontrollen du holder i hendene. Mottakeren sitter i modellen. De må bruke samme radiosystem."},
];

export const glossaryFor=(texts:string[])=>{const all=texts.join(" ");return GLOSSARY.filter(e=>e.match.test(all));};

export type PackageChecklist={inBox:string[];inPackage:string[];yourself:string[]};

/** What comes with the model, what the package adds, and what the customer must sort out on their own. */
export function checklistFor(rule:ModelRule,lines:{product:CatalogProduct;quantity:number}[],vehicleId:string,controllerKey:string):PackageChecklist{
  const c=rule.controller;const inBox:string[]=[];const yourself:string[]=[];
  if(rule.includedCharger) inBox.push("Lader");
  if(controllerKey==="none"&&c?.included&&!c.unconfirmed) inBox.push("Kontroll");
  if(controllerKey==="none"&&c?.unconfirmed) yourself.push("Sjekk om sender og mottaker følger med før du kjøper");
  if(controllerKey==="none"&&!c?.included&&c?.noneLabel&&!c.defaultNone) yourself.push("Sender og eventuell mottaker du allerede har");
  const aa=controllerKey==="none"?c?.included?.match(/(\d+)\s*×\s*AA/):undefined;
  if(aa) yourself.push(`${aa[1]} AA-batterier til senderen`);
  return {inBox,inPackage:lines.filter(l=>l.product.id!==vehicleId).map(l=>`${l.quantity} × ${l.product.name.replace(/\s+/g," ").trim()}`),yourself};
}

export const DRONE_RULES_URL="https://luftfartstilsynet.no/en/drones/registrering-og-soknader/registration/";
