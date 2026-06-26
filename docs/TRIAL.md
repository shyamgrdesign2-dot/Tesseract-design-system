# Try Tesseract in a fresh local project (5 minutes)

A copy-paste walkthrough: spin up a brand-new React app and use the Tesseract
design system in it, installed from our **private GitHub Packages registry**.
No design-system source is copied into your app — it installs as a normal
dependency and you just `import` components.

> Prerequisites: **Node 18+**, and your GitHub account is a member of the
> **DHSPL-Tatvacare** org (that's what gates access).

---

## 1. Get a GitHub token (one-time, reusable for every project)

The registry is private, so npm needs a token to read it.

1. GitHub → your avatar → **Settings** → **Developer settings** →
   **Personal access tokens** → **Tokens (classic)** → **Generate new token (classic)**.
2. Tick the **`read:packages`** scope. (Tick `repo` too if you'll use the git fallback in §7.)
3. Generate, copy the token (`ghp_…`).
4. Put it in your shell so it's available to npm — add this line to `~/.zshrc`
   (or `~/.bashrc`), then restart the terminal:
   ```bash
   export GITHUB_TOKEN=ghp_your_token_here
   ```

---

## 2. Scaffold a React app

```bash
npm create vite@latest tesseract-trial -- --template react
cd tesseract-trial
```

## 3. Point npm at the registry

Create a file named **`.npmrc`** in the project root with exactly:

```ini
@dhspl-tatvacare:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
```

(The `${GITHUB_TOKEN}` reads the env var from step 1 — never paste the raw token here.)

## 4. Install

```bash
npm install                                   # the Vite app's own deps
npm install @dhspl-tatvacare/tesseract-ui     # the design system
```

## 5. Wire it up once — `src/main.jsx`

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

## 6. Use some components — `src/App.jsx`

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

## 7. Run it

```bash
npm run dev
```
Open the printed `localhost` URL — you should see the Tesseract card, buttons, and
icons rendering with the brand tokens.

---

## Updating to a newer version

```bash
npm update @dhspl-tatvacare/tesseract-ui
```
You only ever get patches/minors within `1.x` — never a breaking change (see
[PREREQUISITE.md](./PREREQUISITE.md)). To pin an exact version:
`npm install @dhspl-tatvacare/tesseract-ui@1.0.1`.

## No-token fallback (quick spike, git-gated instead of registry)

If you'd rather not set up the token, install the prebuilt bundle straight from
the repo by tag (you just need git access to the repo):
```bash
npm install github:DHSPL-Tatvacare/tesseract-design-system#v1.0.1
```
Everything from step 5 onward is identical. Prefer the registry for real projects —
the git install doesn't give true semver ranges.

## Troubleshooting

| Symptom | Fix |
|---|---|
| `401 Unauthorized` / `403` on install | Token missing/expired, or no `read:packages` scope. Re-check step 1; make sure `echo $GITHUB_TOKEN` prints it. |
| `404 Not Found` for the package | Your GitHub account isn't in the **DHSPL-Tatvacare** org, or the `.npmrc` scope line is missing. |
| Components render unstyled | You forgot `import "@dhspl-tatvacare/tesseract-ui/styles.css"` in `main.jsx`. |
| Fonts look generic | Add the Google Fonts `<link>` from step 5. |
| Icons don't appear | They load from the CDN at runtime — check the network tab isn't blocked; nothing to install locally. |

## Want the AI page-builder too?

Beyond the components, you can ground Claude in our system so it builds whole pages
correctly (the `/tesseract` skill + the MCP). See [USING-TESSERACT.md](./USING-TESSERACT.md).
