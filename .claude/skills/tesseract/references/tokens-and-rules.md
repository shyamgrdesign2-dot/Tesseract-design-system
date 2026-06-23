# Tokens & Hard Rules

Final compliance pass. A page is only "in our world" if it obeys all of this.

---

## Non-negotiable rules

1. **Tokens only — never raw values.** Every colour, spacing, radius, and type value comes from a `--tesseract-*` CSS variable. No hex, no `rgb()`, no magic px for colour. `color: var(--tesseract-fg-primary)`, not `color: #1e1e2d`.
2. **No odd numbers in any dimension.** Width, height, padding, margin, gap, radius, font-size, line-height — all even. Use 4 / 8 / 10 / 12 / 14 / 16 / 18 / 20 / 24 / 28 / 32… Only exception: 1px hairline borders.
3. **Never edit `src/tesseract-tokens.css`.** It is the source of truth. To re-theme, use `TesseractThemeProvider` overrides — never mutate the token file.
4. **Naming.** Tokens are `--tesseract-*`; package is `tesseract-ui`; theme provider is `TesseractThemeProvider`. The **icon components keep their `TP*` names** — `TPIcon`, `TPMedicalIcon`, `TPLibraryIcon` (they wrap the shared icon library). Don't introduce a third prefix or rename the icon components.
5. **Barrel imports only.** `import { X } from "@/src/components/atoms"` / `"@/src/components/molecules"`. No deep relative paths into component internals from product code.
6. **CSS Modules + `data-*` styling.** Component styling is `Name.module.scss`; variant/state is expressed via `data-*` attributes and targeted in SCSS (`[data-variant="solid"]`), not ad-hoc class soup.
7. **Tesseract components only.** No Ant Design, MUI, Tailwind, or raw Radix in generated product pages. Compose missing primitives from existing atoms.

---

## Token families (reference — read names from `src/tesseract-tokens.css`, don't redefine)

**Colour ramps** (steps 50–900): `--tesseract-blue-*` (primary brand), `--tesseract-violet-*` (AI accent), `--tesseract-amber-*`, `--tesseract-success-*`, `--tesseract-warning-*`, `--tesseract-error-*`, and neutral `--tesseract-slate-0 … --tesseract-slate-900`.

**Semantic aliases** (prefer these in layout code over raw ramps):
- Foreground: `--tesseract-fg-heading`, `--tesseract-fg-primary`, `--tesseract-fg-secondary`, `--tesseract-fg-tertiary`, `--tesseract-fg-placeholder`, `--tesseract-fg-disabled`, `--tesseract-fg-inverse`, `--tesseract-fg-link`.
- Background: `--tesseract-bg-page`, `--tesseract-bg-page-subtle`, `--tesseract-bg-surface`, `--tesseract-bg-surface-hover`, `--tesseract-bg-surface-active`, `--tesseract-bg-selected`, `--tesseract-bg-inverse`.
- Soft fills: `--tesseract-bg-brand-soft`, `--tesseract-bg-success-soft`, `--tesseract-bg-warning-soft`, `--tesseract-bg-error-soft`.
- Borders: `--tesseract-border-soft`, `--tesseract-border-neutral`, `--tesseract-border-strong`, `--tesseract-border-focus`.

**Spacing** (4pt base): `--tesseract-space-0-5` (2px), `--tesseract-space-1` (4px), `--tesseract-space-2` (8px), `--tesseract-space-2-5` (10px), `--tesseract-space-3` (12px), `--tesseract-space-4` (16px) … Compose layout gaps/padding from these.

**Radius:** `--tesseract-radius-8`, `--tesseract-radius-10` (chips/badges default), `--tesseract-radius-12` (cards/pills default), `--tesseract-radius-full`. (For Sidebar/SecondarySidebar selected pill + icon chip, default is 12px.)

**Typography:** `--tesseract-font-heading` (Mulish), `--tesseract-font-body` (Inter). Weights 400/500/600/700/800. Type scale tokens `--tesseract-text-display-*`, `--tesseract-text-h1…h6`, `--tesseract-text-body-xl/lg/base/sm/xs`, caption sizes. Weight tokens `--tesseract-weight-medium/semibold/bold`.

**Type usage baseline:** 14px/400 body & table cells & CTA labels; 14px/600 card titles; 12px meta/badges; 10px/600 uppercase trackers only.

---

## Theming

Wrap the app once in `TesseractThemeProvider` to override ramps, component tokens (button/input/dropdown/badge radius), or set `colorScheme="light|dark|system"`. Hooks: `useTheme()`, `useBreakpoint()` ("mobile"|"tablet"|"desktop"), `useComponentTokens("button")`. Never theme by editing tokens or hardcoding values in components.

---

## Icons

CDN-served (Iconsax). `TPIcon` (curated) / `TPLibraryIcon` (any name) / `TPMedicalIcon` (medical). Variants: `linear` (default), `bulk` (active/selected), `bold`. Recolour via `color={var(--tesseract-…)}`. Active nav/tab icons use `bulk`; everything else `linear`. Example names: `search`, `filter-2`, `calendar-1`, `profile`, `clipboard`, `printer`, `add`, `trash`, `eye`, `chevron-down`.

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
