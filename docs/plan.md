# plan.md – Elefun Pakkebygger, prototypefasen (omstart)

**Gruppe 8 / 1000BYTE · IS-219 Digitalisering og tjenestedesign · UiA**
Sist oppdatert: 2026-11-09 · Status: utkast til gjennomgang i gruppa

Dette dokumentet er arbeidsplanen for prototypefasen. Vi starter fasen på nytt – ikke koden, men måten vi jobber på. Prototypen i [`Arildb88/elefun_pakkebygger`](https://github.com/Arildb88/elefun_pakkebygger) er utgangspunktet. Den skal nå dokumenteres og videreutvikles etter prosessen i *Prototyping-fasen – et veikart* (NFG/UiA), **Appendix B: Claude Code – tilsvarende prosess**:

> Context Development → CLAUDE.md og regler → feature-spesifikasjon → Plan Mode → oppgaver → implementasjon → hooks/tester → review

Veikartet anbefaler Copilot som standard for studenter, men peker på Claude Code når man har en større eksisterende kodebase og vil sammenligne prosesser. Det er vår situasjon: vi har en fungerende prototype med 36 commits som skal dokumenteres i etterkant og bygges videre på.

---

## 1. Hvor vi står i dag

### 1.1 Prototypen (main, commit `c8addc1`)

| Område | Status i repoet |
| --- | --- |
| Stack | vinext (Next.js App Router på Vite), React 19, Tailwind 4 + shadcn, Cloudflare Worker, valgfri D1/SQLite via Drizzle |
| Katalog | `data/catalog-snapshot.json` – 79 produkter, hvorav 24 modeller (9 biler, 5 båter, 5 droner, 5 fly) med kilde-URL til elefun.no |
| Kompatibilitet | `lib/compatibility.ts` + `data/model-accessories.json` – eksplisitte, manuelt gjennomgåtte koblinger modell → batteri / lader / kabler / sender |
| Statuser | `compatible`, `conditional`, `incompatible`, `unknown` – ukjent radiooppsett avvises ("fail closed") |
| Pakkebygger | Velg modell → batteri (1 eller 2 sett) → lader → sender; kabler legges til automatisk; begrunnelse når noe ikke passer |
| Ferdigpakker | Tre nivåer per kategori, sortert etter totalpris, 15 % rabatt kun hvis pakken ikke endres |
| Erfaringsnivå | Nybegynner/erfaren-filter for alle fire modellkategorier (kuraterte tagger) |
| Butikk-skall | Elefun-design, megameny med ekte kategoritre, `/sortiment`-sider, ekte kundeanmeldelser, demo-handlevogn i localStorage |
| Tester | `tests/catalog.test.cjs`, `tests/elefun-menu.test.cjs` (node:test) |
| Dokumentasjon | `README.md`, `PRODUCT.md`, `DESIGN.md`, `docs/research/elefun-sources.md` |
| Mangler | Ingen `CLAUDE.md`, ingen `docs/context/`, ingen `specs/`, ingen CI (`.github/` finnes ikke) |

### 1.2 Hva vi har fra tidligere faser

| Leveranse | Det vi tar med videre |
| --- | --- |
| Refleksjonsoppgave | Elefuns egne funksjonsønsker (kompatibilitetsmotor, «Go big/Go small», samlet handlekurv, pakkerabatt). Konkret eksempel fra Elefun: FMS FCX10 Range Rover RS leveres uten batteri og lader. «Anbefalt tilbehør» i dag er manuelt og blir utdatert. |
| Oppgave 3 (undersøkelse/analyse) | Interessenter, intervjufunn, spørreundersøkelse, observasjon (r/rccars, r/fpv – f.eks. XT60-lader + XT90-batteri), konkurrentanalyse (Komplett PC-bygger), personas Ragnar, Tiril, Martin og Roy, empatikart, begrensninger i utvalget |
| Oppgave 4 (idé/utvelgelse) | Kundeprofil og verdiforslag, lotusblomst, prioritering, brukerreise og tjenesteplan, kravspesifikasjon (9 punkter), WBS (A1 katalog, A2 regler, B1 dialog, B2 ferdigpakker) |

### 1.3 Avvik og løse tråder funnet ved gjennomgang

Disse bør ryddes før eller under Context Development, ellers arver Claude motsigelsene:

1. **Antall modeller.** `PRODUCT.md` og WBS A1 sier 20 modeller (5 biler). Data har 24 (9 biler). Testen heter fortsatt «exactly five real models in each requested category», men sjekker 9 biler.
2. **Enhetlig evaluator mangler.** `evaluateCarPackage()` gir status kun for biler. Båt, drone og fly bruker bare `batteryReasons()`/`chargingReasons()` og får ingen samlet status.
3. **Statusnivåene er grovere enn veikartet.** Veikartet skiller *bekreftet*, *regelutledet*, *betinget*, *ukjent* og *inkompatibel*. Prototypen slår sammen bekreftet og regelutledet, og lagrer ikke evidens (kilde) per kobling.
4. **Ferdigpakkene er bare sortert etter pris.** Oppgave 4 viste selv problemet: en dronepakke fikk for billig drone i forhold til briller og andre komponenter. Nivåene må ta hensyn til formål, pris og kontekst.
5. **Rester fra startmalen.** `.openai/hosting.json`, `app/chatgpt-auth.ts` (mock-innlogging), `examples/d1/` og `.impeccable/` kommer fra malen prototypen ble generert fra. Vi må bestemme hva som beholdes (ADR-001).
6. **To installasjonsveier.** README anbefaler `corepack pnpm`, den tekniske delen bruker `npm`. Velg én og skriv den i `CLAUDE.md`.
7. **Lesbarhet.** `lib/compatibility.ts` og `app/configurator.tsx` er skrevet som lange enlinjere. Veikartet krever at vi forstår endringene vi godtar – formatering er derfor en del av baseline.
8. **FMS FCX10 Range Rover RS** – Elefuns eget eksempel – bør sjekkes mot katalogen og eventuelt bli et testcase.

---

## 2. Arbeidsmåte med Claude

### 2.1 Prinsipp

Claude skal ikke starte med kode. Rekkefølgen er alltid: **les kontekst → avklar → planlegg i Plan Mode → implementer én oppgave → verifiser**. Kompatibilitet avgjøres av data og deterministiske regler, aldri av en språkmodell – dette er også det intervjuobjektene var mest skeptiske til.

### 2.2 Fem sporbare elementer per feature

Veikartet krever fire sporbare elementer. Vi legger til et femte for KI-bruk:

| Element | Fil | Viser |
| --- | --- | --- |
| Kontekst | `docs/context/*.md` | At vi forstår Elefun og domenet |
| Spesifikasjon | `specs/NNN-*/spec.md` | At vi kan formulere testbare behov |
| Plan og oppgaver | `specs/NNN-*/plan.md`, `tasks.md` | Hvordan, før vi koder |
| Git-diff og commits | PR koblet til spec og oppgave | Hva som faktisk ble utviklet |
| Verifikasjon + KI-logg | `specs/NNN-*/verification.md` | Hvilke tester som ble kjørt, hvilke Claude-forslag vi forkastet eller rettet |

### 2.3 Regler for samarbeid i gruppa

- Én feature-branch per oppgave (`feat/NNN-tX-kort-navn`), PR til `main`, minst én annen i gruppa godkjenner.
- PR-beskrivelsen lenker til spec og oppgave-ID (f.eks. `001 / T-03`).
- Ingen endring i `data/model-accessories.json` uten kildelenke i samme commit.
- Claude-økter starter alltid i Plan Mode for endringer i mer enn én fil.

---

## 3. Faser

### Fase 0 – Baseline og opprydding (før dokumentasjon)

Mål: Et rent utgangspunkt som alle kan kjøre likt.

- [ ] Alle i gruppa kloner og kjører `corepack pnpm install && corepack pnpm dev` lokalt.
- [ ] Kjør dagens kontroller og noter resultatet i `docs/baseline.md`:
  `node --test tests/catalog.test.cjs tests/elefun-menu.test.cjs` · `tsc --noEmit` · `npm run build`
- [ ] Ta skjermbilder av dagens hovedflyt (modellvalg, pakkebygger, ferdigpakker, handlevogn) – brukes i rapport og som før/etter.
- [ ] Tag dagens `main` som `v0-prototype` så vi alltid kan vise utgangspunktet.
- [ ] Skriv ADR-001: hva vi gjør med malrester (punkt 1.3.5).
- [ ] Legg til formatering (Prettier) i en egen, ren PR uten logikkendringer.
- [ ] Sett opp enkel GitHub Actions-CI som kjører test + typesjekk + build på hver PR.

### Fase 1 – Context Development

Mål: Gjøre det vi allerede vet eksplisitt og versjonert, slik at Claude (og sensor) kan lese det. Mye av innholdet finnes allerede i oppgave 3 og 4 – jobben er å flytte det inn i repoet i riktig form, og markere hva som er observert, antatt og ukjent.

| Fil | Innhold | Hentes fra |
| --- | --- | --- |
| `docs/context/business-context.md` | Elefun, ~70 000 artikler, 96 % netthandel, butikk i Grimstad, problemet med manuelt «Anbefalt tilbehør», prosjektmandat og avgrensning (konsept/prototype, ikke produksjon) | Refleksjon, oppgave 3 §1–2.1 |
| `docs/context/users-and-jobs.md` | Kundesegment (privatkunder på nett), kundejobber/goder/smerter, personas Ragnar, Tiril, Martin, Roy, B2B-aktører nevnt av Elefun | Oppgave 3 §4.3–4.5, oppgave 4 §2 |
| `docs/context/customer-journeys.md` | Narrativer for 4–6 situasjoner (se under) | Oppgave 4 §1.1 og §5, nye narrativer |
| `docs/context/service-blueprint.md` | Tjenesteplanen fra oppgave 4 utvidet med *data*, *regel/tjeneste som avgjør*, *risiko*, *når en fagperson tar over* | Oppgave 4 tabell 2, veikartets blueprint-mal |
| `docs/context/domain-glossary.md` | Begreper: celler (2S/3S/4S/6S), mAh, C-rate, kontakter (XT60, XT90, EC5, IC3, IC5, Deans/T-plugg), RTR, BNF, PNP, ESC, brushless, balanselader, sender/mottaker | Prototypedata, intervjuguiden |
| `docs/context/product-taxonomy.md` | Kategorier i prototypen (bil, båt, drone, fly + batteri, lader, kabel, sender) og hvordan de kobles til Elefuns kategoritre | `data/elefun-menu.json`, katalogen |
| `docs/context/data-sources.md` | Hvor hver datatype kommer fra, hvor fersk den er, og hva vi *ikke* har (lager, sanntidspris, Elefuns PIM). Skrapeskriptene og deres begrensninger. | README, `elefun-sources.md`, `scripts/` |
| `docs/context/compatibility-rules.md` | Reglene i klartekst: hva som gjør et batteri gyldig, når adapter kreves, når pakken blokkeres. Statusnivåer (se fase 2). Hvilken kilde vinner ved konflikt. | `lib/compatibility.ts`, `model-accessories.json`, `elefun-sources.md` |
| `docs/context/risks-and-guardrails.md` | Feil kontakt (XT60/XT90), feil cellekobling, falsk kompatibilitet, utdatert pris, drone-registrering for nybegynnere, tillitsproblemet fra intervjuene | Oppgave 3 §3–5 |
| `docs/context/success-metrics.md` | Hvordan vi måler prototypen (se fase 6) | Veikartet §10, kravspesifikasjonen |
| `docs/context/open-questions.md` | Spørsmål til Elefun og egne antakelser som må valideres (se §5) | Hele gruppa |

**Kundesituasjoner som skal bli narrativer** (velg 4–6):

1. *Tiril* – kjøper RC-bil som gave, vet ingenting om batteri og lader.
2. *Martin* – første kameradrone; usikker på ekstra batterier og vet ikke om registrering/nettkurs.
3. *Roy* – FPV på 6 000 kr budsjett; risikerer et analogt oppsett med kort flytid uten å vite det.
4. *Ragnar* – erfaren; vil bytte enkeltkomponenter og se *hvorfor* noe passer, stoler ikke på automatiske anbefalinger.
5. *Kontaktfeilen* – kunden har XT60-lader og XT90-batteri (fra observasjonen på Reddit).
6. *Elefuns eget eksempel* – FMS FCX10 Range Rover RS uten batteri og lader i esken.

For hver: hva utløser behovet, hva kunden vet og ikke vet, hvor usikkerheten oppstår, hva et godt resultat er, og «moments of truth».

**Ferdig når:** Alle filene finnes, hver påstand er merket observert / antatt / åpent, og gruppa har godkjent dem i en PR.

**Claude-økt for fasen** (start, ikke Plan Mode ennå):

```
Les README.md, PRODUCT.md, docs/research/elefun-sources.md, lib/compatibility.ts
og data/model-accessories.json. Les også rapportene i docs/reports/ (oppgave 3 og 4).
Ikke foreslå arkitektur eller kode.
1. Identifiser brukergrupper, jobs-to-be-done og beslutningssituasjoner.
2. Lag et utkast til domain-glossary.md fra begrepene som faktisk brukes i data og kode.
3. Beskriv kompatibilitetsreglene slik koden faktisk håndhever dem i compatibility-rules.md.
4. List alle motsigelser mellom dokumentasjon, tester og data.
5. Skill mellom observert, antatt og ukjent.
6. Intervju oss om ett tema om gangen før dokumentene ferdigstilles.
Skriv til docs/context/.
```

(Rapportene fra oppgave 3 og 4 legges i `docs/reports/` som markdown, uten personopplysninger.)

### Fase 2 – CLAUDE.md og constitution

Mål: Varige regler Claude leser ved starten av hver økt.

**`docs/governance/constitution.md`** – forslag til prinsipper (diskuteres og godkjennes av gruppa):

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

**`CLAUDE.md`** (rot) – kort, peker videre:

```markdown
# Elefun Pakkebygger – studentprototype (IS-219, UiA)

## Mål
Hjelpe Elefuns kunder å kjøpe en komplett, kompatibel RC-pakke (modell, batteri,
lader, kabler, sender) med forklaring når noe ikke passer. Konseptprototype –
ikke koblet til Elefuns systemer, ingen ekte ordre.

## Kommandoer
- Installer: corepack pnpm install
- Utvikling: corepack pnpm dev   (http://localhost:5173)
- Tester: node --test tests/
- Typesjekk: node node_modules/typescript/bin/tsc --noEmit
- Build: npm run build

## Arbeidsflyt
1. Les relevante filer i docs/context/ og spesifikasjonen i specs/.
2. Bruk Plan Mode før endringer i mer enn én fil.
3. Still spørsmål ved uklare krav. Stopp og rapporter konflikt mellom spec og constitution.
4. Implementer én oppgave fra tasks.md om gangen. Ikke start neste.
5. Kjør tester, typesjekk og build. Sammenhold med akseptansekriteriene.

## Absolutte regler
- Følg docs/governance/constitution.md.
- Aldri avgjør kompatibilitet i kode utenfor lib/compatibility.ts.
- Aldri endre data/model-accessories.json uten kildelenke.
- Aldri oppfinn pris, lager, produkt-ID, anmeldelser eller kampanjer.
- Kundetekst på norsk bokmål.

## Sannhetskilder
- Domene: docs/context/domain-glossary.md
- Regler: docs/context/compatibility-rules.md
- Risiko: docs/context/risks-and-guardrails.md
- Design: DESIGN.md · Produkt: PRODUCT.md
- Godkjente features: specs/
```

**`.claude/rules/`** (valgfritt, kort): `product-data.md` (kildekrav for data), `testing.md` (positive/negative/ukjente tester).

Skills og subagenter (veikartets punkt 8–9) utsettes. Vi tar dem inn bare hvis vi ser at samme bestilling gjentas mange ganger – da lager vi `/specify` og `/implement-task`. Én skrivebeskyttet `compatibility-reviewer`-agent er den mest nyttige å starte med hvis vi får tid.

**Ferdig når:** `CLAUDE.md` og constitution er godkjent i PR, og en ny Claude-økt kan svare riktig på «hvordan kjører jeg testene, og hva betyr UNKNOWN?».

### Fase 3 – Spesifikasjoner

Features nummereres og får egen mappe. Spec beskriver *hva og hvorfor*, ikke teknologi.

| ID | Feature | Grunnlag | Type |
| --- | --- | --- | --- |
| **000** | Dagens pakkebygger (bakoverspec) | Prototypen | Dokumenterer det som finnes, med akseptansekriterier som dagens tester dekker – og markerer hull |
| **001** | Enhetlig kompatibilitetsvurdering med evidens | Avvik 1.3.2–1.3.3, constitution 3–4 | Ny – én evaluator for alle kategorier, fem statusnivåer, kilde per kobling |
| **002** | Ferdigpakker etter formål, ikke bare pris | Avvik 1.3.4, krav 3 og 5, Elefuns «Go big/Go small» | Ny – Budsjett/Medium/Premium per modell eller formål, med regler for balanse mellom komponenter |
| **003** | Forklaring og veiledning for nybegynnere | Tiril, Martin, krav 6–7, intervjufunn om fagbegreper | Ny – forklar begreper i kontekst, vis hva som ikke følger med, informasjon om droneregler |
| **004** | «Jeg har allerede…» – pakke rundt eksisterende utstyr | Ragnar, kontaktfeilen (XT60/XT90), krav 4–5 | Kandidat – vurderes etter 001–003 |

Utenfor scope i denne fasen: chatbot/LLM-dialog, sanntidspris og lager, kobling mot Elefuns produksjonsdatabase, reell betaling, hele katalogen.

**Mal for `spec.md`:** mål og avgrensning · aktører og brukerhistorier · hovedflyt og alternative flyter · funksjonelle krav (FR-nn) · ikke-funksjonelle krav · forretningsregler · edge cases · akseptansekriterier (AC-nn, Gitt/Når/Så) · suksesskriterier · eksplisitt utenfor scope. Avklaringer logges i `clarification-log.md`.

**Claude-økt for spec:**

```
Vi skal spesifisere feature 001-enhetlig-kompatibilitet.
Les constitution og docs/context/. Opprett specs/001-.../spec.md etter malen.
Spesifikasjonen skal ikke velge teknologi.
Før du ferdigstiller: finn tvetydige eller ikke-testbare formuleringer,
still oss prioriterte avklaringsspørsmål, og logg beslutningene i clarification-log.md.
Ikke skriv kode.
```

**Ferdig når:** Spec er godkjent i PR, og hvert akseptansekriterium kan testes.

### Fase 4 – Plan Mode

Per feature: Claude i Plan Mode leser `CLAUDE.md`, constitution, relevant kontekst, spec og eksisterende kode, og lager `plan.md` med komponenter, dataflyt, datamodellendringer (f.eks. evidensfelt i `model-accessories.json`), berørte filer, teststrategi, risiko og åpne beslutninger. Planen lagres i repoet, ikke bare i samtalen. Vesentlige valg skrives som ADR i `docs/architecture/decisions/`.

### Fase 5 – Oppgaver og implementasjon

`tasks.md` bryter planen i små, sekvensielle oppgaver. Hver oppgave har: formål · hvilke FR/AC den dekker · avhengigheter · forventede filer · tester · kontrollkommandoer · Definition of Done.

Bestilling til Claude for hver oppgave:

```
Implementer bare T-03 fra specs/001-.../tasks.md.
Før du redigerer: bekreft hvilke krav og akseptansekriterier oppgaven dekker,
undersøk eksisterende kode, oppgi hvilke filer du vil endre, og stopp hvis
plan og krav er motstridende. Implementer kode og tester, kjør alle kontroller,
og sammenhold resultatet med Definition of Done. Ikke start neste oppgave.
```

Den som kjørte økten forklarer endringen for gruppa i PR-en før den godkjennes.

### Fase 6 – Verifisering og brukertest

**Automatisk**

- **Golden dataset** (`evals/golden-packages.json`): 20–30 håndkontrollerte kombinasjoner modell + batteri + lader + sender med forventet status og forventet pakke. Skal inneholde kontaktfeil, feil celleantall, manglende lader, ukjent radio, PNP/BNF-fly som trenger sender, og Miss Illinois (2 × 4S).
- Test at ingen `UNKNOWN`/`INCOMPATIBLE` noen gang vises som «passer», og at pakker med manglende obligatorisk tilbehør ikke kan legges i handlevogn.
- CI kjører alt på hver PR.

**Brukertest** (observasjon, som planlagt i oppgave 3 §2.4)

- 5–6 deltakere med spredning i erfaring – oppgave 3 påpekte at erfarne var overrepresentert.
- Oppgaver: bygg en komplett pakke til en gitt modell innen et budsjett; finn ut hvorfor et batteri ikke passer; velg mellom tre ferdigpakker.
- Mål: fullføringsgrad, tid til komplett pakke, feil i handlevognen, om deltakeren kan forklare *hvorfor* pakken passer, opplevd tillit.
- Samme samtykkeskjema og anonymisering som i oppgave 3.

**`verification.md` per feature:** tester kjørt og resultat · AC oppfylt/ikke oppfylt · Claude-forslag forkastet eller rettet, og hvorfor · kjente svakheter · hva som krever Elefuns faglige vurdering.

---

## 4. Målstruktur for repoet

```
CLAUDE.md
.claude/
  rules/                      (valgfritt)
.github/
  workflows/ci.yml
  pull_request_template.md
docs/
  baseline.md
  context/                    (fase 1)
  governance/constitution.md  (fase 2)
  architecture/decisions/     (ADR-er)
  reports/                    (oppgave 3 og 4 som markdown)
  research/elefun-sources.md  (finnes)
specs/
  000-dagens-pakkebygger/
  001-enhetlig-kompatibilitet/
    spec.md  clarification-log.md  plan.md  tasks.md  verification.md
  002-ferdigpakker-etter-formal/
  003-nybegynnerveiledning/
evals/golden-packages.json
app/ components/ lib/ data/ tests/   (finnes)
```

---

## 5. Åpne spørsmål til Elefun (Roger)

1. Hvilken kilde er fasit når produsentens anbefaling og Elefuns «Anbefalt tilbehør» er uenige?
2. Kan vi få et avgrenset produktuttrekk (f.eks. én kategori) med tekniske felt, i stedet for å skrape nettsiden?
3. Hvilken kategori bør prioriteres – biler (størst i prototypen) eller droner (flest nybegynnerproblemer i funnene)?
4. Er 15 % pakkerabatt realistisk som forslag, eller bør vi vise rabatt uten tall?
5. Har dere eksempler på returer eller kundeservicesaker om feil batteri/lader/kontakt (anonymisert)?
6. Kan dere formidle 3–5 kunder til brukertest, gjerne nybegynnere?
7. Bekreft FMS FCX10 Range Rover RS-eksempelet: hvilket batteri, hvilken lader og hvilke kabler er riktig?

---

## 6. Rekkefølge og milepæler

Datoer fylles inn når innleveringsfristen for prototypefasen er kjent.

| # | Milepæl | Avhenger av | Frist |
| --- | --- | --- | --- |
| M0 | Baseline, ADR-001, formatering og CI på plass | – | |
| M1 | `docs/context/` godkjent | M0 | |
| M2 | `CLAUDE.md` + constitution godkjent | M1 | |
| M3 | Spec 000 og 001 godkjent | M2 | |
| M4 | 001 implementert og verifisert mot golden dataset | M3 | |
| M5 | Spec + implementasjon 002 og 003 | M4 | |
| M6 | Brukertest gjennomført og oppsummert | M5 | |
| M7 | Rapport: prosess, sammenligning av før/etter, refleksjon over Claude-bruk | M6 | |

**Forslag til ansvar** (justeres i gruppa):

| Område | Ansvarlig |
| --- | --- |
| Context Development, narrativer, blueprint | |
| CLAUDE.md, constitution, spec-maler | |
| Kompatibilitetsdata, evidens, golden dataset | |
| UI og ferdigpakker (002, 003) | |
| CI, repo-oppsett, ADR-er | |
| Brukertest og verifikasjonsnotater | |

---

## 7. Neste konkrete steg

1. Gruppa leser denne planen og kommenterer i en PR (`docs/plan.md`).
2. Fase 0 startes: alle kjører prototypen lokalt, vi tagger `v0-prototype` og skriver baseline.
3. Spørsmålene i §5 sendes til Roger.
4. Første Claude-økt: Context Development-prompten i fase 1.
