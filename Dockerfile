# syntax=docker/dockerfile:1

###############################################################################
# Stage 1 — build the static Storybook (needs the full devDependencies)
###############################################################################
FROM node:20-alpine AS build
WORKDIR /app

# Storybook's Vitest addon depends on Playwright. We only build the static site
# here, so never pull Chromium into the image — it's slow and huge.
ENV PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1 \
    NODE_OPTIONS=--max-old-space-size=4096 \
    CI=1

# 1) Install deps first — this layer is cached until the lockfile changes,
#    so source-only edits don't re-run `npm ci`.
COPY package.json package-lock.json ./
RUN npm ci

# 2) Copy the source and build → /app/storybook-static
#    (`npm run build` = tsc -b && storybook build; output dir from vercel.json)
COPY . .
RUN npm run build

###############################################################################
# Stage 2 — serve the static output with a tiny, non-root nginx.
# nginx-unprivileged runs as uid 101 and listens on :8080 — exactly what
# Azure Container Apps wants (non-root + a single HTTP port).
###############################################################################
FROM nginxinc/nginx-unprivileged:stable-alpine AS runtime

# Static-site server config (gzip, asset caching, SPA fallback) on :8080.
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Ship ONLY the built assets — no node_modules, no source.
COPY --from=build /app/storybook-static /usr/share/nginx/html

EXPOSE 8080

# Liveness for local/docker runs; Azure Container Apps uses its own probes.
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -qO- http://127.0.0.1:8080/ >/dev/null 2>&1 || exit 1

# The base image's entrypoint already starts nginx as a non-root user.
