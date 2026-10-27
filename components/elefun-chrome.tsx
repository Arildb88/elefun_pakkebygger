import Link from "next/link";
import { ArrowUpRight, Flag, Handshake, Headset, Search, ShoppingCart, Truck, UserRound } from "lucide-react";
import MegaMenu from "./mega-menu";
import { CartCount } from "./cart-controls";
import { CATEGORIES } from "@/lib/store";
import { megaMenu } from "@/lib/elefun-menu";

const ELEFUN="https://www.elefun.no/";

export default function ElefunChrome({children}:{children:React.ReactNode}){
  return (
    <div className="site-shell">
      <a className="skip-link" href="#innhold">Hopp til innholdet</a>
      <div className="utility-bar">
        <div className="utility-inner">
          <p><strong>Studentprosjekt</strong> Ikke Elefuns offisielle nettbutikk. Prisene er øyeblikksbilder, og ingen bestillinger sendes.</p>
          <ul aria-label="Elefun lover">
            <li><Flag size={14} aria-hidden/> 100% norsk nettbutikk</li>
            <li><Truck size={14} aria-hidden/> Lynrask levering</li>
            <li><Handshake size={14} aria-hidden/> 60 dager bytterett</li>
          </ul>
        </div>
      </div>
      <header className="masthead">
        <div className="masthead-inner">
          <Link className="brand" href="/" aria-label="Elefun – til forsiden">
            <img src="/brand/elefun-logo-white.svg" alt="Elefun" width={176} height={46}/>
          </Link>
          <form className="site-search" action="https://www.elefun.no/" method="get" target="_blank" role="search">
            <Search className="site-search-icon" size={19} aria-hidden/>
            <input name="search_text" type="search" placeholder="Søk blant 30 000 produkter" aria-label="Søk i Elefuns sortiment"/>
            <button type="submit">Søk</button>
          </form>
          <nav className="masthead-actions" aria-label="Konto og handlevogn">
            <a href={ELEFUN} target="_blank" rel="noreferrer"><Headset size={22} aria-hidden/><span>Kundeservice</span></a>
            <a href={ELEFUN} target="_blank" rel="noreferrer"><UserRound size={22} aria-hidden/><span>Logg inn</span></a>
            {/* Plain anchor: the builder intercepts #cart clicks to open its cart dialog. */}
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
            <a href="/#cart" className="cart-link"><ShoppingCart size={22} aria-hidden/><span>Handlevogn</span><CartCount/></a>
          </nav>
        </div>
      </header>
      <MegaMenu categories={megaMenu()}/>

      <div id="innhold" className="page">{children}</div>

      <footer className="site-footer">
        <div className="footer-inner">
          <div className="footer-brand">
            <img src="/brand/elefun-logo-white.svg" alt="Elefun" width={168} height={44}/>
            <p>Radiostyrt, hobby og fritid. En moderne skisse av Elefuns nettbutikk, laget som studentprosjekt.</p>
            <a className="prisjakt-link" href="https://www.prisjakt.no/shop.php?f=18260" target="_blank" rel="noreferrer">
              <img src="/brand/prisjakt.png" alt="" width={22} height={22}/>
              <span>Les Elefuns kundeomtaler på Prisjakt</span>
            </a>
          </div>
          <nav aria-label="Handle">
            <h2>Handle</h2>
            <ul>
              <li><Link href="/">Pakkebygger</Link></li>
              <li><Link href="/sortiment">Hele sortimentet</Link></li>
              {CATEGORIES.map(c=><li key={c.slug}><a href={`/kategori/${c.slug}`}>{c.title}</a></li>)}
            </ul>
          </nav>
          <nav aria-label="Kundeservice hos Elefun">
            <h2>Kundeservice</h2>
            <ul>
              {["Kontakt oss","Frakt og levering","Bytte og retur","Garanti","Kjøpsvilkår","Personvern"].map(l=><li key={l}><a href={ELEFUN} target="_blank" rel="noreferrer">{l}</a></li>)}
            </ul>
          </nav>
          <div className="footer-news">
            <h2>Tilbud og nyheter først</h2>
            <p>Nyhetsbrevet og alle bestillinger håndteres av Elefun.</p>
            <a className="btn-outline-light" href={ELEFUN} target="_blank" rel="noreferrer">Meld deg på hos Elefun <ArrowUpRight size={16} aria-hidden/></a>
            <div className="footer-pay" aria-label="Betalingsmåter hos Elefun">
              <img src="/brand/vipps.png" alt="Vipps"/>
              <img src="/brand/visa.png" alt="Visa"/>
              <img src="/brand/mastercard.png" alt="Mastercard"/>
            </div>
          </div>
        </div>
        <div className="footer-legal">
          <p>Logo, produktnavn og produktbilder tilhører Elefun AS. Studentprosjekt 2026, uten tilknytning til Elefun.</p>
        </div>
      </footer>
    </div>
  );
}
