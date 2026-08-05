# Defaults-first guardrails

These guardrails apply to **every output** — wireframes, mockups, widgets, prototypes,
AND production code. There is no "wireframe mode" where arbitrary styling is acceptable.
Whether you are generating a quick visual preview or a finished page, the Tesseract defaults
govern how it looks. This is non-negotiable.

## The rule

> Every visual output — wireframe, mockup, widget, or production code — must use
> Tesseract's default component props and tokens for all foundational styling:
> colour, font family, font size, font weight, corner radius, and spacing.
>
> Structure and content come from the brief or wireframe. Styling comes from the system.

## Why this matters

When a designer or AI generates a wireframe with arbitrary colours, fonts, or radii, it
creates a false reference. Downstream developers or AI agents then try to match that
wireframe's styling instead of using the design system. The fix: **even wireframes look
like Tesseract**. A wireframe built with the right defaults is already 90% production-ready.

## Foundational defaults — apply always

### Colour
- Use each component's **default tone** (neutral) unless the domain explicitly calls for
  a semantic tone (success for completed, warning for overdue, error for critical).
- Never use arbitrary fills. Every colour is a `--tesseract-*` token.
- If the output is a black-and-white wireframe, use `--tesseract-slate-*` ramp values
  (slate-0 for backgrounds, slate-100 for cards, slate-200 for borders, slate-600 for
  secondary text, slate-900 for primary text) — not random greys.
- SectionCard: default tone is `neutral`; only set a tone when the content is semantically
  coloured (e.g. a vitals section = `success`, alerts = `error`).
- Buttons: default variant is `solid` + `primary` tone. Secondary actions = `outline`.
- Chips/Badges: use the status→tone mapping from `product-and-domain.md`.

### Typography
- **Font family**: `--tesseract-font-body` (Inter) for everything; `--tesseract-font-heading`
  (Mulish) only for the main page heading.
- **Font size**: body text = `--tesseract-text-body-sm` (14px); meta/badges = 12px;
  card titles = 14px/600.
- **Font weight**: `--tesseract-weight-medium` (500) for labels, `--tesseract-weight-semibold`
  (600) for titles, `--tesseract-weight-bold` (700) for emphasis.
- These apply even in wireframe/preview mode. Never use a different type scale.

### Corner radius
- Cards/SectionCard: `--tesseract-radius-14` (14px).
- Chips/Badges: `--tesseract-radius-10` (10px).
- Buttons: `--tesseract-radius-12` (12px).
- Avatars: `--tesseract-radius-full`.
- Inputs: `--tesseract-radius-10` (10px).
- Use the token, always. No eyeballing, no approximating.

### Spacing
- Card/content padding: **18px** default.
- Section gaps: **24px** between sections, **16px** between fields.
- All values from the `--tesseract-space-*` scale.

### Sizing
- Use each component's **default size** prop. The default is designed for production density.
- Touch targets: minimum 44px (36px in dense tables).

### Elevation & borders
- Use SectionCard's default `bordered` + default `intensity` (6).
- Dividers between bands: let SectionCard handle them (the `divided` data attribute).

## Component prop defaults — always start here

When placing a component, **do not pass any prop that isn't strictly necessary for the
content**. Let the component's built-in defaults handle the rest:

| Component | Let these default | Only override when |
|-----------|-------------------|--------------------|
| `Button` | `variant="solid"`, `tone="primary"`, `size="md"` | Secondary CTA (→ `outline`), destructive (→ `tone="error"`), compact row (→ `size="sm"`) |
| `SectionCard` | `tone="neutral"`, `intensity={6}`, `iconBg="soft"`, `bordered` | Semantic section (→ set tone), intensity tuning (rare) |
| `InputBox` | `size="md"`, no tone | Never change the size to match a wireframe |
| `DataTable` | default density, default column widths | Only set `compact` for known dense contexts (RxPad, billing line items) |
| `Chip` | `variant="soft"`, tone from status mapping | Never pick a chip colour arbitrarily |
| `Badge` | `variant="soft"`, tone from status mapping | Same |
| `Avatar` | `size="md"` | Only `size="sm"` in table rows; `size="lg"` in profile headers |
| `Dropdown` | `size="md"` | Never |
| `Toggle` | `size="md"` | Never |
| `Tabs` | default styling | Never change tab styling arbitrarily |

## What to extract from a brief or wireframe

### Extract
- Which **sections** exist (e.g. Symptoms, Examinations, Diagnosis, Medication)
- The **hierarchy** (header → body → footer; sidebar → main)
- Which **components** fill each region (a table, a form, cards, a list)
- The **data/fields** shown (columns, labels, placeholder text)
- The **actions** available (buttons, menus, CTAs)
- The **navigation** structure (sidebar items, tabs)

### Always apply from the system (never from external input)
- Colours, gradients, fills, backgrounds → from tokens
- Font sizes, weights, families → from the type scale
- Border radii, shadows, elevation → from radius/elevation tokens
- Spacing values, padding, margins → from the spacing scale
- Icon styles → `linear` default; `bulk` for active/selected only
- Component sizes, variants, tones → from default props

## Reference screenshots

Real product screenshots live in `references/screenshots/`. When composing any output —
wireframe or production — **read the relevant screenshot** to see how the actual product
handles that page type. The screenshot is the visual contract.

Naming convention: `<page>-<variant>.png` — e.g. `appointments-list.png`, `rxpad-detail.png`.

## Pre-delivery check (add to the existing checklist)

- [ ] Every component uses its default variant/tone/size unless semantically justified.
- [ ] Colours come from `--tesseract-*` tokens + status→tone mapping.
- [ ] Font family/size/weight are from the type scale tokens.
- [ ] Corner radii are from `--tesseract-radius-*` tokens.
- [ ] Spacing is from `--tesseract-space-*` tokens.
- [ ] Output resembles the product reference screenshots in look and feel.
- [ ] This applies to wireframes and previews too, not just production code.
