# Product reference screenshots

Real TatvaPractice screens — the ground truth for what the product looks like. When an
AI builds a page with this skill, it should match this **look and feel**, not invent its own.

## Naming convention

```
<page>-<variant>.png
```

| Segment | Values (examples) | Purpose |
|---------|-------------------|---------|
| `page` | `appointments`, `rxpad`, `patient-detail`, `opd-billing`, `ipd`, `settings`, `pharmacy`, `lab-results`, `vitals`, `history`, `daycare`, `follow-ups`, `records`, `print-preview`, `bulk-messages` | Which module / page |
| `variant` | `list`, `detail`, `drawer`, `sidebar`, `customise`, `preview`, `empty`, `form`, `full` | Which view or state of that page |

### Examples

```
appointments-list.png          — the queue / table view
rxpad-detail.png               — RxPad with sidebar + sections
rxpad-detail-sidebar.png       — same page, VoiceRx sidebar open
rxpad-preview.png              — Rx Preview drawer
rxpad-customise.png            — "Customise Your Pad" settings drawer
rxpad-end-visit.png            — End Visit actions list
patient-detail-form.png        — patient form / registration
opd-billing-list.png           — OPD billing queue
settings-sidebar.png           — settings page with sidebar nav
```

## How the AI uses these

The `/tesseract` skill's `defaults-guardrails.md` instructs the AI to **read these
screenshots** when composing a page. They serve as the visual contract:

- **Layout reference** — where the sidebar is, where CTAs sit, how the header looks
- **Component usage** — real SectionCards, real DataTables, real Buttons in production
- **Colour / density / spacing** — what the actual product feels like (not a wireframe)

The screenshots are NOT wireframes. They are the finished product. When translating a
wireframe into code, the code should look like **these screenshots**, not like the wireframe's
arbitrary styling.

## Adding new screenshots

1. Take a screenshot of the real TatvaPractice page (production or staging).
2. Name it per the convention above.
3. Drop it in this folder.
4. The AI will pick it up automatically — no code changes needed.
