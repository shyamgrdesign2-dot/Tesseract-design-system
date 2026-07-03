# Tesseract Design System — Starter

TatvaPractice's React UI library **plus** an AI skill that builds our screens the
right way. Starting a new project (locally or in the cloud)? Set up two things:

1. **The AI skill + MCP** — so your Claude/cloud agent knows our design system.
2. **The component package** — so your app can actually import the components.

> Repo: `DHSPL-Tatvacare/tesseract-design-system`
> You can paste this whole file into a cloud chat and ask the agent to set it up,
> or just follow the three steps yourself.

---

## 1 · Install the skill + MCP  (run in Claude Code / cloud)

Two slash commands:

```
/plugin marketplace add DHSPL-Tatvacare/tesseract-design-system
/plugin install tesseract@tesseract
```

This installs:

- **`/tesseract` skill** — our brand, EMR page principles, and a guided page intake.
- **tesseract MCP** — ground-truth components, props, tokens, and icons, with a
  `validate_usage` guardrail so the agent can't invent props or icon names.

*(Private repo — your GitHub account needs access to `DHSPL-Tatvacare`.)*

## 2 · Use it — start every screen with `/tesseract`

```
/tesseract
```

Type that (or say *"use the Tesseract design system"*) **before** building any
clinic/EMR page. It plans the page architecture with you and builds from real
components; the MCP checks every component, prop, icon, and token as it goes.

## 3 · Install the component package  (in your app)

One-time `.npmrc` in your app's root (needs a token with `read:packages`):

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

**That's it.** Skill + MCP so the agent knows our system; the package so your app
can import it. Deeper reference: [`docs/USING-TESSERACT.md`](docs/USING-TESSERACT.md).
