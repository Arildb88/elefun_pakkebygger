---
version: 1
slug: "app-page-tsx"
primary_target: "app/page.tsx"
related_targets: ["app/kategori","app/produkt","components/elefun-chrome.tsx"]
---

# Elefun storefront (Pakkebygger, kategori, produkt)

Scope: shared chrome (header, category bar, footer), `/` Pakkebygger (restyle, behavior kept), `/kategori/[slug]`, `/produkt/[id]`.
Mode: Operate. Visitors browse, compare specs, and build a compatible package. Persuade only in the builder intro.
Audience: teachers reviewing a school project; represented users are Norwegian RC hobbyists who read cell counts and connectors.
Constraints: Elefun colors pinned by the user. Demo prices and cart, always disclosed. Norwegian bokmål. Build path: code-led (no image generation available).

## Direction contract

THESIS: Elefun's own blue shell and black-and-yellow stripe, rebuilt as a modern spec-first hobby store. It refuses the generic marketplace grid of grey cards and the old site's gradient buttons, icon tiles and bevelled search.

OWN-WORLD: The header is a full blue `#116ba0` field. Under it runs a black category bar with a 3px yellow `#f8bd1e` top edge (the old stripe, now navigation). The page ground is white with a cool `#f2f6f9` tint on wells. Yellow fills the primary actions with near-black text. Green `#1a8f2e` is for buying only. Headings and all numerals are Play (tabular); text is Signika. Radii are 6–10px, borders are 1px `#dbe3e9`, and shadows are soft with an offset.

STORY: A visitor knows this is Elefun at once, finds a category or model, reads the real specs at a glance, sees what fits it, and either builds a package or adds it to the demo cart. They always know the prices are snapshots.

FIRST VIEWPORT: The blue header has the logo, a wide white search with a yellow button, and service, login and cart (with count). The black category bar sits under it. On `/`, a split hero: H1 "Finn modellen. Bygg pakken." on blue, a short line, and a yellow CTA on the left; the ARRMA Typhon on a light well on the right. The bottom of the hero is a black spec rail with three steps. On category pages: a filter rail on the left and a 4-column card grid. On product pages: a large image well on the left; on the right the name, spec rail, Play price, and actions.

FORM: pinned brief (Elefun brand world; user-pinned, concept roll skipped). Signature move: the spec rail, a black band with a yellow top hairline that carries the real specs (scale, drive, RTR/BNF/PNP, S-cells, mAh, C, connector, watt) in Play. It appears on every card, the product page and the package summary. Seed key: none (pinned).

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
