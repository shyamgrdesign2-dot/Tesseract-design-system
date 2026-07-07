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

# Add Node so we can CO-HOST the Tesseract MCP (Streamable HTTP) next to nginx —
# both run non-root in one container; nginx reverse-proxies /mcp → the MCP on :8787.
USER root
RUN apk add --no-cache nodejs
USER 101

# Static-site server config (gzip, asset caching, SPA fallback) + /mcp proxy on :8080.
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Static Storybook.
COPY --from=build /app/storybook-static /usr/share/nginx/html

# The bundled MCP (HTTP, self-contained — no node_modules) + the data it reads
# at runtime. Paths: http-server.mjs → ../manifest and ../../design.md resolve to
# /app/mcp/manifest and /app/design.md below.
COPY mcp/dist/http-server.mjs /app/mcp/dist/http-server.mjs
COPY mcp/manifest             /app/mcp/manifest
COPY design.md                /app/design.md

# Start the MCP in the background before nginx. The base image's entrypoint runs
# /docker-entrypoint.d/*.sh (this script backgrounds Node) then execs nginx.
COPY mcp/docker-start-mcp.sh /docker-entrypoint.d/40-tesseract-mcp.sh

# MCP internals. Set TESSERACT_MCP_TOKEN in the Container App to require a bearer
# token; leave it unset to run open (matches the already-public Storybook).
ENV PORT=8787 MCP_PATH=/mcp

EXPOSE 8080

# Liveness for local/docker runs; Azure Container Apps uses its own probes.
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -qO- http://127.0.0.1:8080/ >/dev/null 2>&1 || exit 1

# The base image's entrypoint runs the MCP starter then launches nginx (non-root).
