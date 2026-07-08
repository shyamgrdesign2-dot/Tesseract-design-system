---
name: tesseract
description: The prerequisite context layer for the Tesseract design system (`tesseract-ui`) and the TatvaPractice EMR world. Invoke this whenever a project says "use the Tesseract design system", whenever you start building/scaffolding/designing any clinic/EMR page or screen, or before generating any UI that should live "in our world". It loads who we are (brand + design system), the principles for how an EMR page is composed, a collaborative intake to decide the page architecture WITH the user, and the real Tesseract components to build from. Triggers: "/tesseract", "use tesseract", "build a patient list / appointments / billing / IPD / settings page", "make an EMR screen", "scaffold a page with our design system".
---

# Tesseract — Design System & EMR Page Context

This skill is the **front door to our world**. Drop it into any project and it tells the AI three things before a single line is written: **who we are** (brand + the `tesseract-ui` design system), **how we think about pages** (EMR composition principles), and **how to decide a specific page** (a collaborative intake with the user). Then it builds from real Tesseract components.

It is a *prerequisite*, not a generator-on-rails. The goal is that a future project can say "use the Tesseract design system" → `/tesseract` → and the AI is fully grounded in our components, brand, rules, and page philosophy, ready to design *with* you.

## Order of operations

### 0 · Ground yourself (always, silently)
Read `references/design-system-and-brand.md` once at the start of a Tesseract task. It defines what `tesseract-ui` is, our brand identity, the iron rules, and **how to consume the library in this project** (inside the storybook repo vs. the published package — the import path differs). Everything else builds on this.

### 1 · Intake — decide the architecture *with* the user
Do **not** jump straight to code. Read `references/intake-questions.md` and run a short collaborative intake. The pattern:

- **Infer first, then confirm.** From the feature the user describes, propose a sensible default page shape ("This sounds like a records list, so I'd give it the app shell, a top Header with a single 'Add' action, search + filter, and a DataTable — no banner. Sound right?").
- **Ask only the questions that actually branch the design** — header contents, banner or no banner (and what's in it), primary vs secondary sidebar (and its items), tabs/segments, the columns/fields, the primary action. Don't interrogate; offer defaults the user can accept or adjust.
- Use the `AskUserQuestion` tool for the 1–3 genuine forks; let obvious things ride on stated defaults.

The output of intake is an agreed **page architecture** (which shell regions exist and what's in them). Only then build.

### 2 · Apply the principles
Read `references/page-principles.md`. These are the *ideology* — shell-first, one primary action, progressive disclosure, entity context bars, status as colour+text, designed empty/loading states, clinical density, consistency over novelty. Any shared design is just an example of these principles; when a design and a principle conflict, follow the principle.

### 3 · Compose from the catalog
Read `references/component-catalog.md`. For each region in the agreed architecture, pick the Tesseract component that fills it (molecules for regions, atoms for leaves).

**Ground-truth props — prefer the MCP if connected.** This repo ships a `tesseract` MCP server (`mcp/`) that serves the *exact* components and props from source. If its tools are available, use them so you never hallucinate a prop or value:
- `get_component(name)` → the real prop list + allowed values before you write JSX.
- `validate_usage(component, props)` → confirm zero unknown props / out-of-range values before committing the usage.
- `get_design()` → the design language (`design.md`): colour meanings, type, spacing, motion, shape, voice, do/don't. `get_tokens` / `get_rules` / `get_icons` for tokens, rules, and icon names.
- `check_version(installedVersion)` → at the **start** of working in a project, read the installed `@dhspl-tatvacare/tesseract-ui` version (from the project's `package.json` / `node_modules`) and pass it here; if the project is behind the latest, tell the user and recommend the upgrade before building.
If the MCP isn't connected, fall back to the catalog and the component's source/story at `src/components/{atoms,molecules,charts}/<Name>/`.

### 4 · Populate with our domain
Read `references/product-and-domain.md`. Use real module names, entities, statuses, and vocabulary (Patient, Encounter, MRN, Visit Type, IPD admission, Form 3C, ABHA…) so the page reads like TatvaPractice, not generic CRUD.

### 5 · Compliance pass
Check against `references/tokens-and-rules.md`: tokens-only, no odd numbers, `--tesseract-` prefix, never edit `tesseract-tokens.css`, barrel imports, CSS Modules + `data-*`, **Tesseract components only** (never Ant Design / MUI / Tailwind / raw Radix — our old live apps use those for *structure reference only*).

## Reference examples (optional, not mandates)
- `references/page-archetypes.md` — common EMR page *shapes* (List, Detail, Form, Dashboard, RxPad, Print, Drawer, Settings) as worked illustrations of the principles. Use them as a starting sketch, then adapt to the intake.
- `references/recipes/data-listing-page.md` — a full, copy-paste List page with real component APIs.

## Keeping current
After the design system changes, run:
```
node .claude/skills/tesseract/scripts/sync-catalog.mjs
```
It regenerates `references/_generated-inventory.md` from `src/components/**`. Reconcile new/changed components into `component-catalog.md` by hand (the script syncs inventory; you keep the judgement).

## Reference map

| File | Read it when |
|------|--------------|
| `references/design-system-and-brand.md` | First, every time — who we are + how to consume `tesseract-ui` |
| `references/intake-questions.md` | Before building — to agree the page architecture with the user |
| `references/page-principles.md` | The ideology for composing any EMR page |
| `references/component-catalog.md` | Choosing components per region; checking props |
| `references/product-and-domain.md` | Naming modules/entities/columns/statuses our way |
| `references/tokens-and-rules.md` | Final compliance pass |
| `references/page-archetypes.md` | Example page shapes to sketch from |
| `references/recipes/data-listing-page.md` | A complete worked List page |
