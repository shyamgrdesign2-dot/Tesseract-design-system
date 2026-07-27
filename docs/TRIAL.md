# Try Tesseract in a fresh local project (5 minutes)

A copy-paste walkthrough: spin up a brand-new React app and use the Tesseract design
system in it. The package is on the org's **private GitHub Packages** registry — install it
with a one-time `.npmrc` + a `read:packages` token, then `import` components.

> Prerequisites: **Node 18+**, membership in the **DHSPL-Tatvacare** org, and a
> `read:packages` token (exported as `NPM_TOKEN`).

---

## 1. Scaffold a React app

```bash
npm create vite@latest tesseract-trial -- --template react
cd tesseract-trial
```

## 2. Install

Add a `.npmrc` in the project root (token via the `NPM_TOKEN` env var), then install:
```ini
@dhspl-tatvacare:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${NPM_TOKEN}
```
```bash
npm install                                   # the Vite app's own deps
npm install @dhspl-tatvacare/tesseract-ui     # the design system
```

## 3. Wire it up once — `src/main.jsx`

```jsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@dhspl-tatvacare/tesseract-ui/styles.css";          // tokens + all styles
import { TesseractThemeProvider } from "@dhspl-tatvacare/tesseract-ui";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <TesseractThemeProvider colorScheme="light">
      <App />
    </TesseractThemeProvider>
  </StrictMode>
);
```

Add the fonts in **`index.html`** inside `<head>`:
```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Mulish:wght@600;700;800&display=swap" rel="stylesheet" />
```

## 4. Use some components — `src/App.jsx`

```jsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter,
         Button, Badge, TPIcon } from "@dhspl-tatvacare/tesseract-ui";

export default function App() {
  return (
    <div style={{ maxWidth: 420, margin: "64px auto" }}>
      <Card variant="elevated">
        <CardHeader>
          <CardTitle>Patient summary</CardTitle>
          <CardDescription>MRN-10231 · updated 2h ago</CardDescription>
        </CardHeader>
        <CardContent>
          3 active prescriptions · 1 pending lab result <Badge color="warning" variant="soft" size="sm">Review</Badge>
        </CardContent>
        <CardFooter>
          <Button variant="solid" theme="primary" leftIcon={<TPIcon name="add" size={16} />}>
            Add note
          </Button>
          <Button variant="ghost" theme="neutral">Dismiss</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
```

## 5. Run it

```bash
npm run dev
```
Open the printed `localhost` URL — you should see the Tesseract card, buttons, and icons
rendering with the brand tokens.

---

## Updating to a newer version

```bash
npm update @dhspl-tatvacare/tesseract-ui
```
You only ever get patches/minors within `1.x` — never a breaking change (see
[PREREQUISITE.md](./PREREQUISITE.md)). To pin an exact version:
`npm install @dhspl-tatvacare/tesseract-ui@1.0.6`.

## Troubleshooting

| Symptom | Fix |
|---|---|
| `401` / `404` for the package | Check the `.npmrc` scope line + that `NPM_TOKEN` (a `read:packages` token) is exported, and that you're in the **DHSPL-Tatvacare** org. |
| Components render unstyled | You forgot `import "@dhspl-tatvacare/tesseract-ui/styles.css"` in `main.jsx`. |
| Fonts look generic | Add the Google Fonts `<link>` from step 3. |
| Icons don't appear | They load from the CDN at runtime — check the network tab isn't blocked; nothing to install locally. |

## Want the AI page-builder too?

Beyond the components, you can ground Claude in our system so it builds whole pages
correctly (the `/tesseract` skill + the MCP). See [../STARTER.md](../STARTER.md) · [CONNECT-MCP.md](./CONNECT-MCP.md).
