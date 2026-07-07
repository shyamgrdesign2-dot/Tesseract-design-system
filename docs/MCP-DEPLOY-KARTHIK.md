# Tesseract MCP — deploy steps (Karthik)

**Status: the MCP is DEPLOYED and LIVE** at **`https://tesseract.tatvapractice.in/mcp`**
(co-hosted in the Storybook container). It is currently running **OPEN** (no token).
Verified: `GET /mcp/health` → `{"status":"ok","components":50,...,"auth":"off"}`, and the
Storybook is unaffected.

**Your one remaining step: set the bearer token to gate it (step 2).** Steps 1 & 3 are
just for reference / verification.

## 1. (done) The image build
The runtime image now installs **Node** and runs the MCP next to nginx. This built and
deployed successfully; the Node process is up (health shows 50 components).

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

## 3. Verify (after setting the token)
```bash
# health (always open) → 200 + {"auth":"on"} once the token is set
curl -s https://tesseract.tatvapractice.in/mcp/health

# MCP WITHOUT the token → 401 (proves the gate is on)
curl -s -o /dev/null -w "%{http_code}\n" -X POST https://tesseract.tatvapractice.in/mcp -d '{}'
```
(Note the health path is **`/mcp/health`** — only `/mcp*` reaches the MCP; plain `/…`
serves the Storybook.)

## 4. Share the token
Send it to the DS team (via a password manager, not chat/repo). Devs connect with the URL
+ `Authorization: Bearer <token>` — config is in `docs/CONNECT-MCP.md`.

## Notes
- **Ingress unchanged** — same external port `8080`; `/mcp` rides the same origin.
- **Rotation** — change the secret value + restart the revision → re-share.
- **Co-host tradeoff** — if the Node MCP crashes, nginx keeps serving the Storybook but
  `/mcp` returns `502` until a container restart (no in-container supervisor). Fine for v1;
  we can move to a sidecar/separate app later if you want auto-restart.
