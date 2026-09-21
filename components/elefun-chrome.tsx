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

const CATEGORIES=[
  {label:"3D-print",href:"https://www.elefun.no/",Icon:Printer},
  {label:"Batteri & ladere",href:"https://www.elefun.no/",Icon:Zap},
  {label:"Bilbane",href:"https://www.elefun.no/",Icon:RectangleHorizontal},
  {label:"Biler",href:"https://www.elefun.no/",Icon:Car},
  {label:"Båter",href:"https://www.elefun.no/",Icon:Ship},
  {label:"Droner",href:"https://www.elefun.no/",Icon:Fan},
  {label:"Droner for FPV",href:"https://www.elefun.no/",Icon:Video},
  {label:"Fly",href:"https://www.elefun.no/",Icon:Plane},
];

export default function ElefunChrome({children}:{children:React.ReactNode}){
  return (
    <div className="site-shell">
      <div className="prototype-bar"><strong>PROTOTYPE</strong><span>Produktdata lagres i database – ingen ekte bestilling</span></div>
      <header className="store-header">
        <div className="header-main">
          <a className="elefun-logo" href="https://www.elefun.no/" target="_blank" rel="noreferrer">
            <img src="/brand/elefun-logo-white.svg" alt="Elefun"/>
          </a>
          <button className="header-menu" type="button"><Menu/><span>Meny</span></button>
          <form className="search" action="https://www.elefun.no/" method="get" target="_blank">
            <input name="search_text" placeholder="Søk blant våre 30.000 produkter" aria-label="Søk blant våre 30.000 produkter"/>
            <button type="submit"><Search/><span>Søk</span></button>
          </form>
          <nav className="header-actions">
            <a href="https://www.elefun.no/" target="_blank" rel="noreferrer"><Headset/><span>Kundeservice</span></a>
            <a href="https://www.elefun.no/" target="_blank" rel="noreferrer"><UserRound/><span>Logg inn</span></a>
            <a href="https://www.elefun.no/" target="_blank" rel="noreferrer"><ShoppingCart/><span>Handlevogn</span></a>
          </nav>
        </div>
        <div className="header-stripe"/>
      </header>

      <nav className="category-nav" aria-label="Kategorier">
        {CATEGORIES.map(({label,href,Icon})=>(
          <a key={label} href={href} target="_blank" rel="noreferrer">
            <Icon/>
            <span>{label}</span>
          </a>
        ))}
      </nav>

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
