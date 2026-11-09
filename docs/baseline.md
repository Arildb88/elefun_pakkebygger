# Baseline før feature 001–003

Målt 9. november 2026 på commit `c8addc1` pluss den uferdige menyendringen fra `pakkebygger-v2` (`lib/site-menu.ts` m.fl.).

| Kontroll | Resultat |
| --- | --- |
| `node --test tests/catalog.test.cjs tests/elefun-menu.test.cjs` | 22 av 23 bestått |
| `tsc --noEmit` | Ingen feil |
| ESLint på berørte filer | 1 feil fra før: `react-hooks/set-state-in-effect` i `app/configurator.tsx` |

Testen som feilet var `car package evaluation requires reviewed battery and radio combinations`. Den ventet `unknown` for bil `47308` uten valgt radio, men dataene sier at radioen følger med.

Ikke gjort ennå fra fase 0: skjermbilder, taggen `v0-prototype`, ADR-001, Prettier og CI.
