import { FLIGHT_ASSUMPTIONS, formatMinutes, type FlightRow } from "@/lib/flight-time";
import { cleanName, displayBrand } from "@/lib/store";

/** Short drone name for a bar label: the name without the brand and the control-link suffix. */
const label=(row:FlightRow)=>cleanName(row.product.name).replace(new RegExp(`^${displayBrand(row.product)}\\s+`,"i"),"").replace(/\s+(-\s+)?(BNF|PNP|RTF)\b.*$/i,"");

/**
 * Flight time for the chosen drone next to every other FPV drone, longest first.
 * The bars share one scale. Times are estimates, so the assumptions are open under "Slik er tiden regnet".
 */
export default function FlightTimeBar({rows,compact=false}:{rows:FlightRow[];compact?:boolean}){
  if(!rows.length) return null;
  const longest=Math.max(...rows.map(r=>r.estimate.minutes));
  return <section className={`ft${compact?" ft-compact":""}`} aria-label="Flytid sammenlignet med andre FPV-droner">
    {!compact&&<h4 className="ft-title">Flytid sammenlignet med andre FPV-droner</h4>}
    <ul className="ft-list">
      {rows.map(r=><li key={r.product.id} className={r.selected?"ft-row ft-selected":"ft-row"}>
        <span className="ft-name">{displayBrand(r.product)} {label(r)}{r.selected&&<span className="ft-you">Valgt</span>}</span>
        <span className="ft-track" aria-hidden="true"><span className="ft-fill" style={{width:`${Math.max(4,r.estimate.minutes/longest*100)}%`}}/></span>
        <span className="ft-value">{formatMinutes(r.estimate.minutes)}{r.estimate.basis==="stated"&&<small> oppgitt</small>}</span>
      </li>)}
    </ul>
    {!compact&&<details className="ft-how">
      <summary>Slik er tiden regnet</summary>
      <p>Energi i batteriet × {Math.round(FLIGHT_ASSUMPTIONS.usableBatteryShare*100)} % brukbar andel ÷ effekt. Effekten er vekt (drone og batteri) × watt per kilo for typen drone. Det er en antakelse fra studentgruppa, ikke en måling.</p>
      <p>{FLIGHT_ASSUMPTIONS.basis}</p>
      <p>«Oppgitt» betyr at tiden står på Elefuns produktside. Droner uten dokumentert vekt vises ikke.</p>
    </details>}
  </section>;
}
