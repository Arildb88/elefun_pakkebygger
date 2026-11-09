# Constitution – Elefun Pakkebygger

Status: utkast. Prinsippene er foreslått i `docs/plan.md` og må godkjennes av gruppa.

1. Pris, lagerstatus og produkt-ID oppfinnes aldri. Prototypen viser at priser er øyeblikksbilder og påstår ikke lagerstatus.
2. Kompatibilitet kommer fra `data/model-accessories.json` eller en navngitt, testet regel – aldri fra produkttekst eller en språkmodell.
3. Hver kobling har evidens: kilde-URL og type (produsentside, Elefun-side, egen vurdering).
4. Statusnivåer: `CONFIRMED` (dokumentert i kilde), `RULE_DERIVED` (utledet av testet regel), `CONDITIONAL` (krever adapter, bekreftelse eller ekstra tilbehør), `UNKNOWN`, `INCOMPATIBLE`. Ukjent vises aldri som «passer».
5. Pakken kan ikke legges i handlevogn hvis obligatorisk tilbehør mangler.
6. Alle anbefalinger kan forklares på norsk med hverdagsspråk; fagbegreper forklares for nybegynnere.
7. Hver regel har positive, negative og ukjente testtilfeller.
8. Elefuns merkevare (farger, fonter, USP-er) beholdes; ingen oppdiktede anmeldelser, kampanjer eller leveringsløfter.
9. Rabatt og pakkenivåer er studentforslag og merkes slik.
10. Endringer i ønsket atferd gjøres i spec først, så i kode.
