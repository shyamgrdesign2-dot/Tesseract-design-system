# Page Shapes & App Shell (examples, not mandates)

These are common EMR page *shapes* — worked illustrations of the principles in `page-principles.md`, not fixed templates you must reproduce. Use them as a starting sketch during intake, then adapt to what you and the user agree. When a shape and a principle disagree, follow the principle.

Most TatvaPractice screens resemble one of these shapes. Sketch from the closest one, then shape it to the intake.

---

## Page layout — compose from parts (there is NO single fixed template)

A TatvaPractice screen is **assembled from parts**; which parts appear depends on the page —
don't force every page into one frame. The only near-constant is a **top bar + the content
below it** (with ~**18px** spacing). **`Sidebar` and `HeroBanner` are optional** — the sidebar
only on module pages, the banner only on hero / section-landing pages; sub-pages and drawers
have neither.

Pick a frame by page type (a starting point, not the only layout):

### ① Hero / section landing — has the banner, and the content card overlaps it

```
┌────────┬──────────────────────────────────────────────────────────────┐
│        │  ‹  Page Title                          ⟳    🔔    Hosp ▾    ◍ │   HEADER · back · title · actions
│        ├──────────────────────────────────────────────────────────────┤
│  Side  │▓▓▓▓▓▓▓▓▓▓▓▓▓  HeroBanner — brand gradient  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│   BANNER · carries the H1
│  bar   │▓▓▓▓  Page Title  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│
│        │▓▓▓┌───────────────────────────────────────────────────────┐▓▓│  ◄─ card TOP EDGE overlaps
│  ▣     │   │  [ 🔍 Search ]                             [ Filters ▾ ] │  │      the banner (sits on it)
│  ▣     │   │  ─────────────────────────────────────────────────────  │  │
│  ▣     │   │  CONTENT CARD  — the only part that changes:            │  │      the white card holds
│  ▣     │   │  DataTable · report Cards · form · empty state          │  │      everything and runs
│        │   │                                                         │  │      down the page
│        │   └───────────────────────────────────────────────────────┘  │
└────────┴──────────────────────────────────────────────────────────────┘
```

### ② Sub-page — no banner; content sits ~18px below the top bar

```
┌────────┬──────────────────────────────────────────────────────────────┐
│        │  ‹  Page Title                          ⟳    🔔    Hosp ▾    ◍ │   HEADER
│  Side  ├──────────────────────────────────────────────────────────────┤
│  bar   │                        ↕ 18px                                  │
│ (opt.) │   ┌──────────────────────────────────────────────────────┐    │
│  ▣     │   │  Content — form · sections · table · detail            │   │   content sits directly
│  ▣     │   │  …                                                     │   │   below the top bar
│        │   └──────────────────────────────────────────────────────┘    │
└────────┴──────────────────────────────────────────────────────────────┘
```

### ③ Drawer / full-page drawer — no banner, no sidebar; header + body + footer

```
┌───────────────────────────────────────────────┐
│  ‹  Title                     [ CTA ]  [ ⋯ ]   │   Drawer header — right = CTAs / info (NO close ✕)
├───────────────────────────────────────────────┤
│              ↕ 18px                             │
│   Content — form · confirm · details            │   Drawer body
│   …                                             │
├───────────────────────────────────────────────┤
│                          [ Cancel ]  [ Save ]   │   Drawer footer
└───────────────────────────────────────────────┘

> **Header right side = a CTA / action / info zone** (in the top bar *and* the drawer header) —
> never a close `✕`. Close a drawer via the back `‹` or a footer action. This holds across all
> three frames (hero, sub-page, drawer).
```

*Optional add-ons:* a `SecondarySidebar` sub-nav on **record** pages (patient tabs, RxPad); a
right-docked **Dr. Agent** `Drawer` on clinical/ops pages.

**Regions, outside → in** (each maps to one component):

| Region | Component | Notes |
|---|---|---|
| Primary nav (left) *(optional)* | `Sidebar` | icon+label module rail; `activeId` = current module. **Only on module pages** — drop it on sub-pages, drawers, and standalone flows. |
| Sub-nav (left, record pages) | `SecondarySidebar` | only on a record's sub-sections (IPD patient tabs, RxPad sections, settings groups). |
| Top bar | `Header` | **Standard top bar** — `back` chevron + page title + right `actions[]` (refresh, notifications, hospital `Dropdown`, `Avatar`). Add `Tabs`/`SegmentedControl` **only** if the page genuinely has sub-views — not by default. On **record** pages the title area carries entity context — patient name + `Chip`s (ward, consultant, admitted date). |
| Hero *(hero pages only)* | `HeroBanner` | brand-gradient strip carrying the page title (H1). **Hero / section-landing pages only** — never on a sub-page or drawer. |
| **Overlay card** | `Card` / `SectionCard` pulled **up over the hero** (negative top margin) | the signature move — the white content surface overlaps the hero's lower edge. Render hero and card as one overlapping unit, **not** two stacked blocks with a gap. |
| Toolbar (top of card) | `InputBox` (search, left) + `Filter` (right); chosen filters → `Chip` row | on listing / searchable pages. |
| Body (in card) | the archetype content | **the only region that changes** — see A–H below. |
| Right dock *(optional)* | `Drawer` opened by a docked **"Dr. Agent"** tab on the right edge | AI-assistant panel — a **right `Drawer`** (header / body / footer), never a hand-rolled fixed panel. **Not part of the base skeleton** — add only on clinical / ops pages. |

**Three concrete instances (from the live product):**
- **Listing** — hero → overlay card → `[search] [Filters]` toolbar → `DataTable` (e.g. Nursing → *My Patients*). Shape **A**.
- **Report / category grid** — hero → overlay card → grouped sections (FINANCIAL · CLINICAL · REFERENCE), each a grid of report `Card`s with a Download `Button` (e.g. *OPD Reports*). Shape **D/A** hybrid.
- **Record section** — `SecondarySidebar` (patient sub-nav) + entity-context top bar (patient + `Chip`s) → hero → overlay card → an **empty state** (icon + text + one primary `Button`) or the section's content (e.g. IPD → *Admission Assessment*). Shape **B**.

**Rules:**
1. **Sidebar and banner are optional and contextual** — sidebar on module pages, banner on hero/landing pages; sub-pages and drawers have neither. Don't force one frame onto every page.
2. **Spacing** — content sits ~**18px** below the top bar (or overlaps the banner on a hero page); content / card inner **padding defaults to 18px** on all sides (use 24px for roomier surfaces).
3. **One primary action** per page.
4. Any side/full-page panel — including **Dr. Agent** — is a `Drawer` (header + body + footer), never a hand-rolled panel.
5. Lay out with flex/grid; components nest directly. If asked for "just the table / just the content", build the body alone.

---

## A · List / Index page  → recipe: `recipes/data-listing-page.md`

The most common ask ("patient list", "appointments", "invoices", "any listing page").

Regions, top to bottom:
1. **Page title row** — title + primary CTA (`+ Add …`) on the right. (`Header` title/actions, or an in-content row with a `Button`.)
2. **Status tabs** *(optional)* — `Tabs` with count `tag`s (Queue / Finished / Cancelled / Draft).
3. **Toolbar** — search `InputBox` (left) + `DateRangePicker` (range, presets) + `Filter` button (right). Selected filters → `Chip` row below.
4. **Table** — `DataTable` with `DataCell` cells, status `Badge`s, sticky right **Actions** column (icon `Button`s / `Dropdown` menu), `selectable` for bulk actions, `sortable`.
5. **Pagination** — infinite scroll via `hasMore` + `onLoadMore`, or page controls.
6. **States** — `loading` (skeleton rows), `emptyState` (icon + message + CTA).

---

## B · Detail / Profile page (e.g. Patient Details)

1. **Patient context bar** — name · age/gender · MRN · contact · last visit, plus quick actions (Admit, Upload, Message). Build from `Avatar` + text + `Badge` + `Button`s, or put it in `Header` `leading`/`title`.
2. **Section nav** — `SecondarySidebar` rail **or** `Tabs`: Visit Summary, Medical History, Vitals, Lab Parameters, Vaccination, Growth, Records, Certificates, Billing…
3. **Consultation pager** *(optional)* — prev/next consultation with a counter (`Button` icons + text).
4. **Section content** — per active section: read-only summaries (`DataCell`/`Accordion`), `DataTable`s (labs, vitals history), or cards.
5. **Action drawers** — Upload, Create Certificate, Admit to IPD as overlays (`ConfirmDialog` for confirms; a side panel for forms).

---

## C · Form (Create / Edit) page

1. **Header** — title ("Add New Patient" / "Edit Patient"), `back`.
2. **Sectioned form** — group fields with `Accordion` or plain sections: Personal Info, Medical, Emergency Contact. Fields = `InputBox`, `Dropdown`, `DateRangePicker` (single), `RadioGroup`, `Checkbox`, `Toggle`. Required = label asterisk; errors = field `status="error"` + `helperText`.
3. **Conditional sections** — show/hide by value (e.g. Pediatric section when age < 18).
4. **Sticky action bar** — Cancel (ghost) + Save / Submit (`Button` solid primary, `loading` while saving).
5. **Feedback** — `Toast` on success.

---

## D · Dashboard / Analytics page

1. **Section tabs** — `Tabs`: Operational · Financial · Clinical · Growth (the four analytics domains).
2. **Global filter bar** — `DateRangePicker` (range) + `Dropdown` (hospital/doctor) + Refresh + `+ Add widget` `Button`.
3. **KPI row** — statistic cards (compose from text + `Badge` trend + icon). One number + delta each.
4. **Widget grid** — charts + `DataTable` widgets. Charts: render with the product's chart lib (recharts in the new stack); each widget has a ⋮ `Dropdown` menu (edit/export). See `product-and-domain.md` → Analytics for the measure/dimension/chart-fit rules.
5. **Empty/loading** — skeleton cards while querying.

> Chart-type fit (from the analytics spec): KPI = single number; Line/Area = trend over a date dimension; Bar = compare categories; Stacked bar = part-to-whole over time; Pie/Donut = composition (≤6 slices); Table = detail/fallback.

---

## E · RxPad / Consultation page

The signature 3-column clinical workspace.

1. **Patient header** — name, age/gender, contact, visit date/time (`Header` `leading` or a context bar).
2. **Left rail** — historical reference (past visits, vitals, allergies) — read-only, copy-on-click. `SecondarySidebar` + `DataCell` lists.
3. **Center — the RxPad** — stacked `RxPadSection`s: Symptoms → Examinations → Diagnosis → Medication → Advices → Lab Investigation → Follow-up. Each section = editable `ClinicalTable` body + search + toolbar (Voice/Template/Save/Clear).
4. **Right rail** — Dr.Agent / AI panel (suggestions), or section navigator (`SecondarySidebar`).
5. **Bottom actions** — Save Draft · Finalize & Print · Send to Patient (`Button`s).

See the RxPad anatomy detail in `product-and-domain.md`.

---

## F · Print / Preview page

1. **Minimal header** — `Logo` + clinic name + Print `Button`. No sidebars.
2. **A4 document body** — Rx header (patient, date, doctor), content sections (medication table, advice, investigations), signature/stamp footer, page breaks.
3. Print-optimized: full width, no nav chrome.

---

## G · Drawer / Modal overlay

Reused across archetypes for focused tasks:
- **Confirm** (delete, cancel, finalize) → `ConfirmDialog`.
- **Quick forms** (Create Bill, Add Advance, Upload Document, Create Certificate, Admit to IPD) → side drawer / dialog containing a mini Form (archetype C regions).
- Keep destructive action on the left (`secondaryTone="destructive"`), safe/primary on the right.

---

## H · Settings / Configuration page

Configuration screens (Billing Settings, Print Config, Profile, Website Settings). Principle 8: panels, not one giant form.

1. **Header** — title ("Billing Settings"), `back`.
2. **Settings nav** — left rail or vertical `Tabs` listing groups (e.g. Invoice defaults · Taxes · Payment modes · Print template · Form 3C). `SecondarySidebar` works as the rail; `Tabs` for fewer groups.
3. **Active group panel** — grouped fields for the selected group: `InputBox`, `Dropdown`, `Toggle` (feature switches), `RadioGroup`, `DateRangePicker`. Use `Accordion` to sub-divide a long group.
4. **Per-section save** — each group has its own Save/Reset (`Button`s) — not a single page-level submit. `Toast` on save.
5. **Editor + live preview** *(the live product's dominant settings pattern)* — for anything that produces an artifact (print config, certificate template, doctor website), split the page: **left** = config form (tabs or accordion groups, ~30–40% width), **right** = a **live preview** that re-renders as fields change. Seen in Print Settings (left tabs / right document preview) and Website Settings (left accordion / right homepage preview).
6. **Completion affordances** *(optional)* — long setup flows show a completion **score/progress bar** and per-section **"Mandatory"** `Badge`s + done checkmarks, so the user sees what's left. Use for onboarding-style settings.

Note: a settings screen that manages a list of records (e.g. Billing Settings = a service/price master) is really a **List/Index page (A)** with CRUD, not the editor+preview split. Pick by content: artifact-config → split; record-management → table.

---

## Classifying an ambiguous request (a sketch start, then confirm in intake)

| User says… | Start from shape |
|------------|-----------|
| "list / table / index / all X / queue / records of X" | A — List/Index |
| "X details / profile / view a single X" | B — Detail/Profile |
| "add / create / edit / new X form" | C — Form |
| "dashboard / analytics / metrics / KPIs / report" | D — Dashboard |
| "prescription / RxPad / consultation / clinical entry" | E — RxPad |
| "print / preview / printable X" | F — Print |
| "confirm / delete dialog / quick add drawer" | G — Overlay |
| "settings / configuration / print config / billing settings" | H — Settings |

This table picks a *starting sketch*. Confirm the real regions with the user via the intake (`intake-questions.md`) before building.

When in doubt, state your assumed archetype before building so the user can redirect cheaply.
