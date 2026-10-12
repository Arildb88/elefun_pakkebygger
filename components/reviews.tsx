import { ArrowUpRight, MessageSquareQuote, Star, ThumbsUp } from "lucide-react";
import { countLabel, ratingLabel, reviewDate, type ProductReviews } from "@/lib/reviews";
import ReviewText from "./review-text";

/** Five stars with the filled layer clipped to the score, so half stars work. */
export function Stars({stars,size=16}:{stars:number;size?:number}){
  const row=(cls:string)=><span className={cls}>{[0,1,2,3,4].map(i=><Star key={i} size={size} strokeWidth={1.6}/>)}</span>;
  return <span className="stars" aria-hidden="true">
    {row("stars-base")}
    <span className="stars-fill" style={{width:`${stars/5*100}%`}}>{row("stars-row")}</span>
  </span>;
}

/** Compact score for cards: stars, average and count. */
export function RatingBadge({data,href}:{data:ProductReviews;href?:string}){
  const label=`Vurdert ${ratingLabel(data.stars)} av 5 i ${countLabel(data.count)} hos Elefun`;
  const inner=<><Stars stars={data.stars} size={14}/><b>{ratingLabel(data.stars)}</b><span>({data.count})</span></>;
  return href
    ?<a className="rating-badge" href={href} aria-label={label}>{inner}</a>
    :<span className="rating-badge" role="img" aria-label={label}>{inner}</span>;
}

export function ReviewSection({data}:{data:ProductReviews}){
  const written=data.reviews.filter(r=>r.text||r.headline);
  const starOnly=data.reviews.filter(r=>!r.text&&!r.headline);
  const shown=data.reviews.length;
  return <section className="reviews" id="anmeldelser" aria-labelledby="reviews-title">
    <div className="section-head">
      <h2 id="reviews-title"><MessageSquareQuote size={22} aria-hidden/> Hva kundene sier</h2>
      <p>Ekte anmeldelser fra produktsiden hos Elefun.</p>
    </div>
    <div className="reviews-layout">
      <div className="reviews-score">
        <strong className="reviews-big">{ratingLabel(data.stars)}<small> av 5</small></strong>
        <Stars stars={data.stars} size={22}/>
        <p>Elefuns vurdering etter {countLabel(data.count)}{data.count>shown?`. Her ser du ${shown===1?"den første":`de ${shown} første`}.`:"."}</p>
        <a className="source-link" href={`${data.sourceUrl}#prodpage_review`} target="_blank" rel="noreferrer">Les alle hos Elefun <ArrowUpRight size={15} aria-hidden/></a>
      </div>
      <div className="review-list">
        {written.map(r=><article key={`${r.author}-${r.date}`} className="review">
          <div className="review-head">
            <span role="img" aria-label={`${r.rating} av 5 stjerner`}><Stars stars={r.rating}/></span>
            {r.headline&&<h3>{r.headline}</h3>}
          </div>
          {r.text&&<ReviewText text={r.text}/>}
          <p className="review-meta">
            <span>{r.author}</span>
            <time dateTime={r.date}>{reviewDate(r.date)}</time>
            {r.helpful>0&&<span className="review-helpful"><ThumbsUp size={14} aria-hidden/> {r.helpful} syntes dette var nyttig</span>}
          </p>
        </article>)}
        {starOnly.length>0&&<div className="review-quiet">
          <p>{written.length?"Ga bare stjerner:":"Kundene har bare gitt stjerner, uten tekst:"}</p>
          <ul>{starOnly.map(r=><li key={`${r.author}-${r.date}`}><span role="img" aria-label={`${r.rating} av 5 stjerner`}><Stars stars={r.rating} size={14}/></span> {r.author} · <time dateTime={r.date}>{reviewDate(r.date)}</time></li>)}</ul>
        </div>}
      </div>
    </div>
    <p className="reviews-note">Kopiert fra elefun.no 12. oktober 2026 til dette studentprosjektet. Navn er forkortet til fornavn og initial.</p>
  </section>;
}
