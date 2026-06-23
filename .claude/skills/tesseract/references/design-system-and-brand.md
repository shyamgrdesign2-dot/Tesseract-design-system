# Tesseract — Design System & Brand (read this first)

The grounding layer. Before designing anything, know what `tesseract-ui` is, our brand, and how to consume the library *in this specific project*.

---

## What Tesseract is

**Tesseract** is the design system for **TatvaPractice** (Tatva Care's clinic/EMR product). It ships as **`tesseract-ui`** — a zero-runtime-dependency React component library (only `react`/`react-dom` as peers). Two layers:

- **Atoms** — primitives: Button, Badge, Chip, InputBox, Avatar, Divider, Checkbox, Radio, Toggle, SegmentedControl, Slider, Skeleton, LoadingIndicator, Logo, icons (TPIcon / TPLibraryIcon / TPMedicalIcon).
- **Molecules** — composed regions: DataTable, Filter, Dropdown, Tabs, Accordion, Header, Sidebar, SecondarySidebar, ConfirmDialog, Toast, Tooltip, DateRangePicker, ClinicalTable, RxPadSection, HeroBanner.

Everything is **token-driven** (CSS variables), styled with **CSS Modules + `data-*` attributes**, hand-rolled (no Radix/MUI inside), accessible by default, and domain-agnostic (no business logic baked in).

It is also the only UI vocabulary we build product pages in. "Our world" = pages composed from these components, on these tokens, following our page principles.

---

## Brand identity

- **Name & marks.** Product is **TatvaPractice**; sibling brand **Tatva Care**. Use the `Logo` atom — `variant="wordmark"|"symbol"`, `brand="practice"|"care"`, `tone` per surface. Never reconstruct the logo by hand.
- **Primary colour — blue.** `--tesseract-blue-500` (~#4B4AD5) is the brand/primary action colour. Filled primary CTAs only.
- **AI accent — violet.** `--tesseract-violet-*` signals AI / Dr.Agent / smart features. **Never** use violet as a primary CTA fill; it marks intelligence (suggestions, AI panels, "Trial"/smart chips).
- **Secondary — amber** (`--tesseract-amber-*`); **semantic** success/warning/error ramps; **neutral** slate ramp for chrome.
- **Typography.** Headings = **Mulish** (`--tesseract-font-heading`); body/UI = **Inter** (`--tesseract-font-body`). Baseline: 14/400 body, table cells, and CTA labels; 14/600 card titles; 12 meta/badges; 10/600 uppercase trackers only.
- **Iconography.** Iconsax, CDN-served, via `TPIcon`/`TPLibraryIcon` (and `TPMedicalIcon` for clinical glyphs). `linear` is default; `bulk` marks active/selected. Clinical sections use medical icons in violet.
- **Tone.** Clinical-calm and trustworthy: dense but scannable, low-drama, no red error banners mid-consultation. Function over flourish; decoration (AnimatedGrid/HeroBanner) is reserved for hero/marketing surfaces.
- **Shape language.** Even, soft radii — chips/badges 10px, cards/pills/selected-rail 12px. No odd numbers anywhere.

---

## How to consume `tesseract-ui` in this project

The import path depends on where the AI is working. Detect which case applies, then use the matching pattern.

### Case A — inside the design-system repo (TP_UI_Storybook)
Building/storybook work, or a page colocated in this repo. Import from the barrels via the `@` alias:
```jsx
import { Button, Badge, InputBox } from "@/src/components/atoms";
import { DataTable, Header, Sidebar } from "@/src/components/molecules";
```
Component source and stories live at `src/components/{atoms,molecules}/<Name>/` — read them for exact APIs. Tokens are at `src/tesseract-tokens.css`.

### Case B — a separate project consuming the published package
A new app that installed the library. Import from the package name it was installed as (currently **`tesseract-ui`**; publish/scoping is still pending, so confirm the name in that project's `package.json`):
```jsx
import { Button, DataTable, Header } from "tesseract-ui";        // or the scoped name in package.json
import "tesseract-ui/dist/tokens.css";                            // load tokens once at app root
```
Then wrap the app root once in the theme provider so tokens + component overrides apply:
```jsx
import { TesseractThemeProvider } from "tesseract-ui";
<TesseractThemeProvider colorScheme="light">{/* app */}</TesseractThemeProvider>
```
If you cannot tell which case you're in, check the project's `package.json` (is `tesseract-ui` a dependency?) and whether `src/components/atoms` exists locally. When unsure, ask the user which install they have.

### Either case
- Wrap the app once in `TesseractThemeProvider` (theme overrides, `colorScheme`, breakpoints). Re-theme via provider overrides — **never** by editing tokens.
- Load the token stylesheet exactly once at the root.
- Recipes in this skill are written for **Case A** import paths; swap to the package name for Case B.

---

## The iron rules (full detail in `tokens-and-rules.md`)

1. Tokens only — no raw hex/rgb/magic colour values.
2. No odd numbers in any dimension (1px hairline borders excepted).
3. Never edit `tesseract-tokens.css`; theme via `TesseractThemeProvider`.
4. Naming: tokens `--tesseract-*`, package `tesseract-ui`, theme provider `TesseractThemeProvider`. Icon components keep `TP*` names (`TPIcon`, `TPMedicalIcon`, `TPLibraryIcon`).
5. Barrel/package imports only.
6. CSS Modules + `data-*` styling.
7. Tesseract components only — no Ant Design / MUI / Tailwind / raw Radix in product pages.

These are not style preferences; they are what makes a page "ours." A page that breaks them is off-system regardless of how it looks.
