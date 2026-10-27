# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

vinext (Next.js App Router API on Vite), React 19, Tailwind 4 with shadcn tokens, deployed as a Cloudflare Worker with optional D1. Catalog falls back to `data/catalog-snapshot.json`.

## Purpose

A student project (school course) that reimagines the Norwegian hobby web shop Elefun (elefun.no, "radiostyrt, hobby & fritid") as a modern storefront. The core feature is the Pakkebygger: pick an RC model and get a documented-compatible package of batteries, chargers and the adapter cables it needs, with clear reasons when something does not fit.

## Audience

- Primary viewers: teachers assessing the course project. Clarity, polish and honesty about what is demo data matter most.
- Represented users: Norwegian RC and hobby customers (cars, boats, drones, planes) who know their specs (cell count, mAh, connector types like XT60, EC5, IC3, Deans) and want to buy the right accessories the first time.

## Content and capabilities

- 20 real Elefun models (5 electric cars, 5 boats, 5 camera drones, 5 planes) plus batteries, chargers and adapter cables, with names, image URLs and source links from elefun.no.
- Model-specific compatibility rules in `data/model-accessories.json`, including pending or blocked combinations.
- Demo cart stored in localStorage (`elefun-packages-v2`). No real orders or payments.
- Store pages: the Pakkebygger at `/`, category listings, and product detail pages.

## Constraints and honesty

- Prices are snapshots, not live. Stock is not claimed. The pages must never imply a real purchase.
- The UI copy is Norwegian bokmål.
- No invented reviews, ratings, campaigns or delivery promises beyond Elefun's published USPs ("100% norsk nettbutikk", "Lynrask levering", "60 dager bytterett", customer reviews on Prisjakt).

## Brand commitments

- Keep Elefun's colors: blue `#116ba0`, yellow `#f8bd1e`, the black header stripe with its yellow edge, and green for buying. The result must still feel like Elefun, only more modern.
- Elefun logo assets live in `public/brand/`. Brand fonts are Play (display) and Signika (text).
