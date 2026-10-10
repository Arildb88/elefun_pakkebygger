import {
  Car,
  Fan,
  Flag,
  Handshake,
  Headset,
  Menu,
  Plane,
  Printer,
  RectangleHorizontal,
  Search,
  Ship,
  ShoppingCart,
  Star,
  Truck,
  UserRound,
  Video,
  Zap,
} from "lucide-react";

import MegaMenu from "./mega-menu";
import CatalogHeaderSearch from "./catalog-header-search";

export default function ElefunChrome({children}:{children:React.ReactNode}){
  return (
    <div className="site-shell">
      <div className="prototype-bar"><strong>PROTOTYPE</strong><span>Studentprosjekt · Prisøyeblikksbilder · Ingen ekte bestilling</span></div>
      <header className="store-header">
        <div className="header-main">
          <a className="elefun-logo" href="https://www.elefun.no/" target="_blank" rel="noreferrer">
            <img src="/brand/elefun-logo-white.svg" alt="Elefun"/>
          </a>

          <CatalogHeaderSearch/>
          <nav className="header-actions">
            <a href="https://www.elefun.no/" target="_blank" rel="noreferrer"><Headset/><span>Kundeservice</span></a>
            <a href="https://www.elefun.no/" target="_blank" rel="noreferrer"><UserRound/><span>Logg inn</span></a>
            <a href="#cart"><ShoppingCart/><span>Handlevogn</span></a>
          </nav>
        </div>
        <div className="header-stripe"/>
      </header>

      <MegaMenu/>

      <div className="hero-card">
        <img className="hero-banner" src="/brand/elefun-logo-white.svg" alt="Elefun"/>
        <div className="trust-strip">
          <a href="https://www.elefun.no/" target="_blank" rel="noreferrer"><Flag/><b><em>100%</em> norsk nettbutikk</b><small>Om oss</small></a>
          <a href="https://www.elefun.no/" target="_blank" rel="noreferrer"><Truck/><b>Lynrask levering</b><small>Les mer</small></a>
          <a href="https://www.elefun.no/" target="_blank" rel="noreferrer"><Handshake/><b>60 dager bytterett</b><small>Gå til bytte og retur</small></a>
          <a href="https://www.prisjakt.no/shop.php?f=18260" target="_blank" rel="noreferrer">
            <span className="prisjakt"><img src="/brand/prisjakt.png" alt=""/> <Star/><Star/><Star/><Star/><Star/></span>
            <b>Kundeomtale på prisjakt</b><small>Les våre omtaler</small>
          </a>
        </div>
      </div>

      {children}

      <footer className="store-footer">
        <div className="footer-subscribe">
          <span>Motta tilbud og nyheter først!</span>
          <div>
            <input type="email" placeholder="Din e-post" aria-label="Din e-post"/>
            <a href="https://www.elefun.no/" target="_blank" rel="noreferrer">Meld meg på</a>
          </div>
        </div>
        <div className="footer-pay">
          <img src="/brand/vipps.png" alt="Vipps"/>
          <img src="/brand/visa.png" alt="Visa"/>
          <img src="/brand/mastercard.png" alt="Mastercard"/>
        </div>
        <nav className="footer-links">
          <a href="https://www.elefun.no/" target="_blank" rel="noreferrer">Hovedsiden</a>
          <a href="https://www.elefun.no/" target="_blank" rel="noreferrer">Om oss</a>
          <a href="https://www.elefun.no/" target="_blank" rel="noreferrer">Kontakt oss</a>
          <a href="https://www.elefun.no/" target="_blank" rel="noreferrer">Kjøpsvilkår</a>
          <a href="https://www.elefun.no/" target="_blank" rel="noreferrer">Personvern</a>
        </nav>
        <p>Elefun AS © 2003 – 2026</p>
      </footer>
    </div>
  );
}
