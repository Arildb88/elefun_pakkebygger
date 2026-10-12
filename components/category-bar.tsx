"use client";
import { usePathname } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import { CATEGORIES } from "@/lib/store";

export default function CategoryBar(){
  const path=usePathname()??"/";
  const links=[{href:"/",label:"Pakkebygger"},...CATEGORIES.map(c=>({href:`/kategori/${c.slug}`,label:c.label}))];
  return <nav className="catbar" aria-label="Kategorier">
    <div className="catbar-inner">
      <ul>
        {links.map(l=>{const active=l.href==="/"?path==="/":path.startsWith(l.href);return <li key={l.href}><a href={l.href} aria-current={active?"page":undefined}>{l.label}</a></li>;})}
      </ul>
      <a className="catbar-more" href="https://www.elefun.no/" target="_blank" rel="noreferrer">Alle 22 kategorier på elefun.no <ArrowUpRight size={15} aria-hidden/></a>
    </div>
  </nav>;
}
