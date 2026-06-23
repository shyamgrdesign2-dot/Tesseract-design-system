# TatvaPractice — Product Map & Domain

This is "our world." Use these modules, entities, statuses, and terms so generated pages read like the real product, not generic CRUD.

---

## Module map (primary Sidebar)

| Module | What it does |
|--------|--------------|
| **Appointments** | Queue-based daily schedule. Tabs: Queue / Finished / Cancelled / Draft / Pending Digitisation. Patient, visit type, slot time, AI-agent recommendations. Default landing module. |
| **RxPad** | Prescription workspace — structured clinical entry with patient context. Feeds VoiceRx, SnapRx, SmartRx. |
| **All Patients** | Central patient repository — search, create, edit, view history. |
| **Clinical / EMR** | Patient Details with tabbed history: Visit Summary, Medical History, Vitals, Lab Parameters, Vaccination, Growth Chart, Obstetric, Medical Records, Certificates, Care Plan. Specialty-aware. |
| **OPD Billing** | Invoices, advance deposits, Form 3C. Per-patient billing with wallet/advance balance. |
| **Medical Certificates** | Fitness / sick-leave certificates tied to a visit; printable. |
| **Health Records (ABHA)** | Ayushman Bharat integration — upload/download national digital health records. |
| **IPD (Inpatient)** | Admissions, ward/bed, discharge summaries, IPD billing. **In the live product this is an external module** — the sidebar entry SSO-redirects to a separate IPD portal (`pm-doctor-portal-ipd-*.tatvacare.in`); "Admit to IPD" encodes patient data and hands off via `?redirectTo=ipd/...&authToken=…`. Treat IPD screens as either (a) a link-out, or (b) net-new in-app pages you design from the List/Detail/Form shapes. |
| **Pharmacy** | Drug inventory and dispensing. Also an external/SSO module in the live product. |
| **Analytics** | Dashboards across Operational / Financial / Clinical / Growth. |
| **Messages / Campaigns** | Bulk patient SMS/WhatsApp. |
| **Ask Tatva** | AI clinical decision support / Q&A. |
| **Settings** | Doctor profile, website settings, print config, billing settings. |
| **Verticals** | Dental (treatment plans), Ophthalmology, Vaccination, partner integrations (Apollo, Zydus). |

Prescription sub-products: **VoiceRx** (voice→Rx), **SnapRx** (photo/OCR→Rx), **SmartRx/SmartPrescription** (AI-assisted), **TabRx** (tablet UI).

**External / SSO modules.** Some heavy modules (IPD, Pharmacy) don't live in the main app — the nav entry SSO-redirects to a dedicated portal, passing an auth token (and for "Admit to IPD", base64-encoded patient data) on the URL. When a feature like this comes up, default to a clean **link-out** (a nav item / button that hands off), not an in-app rebuild — unless the user explicitly wants the screens brought in-app, in which case design them from the List/Detail/Form shapes.

---

## Core entities

| Entity | Key fields (use as columns/labels) |
|--------|-----------------------------------|
| **Doctor / User** | name, specialty (`dp_name`), contact, clinic access |
| **Clinic / Hospital** | clinic name, city, `module_data` (enabled features) |
| **Patient** | name, **MRN** (`mrn_no`), age, gender, DOB, contact, email, address, blood group, allergies |
| **Appointment / Visit** | patient, doctor, slot date/time, **visit type** (New / Follow-up / Routine), **status** (Queue / Finished / Cancelled / Draft), video flag |
| **Encounter / Consultation** | date/time, chief complaint, diagnosis, prescription ref, notes |
| **Prescription / Rx** | medications[], advice, investigations, status (Draft / Finalized / Printed), print count |
| **Medication** | drug, strength, dosage, **frequency** (1-0-1, BD/TDS/OD), when (Before/After food), duration, quantity |
| **Vital Signs** | type (BP, HR, temp, SpO₂, weight, height), value, unit, recorded at |
| **Lab Parameter** | test, reference range, result, status (Ordered / Completed / **Abnormal**) |
| **Invoice / Bill** | patient, invoice #, line items, total, tax, paid, **status** (Draft / Finalized / Paid / Cancelled), date |
| **Advance Deposit** | amount, payment method, date (patient wallet balance) |
| **Medical Record** | category (Lab Report / Scan / Document), file, uploaded by, date |
| **Certificate** | type (Fitness / Sick leave), valid from/to, reason, issued date |
| **Vaccination** | vaccine, date given, next due |
| **IPD Admission** | ward, bed, admission/discharge date, diagnosis |
| **Treatment Plan** *(Dental)* | tooth #, procedure, cost, status (Planned / In Progress / Completed) |

---

## Status → Badge tone (be consistent)

| Status | `Badge` color |
|--------|---------------|
| Queue / Pending / Draft / Unfulfilled | `warning` |
| Finished / Completed / Paid / Confirmed | `success` |
| Cancelled / Abnormal / Overdue / Failed | `error` |
| New / First visit / Info | `primary` |
| Routine / Neutral / Inactive | `neutral` |
| AI / Suggested / Trial | `violet` |

---

## Glossary (product terms)

- **MRN** — Medical Record Number (unique patient id per clinic).
- **ABHA** — Ayushman Bharat Health Account (national digital health id).
- **Form 3C** — Indian medical insurance claim form (hospital billing).
- **Queue / Finished / Pending Digitisation** — appointment statuses.
- **Draft Rx** — saved but not finalized prescription; editable.
- **Advance / Wallet** — patient prepaid balance.
- **Walk-in** — unscheduled visit.
- **Teleconsult** — video consultation.
- **Module Data** — per-clinic feature flags.
- **DDX / DDI** — differential diagnosis / drug-drug interaction (AI checks in RxPad).

---

## RxPad anatomy (for archetype E)

The RxPad is a prescription pad — the editable center of the consultation workspace.

**Built-in sections (reorderable, toggleable):** Symptoms → Examinations → Diagnosis → Medication (Rx) → Advices → Lab Investigation → Surgery → Additional Notes → Follow-up. Plus up to 15 doctor-defined **custom modules**.

Each section = title + medical icon (violet) + toolbar (Voice / Template / Save / Clear + voice-count badge) + editable table/textarea body. Column shapes:

| Section | Columns |
|---------|---------|
| Symptoms | name (autocomplete) · since (duration) · status (Severe/Moderate/Mild) · note |
| Diagnosis | name · since · status (Suspected/Confirmed/Ruled Out) · note |
| Medication | medicine · unit/dose · frequency (1-0-1 / BD/TDS/OD) · when (Before/After food) · duration · note |
| Advices | advice (wide) · note |
| Lab Investigation | investigation · note |
| Follow-up | date picker + quick chips (2 days / 1 week / 1 month / 3 months) + notes |

**Editable-cell mechanics:** click cell → inline dropdown with type-ahead + canned chips; drag handle to reorder; × to delete on hover. Build this with `RxPadSection` / `ClinicalTable`.

**AI touchpoints** appear *after* data is entered: "Suggest DDX" (from symptoms), "Suggest lab tests" (from diagnosis), "Check interactions" (drugs), inline drug-allergy and DDI warnings. AI affordances use `violet`, never as a primary CTA fill.

**Historical sidebar (read-only, copy-on-click):** past visits, vitals timeline, allergies/chronic/surgical/family history, plus specialty panels (Ophthal: vision/IOP; Gynec: LMP/Pap; Obstetric: GPAL), vaccines, growth, labs by category, records, follow-ups.

---

## Analytics semantics (for archetype D)

Four domains: **Operational** (appointments, throughput, IPD BOR/ALOS/ADC, ward use), **Financial** (revenue/collections, daily close, payment-mode mix, AR ageing, 3C), **Clinical** (diagnosis mix, Rx patterns, generic-vs-branded, lab volume), **Growth** (new vs repeat, referral source, demographics, retention).

A widget = a **query** (dataset · measures · dimensions · filters) + a **viz spec** (chart type + axes). Default dashboards are seeded JSON, not bespoke code. Scope filters (hospital, doctor) are injected server-side — never trusted from the client. Chart-type fit rules are in `page-archetypes.md` → archetype D.

---

## Stack note — old vs new

- **Reference-only (do not copy stack):** TP_Master, Pm-Doctor-Portal — Ant Design + Redux + CRA. Mine them for *what pages exist and what they contain*, never for styling or components.
- **Modern reference:** VoiceRx-L, TP_Dental_L — Next.js App Router, SCSS Modules, atomic design, local state + Context (no Redux), recharts, react-hook-form + zod. Generated pages should match this stack shape and import Tesseract `tesseract-ui` components.
