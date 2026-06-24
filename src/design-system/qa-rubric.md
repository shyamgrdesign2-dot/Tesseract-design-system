# Tesseract Component QA Rubric (verifier ground truth)

Every component refinement is judged against this rubric by independent verifier agents
(design · FE-engineer · Storybook-QA · overall correctness). A component is "done" only
when all sections pass. Findings feed back to a fix pass, then re-verify, until clean.

This rubric captures the maintainer's accumulated requirements. Treat each item as PASS/FAIL
with a specific reason + file:line when failing.

## 1. Reusability & inheritance hygiene (TOP PRIORITY)
- [ ] Atoms REUSE other atoms/foundations instead of re-creating (no hand-rolled inline `<svg>` — use `TPLibraryIcon`/`TPIcon`; no bespoke button/chip/badge/avatar/spinner — compose the atom).
- [ ] Molecules COMPOSE atoms / other molecules / foundations rather than rebuilding equivalent markup.
- [ ] No duplicated styling that an existing atom/token already provides.
- [ ] Shared logic uses shared hooks/primitives (`Slot`, `DialogPrimitive`, overlay hooks), not re-implemented.

## 2. CSS isolation / adoptability (host-proof)
- [ ] Component is self-contained: establishes its own box-sizing/font/color on its root subtree; does NOT depend on the global base reset.
- [ ] Styles live in a named cascade `@layer` so host CSS can't bleed in and Tesseract can't leak out.
- [ ] No reliance on inherited `color`/`font`/`line-height` from the host for critical visuals (icons via `currentColor` must have a defined color context).
- [ ] No bare element selectors leaking globally (`button {}`, `h1 {}`); class/data-attribute scoped only.

## 3. Tokens & theming
- [ ] Colours/spacing/radius via `var(--tesseract-*)` only — no raw hex except as a token fallback.
- [ ] NEVER modify `tesseract-tokens.css` (immutable foundation). New semantic aliases go in a separate layer/file.
- [ ] Prefer semantic tokens (surface/fg/border/ring) over raw ramp steps where they exist.
- [ ] Even-numbered dimensions; no odd px. Radius via `resolveRadius` (number | "pill" | "sharp" | token).
- [ ] Re-themes (dark / brand / clinic) by token swap with zero component edits; defaults preserve the current look.

## 4. API: scalable, predictable, non-hallucinating
- [ ] `forwardRef` to the root DOM node; unknown props (`...rest`) spread to root; `className` appended (not replaced) and `style` merged.
- [ ] `asChild` on interactive leaves that render `<button>`/`<a>` (Button, Tabs trigger, nav items, menu items) for routing/SSR without forking.
- [ ] Controlled + uncontrolled parity: `value`/`defaultValue`/`onValueChange` (selection) or `open`/`defaultOpen`/`onOpenChange` (overlays). Never ship a control prop without its `default*` partner. Consistent change-callback naming.
- [ ] Compound parts (Root/Trigger/Content/Item via context) for anything with internal structure; flat wrapper may sit on top.
- [ ] `slots`/`slotProps` (or at least documented override seams) for high-surface molecules (DataTable, ClinicalTable, Header, InputBox, Dropdown).
- [ ] Deeply configurable: every visual knob a designer/developer would want is a prop. Nothing hardcoded that should be controllable.
- [ ] The API surface is finite and declarable — the MCP `validate_usage` manifest must reflect every real prop (regenerate after changes).

## 5. Accessibility
- [ ] Overlays (Dropdown/Tooltip/Dialog/flyout/menu): portal, focus management (roving tabindex or `aria-activedescendant`), Escape, click-outside, focus return, correct role + item roles, `aria-expanded`/`controls`/`haspopup` on trigger.
- [ ] Icon-only controls have `aria-label`. Labels associated with inputs. Color is not the only signal.
- [ ] `@media (prefers-reduced-motion: reduce)` honored wherever the component animates.
- [ ] State expressed via `data-*` attributes (`data-state`, `data-disabled`, `data-side`, `data-orientation`).

## 6. Storybook / docs / DX
- [ ] Real controls — no auto-inferred "Set object"; every controllable prop has a proper control + description.
- [ ] Corner-radius control is a restricted dropdown (`default·sharp·2·4·6·8·10·12·14·16·20·24·pill`), not free text.
- [ ] Icon controls expose name + style (linear/bulk/bold/broken/twotone/outline) + family where icons are rendered.
- [ ] `parameters.docs.source.transform` emits accurate JSX (only non-default props).
- [ ] Meta-level argTypes so the autodocs args table is populated (description + control) — not just story-level.
- [ ] Structured usage doc (what / when to use / when not / key props / good to know).
- [ ] Stories cover all states/variants; defaults render identically to before the change.

## 7. Conventions
- [ ] Back buttons: small, control-sized, using `arrow-left3` in the `straight` corner variant.
- [ ] InputBox add-ons: any add-on (text/select/button) can sit on either side; styling lives in the component, not the story.

## 8. Quality gate
- [ ] `npm run lint` → 0 errors. `npm run build:lib` → clean. `npm run build:mcp` regenerated (31+ components).
- [ ] Verified in Storybook (render + key interactions); default look unchanged; screenshot proof for visual changes.

## Benchmark north star
Match or exceed Material UI / Radix UI / shadcn-ui on composition, customizability, a11y, and
adoptability — without bloating the brand. Skip patterns irrelevant to a desktop EMR (filled/standard
input variants, mobile scroll-collapse heros, inset/floating sidebar cosmetics, 3+ level nesting).
