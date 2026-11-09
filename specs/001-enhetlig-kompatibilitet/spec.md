# 001 – Enhetlig kompatibilitetsvurdering med evidens

Status: utkast, ikke godkjent av gruppa.

## Mål
Alle modellkategorier skal få samme vurdering, med ett av fem statusnivåer og synlig grunnlag for hver del i pakken.

Utenfor scope: språkmodell, nye kompatibilitetskoblinger, Elefuns produksjonsdata.

## Brukerhistorier
- Som Ragnar vil jeg se hvorfor en del passer og hvor opplysningen kommer fra, slik at jeg kan stole på den.
- Som Tiril vil jeg ikke kunne kjøpe en pakke som ikke er avklart.

## Funksjonelle krav
- FR-01: Bil, båt, drone og fly vurderes av samme regel.
- FR-02: Status er én av `CONFIRMED`, `RULE_DERIVED`, `CONDITIONAL`, `UNKNOWN`, `INCOMPATIBLE`.
- FR-03: Hver del i pakken viser type grunnlag: produsent, Elefun eller studentgruppa.
- FR-04: Grunnlag fra produsent eller Elefun har kildelenke. Gruppas vurdering har ingen.
- FR-05: `UNKNOWN` og `INCOMPATIBLE` kan ikke legges i handlevogn.
- FR-06: I «Tilpass pakken» kan et ikke-kontrollert batteri med samme spenning som modellens eget velges til visning. Pakken får da `CONDITIONAL`, et synlig forbehold og grunnlaget «Ikke kontrollert, kun til visning». Regelen gjelder ikke ferdigpakker.

## Akseptansekriterier
- AC-01: Gitt en modell i hver kategori, når pakken vurderes, så får den en av de fem statusene.
- AC-02: Gitt en modell uten regel, når pakken vurderes, så er status `UNKNOWN` og pakken kan ikke kjøpes.
- AC-03: Gitt et batteri som ikke er dokumentert, når pakken vurderes uten visningsregelen, eller batteriet har annen spenning, så er status `INCOMPATIBLE`.
- AC-04: Gitt et BNF-fly uten valgt sender, når pakken vurderes, så er status `CONDITIONAL`.
- AC-05: Gitt DJI Neo 2 uten kontroll, når pakken vurderes, så er status ikke `CONDITIONAL`, fordi Elefun oppgir at den kan flys uten.
- AC-06: Gitt en radio som ikke er bekreftet, når pakken vurderes, så er status `CONDITIONAL`.
- AC-07: Gitt et ikke-kontrollert batteri med samme spenning i «Tilpass pakken», når det velges, så er status `CONDITIONAL`, forbeholdet vises, og pakken kan legges i demo-handlevognen.

## Beslutninger gruppa må ta stilling til
1. **`RULE_DERIVED` betyr foreløpig «gjennomgått av gruppa, uten kilde for akkurat denne koblingen».** Planen definerer det som utledet av en testet regel. Slike regler finnes ikke ennå for lader og kabler.
2. **Evidens ligger i `data/compatibility-evidence.json`,** med unntak per kobling. Standard er Elefun for batterier og medfølgende utstyr, og gruppas vurdering for lader, kabler og byttet radio. Standarden bygger på `docs/research/elefun-sources.md`, ikke på ny kontroll av hver side.
3. **`model-accessories.json` er ikke endret,** i tråd med regelen om kildelenke.
4. **Visningsregelen i FR-06 er lagt til for presentasjon av prototypen.** Den må fjernes før en brukertest eller reell bruk der kunder kan tro at batteriene passer.
