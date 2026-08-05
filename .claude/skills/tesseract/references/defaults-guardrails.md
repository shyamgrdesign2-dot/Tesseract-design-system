# Defaults-first guardrails — wireframe → production translation

When translating a wireframe, mockup, sketch, or any rough visual into real Tesseract code,
the wireframe dictates **structure and layout only** — never styling. All visual properties
come from the component's **default props and tokens**. This is non-negotiable.

## The rule

> A wireframe tells you WHAT to build (which sections, which components, what data).
> It does NOT tell you HOW it looks. How it looks is decided by Tesseract's defaults.

## What "defaults" means, concretely

### Colour
- Use each component's **default tone** (neutral) unless the domain explicitly calls for
  a semantic tone (success for completed, warning for overdue, error for critical).
- Never pick a colour from a wireframe. Wireframes use arbitrary fills; production uses
  `--tesseract-*` tokens exclusively.
- SectionCard: default tone is `neutral`; only set a tone when the content is semantically
  coloured (e.g. a vitals section = `success`, alerts = `error`).
- Buttons: default variant is `solid` + `primary` tone. Secondary actions = `outline`.
  Don't invent button colours from wireframe fills.
- Chips/Badges: use the status→tone mapping from `product-and-domain.md`, not wireframe colours.

### Typography
- **Font family**: `--tesseract-font-body` (Inter) for everything; `--tesseract-font-heading`
  (Mulish) only for the main page heading.
- **Font size**: body text = `--tesseract-text-body-sm` (14px); meta/badges = 12px;
  card titles = 14px/600. Never match a wireframe's arbitrary font sizes.
- **Font weight**: `--tesseract-weight-medium` (500) for labels, `--tesseract-weight-semibold`
  (600) for titles, `--tesseract-weight-bold` (700) for emphasis. Never guess from wireframe
  boldness.

### Corner radius
- Cards/SectionCard: `--tesseract-radius-14` (14px) — the shell default.
- Chips/Badges: `--tesseract-radius-10` (10px).
- Buttons: `--tesseract-radius-12` (12px).
- Avatars: `--tesseract-radius-full`.
- Inputs: `--tesseract-radius-10` (10px).
- Never eyeball a radius from a wireframe. Use the token.

### Spacing
- Card/content padding: **18px** default.
- Section gaps: **24px** between sections, **16px** between fields.
- All values from the `--tesseract-space-*` scale. Never a raw pixel from a wireframe.

### Sizing
- Use each component's **default size** prop. Don't set `size="sm"` or `size="lg"` to match
  a wireframe's proportions — the default is designed for production density.
- Touch targets: minimum 44px (36px in dense tables). This overrides any wireframe that shows
  smaller controls.

### Elevation & borders
- Use SectionCard's default `bordered` + default `intensity` (6). Don't add `box-shadow` or
  custom borders to match wireframe depth cues.
- Dividers between bands: let SectionCard handle them (the `divided` data attribute). Don't
  add manual `<hr>` or border-bottom.

## Component prop defaults — always start here

When placing a component, **do not pass any prop that isn't strictly necessary for the
content**. Let the component's built-in defaults handle:

| Component | Let these default | Only override when |
|-----------|-------------------|--------------------|
| `Button` | `variant="solid"`, `tone="primary"`, `size="md"` | Secondary CTA (→ `outline`), destructive (→ `tone="error"`), compact row (→ `size="sm"`) |
| `SectionCard` | `tone="neutral"`, `intensity={6}`, `iconBg="soft"`, `bordered` | Semantic section (→ set tone), intensity tuning (rare) |
| `InputBox` | `size="md"`, no tone | Never change the size to match a wireframe |
| `DataTable` | default density, default column widths | Only set `compact` for known dense contexts (RxPad, billing line items) |
| `Chip` | `variant="soft"`, tone from status mapping | Never pick a chip colour from a wireframe |
| `Badge` | `variant="soft"`, tone from status mapping | Same |
| `Avatar` | `size="md"` | Only `size="sm"` in table rows; `size="lg"` in profile headers |
| `Dropdown` | `size="md"` | Never |
| `Toggle` | `size="md"` | Never |
| `Tabs` | default styling | Never colour-match a wireframe's tab styling |

## What to extract from a wireframe (and what to ignore)

### Extract (structure)
- Which **sections** exist (e.g. Symptoms, Examinations, Diagnosis, Medication)
- The **hierarchy** (header → body → footer; sidebar → main)
- Which **components** fill each region (a table, a form, cards, a list)
- The **data/fields** shown (columns, labels, placeholder text)
- The **actions** available (buttons, menus, CTAs)
- The **navigation** structure (sidebar items, tabs)

### Ignore (styling)
- Colours, gradients, fills, backgrounds
- Font sizes, weights, families
- Border radii, shadows, elevation
- Spacing values, padding, margins
- Icon styles (use our `linear` default; `bulk` for active/selected only)
- Button shapes, input styles, card borders

## Reference screenshots

Real product screenshots live in `references/screenshots/`. When composing a page, **read
the relevant screenshot** to see how the actual product handles that page type. The screenshot
is the visual contract — your output should look like that, not like the wireframe.

Naming convention: `<page>-<variant>.png` — e.g. `appointments-list.png`, `rxpad-detail.png`.

## Pre-delivery check (add to the existing checklist)

- [ ] No prop was set just to match a wireframe's visual (colour, size, radius, weight).
- [ ] Every component uses its default variant/tone/size unless semantically justified.
- [ ] Colours come from tokens + status→tone mapping, not from the wireframe.
- [ ] Font sizes/weights are from the type scale, not eyeballed.
- [ ] Corner radii are from `--tesseract-radius-*` tokens, not approximated.
- [ ] Output resembles the product reference screenshots, not the wireframe.
