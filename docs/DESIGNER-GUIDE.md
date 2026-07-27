# Tesseract for Designers — set up & build TatvaPractice screens

Tesseract is TatvaPractice's design system. As a designer you get three things, and you
can use as few or as many as you like:

1. **A live gallery** of every component — see it, click it, try every state (no setup).
2. **An AI helper** that builds whole screens from a plain-English description, using the
   *real* components (it can't invent buttons, colours, or icons).
3. **The design language** — the colours, type, spacing, and rules that make a screen feel
   like TatvaPractice.

---

## 1 · See every component (nothing to install)

Open the Storybook: **https://tesseract.tatvapractice.in**

- Every component, every variant. Flip the controls (colour, size, state) and watch it change.
- Use **"Show code"** to get the exact code for what you're looking at.

This is your palette — the fastest way to know what already exists so you never design a
control we don't have.

## 2 · Know the design language

Skim **`design.md`** (in the repo, or ask the team for it): our colours and *what each one
means*, the type scale, spacing, elevation, motion, and the non-negotiable rules. Reading it
once keeps your screens looking like TatvaPractice instead of generic.

## 3 · Set up the AI helper — the real game-changer for design

Connect Tesseract to **Cursor** or **Claude** so you can *describe* a screen and it builds it
with the real components. You don't hand-write CSS — you direct.

**a) The MCP** grounds the AI in our exact components/props/tokens/icons. In Cursor, add
`~/.cursor/mcp.json`:
```json
{
  "mcpServers": {
    "tesseract": {
      "url": "https://tesseract.tatvapractice.in/mcp",
      "headers": { "Authorization": "Bearer <MCP-TOKEN-FROM-TEAM>" }
    }
  }
}
```
(Claude / Claude Desktop work too — see `docs/CONNECT-MCP.md`.)

**b) The `/tesseract` skill** (Claude Code) teaches it our brand + how a TatvaPractice page is
composed:
```
/plugin marketplace add DHSPL-Tatvacare/tesseract-design-system
/plugin install tesseract@tesseract
```

Now you can say, in plain words:
> *"/tesseract — build an All Patients list page: a header with an 'Add Patient' button,
> search + filters, a table of patients, and pagination."*

…and it produces real Tesseract code, checking every component and prop against the MCP so
nothing is made up.

## 4 · Install the components in your project (one-time per machine)

When you want the code to actually run, add the package. It lives on our **private registry**,
so there's a **one-time** token setup — the dev team gives you the token:

```bash
# paste the token the team gives you where it says <TOKEN-FROM-TEAM>:
echo '@dhspl-tatvacare:registry=https://npm.pkg.github.com' >> ~/.npmrc
echo '//npm.pkg.github.com/:_authToken=<TOKEN-FROM-TEAM>' >> ~/.npmrc

npm install --legacy-peer-deps
```
Then use it:
```jsx
import "@dhspl-tatvacare/tesseract-ui/styles.css";      // once, at the app root
import { Button, DataTable } from "@dhspl-tatvacare/tesseract-ui";
```
You do this **once** on your machine. After that, `npm install` just works — and so does any
deploy, because the same token is stored as a **secret in GitHub and Azure** (the dev team set
that up, so pushes and CI/CD builds don't break).

## 5 · Build a TatvaPractice screen — the loop

1. In Cursor/Claude, type **`/tesseract`** (or "use the Tesseract design system").
2. **Describe** the screen in plain words (or share a sketch / Figma frame).
3. The AI proposes the page layout, asks a couple of questions, then builds it from real
   components — validating each against the MCP.
4. **Preview and refine by asking**: *"make the table denser"*, *"use the warning tone for
   overdue items"*, *"add a filter for visit type"*. Then ship.

## The one rule

Always real **`@dhspl-tatvacare/tesseract-ui`** components — never Ant Design, Material,
Tailwind, or hand-rolled. The MCP + `/tesseract` skill keep the AI honest about this for you.

## Getting access (ask the team — Shyam / Karthik)

- the **install token** (for step 4's `.npmrc`)
- the **MCP token** (for step 3)
- membership in the **`DHSPL-Tatvacare`** GitHub org (for the `/tesseract` plugin)

More: `../STARTER.md` · `docs/CONNECT-MCP.md` (connect the MCP) · `docs/CATALOG.md` (every
component) · `design.md` (the design language).
