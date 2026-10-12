---
name: Elefun
description: Elefun's blue shell and black-and-yellow stripe, rebuilt as a modern spec-first hobby store with a package builder.
colors:
  elefun-blue: "#116ba0"
  blue-deep: "#0b5383"
  blue-ink: "#083d61"
  blue-wash: "#e9f2f8"
  elefun-yellow: "#f8bd1e"
  yellow-hover: "#ffca3a"
  yellow-deep: "#e69500"
  stripe-black: "#0f1418"
  buy-green: "#157a27"
  buy-green-hover: "#10651f"
  ink: "#16232d"
  ink-2: "#4a5c6a"
  ink-3: "#6b7c89"
  line: "#dbe3e9"
  line-strong: "#c3d2dc"
  well: "#f2f6f9"
  well-2: "#e6eef3"
  paper: "#ffffff"
  ok-bg: "#ebf6ed"
  ok-ink: "#1d5e2a"
  warn-bg: "#fff5dc"
  warn-line: "#efd38c"
  warn-ink: "#6b4a00"
  destructive: "#c42b22"
typography:
  display:
    fontFamily: "Play, Signika, sans-serif"
    fontSize: "clamp(42px, 5.6vw, 78px)"
    fontWeight: 700
    lineHeight: 0.98
    letterSpacing: "-0.025em"
  headline:
    fontFamily: "Play, Signika, sans-serif"
    fontSize: "clamp(32px, 3.6vw, 46px)"
    fontWeight: 700
    lineHeight: 1.05
    letterSpacing: "-0.01em"
  title:
    fontFamily: "Play, Signika, sans-serif"
    fontSize: "26px"
    fontWeight: 700
    lineHeight: 1.15
    letterSpacing: "-0.01em"
  card-title:
    fontFamily: "Signika, Arial, Helvetica, sans-serif"
    fontSize: "15.5px"
    fontWeight: 600
    lineHeight: 1.35
  body:
    fontFamily: "Signika, Arial, Helvetica, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.5
  price:
    fontFamily: "Play, Signika, sans-serif"
    fontWeight: 700
    letterSpacing: "-0.01em"
    fontFeature: "tnum"
  spec-label:
    fontFamily: "Play, sans-serif"
    fontSize: "12.5px"
    fontWeight: 700
    lineHeight: 1.3
    letterSpacing: "0.01em"
    fontFeature: "tnum"
rounded:
  focus: "4px"
  rail: "6px"
  control-sm: "7px"
  control: "8px"
  field: "10px"
  card: "12px"
  panel: "14px"
  stage: "16px"
  pill: "99px"
spacing:
  grid-gap: "18px"
  gutter: "24px"
  gutter-mobile: "16px"
  split: "48px"
  section: "64px"
  container: "1320px"
components:
  button-build:
    backgroundColor: "{colors.elefun-yellow}"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    padding: "13px 20px"
  button-build-hover:
    backgroundColor: "{colors.yellow-hover}"
  button-build-compact:
    backgroundColor: "{colors.elefun-yellow}"
    textColor: "{colors.ink}"
    rounded: "{rounded.control-sm}"
    padding: "8px 12px"
  button-buy:
    backgroundColor: "{colors.buy-green}"
    textColor: "{colors.paper}"
    rounded: "{rounded.control}"
    height: "52px"
  button-buy-hover:
    backgroundColor: "{colors.buy-green-hover}"
  button-buy-disabled:
    backgroundColor: "{colors.well-2}"
    textColor: "{colors.ink-3}"
  button-secondary:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.blue-deep}"
    rounded: "{rounded.control}"
    padding: "10px 16px"
  button-secondary-hover:
    backgroundColor: "{colors.blue-wash}"
  spec-rail:
    backgroundColor: "{colors.stripe-black}"
    textColor: "{colors.paper}"
    typography: "{typography.spec-label}"
    padding: "7px 12px"
  category-bar:
    backgroundColor: "{colors.stripe-black}"
    textColor: "{colors.paper}"
    padding: "13px 14px 12px"
  product-card:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.card}"
  field:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    height: "42px"
  chip:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "6px 12px"
  chip-selected:
    backgroundColor: "{colors.elefun-blue}"
    textColor: "{colors.paper}"
  segmented-selected:
    backgroundColor: "{colors.elefun-blue}"
    textColor: "{colors.paper}"
    rounded: "{rounded.field}"
---

# Design System: Elefun

## Overview

**Creative North Star: "The Spec Stripe"**

Elefun's own shop, made modern. The blue masthead, the black stripe with its yellow edge and the green buy button are the store's inherited identity, kept at full strength; what is new is that the stripe now does work. It runs under the masthead as the category bar, under every product image as the spec rail, across the bottom of the hero as the three steps, under the dialog header and over the footer. Wherever it appears it carries something real: navigation, or the specs a hobby buyer actually reads (scale, drive, cells, mAh, connector, watt).

The rest of the page stays quiet so the stripe and the products can speak. Ground is white; product photography sits on a cool blue-grey well and multiplies into it. Neutrals lean toward the brand blue rather than grey. Density is retail-normal: a 1320px container, 18px card gaps, 12px card radii, borders at 1px. Headings and every number are Play; running text is Signika. Depth is soft and blue-shadowed, never hard-edged.

**Key Characteristics:**
- Full-bleed Elefun blue masthead and hero; white page ground; cool wells for imagery.
- The black band with a 3px yellow top edge as the one recurring signature, always carrying content.
- Yellow fills primary actions with near-black text; green is spent only on buying.
- Play for headings, prices and specs with tabular numerals; Signika for text.
- Soft, negative-spread blue shadows; radii 6–16px; pills only for chips, counts and status.

## Colors

The palette is Elefun's pinned brand trio (blue, yellow, black stripe) plus a reserved buying green, set on neutrals tinted toward the blue.

### Primary
- **Elefun Blue** (elefun-blue): the masthead, the hero field, sheet headers, links, selected chips and segmented tabs, checkbox accent and focus ring on fields. Also the `theme-color`.
- **Deep Blue** (blue-deep): link hover and secondary-button text. **Blue Ink** (blue-ink): the utility bar above the masthead and the tint inside shadows. **Blue Wash** (blue-wash): secondary-button hover and accent surfaces.

### Secondary
- **Elefun Yellow** (elefun-yellow): primary "Bygg pakke" actions, the search button, the 3px stripe edge, step numbers, the cart count, active category underline and text selection. **Yellow Hover** (yellow-hover) lightens on hover. **Deep Yellow** (yellow-deep) is the global `:focus-visible` outline color, chosen to read on both blue and white.

### Tertiary
- **Buy Green** (buy-green), hover **buy-green-hover**: "Legg i handlevogn" and "Kjøp" only.

### Neutral
- **Stripe Black** (stripe-black): the category bar, spec rails, hero steps, hero tag and footer.
- **Ink / Ink 2 / Ink 3** (ink, ink-2, ink-3): body text, secondary copy, meta and placeholders.
- **Line / Line Strong** (line, line-strong): 1px card and row borders; field, chip and secondary-button borders.
- **Well / Well 2** (well, well-2): image wells, notes, the package summary, hover fills; well-2 is the hero image stage and disabled buy fill.
- **Status pairs** (ok-bg/ok-ink, warn-bg/warn-line/warn-ink): "fits" and "must be confirmed" notes and status pills. **Destructive** (destructive) is a shadcn token for errors.

### Named Rules
**The Green Is Money Rule.** Green appears only on actions that put something in the cart. Building, choosing and navigating are yellow or blue.

**The Tinted Neutral Rule.** No pure greys. Every neutral, border and shadow leans toward the brand blue (shadows are `rgb(8 61 97 / …)` or `rgb(4 30 50 / …)`, never black).

**The Yellow Carries Dark Text Rule.** Yellow fills always take ink text, never white.

## Typography

**Display Font:** Play (with Signika, sans-serif)
**Body Font:** Signika (with Arial, Helvetica, sans-serif)

**Character:** Play is Elefun's squared, technical display face; it suits model names, prices and spec strings. Signika is a soft, readable humanist sans for everything a customer reads in sentences. Both load from Google Fonts (Play 400/700, Signika 400/600/700).

### Hierarchy
- **Display** (Play 700, clamp(42px, 5.6vw, 78px), 0.98, -0.025em): the hero H1 only; 44px on phones.
- **Headline** (Play 700, clamp(32px, 3.6vw, 46px), 1.05): page heads on category pages. Product names use clamp(28px, 3vw, 40px) at 1.1.
- **Title** (Play 700, 26px): section heads; 28px toolbar heads; 17–24px inside sheets, filters and footer columns.
- **Card title** (Signika 600, 15.5px, 1.35, two-line clamp): product names on cards, deliberately in the text face so the grid reads calmly.
- **Body** (Signika 400, 16px, 1.5; 15px under 640px): copy capped at 44–76ch; lead lines 17–19px in ink-2.
- **Price** (Play 700, tabular): 21px on cards, 42px on the product page, 32px in the package total.
- **Spec label** (Play 700, 12.5px, tabular, +0.01em): the spec rail; 15px in the large rail, 11.5px on phones. Never uppercased by CSS.

### Named Rules
**The Numbers Are Play Rule.** Every price, count, spec and step number is set in Play with tabular numerals.

**The No Kicker Rule.** No eyebrow labels above headings. A heading stands on its own; supporting text goes under it.

## Layout

A centered 1320px container with 24px gutters (16px under 900px) holds every band: utility bar, masthead, category bar, hero, content and footer. The masthead is a three-column grid (logo, search up to 680px, actions); under 900px it becomes logo and actions over a full-width search. The home hero is a 1.05fr / 0.95fr split with a 48px gap; its three-step black band is translated half its height below the blue so it straddles the edge, and stacks to one column on phones. Category pages put a 248px sticky filter panel beside the card grid (auto-fill, min 216px, 18px gap); the builder uses five columns stepping to 4, 3 and 2. Product pages split 1.1fr / 0.9fr with a sticky image well. Related sections sit 64px apart. On phones, card grids are always two columns at a 10px gap, and sheets become full-screen.

Breakpoints are 1240px, 1100px, 900px and 640px (see sidecar).

## Elevation & Depth

Surfaces are flat with 1px borders at rest; depth comes from soft, blue-tinted shadows with a negative spread and a downward offset, so they read as a lift rather than an outline.

### Shadow Vocabulary
- **Card lift** (`box-shadow: 0 12px 28px -16px rgb(8 61 97 / .38)`): product card hover, paired with a 3px rise.
- **Buy box** (`box-shadow: 0 10px 30px -22px rgb(8 61 97 / .45)`): the product page price panel at rest.
- **Masthead float** (`box-shadow: 0 8px 20px -10px rgb(4 30 50 / .55)`): the search field on blue.
- **Stage** (`box-shadow: 0 24px 50px -24px rgb(4 30 50 / .6)`): the hero image stage on blue.
- **Yellow action** (`box-shadow: 0 6px 14px -6px rgb(160 100 0 / .55)`): primary yellow buttons; tightens on press.
- **Pop** (`box-shadow: 0 30px 80px -24px rgb(8 30 50 / .55)`): sheets, over a blurred `rgb(6 22 36 / .6)` backdrop.

### Named Rules
**The Soft Offset Rule.** Shadows always blur and spread negative, tinted blue or amber. No hard, unblurred offset shadows.

## Shapes

Gently rounded throughout: 6px on rail feet, 7–8px on buttons and fields, 10px on segmented tabs, options and notes, 12px on cards and filter panels, 14px on the buy box and package summary, 16px on the hero stage, product image well and sheets. Pills (99px) are reserved for chips, counts and status; circles for step numbers and icon buttons.

**The Square Stripe Rule.** Wherever the black band sits under a 3px yellow top edge, the top corners stay square and only the corners opposite the stripe round (`0 0 8px 8px`, `0 0 6px 6px`). The stripe reads as a continuous edge, not a pill. This is a sanctioned brand exception: the detector rule `border-accent-on-rounded` is suppressed for `app/globals.css` in `.impeccable/config.json` for this reason.

## Components

### Buttons
- **Shape:** gently rounded (8px; 7px on compact).
- **Build (primary):** Elefun yellow with ink text, 700 weight, 13px 20px (hero 16px 26px at 18px; compact 8px 12px at 14px), amber soft shadow. The trailing arrow nudges 3px on hover (down on the hero CTA). Press shifts 1px down.
- **Buy:** buy green with white text; full variant is 52px tall and full-width in the buy box; disabled goes to well-2 with ink-3 text.
- **Secondary:** white with a line-strong border and deep-blue text; hover turns the border blue over blue wash.
- **Outline light:** on dark surfaces, a 40% white border that turns yellow with yellow text on hover.
- **Text links:** blue, 600 weight, underline offset 3px.

### Chips
- **Style:** pill, line-strong border, white, Play 700 14px (cell counts, connectors).
- **State:** hover border turns blue; pressed fills Elefun blue with white text.

### Cards / Containers
- **Product card:** white, 1px line border, 12px radius, clipped. 4:3 well-colored image area with the photo multiplied in; spec rail directly under the image; body 12px 14px 14px; name, then brand in blue under it, then a Play price and an action pinned to the foot. The whole card is one link target. Hover lifts 3px with the card shadow and scales the image 1.04.
- **Notes and summary:** well background, 1px line border, 12–14px radius.

### Inputs / Fields
- **Style:** 42px tall, white, line-strong border, 8px radius, ink-3 icon.
- **Focus:** border goes blue with a 3px `rgb(17 107 160 / .18)` halo. The masthead search instead takes a 3px yellow outline on blue.

### Navigation
- **Masthead:** blue field, logo, white 48px search with a yellow "Søk" button, icon-over-label actions with a yellow cart count ringed in blue.
- **Category bar:** stripe black with a 3px yellow top edge, Signika 600 15px links in near-white; hover adds a faint white wash; the current page gets a 3px yellow underline drawn as an inset shadow. Scrolls horizontally on narrow screens.
- **Breadcrumbs:** 14px, blue links, ink-3 chevrons.

### Spec Rail (signature)
A stripe-black band with a 3px yellow top edge carrying real specs in Play 700 with tabular numerals, separated by 1px 22%-white dividers. On cards it is a single non-wrapping line of up to three specs; the large variant (15px, 11px 16px, rounded `0 0 8px 8px`) sits under the product name; a compact rounded version heads the package summary and model overview. Its relatives: the hero tag on the stage image (name plus yellow price), the three hero steps with yellow numbered circles, and the sheet header's 3px yellow bottom edge.

### Sheets
Native dialogs, 16px radius, max 1080px (cart 720px), Pop shadow over a blurred dark-blue backdrop. Sticky blue header with a 3px yellow bottom edge and a round translucent close button. Entrance is the system's single motion: `sheet-in`, 0.4s, fade up 18px on `cubic-bezier(.16,1,.3,1)`.

### Option rows (builder)
Bordered 10px rows: icon, name with Play spec line, price, round check. Selected rows go blue-bordered over `#f2f8fc` with a filled blue check; blocked rows go to well with the reason in a rust note.

## Do's and Don'ts

### Do:
- **Do** put real specs or navigation in every black band with a yellow 3px top edge; keep its top corners square.
- **Do** use Elefun yellow with ink text for build and choose actions, and buy green only for adding to the cart.
- **Do** set prices, counts and specs in Play with tabular numerals.
- **Do** place product images on the well color with `mix-blend-mode: multiply` and `object-fit: contain`.
- **Do** tint shadows and neutrals toward the brand blue; keep shadows soft with negative spread.
- **Do** theme the small things: yellow selection, blue caret, 3px deep-yellow focus outline, blue-grey scrollbar on the well.
- **Do** keep motion to short state transitions (0.15–0.25s) on `cubic-bezier(.16,1,.3,1)`, the one sheet entrance, and honor reduced motion.

### Don't:
- **Don't** add eyebrow or kicker labels above headings.
- **Don't** use green for anything but buying, or white text on yellow.
- **Don't** use hard, unblurred offset shadows, gradient buttons or bevelled fields.
- **Don't** use the stripe as decoration with nothing in it.
- **Don't** introduce pure greys or radii outside 4–16px (pills and circles excepted).
