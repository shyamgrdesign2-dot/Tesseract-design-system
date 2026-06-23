# EMR Page Principles — the ideology

How we think about composing a page. These are *principles*, not templates. Any specific design (including ones the user shares) is just one expression of them — when a design and a principle conflict, follow the principle and say so. The example shapes in `page-archetypes.md` are derived from these.

---

## 1. Shell-first
Every authenticated page lives in the same frame: **Header** on top, **primary Sidebar** for module nav, optional **SecondarySidebar/Tabs** for sub-context. Users should never wonder where they are. The content region is the only thing that changes between pages. Exceptions are deliberate and rare: print/preview and full-screen flows drop the shell.

## 2. One primary action per surface
Each surface has exactly **one** primary CTA (filled blue, top-right of its region). Everything else is secondary (outline/ghost) or tertiary (link/icon). If a page seems to need two primary actions, it's probably two surfaces. This keeps the "what do I do here" obvious.

## 3. Progressive disclosure
Show the least that's useful, reveal the rest on demand. **List → detail → drawer/dialog**, not everything inline. Collapse secondary detail into Accordions, tabs, flyouts, and drawers. A clinician scanning a queue shouldn't see a form they don't need yet.

## 4. Entity context is persistent
When a page is *about* a specific record (a patient, an encounter, an admission), pin its identity in a **context bar**: name · age/gender · MRN · key meta · quick actions. It stays put while sub-views change. The user never loses track of whose data they're looking at.

## 5. Status is colour **and** text, always
A status is never colour alone. Use a `Badge` with a word + a consistent tone (see the status→tone table in `product-and-domain.md`). Colour-blind-safe and instantly scannable. Same status = same tone everywhere in the product.

## 6. The collection triad: search · filter · table
Any list of records gets the same triad — a search field (left), a Filter entry point (right, with selected filters as removable chips), and a `DataTable` below. Add status `Tabs` when the entity has status segments. Consistency across modules means a user who can use one list can use them all.

## 7. Forms are sectioned and forgiving
Group fields into labelled sections (Personal · Medical · Emergency…), not one long wall. Mark required fields, validate inline with field-level `status="error"` + helper text, and keep **Save/Cancel in a sticky action bar**. Show conditional sections only when relevant (e.g. pediatric fields when age < 18). Confirm destructive steps with `ConfirmDialog`.

## 8. Settings are panels, not pages
Configuration screens (billing settings, print config, profile) use a **settings layout**: a left settings-nav (or Tabs) listing groups, a right panel of grouped fields, and **per-section save** — not one giant submit. Each group is independently editable and saveable.

## 9. Design the empty, loading, and error states
A page isn't done until all three are handled. **Loading** = skeleton rows/cards (`Skeleton`), not a spinner-on-blank. **Empty** = icon + one line + the primary CTA to fix it. **Error/permission** = inline, recoverable, with a retry — and during a live consultation, never a red banner (fail silently with inline retry).

## 10. Clinical density, scannable rhythm
Our users move fast through lots of records. Prefer **compact, scannable rows** over airy cards for data; left-align text, right-align numbers and actions; use `DataCell` to pack primary+secondary lines (name + MRN) into one cell. Dense, but with consistent spacing rhythm from the spacing tokens — never cramped, never wasteful.

## 11. Consistency over novelty
Reuse the same shape for the same job across every module. A new page should feel like an existing one. Novelty is a cost in an EMR — predictability is a feature. Reach for an existing archetype/recipe before inventing a layout.

## 12. Brand discipline
Blue = primary action. **Violet = AI/intelligence only** (never a primary CTA fill). Medical icons (violet) head clinical sections. Decoration (HeroBanner/AnimatedGrid) is reserved for hero/marketing/module-intro surfaces — data pages stay quiet. Mulish headings, Inter body. Even radii, even dimensions.

## 13. Accessible by default
44px touch targets (36px min desktop dense), labelled icon-only buttons, keyboard reachability, ≥4.5:1 contrast, `prefers-reduced-motion` respected. Built in, not bolted on — the components already do most of this; don't undo it.

## 14. Composition, not custom
If a region seems to need a component we don't have, **compose it from existing atoms/molecules** before considering anything custom — and never reach outside `tesseract-ui`. Most "missing" components are an arrangement of `DataCell`, `Badge`, `Button`, `Chip`, and a layout.

## 15. Heavy modules can live outside — link out cleanly
Not everything belongs in-app. In the live product, big modules (IPD, Pharmacy) SSO-redirect to dedicated portals rather than being rebuilt. When a feature is really a separate system, default to a clean **hand-off** — a nav item or button that links out with the needed context — instead of reconstructing it. Only bring it in-app when the user explicitly asks, and then design it from the standard shapes.

## 16. Settings = editor + preview (for artifacts)
When a settings screen configures something the user will *see produced* (a printed Rx, a certificate template, a public website), pair the config form with a **live preview** beside it. The user edits on the left and watches the result update on the right. For settings that just manage records, that's a List page with CRUD, not a preview split.

---

### Using the principles
When you propose a page in intake, you're applying these. When you review a finished page, check it against them. When a shared mockup violates one, name the principle and offer the on-system alternative — the user asked for an ideology they can rely on, not pixel-copies of possibly-wrong designs.
