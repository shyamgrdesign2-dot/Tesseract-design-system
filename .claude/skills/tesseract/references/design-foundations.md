# Design Foundations (the general design-system layer)

The universal building blocks *beneath* the components. Read alongside `tokens-and-rules.md`
(token names: colour, spacing, type, a11y) and `design.md` (brand + voice). This file adds what
those don't spell out — **states, elevation, layering, density, spacing rhythm** — so anything
you compose feels like one system. Everything here resolves to `--tesseract-*` tokens; never a
raw value.

## Component states — every interactive element has these
| State | Treatment |
|---|---|
| **Default** | base surface + `--tesseract-fg-*` text |
| **Hover** | `--tesseract-bg-surface-hover`, `cursor: pointer`, 120–160ms transition |
| **Active / pressed** | `--tesseract-bg-surface-active` |
| **Focus (keyboard)** | 2px `--tesseract-border-focus` ring — **always visible**; never remove the outline |
| **Selected** | `--tesseract-bg-selected` + brand text/icon; nav/tab uses the **bulk** icon |
| **Disabled** | `--tesseract-fg-disabled` on a muted `--tesseract-bg-*`; no hover; `aria-disabled` |
| **Loading** | spinner / skeleton in place; disable the trigger; keep layout dimensions stable |
| **Error** | `--tesseract-border-focus`→error + `--tesseract-bg-error-soft`; message below the field |

Rule: never invent a one-off state colour — map it to a semantic token.

## Elevation — surfaces stack in levels
`0` flat page (`--tesseract-bg-page`) · `1` card/surface (subtle shadow) · `2` sticky toolbar/header ·
`3` popover / dropdown / tooltip · `4` modal / drawer (over a scrim). Higher level = more shadow
and closer to the user. **One elevation per surface** — don't nest a shadowed card inside a
shadowed card; use a divider or a subtle-bg (`--tesseract-bg-page-subtle`) instead.

## Layering — z-index scale (no magic numbers)
`base 0` · `sticky 10` · `dropdown/popover 20` · `drawer 30` · `dialog/modal 40` · `toast 50`.
Stay on these rungs so overlays never fight.

## Density — pick one per surface
- **Comfortable** (default): 40–44px controls, 16–18px cell/row padding.
- **Compact** (dense tables, RxPad, side rails): 32–36px rows, 8–12px padding. Never below 32px on desktop.
Keep density consistent within a surface; don't mix comfortable and compact rows in one table.

## Spacing rhythm — from the 4pt scale
- **Card / content padding: 18px** default (24px for roomier surfaces).
- Page content sits **~18px** below the top bar; the overlay card lifts over the hero on landing pages.
- Gap between form fields **16px**; between sections **24px**; toolbar ↔ content **16–18px**.
- Icon ↔ label **8px**; chip/badge internal **8–10px**.
- **Even numbers only** (tokens-and-rules rule 2); only 1px hairline borders are odd.

## Shape & motion (recap → tokens-and-rules)
Radius **12** for cards/pills, **10** for chips/badges, **full** for avatars. Micro-interactions
**120–180ms**, panels **220–320ms**, always `prefers-reduced-motion`-aware.

## Card shell (the SectionCard surface)
The standard card treatment — use `SectionCard` for cluster / overview / KPI / section cards
rather than hand-rolling a card:
- **Fill** — a *subtle*, tone-tinted **linear gradient** from the top-left, fading to surface.
  Strength is configurable via `intensity` (0–100, default 8 = subtle).
- **Border** — a **faded gradient ring**: softest on the sides, a touch stronger top & bottom
  (never a hard uniform line).
- **Radius** — 16px.
- **Dividers** — header-bottom and footer-top only, **very light**; bands are transparent so the
  one shell gradient shows through (no per-band colour).
- **Icon** — an optional square behind the header icon: `iconBg="none" | "soft" | "gradient"`.
- **Tones** — `neutral · primary · active · success · violet` tint the fill, edge, and icon square.
