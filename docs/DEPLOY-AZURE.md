# Deploy the Storybook to Azure Container Apps

The container builds the static Storybook and serves it with a tiny non-root nginx
on port **8080**, and **co-hosts the Tesseract MCP** — nginx reverse-proxies `/mcp`
and the OAuth endpoints to a Node process in the same container (see
[CONNECT-MCP.md](./CONNECT-MCP.md)). Access to the deployed site is protected at the
platform level (see [DEPLOY-AUTH.md](./DEPLOY-AUTH.md)).

Files: [`Dockerfile`](../Dockerfile) · [`nginx.conf`](../nginx.conf) · [`.dockerignore`](../.dockerignore)

## Prerequisites
- An Azure Container Registry (ACR) and a Container Apps environment.
- `az` CLI logged in (`az login`), with the `containerapp` extension
  (`az extension add -n containerapp`).

Set some shell vars:
```bash
RG=tesseract-rg                 # resource group
LOC=centralindia                # region
ACR=tesseractacr                # registry name (must be globally unique)
ENV=tesseract-env               # Container Apps environment
APP=tesseract-storybook
TAG=1.0.6
```

## 1. Build the image (in ACR — no local Docker needed)
```bash
az acr build -r $ACR -t $APP:$TAG .
```
(Or locally: `docker build -t $ACR.azurecr.io/$APP:$TAG . && docker push $ACR.azurecr.io/$APP:$TAG`.)

## 2. Create the Container App
```bash
az containerapp create \
  -n $APP -g $RG \
  --environment $ENV \
  --image $ACR.azurecr.io/$APP:$TAG \
  --registry-server $ACR.azurecr.io \
  --target-port 8080 \
  --ingress external \
  --cpu 0.5 --memory 1.0Gi \
  --min-replicas 1 --max-replicas 3
```
- `--target-port 8080` must match the nginx port — this is the key ACA setting.
- A static site is tiny: `0.25` CPU / `0.5Gi` is plenty if you want to trim.
- `--min-replicas 0` enables scale-to-zero (cheapest; adds a cold start). Use `1`
  to keep it always warm.

The command prints the public FQDN — open it and you'll hit the login gate.

## 3. Ship a new version later
```bash
az acr build -r $ACR -t $APP:$NEWTAG .
az containerapp update -n $APP -g $RG --image $ACR.azurecr.io/$APP:$NEWTAG
```

## Notes
- **Non-root:** the runtime image (`nginx-unprivileged`) runs as uid 101 — no extra
  ACA security config needed.
- **Icons/fonts** load from the CDN + Google Fonts at runtime, so outbound HTTPS
  must be allowed (it is by default on ACA).
- **Health:** ACA's own HTTP probe on `:8080/` is enough; the Dockerfile also has a
  `HEALTHCHECK` for local runs.
- **Auto-deploy (already wired):** pushing to the **`tesseract`** branch triggers a
  GitHub Action that builds the image in ACR and rolls a new revision. A failed build
  keeps the last-good revision, so prod stays up.
- **MCP env / secret:** the co-hosted MCP reads `TESSERACT_MCP_TOKEN` (a Container App
  **secret** — gates the MCP and signs the OAuth tokens) and `MCP_PUBLIC_ORIGIN` (baked
  in the Dockerfile = the public https origin used to build OAuth issuer URLs). `PORT`
  must never be set — Azure treats it specially; the MCP uses `MCP_PORT` (8787) instead.
