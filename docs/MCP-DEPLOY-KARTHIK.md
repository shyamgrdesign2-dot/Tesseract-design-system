# Tesseract MCP — deploy steps (Karthik)

The co-host code is merged to `tesseract`. On this deploy, the container will run
**nginx + a small Node MCP**, and the MCP goes live at
**`https://tesseract.tatvapractice.in/mcp`** (same site, same port, no DNS change).

Your steps:

## 1. Watch the first image build
The runtime image now also installs **Node** and runs the MCP next to nginx (new
`Dockerfile`). Please confirm **the build + container start succeed** on this deploy —
the code was written and Node-tested on our side, but **not Docker-built** (no Docker in
that env). If the build fails or the container won't start, ping the DS team.

## 2. Set the access token (bearer)
```bash
# generate + store the secret
az containerapp secret set -n <app-name> -g <resource-group> \
  --secrets mcp-token=$(openssl rand -hex 32)

# expose it as the env var the MCP reads
az containerapp update -n <app-name> -g <resource-group> \
  --set-env-vars TESSERACT_MCP_TOKEN=secretref:mcp-token
```
*Portal equivalent:* Container App → **Secrets** → add `mcp-token`; then **Containers → env
vars** → add `TESSERACT_MCP_TOKEN` → *reference secret* `mcp-token`.

> Leave it unset → the MCP runs **open** (same exposure as the already-public Storybook).
> Set it → every request must send `Authorization: Bearer <token>`.

## 3. Verify
```bash
# health (always open) → 200
curl -s -o /dev/null -w "%{http_code}\n" https://tesseract.tatvapractice.in/health

# MCP without a token → 401 (if token set) ; and the Storybook still loads normally
curl -s -o /dev/null -w "%{http_code}\n" -X POST https://tesseract.tatvapractice.in/mcp -d '{}'
```

## 4. Share the token
Send it to the DS team (via a password manager, not chat/repo). Devs connect with the URL
+ `Authorization: Bearer <token>` — config is in `docs/CONNECT-MCP.md`.

## Notes
- **Ingress unchanged** — same external port `8080`; `/mcp` rides the same origin.
- **Rotation** — change the secret value + restart the revision → re-share.
- **Co-host tradeoff** — if the Node MCP crashes, nginx keeps serving the Storybook but
  `/mcp` returns `502` until a container restart (no in-container supervisor). Fine for v1;
  we can move to a sidecar/separate app later if you want auto-restart.
