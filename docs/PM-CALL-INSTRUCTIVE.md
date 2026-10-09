# How to run the Tesseract onboarding call with PMs

A step-by-step guide for you (Shyam) to walk the PM team through Tesseract.
Read this before the call so you know the flow. Share `SETUP-TESSERACT-PM.md` with them
during or after the call — that's their self-contained setup doc.

---

## Before the call

- [ ] Make sure `SETUP-TESSERACT-PM.md` is ready to share (Slack / email / drive — NOT in git, it has tokens)
- [ ] Have the Storybook gallery open: https://tesseract.tatvapractice.in
- [ ] Have a sample TatvaPractice page open to show the "before and after" (e.g. Appointments)
- [ ] Optionally: have a Claude Code / Cursor session ready for a live demo

---

## Call flow (30–40 min)

### 1 · What is Tesseract? (5 min)

**Say this:**
> Tesseract is our design system — the single source of truth for every UI component
> in TatvaPractice. It's a React component library (50 components), plus an AI layer
> (an MCP + a skill) that lets Claude / Cursor build real pages using our actual
> components — not generic UI.

**Show:**
- The Storybook gallery — flip through a few components (Button, SectionCard, DataTable)
- A real TatvaPractice page side-by-side — "this is built from the same components"

### 2 · What can PMs do with it? (5 min)

**Set expectations clearly:**
> This is a **prototyping tool**. You describe a page in plain English, and Claude builds
> it using our real components, our real colours, our real spacing. It gets you to a
> solid first draft — the right structure, the right components, the right layout.
>
> But it is NOT a pixel-perfect design tool. Every page it generates will need
> **design review and refinement** before it ships. Think of it as going from 0 to 70%
> in minutes instead of days — the remaining 30% is design polish.

**Key points to land:**
- It's for **rapid prototyping** — exploring page ideas, testing layouts, communicating
  requirements with the dev team using real components
- The output **adapts to our system** — correct tokens, correct components, correct patterns
- It **requires design approval** before shipping — don't expect a 100% production match
- It's not a replacement for design — it's a tool that helps PMs and designers collaborate
  faster by starting from a working prototype instead of a blank canvas

### 3 · Live demo (10 min)

If you have a Claude Code / Cursor session ready:

1. Type `/tesseract` (or just describe a page if the MCP is connected)
2. Say: *"Build me a patient appointments list with a queue tab, search, filters,
   and a table showing name, contact, visit type, slot, and actions"*
3. Let it generate — show how it uses real components (Header, DataTable, Button, Chip)
4. Ask for a refinement: *"Add a Follow-ups tab and make overdue visits show a warning badge"*
5. Show the output — point out it's using real Tesseract colours, real spacing, real radii

**If no live demo:** show screenshots of generated pages vs. the real product.

### 4 · How to set it up (5 min)

**Say:**
> I'm going to share a file called SETUP-TESSERACT-PM.md with you. It has everything you need —
> credentials, setup commands, and how to start. It's three steps, takes 5 minutes.

Walk through the three steps in SETUP-TESSERACT-PM.md:
1. Connect the MCP (the AI brain)
2. Set up the npm package (so it can use real components)
3. Start prototyping

**Emphasise:**
- The MCP token and npm token are in the doc — don't share them publicly
- They only need to do setup once; after that it's just "describe what you want"

### 5 · Guardrails and expectations (5 min)

**Say:**
> The system has built-in guardrails. Even in prototype mode, it follows our design
> tokens — our colours, our fonts, our spacing, our corner radii. So what you get out
> won't look like a random wireframe — it'll look like TatvaPractice.
>
> That said, here's what it CAN'T do:
> - Complex interactions (drag-and-drop, real-time data, WebSocket flows)
> - Backend logic — it generates the UI, not the API calls
> - Pixel-perfect production code — that's the design + dev team's job
>
> Your role: describe what you need, review the output, iterate on the structure,
> then hand it off to design for polish and to dev for integration.

### 6 · Q&A (5–10 min)

Common questions:

**"Can I use this for any page?"**
> Yes — appointments, billing, IPD, pharmacy, settings, any TatvaPractice module.
> It knows our domain vocabulary (Patient, Encounter, Visit Type, ABHA, etc.).

**"Does it work with Cursor?"**
> Yes. The MCP setup in SETUP-TESSERACT-PM.md works for both Claude Code and Cursor.

**"Will it overwrite our existing code?"**
> No. It generates new code in whatever project you point it at. It doesn't touch
> existing files unless you tell it to.

**"How do I know which components exist?"**
> Browse the gallery at tesseract.tatvapractice.in, or ask Claude — the MCP
> has a `list_components` tool that shows all 50 components with their props.

---

## After the call

- [ ] Share `SETUP-TESSERACT-PM.md` via Slack / email (NOT via git push — it has tokens)
- [ ] Tell them to ping you or the DS channel if setup fails
- [ ] Remind: every generated page needs design sign-off before it goes to dev
