# Tesseract Design System — Starter

TatvaPractice's React UI library **plus** a Claude skill (`/tesseract`) and an MCP
that make Claude build our screens with the real components.

Nothing here is pre-installed in your account — this guide sets it up from scratch.
You can read it and follow along, or paste the whole file into a **Claude Code**
chat and ask it to do the steps.

---

## Before you start — check access (important)

Everything below lives in a **private** GitHub repo. It only works if:

1. **You have access to the repo** `DHSPL-Tatvacare/tesseract-design-system`.
   → **No access?** Ask your **dev / operations team** to add your GitHub account
   to the repo — contact **Karthik Jangam** (karthik.jangam@tatvacare.in). Without
   access, Step 1 and Step 3 will fail — this is the #1 reason setup doesn't work.
2. **You're in Claude Code** (desktop app, CLI, or web) — that's where `/plugin`
   and `/tesseract` exist. A brand-new Claude account/workspace does **not** have
   the skill or MCP; Step 1 installs them, and you repeat Step 1 in each new
   workspace where you want them.
3. **Node.js is available** (already true in Claude Code) — the MCP runs on Node.

---

## 1 · Install the `/tesseract` skill + MCP

In Claude Code, run:

```
/plugin marketplace add DHSPL-Tatvacare/tesseract-design-system
/plugin install tesseract@tesseract
```

You now have:

- **`/tesseract` skill** — our brand, EMR page principles, and a guided page intake.
- **tesseract MCP** — ground-truth components, props, tokens, and icons, plus a
  `validate_usage` guardrail so Claude can't invent props or icon names.

The MCP ships **pre-built inside the plugin** — no `npm install`, no build step.

> If `/plugin marketplace add` errors, you don't have access to the private repo →
> request it (see "Before you start").

## 2 · Use it — start every screen with `/tesseract`

```
/tesseract
```

Type that (or say *"use the Tesseract design system"*) **before** building any
clinic/EMR page. Claude plans the page with you and builds from real components;
the MCP checks every component, prop, icon, and token as it goes.

## 3 · Install the component package in your app

The library is a **private** npm package on GitHub Packages (same access as the
repo). One-time `.npmrc` in your app's root — the token needs `read:packages` scope
on `DHSPL-Tatvacare`:

```ini
@dhspl-tatvacare:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
```

Then install and use it:

```bash
npm install @dhspl-tatvacare/tesseract-ui
```

```jsx
import "@dhspl-tatvacare/tesseract-ui/styles.css";        // tokens + styles, once
import { Button, HeroBanner } from "@dhspl-tatvacare/tesseract-ui";
```

Update later with `npm update @dhspl-tatvacare/tesseract-ui`.

---

**In one line:** get access → `/plugin install` the skill + MCP → `/tesseract`
before each screen → `npm install` the package in your app. Deeper reference:
[`docs/USING-TESSERACT.md`](docs/USING-TESSERACT.md).
