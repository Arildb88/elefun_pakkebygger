# Elefun Pakkebygger

A school project that reimagines the Norwegian hobby shop [Elefun](https://www.elefun.no) as a modern storefront. Its main feature is the Pakkebygger ("package builder"): pick a radio-controlled model and get a complete package of parts that are documented to work together.

This is a prototype. Nothing can be bought, no orders reach Elefun, prices are snapshots, and stock is not live.

## The concept

### The problem

An RC model often needs more than what comes in the box: batteries, a charger, adapter cables, and sometimes a transmitter and receiver. Whether they fit depends on details like cell count, connector type (XT60, EC5, IC3, Deans) and physical size. Beginners can easily buy the wrong thing, and even experienced customers have to check several product pages.

### The idea

The customer starts with the model, and the shop works out the rest:

1. Choose a category: cars, boats, camera drones or planes.
2. Choose an experience level: beginner or experienced.
3. Take a ready-made package, or pick a model and adjust the parts.
4. See the total price, the right number of batteries, any adapter cables needed, and a plain explanation when something does not fit.

### Design principles

- **Only documented combinations count.** Compatibility comes from reviewed model-to-accessory links in `data/model-accessories.json`. It is never guessed from a product name, and matching voltage or plug type is not enough.
- **When in doubt, block it.** Unknown or unconfirmed combinations are flagged or refused, and a blocked package cannot be added to the cart.
- **Be honest about demo data.** The site never implies a real purchase and contains no invented reviews, campaigns or delivery promises.
- **It should still feel like Elefun.** The site keeps Elefun's blue `#116ba0`, yellow `#f8bd1e`, black header stripe and green buy buttons, with the Play and Signika fonts. Visitors see Norwegian bokmål throughout. See `DESIGN.md` for the full design system.

### Who it is for

- **Teachers assessing the course project** are the primary viewers.
- **Norwegian RC and hobby customers** are the users the site is designed around.

## Using the site

| Page | What it does |
| --- | --- |
| `/` | The Pakkebygger: categories, experience filter, ready-made packages and the demo cart |
| `/?modell=<id>#<type>` | Opens the builder directly on one model |
| `/kategori/<slug>` | Category listing. Slugs: `biler`, `baater`, `droner`, `fly`, `batterier-og-ladere`, `kontrollere` |
| `/kategori/batterier-og-ladere?type=battery&celler=3` | The same listing with filters set from the URL |
| `/produkt/<id>` | Product detail page |
| `/sortiment` | A limited selection of real Elefun products across its wider range |

**Ready-made packages** come in three tiers: Budsjett, Medium and Premium. They are the cheapest, middle and most expensive complete packages in the category.

**Customizing a package** lets the customer change the battery, add a second battery set, and swap the charger or transmitter.

**The 15 % package discount** applies to ready-made packages, and stays when the customer changes parts. A model opened from the product list gets no discount.

**The demo cart** is saved in the browser's localStorage under `elefun-packages-v2`.

## Getting started

You need Git and Node.js `>=22.13.0`.

```sh
git clone https://github.com/Arildb88/elefun_pakkebygger.git
cd elefun_pakkebygger
corepack pnpm install
corepack pnpm dev
```

Open the address printed in the terminal, usually <http://localhost:5173>. Stop the server with `Ctrl+C`.

Use `corepack pnpm`, not `npm install`, because the project pins its pnpm version in `package.json`.

### Commands

| Command | Purpose |
| --- | --- |
| `corepack pnpm dev` | Start the development server |
| `corepack pnpm build` | Build the Cloudflare Worker |
| `corepack pnpm start` | Preview the built Worker locally |
| `corepack pnpm lint` | Run ESLint |
| `corepack pnpm db:generate` | Generate a Drizzle migration after schema changes |
| `node --test tests/catalog.test.cjs tests/elefun-menu.test.cjs` | Run the tests |
| `node node_modules/typescript/bin/tsc --noEmit` | Type-check |

## How it works

**Stack:** vinext (the Next.js App Router API on Vite), React 19, Tailwind 4 with shadcn components, deployed as a Cloudflare Worker with an optional D1 database through Drizzle.

**Catalog:** 79 products, made up of 24 models (9 cars, 5 boats, 5 drones, 5 planes), 27 batteries, 9 chargers, 11 controllers and 8 cables and accessories. `lib/catalog.ts` syncs the snapshot into D1 once per catalog revision. If D1 is missing or fails, the site uses the snapshot directly, so it runs without a database.

**Compatibility:** `lib/compatibility.ts` checks a package against the rule for its model.

- Batteries and chargers are checked for every category, and each problem produces a reason shown to the customer.
- Car packages also get a full evaluation that includes the radio setup. It returns one of four statuses:

| Status | Meaning |
| --- | --- |
| `compatible` | Every part is documented for this car |
| `conditional` | Usable, with a caveat the customer sees, such as a radio that could not be confirmed |
| `incompatible` | A part is not documented for this car |
| `unknown` | The review data is missing, so the package is not confirmed |

### Where things are

| Path | Contents |
| --- | --- |
| `app/configurator.tsx` | The Pakkebygger interface |
| `app/kategori`, `app/produkt`, `app/sortiment` | Store pages |
| `components/` | Header, menu, product and package components (`ui/` holds shadcn) |
| `lib/compatibility.ts` | Compatibility rules and package lines |
| `lib/store.ts` | Categories, tiers, discount and display helpers |
| `lib/site-menu.ts` | Builds the category bar from the products in the catalog |
| `data/catalog-snapshot.json` | Products, prices and source URLs |
| `data/model-accessories.json` | Reviewed links between models and accessories |
| `data/product-reviews.json` | Real customer reviews from elefun.no |
| `data/elefun-shelves.json` | Products for the `/sortiment` pages |
| `data/elefun-menu.json` | Scraped copy of Elefun's full category tree, covered by tests but no longer used in the navigation |
| `docs/research/elefun-sources.md` | Sources and research notes |
| `DESIGN.md`, `PRODUCT.md` | Design system and product brief |

## Common tasks

### Add a model

1. Add the model and any new accessories to `data/catalog-snapshot.json`, with its source URL and an `experience:beginner` and/or `experience:experienced` tag.
2. Add a rule under the model's ID in `data/model-accessories.json`, listing only combinations you have checked.
3. Change `revision` in `lib/catalog.ts` so existing databases pick up the new catalog.
4. Update `tests/catalog.test.cjs`, which hard-codes the number of models per experience level, and run the tests.

### Refresh the scraped Elefun data

Run these in order, because the shelves depend on the menu:

```sh
node scripts/scrape-elefun-menu.mjs
node scripts/scrape-elefun-shelves.mjs
```

## Limitations

- The catalog is a snapshot in this repository, not a connection to Elefun's product database.
- Specifications must be verified against Elefun's product master before any real use.
- Package recommendations are rule-based and cover only the reviewed models. Extending them to Elefun's full range would need structured data and an approved Elefun integration.
- Experience levels are curated demo tags.
- The Bilbane and Solenergi categories are missing from `/sortiment`, because Elefun loads those products with JavaScript.
