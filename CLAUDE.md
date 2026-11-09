# Elefun Pakkebygger – studentprototype (IS-219, UiA)

> Utkast til gjennomgang i gruppa.

## Mål
Hjelpe Elefuns kunder å kjøpe en komplett, kompatibel RC-pakke (modell, batteri,
lader, kabler, sender) med forklaring når noe ikke passer. Konseptprototype –
ikke koblet til Elefuns systemer, ingen ekte ordre.

## Kommandoer
- Installer: corepack pnpm install
- Utvikling: corepack pnpm dev   (http://localhost:5173)
- Utvikling uten corepack, når avhengigheter er installert: node scripts/run-framework.mjs dev
- Tester: node --test tests/catalog.test.cjs tests/elefun-menu.test.cjs
- Typesjekk: node node_modules/typescript/bin/tsc --noEmit
- Build: node scripts/run-framework.mjs build

## Arbeidsflyt
1. Les relevante filer i docs/context/ og spesifikasjonen i specs/.
2. Bruk Plan Mode før endringer i mer enn én fil.
3. Still spørsmål ved uklare krav. Stopp og rapporter konflikt mellom spec og constitution.
4. Implementer én oppgave fra tasks.md om gangen. Ikke start neste.
5. Kjør tester, typesjekk og build. Sammenhold med akseptansekriteriene.

## Absolutte regler
- Følg docs/governance/constitution.md.
- Aldri avgjør kompatibilitet i kode utenfor lib/compatibility.ts.
- Aldri endre data/model-accessories.json eller data/compatibility-evidence.json uten kildelenke.
- Aldri oppfinn pris, lager, produkt-ID, anmeldelser eller kampanjer.
- Kundetekst på norsk bokmål.

## Sannhetskilder
- Arbeidsplan: docs/plan.md
- Regler: lib/compatibility.ts og docs/research/elefun-sources.md
- Design: DESIGN.md · Produkt: PRODUCT.md
- Godkjente features: specs/
