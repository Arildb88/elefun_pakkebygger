'use client';
import {Search} from 'lucide-react';
export default function CatalogHeaderSearch(){return <form className="search" onSubmit={e=>{e.preventDefault();const value=String(new FormData(e.currentTarget).get('query')??'');window.dispatchEvent(new CustomEvent('elefun-search',{detail:value}));document.getElementById('catalog')?.scrollIntoView({behavior:'smooth'});}}><input name="query" placeholder="Søk i produktutvalget" aria-label="Søk i produktutvalget"/><button type="submit"><Search/><span>Søk</span></button></form>;}
