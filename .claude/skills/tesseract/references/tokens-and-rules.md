# Tokens & Hard Rules

Final compliance pass. A page is only "in our world" if it obeys all of this.

---

## Non-negotiable rules

1. **Tokens only — never raw values.** Every colour, spacing, radius, and type value comes from a `--tp-*` CSS variable. No hex, no `rgb()`, no magic px for colour. `color: var(--tp-fg-primary)`, not `color: #1e1e2d`.
2. **No odd numbers in any dimension.** Width, height, padding, margin, gap, radius, font-size, line-height — all even. Use 4 / 8 / 10 / 12 / 14 / 16 / 18 / 20 / 24 / 28 / 32… Only exception: 1px hairline borders.
3. **Never edit `src/tp-tokens.css`.** It is the source of truth. To re-theme, use `TPThemeProvider` overrides — never mutate the token file.
4. **Keep the `--tp-` / `tp` / `TP` prefix.** Do not rename tokens or components to any other prefix.
5. **Barrel imports only.** `import { X } from "@/src/components/atoms"` / `"@/src/components/molecules"`. No deep relative paths into component internals from product code.
6. **CSS Modules + `data-*` styling.** Component styling is `Name.module.scss`; variant/state is expressed via `data-*` attributes and targeted in SCSS (`[data-variant="solid"]`), not ad-hoc class soup.
7. **Tesseract components only.** No Ant Design, MUI, Tailwind, or raw Radix in generated product pages. Compose missing primitives from existing atoms.

---

## Token families (reference — read names from `src/tp-tokens.css`, don't redefine)

**Colour ramps** (steps 50–900): `--tp-blue-*` (primary brand), `--tp-violet-*` (AI accent), `--tp-amber-*`, `--tp-success-*`, `--tp-warning-*`, `--tp-error-*`, and neutral `--tp-slate-0 … --tp-slate-900`.

**Semantic aliases** (prefer these in layout code over raw ramps):
- Foreground: `--tp-fg-heading`, `--tp-fg-primary`, `--tp-fg-secondary`, `--tp-fg-tertiary`, `--tp-fg-placeholder`, `--tp-fg-disabled`, `--tp-fg-inverse`, `--tp-fg-link`.
- Background: `--tp-bg-page`, `--tp-bg-page-subtle`, `--tp-bg-surface`, `--tp-bg-surface-hover`, `--tp-bg-surface-active`, `--tp-bg-selected`, `--tp-bg-inverse`.
- Soft fills: `--tp-bg-brand-soft`, `--tp-bg-success-soft`, `--tp-bg-warning-soft`, `--tp-bg-error-soft`.
- Borders: `--tp-border-soft`, `--tp-border-neutral`, `--tp-border-strong`, `--tp-border-focus`.

**Spacing** (4pt base): `--tp-space-0-5` (2px), `--tp-space-1` (4px), `--tp-space-2` (8px), `--tp-space-2-5` (10px), `--tp-space-3` (12px), `--tp-space-4` (16px) … Compose layout gaps/padding from these.

**Radius:** `--tp-radius-8`, `--tp-radius-10` (chips/badges default), `--tp-radius-12` (cards/pills default), `--tp-radius-full`. (For Sidebar/SecondarySidebar selected pill + icon chip, default is 12px.)

**Typography:** `--tp-font-heading` (Mulish), `--tp-font-body` (Inter). Weights 400/500/600/700/800. Type scale tokens `--tp-text-display-*`, `--tp-text-h1…h6`, `--tp-text-body-xl/lg/base/sm/xs`, caption sizes. Weight tokens `--tp-weight-medium/semibold/bold`.

**Type usage baseline:** 14px/400 body & table cells & CTA labels; 14px/600 card titles; 12px meta/badges; 10px/600 uppercase trackers only.

---

## Theming

Wrap the app once in `TPThemeProvider` to override ramps, component tokens (button/input/dropdown/badge radius), or set `colorScheme="light|dark|system"`. Hooks: `useTheme()`, `useBreakpoint()` ("mobile"|"tablet"|"desktop"), `useComponentTokens("button")`. Never theme by editing tokens or hardcoding values in components.

---

## Icons

CDN-served (Iconsax). `TPIcon` (curated) / `TPLibraryIcon` (any name) / `TPMedicalIcon` (medical). Variants: `linear` (default), `bulk` (active/selected), `bold`. Recolour via `color={var(--tp-…)}`. Active nav/tab icons use `bulk`; everything else `linear`. Example names: `search`, `filter-2`, `calendar-1`, `profile`, `clipboard`, `printer`, `add`, `trash`, `eye`, `chevron-down`.

---

## Accessibility & motion (carry into every page)

- Touch targets ≥ 44px (36px min on desktop dense rows).
- Icon-only buttons need an accessible label (`ariaLabel` / `Tooltip`).
- Colour is never the only signal — pair status colour with text/icon.
- Respect `prefers-reduced-motion`. Micro-interactions 120–180ms; panel transitions ~220–320ms.
- Contrast ≥ 4.5:1 for text.
- During a live consultation, never show red error banners — fail silently with inline retry (`Toast`/inline message), per product rule.

---

## Pre-delivery checklist

- [ ] Imports come from `@/src/components/atoms` / `molecules` barrels only.
- [ ] Zero raw hex / rgb / non-token colours.
- [ ] Every dimension is even (no 9/11/13/15/17…).
- [ ] No Ant Design / MUI / Tailwind / raw Radix.
- [ ] Page matches a known archetype; shell present unless "content only".
- [ ] Domain labels/columns/statuses use `product-and-domain.md` vocabulary.
- [ ] Status badges follow the status→tone table.
- [ ] Loading + empty states handled.
- [ ] Icon-only controls labelled; keyboard reachable.
