import { ArrowUpRight } from "lucide-react";
import { EVIDENCE_LABELS, STATUS_LABELS, type PackageEvaluation } from "@/lib/compatibility";

export default function PackageStatus({evaluation}:{evaluation:PackageEvaluation}){
  const s=STATUS_LABELS[evaluation.status];
  return <div className="package-status">
    <span className={`status status-${s.tone}`}>{s.label}</span>
    <details className="evidence">
      <summary>Hvorfor står det dette?</summary>
      <p>{s.help}</p>
      {evaluation.evidence.length>0&&<ul>{evaluation.evidence.map((e,i)=><li key={`${e.part}-${i}`}><strong>{e.part}</strong><span>{e.url?<a href={e.url} target="_blank" rel="noreferrer">{EVIDENCE_LABELS[e.kind]} <ArrowUpRight size={13} aria-hidden/></a>:EVIDENCE_LABELS[e.kind]}</span></li>)}</ul>}
    </details>
  </div>;
}
