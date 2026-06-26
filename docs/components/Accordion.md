# Accordion
> A compound disclosure stack that hides/shows skimmable content sections behind clickable headers.

**Import**
```jsx
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@dhspl-tatvacare/tesseract-ui";
```

**When to use** — Progressively disclose long-but-skimmable content: FAQs, patient history sections, a SOAP note. Use `type="single"` for one-open-at-a-time, `type="multiple"` to expand several at once.

**When not** — Switching between peer views of equal weight; reach for `Tabs` instead.

**Key props** (on `<Accordion>`)

| Prop | Type | Default | What it does |
|------|------|---------|--------------|
| `type` | `"single"` \| `"multiple"` | `"single"` | One row open at a time vs. several |
| `collapsible` | `boolean` | `false` | Single mode: let the open row close to none |
| `value` / `defaultValue` | `string` \| `string[]` | — | Controlled / uncontrolled open state (array in `multiple` mode) |
| `onValueChange` | `(next) => void` | — | Fires with the next open value(s) on toggle |
| `density` | `"comfortable"` \| `"compact"` | `"comfortable"` | Row padding + type scale; use `compact` for dense panels |
| `expandIcon` | `string` (icon name) \| node | `"chevron-down"` | Disclosure glyph; rotates on open |
| `iconPosition` | `"right"` \| `"left"` | `"right"` | Which side the indicator sits |

Per-item / per-trigger: `<AccordionItem value disabled>` (a `disabled` item dims and can't toggle while siblings work); `<AccordionTrigger headingLevel={2} as expandIcon iconPosition>` — set `headingLevel`/`as` so the trigger wraps in the right heading for the page outline. Colours and spacing come from `--tesseract-*` tokens — don't hardcode.

**Example**
```jsx
<Accordion type="single" collapsible defaultValue="current">
  <AccordionItem value="current">
    <AccordionTrigger>Current Medications (4)</AccordionTrigger>
    <AccordionContent>Amlodipine 5mg · Atorvastatin 10mg · …</AccordionContent>
  </AccordionItem>
  <AccordionItem value="allergies">
    <AccordionTrigger>Known Allergies (2)</AccordionTrigger>
    <AccordionContent>Penicillin, Sulfa drugs</AccordionContent>
  </AccordionItem>
</Accordion>
```

**Variants**
- **Playground / SingleCollapsible** — default single-open, collapsible to none.
- **Multiple** — several rows open at once (`defaultValue` is an array).
- **NonCollapsibleSingle** — single mode that always keeps one row open.
- **IconLeft** — indicator on the left with a custom `expandIcon`.
- **Compact** — tighter `density` for dense panels.
- **DisabledItem** — one item dimmed and un-togglable; siblings still work.
- **CustomHeadingLevel** — triggers wrap in `h2` for the page outline.
- **Controlled** — open state driven by `value` + `onValueChange`.
- **Healthcare**: Patient Medical History, FAQ (multiple open), SOAP Clinical Note, Medication History.
