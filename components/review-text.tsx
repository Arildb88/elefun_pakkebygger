"use client";
import { useState } from "react";

const LIMIT=420;

/** Review body that shortens the few very long reviews behind a "Les hele" toggle. */
export default function ReviewText({text}:{text:string}){
  const [open,setOpen]=useState(false);
  if(text.length<=LIMIT+80) return <p className="review-text">{text}</p>;
  const cut=text.lastIndexOf(" ",LIMIT);
  return <p className="review-text">
    {open?text:`${text.slice(0,cut).trimEnd()}…`}{" "}
    <button type="button" className="review-more" aria-expanded={open} onClick={()=>setOpen(!open)}>{open?"Vis mindre":"Les hele"}</button>
  </p>;
}
