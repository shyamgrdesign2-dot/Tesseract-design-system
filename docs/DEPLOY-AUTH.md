# Protecting the deployed Storybook

> **Status: the deployed Storybook is currently OPEN (no password).** The
> client-side login gate was removed from
> [`.storybook/manager-head.html`](../.storybook/manager-head.html) — anyone with
> the URL can view it. If you need to lock it down, use platform-level protection
> (below); don't rely on a client-side gate.

---

## If you want access control

Gate the deployment **at the platform**, before any file is served — this is real,
server-side, and needs zero code in this repo.

- **Azure Container Apps** (current prod host): put the app behind
  **Authentication (Easy Auth)** or an ingress/IP restriction in the Container App
  settings, or front it with an authenticated gateway.
- **Vercel** (if deployed there): **Settings → Deployment Protection** → *Password
  Protection* (one shared password) or *Vercel Authentication* (team SSO), then
  redeploy. (May require a paid plan.)

Platform protection also covers direct `…/iframe.html?id=…` deep-links, which a
client-side gate never could.

---

## Re-adding the old client-side login gate (deterrent only)

The previous branded password screen lived entirely in `manager-head.html`. It was
a **deterrent, not security** — the password hashes shipped in the page, so it was
bypassable. If you want it back for casual friction (not real protection), restore
it from git history:

```bash
# find the commit that removed it, then restore that file from its parent
git log --oneline -- .storybook/manager-head.html
git show <commit-before-removal>:.storybook/manager-head.html > .storybook/manager-head.html
```

Passwords were stored only as SHA-256 hashes (plaintext never committed); generate a
new one with:

```bash
node -e 'console.log(require("crypto").createHash("sha256").update("YOUR_PASSWORD").digest("hex"))'
```

For anything that must actually be private, use platform protection above — not this.
