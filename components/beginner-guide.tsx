import { ArrowUpRight } from "lucide-react";
import type { CatalogProduct } from "@/lib/catalog-types";
import type { ModelRule } from "@/lib/compatibility";
import { checklistFor, DRONE_RULES_URL, glossaryFor } from "@/lib/guidance";

function Group({title,items}:{title:string;items:string[]}){
  if(!items.length) return null;
  return <div className="guide-line"><h4>{title}</h4><ul>{items.map(i=><li key={i}>{i}</li>)}</ul></div>;
}

export default function BeginnerGuide({vehicle,rule,lines,controllerKey,open}:{vehicle:CatalogProduct;rule:ModelRule;lines:{product:CatalogProduct;quantity:number}[];controllerKey:string;open:boolean}){
  const list=checklistFor(rule,lines,vehicle.id,controllerKey);
  const terms=glossaryFor([...lines.map(l=>l.product.name),...(controllerKey==="none"?[]:["sender"]),rule.controller?.note??""]);
  return <details className="guide" open={open}>
    <summary>Ny til dette? Dette må du vite</summary>
    <Group title="Følger med modellen" items={list.inBox}/>
    <Group title="Legges i pakken" items={list.inPackage}/>
    <Group title="Må du ordne selv" items={list.yourself}/>
    {vehicle.vehicleType==="drone"&&<div className="guide-group guide-rules"><h4>Før du flyr drone i Norge</h4><p>Droner med kamera krever normalt at du registrerer deg som droneoperatør hos Luftfartstilsynet. Over 250 gram må du også ta nettkurs og eksamen. Sjekk hva som gjelder for din drone.</p><a href={DRONE_RULES_URL} target="_blank" rel="noreferrer">Reglene hos Luftfartstilsynet <ArrowUpRight size={13} aria-hidden/></a></div>}
    {terms.length>0&&<details className="guide-terms"><summary>Ord som brukes her</summary><dl>{terms.map(t=><div key={t.term}><dt>{t.term}</dt><dd>{t.text}</dd></div>)}</dl></details>}
  </details>;
}
