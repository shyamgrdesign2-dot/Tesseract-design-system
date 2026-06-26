# Protecting the deployed Storybook

The deployed Storybook (Vercel → `storybook-static`) is gated by a **password
login screen** so casual visitors can't browse it. There are two layers; use the
one that matches how much protection you actually need.

---

## Layer 1 — the built-in login gate (active now)

A login screen is injected into the Storybook manager via
[`.storybook/manager-head.html`](../.storybook/manager-head.html). On the live
site, visitors see a Tatvacare-branded password screen before the Storybook loads.
A correct password unlocks it for that browser session (`sessionStorage`).

> ⚠️ **This is a deterrent, not real security.** The password *hashes* ship inside
> the page's JavaScript, so a determined person can bypass it (read the bundle, or
> open a story's `iframe.html` directly). It's the right amount of lock for a
> component library with no sensitive data — it is **not** suitable for anything
> confidential. For that, use Layer 2.

### Change / add / remove passwords

Passwords are stored only as **SHA-256 hashes** in `manager-head.html` (the
plaintext is never committed). To set a new one:

```bash
node -e 'console.log(require("crypto").createHash("sha256").update("YOUR_NEW_PASSWORD").digest("hex"))'
```

Paste the resulting hash into the `HASHES` array in
[`.storybook/manager-head.html`](../.storybook/manager-head.html) (add, replace, or
delete entries — any listed password works). Commit, and the next deploy picks it
up. Share the plaintext with your team out-of-band (chat/password manager), never
in the repo.

> Note: the gate covers the Storybook **manager** (the normal entry point). It does
> not block direct `…/iframe.html?id=…` deep-links to a single component. Layer 2
> closes that gap.

---

## Layer 2 — Vercel Deployment Protection (real, server-side)

For genuine access control, turn on Vercel's built-in protection — it gates the
deployment at the edge (before any file is served), so nothing is bypassable from
the browser, and it needs **zero code**.

In the Vercel dashboard for this project:

1. **Settings → Deployment Protection.**
2. Choose one:
   - **Password Protection** — one shared password for the whole deployment.
   - **Vercel Authentication** — only members of your Vercel team can view it (SSO).
3. Save and redeploy.

(Password Protection / advanced protection may require a Vercel Pro plan — check
your plan.) With Layer 2 on, you can keep Layer 1 as the branded landing screen or
remove it — Layer 2 is what actually secures the site.

---

## Recommendation

- **Internal-only design system, low sensitivity:** Layer 1 is fine on its own.
- **Anything you truly need locked down:** enable Layer 2 (Vercel) — and treat
  Layer 1 purely as branding.
