# UI/UX Guidelines (EMR-tuned)

Tactical patterns on top of `page-principles.md` (the ideology) and `tokens-and-rules.md`
(a11y + motion basics). Apply these to any screen you build.

## Always design the three "unhappy" states
- **Loading** — skeletons that match the final layout (not one centered spinner for a whole page); keep dimensions stable so nothing jumps as data arrives.
- **Empty** — an icon + a one-line "what this is" + a single primary CTA (`+ Add …`). Never leave a blank area.
- **Error** — inline, near the cause, with a **retry**. During a live consultation, **never a red banner** — fail quietly with an inline message / `Toast` and retry (product rule).

## Forms
- Validate on **blur / submit**, not on every keystroke. On submit, show the first error and focus it.
- Required = label asterisk; errors = field `status="error"` + `helperText` below.
- Group related fields (sections / `Accordion`); reveal conditional sections by value (e.g. Pediatric fields when age < 18).
- Sticky action bar: **Cancel** (ghost, left) · **Save/Submit** (solid primary, right, `loading` while saving). `Toast` on success.
- **Never lose entered data** on a validation error.

## Tables / lists
- Sort on column headers; **sticky header** + sticky right **Actions** column.
- **Pagination** for finite sets; **infinite scroll** (`hasMore` / `onLoadMore`) for feeds/logs.
- Bulk actions via `selectable` + a selection toolbar. Status = `Badge` (colour **and** text).
- Handle empty + loading (skeleton rows). Row density per the density rule in `design-foundations.md`.

## Feedback & confirmation
- Transient success/info → `Toast` (auto-dismiss). Blocking or destructive → `ConfirmDialog`.
- Destructive confirm: destructive action on the **left** (`secondaryTone="destructive"`), safe/primary on the right.
- Prefer **optimistic UI** for cheap actions (toggle, mark-done); roll back + `Toast` on failure.

## Navigation & wayfinding
- **One primary action** per screen. Back `‹` on sub-pages / records. Active nav = selected state + bulk icon.
- Breadcrumbs only for deep hierarchies; keep the sidebar `activeId` in sync with the route.

## Responsive
- `useBreakpoint()` → `mobile` / `tablet` / `desktop`. Sidebar collapses to a rail/drawer on mobile.
- Tables become stacked cards or scroll horizontally on small screens — never squish columns.
- Touch targets **≥ 44px** on mobile.

## Microcopy
- Buttons are **verbs** ("Add Patient", "Save & Print"), not "OK / Submit".
- Empty states describe the value ("No prescriptions yet — add one to get started").
- Use product vocabulary + formats (MRN, Visit Type, `dd MMM yyyy`) — see `product-and-domain.md`.

## Accessibility (recap → tokens-and-rules)
Contrast ≥ 4.5:1 · visible focus rings · icon-only buttons labelled (`ariaLabel` / `Tooltip`) ·
colour is never the only signal · keyboard-reachable · respects reduced motion.
