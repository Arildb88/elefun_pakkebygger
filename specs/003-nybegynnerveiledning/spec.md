# 003 – Forklaring og veiledning for nybegynnere

Status: utkast, ikke godkjent av gruppa.

## Mål
Nybegynnere skal forstå hva pakken inneholder, hva de må ordne selv og hva fagbegrepene betyr.

Utenfor scope: chatbot, regler for andre fartøy enn droner, full opplæring.

## Funksjonelle krav
- FR-01: Pakkebyggeren viser hva som følger med modellen, hva som legges i pakken og hva kunden må ordne selv.
- FR-02: Bare begreper som finnes i den aktuelle pakken forklares.
- FR-03: Veiledningen er åpen for Nybegynner og lukket for Erfaren.
- FR-04: Droner viser informasjon om registrering og kurs, med lenke til Luftfartstilsynet.

## Akseptansekriterier
- AC-01: Gitt en bil med radio som krever AA-batterier, når pakken vises, så står AA-batteriene under «Må du ordne selv».
- AC-02: Gitt en PNP-modell der kunden har egen sender, når pakken vises, så står senderen under «Må du ordne selv».
- AC-03: Gitt en drone, når pakken vises, så vises droneinformasjonen. Gitt en bil, så vises den ikke.

## Beslutninger gruppa må ta stilling til
1. Forklaringene er skrevet av Claude og bør leses av noen med RC-erfaring eller av Elefun.
2. Dronereglene er gjengitt generelt. Kilde: Luftfartstilsynet og oppslag 9. november 2026. Gruppa bør kontrollere teksten før brukertest.
