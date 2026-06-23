# Intake — Deciding a Page's Architecture *With* the User

Building a page is a short collaboration, not a guess. The job here is to turn a one-line feature request ("I need a page for X") into an agreed **page architecture** — which shell regions exist and what's in each — before writing code.

## The method: infer → propose → confirm

1. **Infer** a sensible default architecture from the feature, using the heuristics below.
2. **Propose** it back in one or two sentences ("Here's what I'd build: …"). Lead with the decision, not a quiz.
3. **Confirm only the genuine forks** with `AskUserQuestion` — typically 1–3. Let obvious defaults ride; the user corrects what they don't like.

Never dump all the questions below on the user. They are a *checklist for you* to reason through; surface only the ones the feature genuinely leaves open.

## The architecture dimensions (reason through each)

For each, there's a default lean and the thing to confirm.

### 1. Shell vs. content-only
- *Default:* full app shell (Header + primary Sidebar). 
- *Confirm if unclear:* "Standalone page in the app shell, or just the content region to embed in an existing layout?"

### 2. Header
- *Default:* present, with the page title and a single primary action on the right.
- *Confirm:* "What lives in the header?" Options to offer: page title/subtitle, back button, user/account block, **right-side actions** (which CTAs?), an inline search, info tags (e.g. plan/clinic), a context selector (clinic/doctor). Suggest the minimal set for the feature.

### 3. Banner (HeroBanner) — with or without?
- *Default:* **without.** Banners are for marketing / module-intro / dashboards-with-a-statement, not data pages.
- *Confirm when it could go either way:* "Want a hero banner up top, or go straight to content?" If yes → ask what's in it: title, subtitle, back, and which action CTAs (banner buttons render on a dark surface).

### 4. Primary sidebar (module nav)
- *Default:* present and **collapsed** (80px icon rail) for a focused page; expanded if nav is the point.
- *Confirm:* "Is the primary sidebar needed?" If yes → which module is active, and is this page reachable from existing nav items or does it add one? Offer the standard module set (Appointments, Patients, RxPad, Billing, Analytics, Settings…) and let the user prune.

### 5. Secondary sidebar / context rail
- *Default:* only when the page has sub-sections of one entity (patient record sections, RxPad sections).
- *Confirm:* "Does this page have sub-views of a single record? If so I'll add a context rail (or horizontal tabs) — which sections?" Suggest sections from the domain (Visit Summary, Vitals, Labs, Billing…).

### 6. In-page tabs / segments
- *Default:* add status `Tabs` when the entity has real status segments (Queue/Finished/Cancelled); use `SegmentedControl` for a small compact switch.
- *Confirm:* "Are there status tabs (e.g. Queue / Finished)? What are they?"

### 7. Entity context bar
- *Default:* if the page is about one specific patient/encounter, add a persistent context bar (name · age/gender · MRN · contact · key actions).
- *Confirm:* "Is this page scoped to a single patient? I'll pin a patient context bar."

### 8. Primary content (the core)
Pick the content type and its sub-decisions:
- **List/table** → columns? filters? search? row actions? bulk select? pagination style?
- **Form** → which sections and fields? required/validation? where do Save/Cancel sit (sticky bar)?
- **Detail** → which sections, read-only vs editable, consultation pager?
- **Dashboard** → which KPIs, which charts, global filters?
- **RxPad** → which sections, AI affordances?
- **Print** → document sections, signature/stamp.

### 9. Primary & secondary actions
- *Default:* exactly one primary CTA per surface (top-right). 
- *Confirm:* "What's the main action on this page?" (Add X / Create / Save / Finalize…) and any secondary actions (Import/Export/Filter).

### 10. States (don't ask — just include)
Always design empty, loading, and error/permission states. Only confirm if the empty state needs a specific message or CTA.

## Smart-default heuristics (feature keyword → proposed architecture)

| The user says… | Propose |
|----------------|---------|
| "list / all X / records / queue / directory" | Shell + Header(title + "Add" CTA) + search + Filter + DataTable + pagination. No banner. Status tabs if X has statuses. |
| "X details / profile / view a patient" | Shell + patient context bar + section rail (SecondarySidebar/Tabs) + section panels. No banner. |
| "add / create / edit X / settings form" | Shell + Header(title + back) + sectioned form (Accordion/sections) + sticky Save/Cancel. No banner. |
| "dashboard / analytics / overview / KPIs" | Shell + section Tabs + global filter bar + KPI row + chart/table widgets. Banner optional (statement dashboards). |
| "settings / configuration / print config / billing settings" | Shell + **settings layout**: left settings-nav (or Tabs) + right panel of grouped fields + per-section Save. No banner. |
| "prescription / RxPad / consultation" | Shell + patient header + 3-column (history rail · RxPadSections · AI panel) + bottom actions. |
| "print / printable / preview" | Minimal header (Logo + Print) + A4 document body. No sidebars, no banner. |
| "module home / landing for X feature" | Banner (title + subtitle + CTA) + content below. This is where a banner *does* fit. |

These are starting proposals — always confirm the 1–3 real forks before building.

## Example intake (good shape)

> **User:** "I need a page to manage IPD admissions."
>
> **You:** "Got it — that's a records-list page. Here's what I'd build: the app shell with the collapsed sidebar (IPD active), a Header titled 'IPD Admissions' with a single **'+ Admit Patient'** action, a search + Filter toolbar, and a DataTable (patient, ward/bed, admission date, status, actions) with status tabs for Admitted / Discharged. No banner. Two quick checks:"
>
> *AskUserQuestion:*
> 1. *Columns* — "Which columns matter most: ward/bed, admitting doctor, length of stay, IPD bill status?"
> 2. *Row action* — "Primary row action on click — open the admission detail, or the discharge summary?"
>
> Then build to the agreed shape.

Keep it this tight. Propose, confirm the forks, build.
