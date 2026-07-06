---
name: Tesseract
package: "@dhspl-tatvacare/tesseract-ui"
version: 1.0.5
description: >
  The design system for TatvaPractice (Tatva Care's clinic/EMR product). A
  zero-runtime-dependency React library (react/react-dom peers only) plus the
  design language it is built on. Everything is token-driven (--tesseract-* CSS
  variables); consume via the package + the /tesseract skill + the tesseract MCP.
audience: [ai-agents, designers, engineers]

# ── Machine-readable tokens (source of truth: src/tesseract-tokens.css) ──
# Never hardcode a value below — always reference the token, e.g.
# color: var(--tesseract-blue-500). These are listed so an agent knows the scale.
tokens:
  colors:
    # 10-step ramps (50…900). 500 is the base of each ramp.
    blue:    { role: "primary / brand action", base: "#4B4AD5" }   # var(--tesseract-blue-*)
    violet:  { role: "AI accent — never a primary CTA", base: "#A461D8" }
    amber:   { role: "secondary highlight", base: "#F5B832" }
    slate:   { role: "neutral chrome — text, surfaces, borders", zero: "#FFFFFF", nine: "#171725" }
    success: { role: "confirmed / valid", base: "#10B981" }
    warning: { role: "caution / pending", base: "#F59E0B" }
    error:   { role: "invalid / destructive", base: "#E11D48" }
    semantic:
      fg: [heading, primary, secondary, tertiary, placeholder, disabled, inverse, link]
      bg: [page, page-subtle, surface, surface-hover, surface-active, selected, inverse, brand-soft, success-soft, warning-soft, error-soft]
      border: [soft, neutral, strong, focus]
  typography:
    heading: "var(--tesseract-font-heading)  # Mulish"
    body:    "var(--tesseract-font-body)      # Inter"
    mono:    "var(--tesseract-font-mono)"
    weights: { regular: 400, medium: 500, semibold: 600, bold: 700, extrabold: 800 }
    sizes_px: { h1: 36, h2: 30, h3: 24, h4: 20, h5: 16, body-base: 16, body-sm: 14, caption: 12, micro: 10 }
  spacing_px: { "space-1": 4, "space-2": 8, "space-2-5": 10, "space-3": 12, "space-4": 16, "space-6": 24, "space-8": 32 }  # 4pt base, even only
  radius_px:  { sm: 6, md: 8, "10": 10, "12": 12, "16": 16, full: 9999 }  # chips/badges 10, cards/pills 12
  shadow:
    xs: "0 1px 2px 0 rgba(23,23,37,.04)"
    sm: "0 1px 3px 0 rgba(23,23,37,.08)"
    md: "0 4px 8px -2px rgba(23,23,37,.08)"
    lg: "0 12px 24px -4px rgba(23,23,37,.08)"
    xl: "0 20px 40px -8px rgba(23,23,37,.12)"
  motion: { micro_ms: "150–300", easing: "ease / ease-out", properties: "transform + opacity only", reduced_motion: required }
  breakpoints_px: { mobile: 0, tablet: 768, desktop: 1280 }
---

# Tesseract — Design System

The design language and component library for **TatvaPractice** (Tatva Care's
clinic/EMR product). This file is the single, human-and-agent readable reference:
the foundations, the rules, and how to actually build "in our world." For the exact
component APIs see [`docs/CATALOG.md`](docs/CATALOG.md); for setup see
[`STARTER.md`](STARTER.md).

> **One law above all: token-only.** Every colour, size, radius, and type value is a
> `--tesseract-*` CSS variable. No hex, no `rgb()`, no magic px. If it isn't a token,
> it isn't Tesseract.

---

## Overview

- **What it is** — `@dhspl-tatvacare/tesseract-ui`: a **zero-runtime-dependency**
  React library (only `react`/`react-dom` as peers). Hand-rolled (no Radix/MUI/AntD
  inside), token-driven, accessible by default, domain-agnostic.
- **Three layers** — **Atoms** (primitives: Button, Badge, Input, …), **Molecules**
  (composed regions: DataTable, Header, Sidebar, …), **Charts** (zero-dep analytics:
  Line/Bar/Donut/Sparkline/StatCard/Radar/Gauge). 48 public components.
- **How you use it** — the `/tesseract` **skill** (brand + page principles + intake),
  the **tesseract MCP** (ground-truth components/props/tokens/icons + `validate_usage`),
  and the **package** you import. See [STARTER.md](STARTER.md).

---

## Colours

Ten-step ramps (`50 … 900`); `500` is each ramp's base. **Meaning is fixed** — pick a
colour for what it *signals*, not decoration.

| Ramp | Token | Means |
|---|---|---|
| **Blue** (primary) | `var(--tesseract-blue-*)` | Brand + the **only** primary CTA fill. |
| **Violet** (AI) | `var(--tesseract-violet-*)` | AI / Dr.Agent / smart features. **Never** a primary CTA. |
| **Amber** | `var(--tesseract-amber-*)` | Secondary highlight, special marks. |
| **Slate** (neutral) | `var(--tesseract-slate-0 … -900)` | Text, surfaces, borders, chrome. |
| **Success / Warning / Error** | `var(--tesseract-{success,warning,error}-*)` | Confirmed / caution / invalid. |

**Prefer semantic aliases** over raw ramps in layout code — they carry intent and
survive theming:
- Text: `--tesseract-fg-{heading,primary,secondary,tertiary,placeholder,disabled,inverse,link}`
- Surfaces: `--tesseract-bg-{page,page-subtle,surface,surface-hover,surface-active,selected,inverse}`
- Soft fills: `--tesseract-bg-{brand,success,warning,error}-soft`
- Borders: `--tesseract-border-{soft,neutral,strong,focus}`

Contrast: body text ≥ 4.5:1; muted text never below `slate-500`; never dim text with
opacity. For alpha, use `color-mix(in srgb, var(--tesseract-…) N%, transparent)`.

---

## Typography

- **Headings** — **Mulish** (`var(--tesseract-font-heading)`).
- **Body / UI** — **Inter** (`var(--tesseract-font-body)`).
- **Mono** — `var(--tesseract-font-mono)`.
- **Weights** — `--tesseract-weight-{regular 400, medium 500, semibold 600, bold 700, extrabold 800}`.
- **Sizes** — `--tesseract-text-*` (h1 36 → micro 10). Baseline rhythm: **14/400** body,
  table cells, CTA labels; **14/600** card titles; **12** meta/badges; **10/600**
  uppercase trackers only. Body line-height 1.5–1.75.

---

## Spacing & layout

- **4pt base, even numbers only.** `--tesseract-space-*` → 4 / 8 / 10 / 12 / 14 / 16 /
  18 / 20 / 24 / 28 / 32 … The only odd value allowed anywhere is a **1px hairline**.
- **Breakpoints** — `mobile 0`, `tablet 768`, `desktop 1280` (via `useBreakpoint`).
- Compose gaps/padding from the scale; don't invent spacing.

---

## Elevation

Six shadow tokens, all a soft near-black (`rgba(23,23,37,·)`):
`--tesseract-shadow-{xs, sm, md, lg, xl, 2xl}`. Cards use `sm`/`md`; popovers/menus
`lg`; modals `xl`. Elevation communicates layering, not decoration — keep it restrained.

---

## Motion

- **150–300ms** for micro-interactions; `ease` / `ease-out`.
- Animate **`transform` + `opacity`** only (never width/height/top/left).
- **Honour `prefers-reduced-motion`** — freeze or remove animation.
- Decorative motion (`AnimatedGrid`, `HeroBanner` light rays) is reserved for
  hero/marketing surfaces, never dense clinical screens.

---

## Shape

Even, soft radii — `--tesseract-radius-*`. Chips/badges **10px**; cards / pills /
selected-rail **12px**; larger containers up to 16–24. Practical ceiling 42px. No odd
radii, no mixed radii within one element.

---

## Icons

**Iconsax**, CDN-served, via **`TPIcon`** / **`TPLibraryIcon`** (and **`TPMedicalIcon`**
for clinical glyphs). `linear` is the default style; `bulk` marks active/selected.
Clinical sections use medical icons in violet. Never inline arbitrary SVGs where a
library icon exists; icon-only controls need an `aria-label`. See [ICONS.md](docs/ICONS.md).

---

## Components

48 public components — see **[docs/CATALOG.md](docs/CATALOG.md)** for the full list and
per-component docs. Summary:

- **Atoms** — Button (the single button: text / icon-only / split), Badge, Chip, InputBox,
  Checkbox, Radio, Toggle, SegmentedControl, Slider, Avatar, Divider, Skeleton, Logo, icons, …
- **Molecules** — DataTable, Filter, Dropdown, Tabs, Accordion, Header, Sidebar,
  SecondarySidebar, Drawer, ConfirmDialog, Toast, Tooltip, DateRangePicker, SectionCard,
  HeroBanner, ClinicalTable, RxPadSection, …
- **Charts** (zero-dep) — LineChart, BarChart, DonutChart / PieChart, Sparkline, StatCard,
  RadarChart, GaugeChart. Plus formatters `formatCompact` / `formatIndian` / `formatNumber`.

**One component per job.** Tesseract ships *one* configurable component per role, not
many near-duplicates: Button is the only button, Dropdown the only select/menu, DataTable
the only list table, SectionCard the container shell. Configure via props — never fork.

---

## Principles & hard rules

A page is only "in our world" if it obeys all of these:

1. **Tokens only** — never a raw colour/size/radius. `var(--tesseract-*)`, always.
2. **No odd numbers** in any dimension (1px hairline excepted).
3. **Never edit `src/tesseract-tokens.css`** — it is the source of truth. Re-theme via
   `TesseractThemeProvider` overrides, never by mutating the token file.
4. **Naming** — tokens `--tesseract-*`; package `tesseract-ui`; provider
   `TesseractThemeProvider`. Icon components keep their `TP*` names.
5. **Barrel imports only** — from the package root (or `@/src/components/{atoms,molecules,charts}`
   inside this repo). No deep paths into internals.
6. **Tesseract components only** — no AntD/MUI/Tailwind/raw Radix in product pages.
   Compose missing primitives from existing atoms.
7. **Accessible by default** — visible focus rings, 44px touch targets, labels on inputs,
   colour never the only signal, `prefers-reduced-motion` respected.

---

## Voice & tone

Clinical-calm and trustworthy: **dense but scannable, low-drama, function over flourish.**
No red error banners mid-consultation. UI copy is imperative and concise ("Add
appointment", not "You can add an appointment here"); numerals as digits; sentence case
for labels, UPPERCASE only for small trackers.

---

## Do / Don't

| Do | Don't |
|---|---|
| Use `var(--tesseract-*)` tokens for every value | Hardcode hex / rgb / magic px |
| Use semantic aliases (`fg-primary`, `bg-surface`) | Reach for raw ramp steps in layout |
| Blue for primary CTAs, violet for AI | Use violet as a primary action fill |
| Even numbers; 10/12 radii | Odd dimensions or mixed radii |
| One configurable component per job | Fork near-duplicate components |
| Dim via `color-mix(… transparent)` | Dim text with `opacity` |
| Reserve decoration for hero surfaces | Animate dense clinical screens |

---

## Using Tesseract

- **Setup** — [STARTER.md](STARTER.md): install the `/tesseract` skill + tesseract MCP
  (`/plugin marketplace add DHSPL-Tatvacare/tesseract-design-system` → `/plugin install
  tesseract@tesseract`), then `npm install @dhspl-tatvacare/tesseract-ui`.
- **Agents** — start every screen with `/tesseract`; the MCP’s `list_components` /
  `get_component` / `get_tokens` / `get_icons` / `get_rules` / `validate_usage` keep you
  on real components and tokens. This `design.md` is the narrative companion to that data.
- **Import** —
  ```jsx
  import "@dhspl-tatvacare/tesseract-ui/styles.css"; // once, at app root
  import { Button, DataTable, LineChart } from "@dhspl-tatvacare/tesseract-ui";
  ```

Reference: [CATALOG](docs/CATALOG.md) · [USING-TESSERACT](docs/USING-TESSERACT.md) ·
[ICONS](docs/ICONS.md) · [CHANGELOG](CHANGELOG.md).
