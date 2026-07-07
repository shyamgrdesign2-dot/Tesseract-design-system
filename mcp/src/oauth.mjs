/**
 * Minimal, STATELESS OAuth 2.1 Authorization Server for the Tesseract MCP.
 *
 * Why this exists: Claude's web/Desktop "Connectors" UI authenticates a remote MCP
 * server via OAuth (Dynamic Client Registration + authorization-code + PKCE), not a
 * static bearer header. This module gives the hosted MCP exactly that surface so it
 * can be added as a custom connector — while the existing static-bearer path (used by
 * Claude Code / the plugin) keeps working untouched.
 *
 * Stateless by design: client_ids, authorization codes, and access/refresh tokens are
 * all HMAC-signed, self-describing strings (no database, safe across replicas/restarts).
 * The signing key is the same shared secret that gates the MCP (TESSERACT_MCP_TOKEN),
 * so there is nothing new to provision.
 *
 * The gate is preserved: the /authorize consent screen requires the shared Tesseract
 * token. Only someone who has it can complete the flow and obtain an access token.
 *
 * Endpoints (all mounted at the site root; nginx proxies them to this process):
 *   GET  /.well-known/oauth-protected-resource   (RFC 9728)
 *   GET  /.well-known/oauth-authorization-server  (RFC 8414)
 *   POST /register                                (RFC 7591 Dynamic Client Registration)
 *   GET  /authorize                               (consent screen)
 *   POST /authorize                               (consent submit -> auth code)
 *   POST /token                                   (code|refresh -> access token)
 */

import crypto from "node:crypto";

const b64url = (buf) => Buffer.from(buf).toString("base64url");
const fromB64url = (s) => Buffer.from(s, "base64url");

// ---- signed, self-describing tokens (payload.signature) -------------------
const sign = (payloadStr, secret) =>
  crypto.createHmac("sha256", secret).update(payloadStr).digest("base64url");

const mint = (obj, secret) => {
  const p = b64url(JSON.stringify(obj));
  return `${p}.${sign(p, secret)}`;
};

const verify = (token, secret) => {
  if (typeof token !== "string" || token.indexOf(".") < 0) return null;
  const [p, sig] = token.split(".");
  if (!p || !sig) return null;
  const expected = sign(p, secret);
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
  let obj;
  try { obj = JSON.parse(fromB64url(p).toString()); } catch { return null; }
  if (obj.exp && Date.now() > obj.exp) return null;
  return obj;
};

const timingEq = (a, b) => {
  const x = Buffer.from(String(a));
  const y = Buffer.from(String(b));
  return x.length === y.length && crypto.timingSafeEqual(x, y);
};

const s256 = (v) => crypto.createHash("sha256").update(v).digest("base64url");

const esc = (s) =>
  String(s).replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

const json = (res, code, obj, headers = {}) => {
  res.writeHead(code, { "content-type": "application/json", "cache-control": "no-store", ...headers });
  res.end(JSON.stringify(obj));
};
const html = (res, code, body) => {
  res.writeHead(code, { "content-type": "text/html; charset=utf-8", "cache-control": "no-store" });
  res.end(body);
};

// ---- Dynamic Client Registration: client_id self-encodes its redirect_uris ----
const registerClient = (body, secret) => {
  const ruris = Array.isArray(body?.redirect_uris) ? body.redirect_uris.filter((u) => typeof u === "string") : [];
  const meta = { ruris, iat: Date.now() };
  const client_id = "c_" + mint(meta, secret);
  return {
    client_id,
    client_id_issued_at: Math.floor(meta.iat / 1000),
    redirect_uris: ruris,
    token_endpoint_auth_method: "none",
    grant_types: ["authorization_code", "refresh_token"],
    response_types: ["code"],
    ...(body?.client_name ? { client_name: body.client_name } : {}),
    ...(body?.scope ? { scope: body.scope } : {}),
  };
};

const getClient = (client_id, secret) => {
  if (typeof client_id !== "string" || !client_id.startsWith("c_")) return null;
  const meta = verify(client_id.slice(2), secret);
  return meta ? { client_id, redirect_uris: meta.ruris || [] } : null;
};

// ---- metadata documents ----------------------------------------------------
const asMetadata = (issuer) => ({
  issuer,
  authorization_endpoint: `${issuer}/authorize`,
  token_endpoint: `${issuer}/token`,
  registration_endpoint: `${issuer}/register`,
  scopes_supported: ["tesseract"],
  response_types_supported: ["code"],
  grant_types_supported: ["authorization_code", "refresh_token"],
  token_endpoint_auth_methods_supported: ["none"],
  code_challenge_methods_supported: ["S256"],
});

const prMetadata = (issuer, resource) => ({
  resource,
  authorization_servers: [issuer],
  bearer_methods_supported: ["header"],
  scopes_supported: ["tesseract"],
});

// ---- consent screen --------------------------------------------------------
const consentPage = (params, { error } = {}) => {
  const hidden = ["client_id", "redirect_uri", "state", "code_challenge", "code_challenge_method", "scope", "response_type", "resource"]
    .map((k) => (params[k] != null ? `<input type="hidden" name="${esc(k)}" value="${esc(params[k])}">` : ""))
    .join("");
  return `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Connect Tesseract MCP</title><style>
:root{color-scheme:light dark}
body{font:15px/1.5 -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;margin:0;display:grid;place-items:center;min-height:100vh;background:#0b0f17;color:#e8edf5}
.card{width:min(92vw,380px);background:#121826;border:1px solid #223;border-radius:16px;padding:28px}
h1{font-size:18px;margin:0 0 4px}p{color:#9fb0c8;margin:0 0 18px;font-size:13px}
label{display:block;font-size:12px;color:#9fb0c8;margin:0 0 6px}
input[type=password]{width:100%;box-sizing:border-box;padding:11px 12px;border-radius:10px;border:1px solid #2b3a52;background:#0b0f17;color:#e8edf5;font-size:14px}
button{width:100%;margin-top:16px;padding:11px;border:0;border-radius:10px;background:#3b82f6;color:#fff;font-size:14px;font-weight:600;cursor:pointer}
.err{color:#f87171;font-size:12px;margin-top:10px}
.brand{font-weight:700;letter-spacing:.02em}
</style></head><body><form class="card" method="post" action="/authorize">
<h1>Connect to <span class="brand">Tesseract</span></h1>
<p>Enter the Tesseract MCP access token to allow this client to read components, tokens, icons and rules.</p>
<label for="t">Access token</label>
<input id="t" type="password" name="access_token" autocomplete="off" autofocus placeholder="Bearer token from the DS team">
${error ? `<div class="err">${esc(error)}</div>` : ""}
${hidden}
<button type="submit">Authorize</button>
</form></body></html>`;
};

// ---- validate a presented access token (used by the /mcp gate) -------------
export const verifyAccessToken = (authHeader, secret) => {
  if (typeof authHeader !== "string" || !authHeader.startsWith("Bearer ")) return false;
  const payload = verify(authHeader.slice(7), secret);
  return !!(payload && payload.t === "at");
};

/**
 * Handle an OAuth request. Returns true if it consumed the request.
 * ctx = { pathname, method, query (URLSearchParams), rawBody (string), issuer, resource, gateToken, secret }
 */
export const handleOAuth = (req, res, ctx) => {
  const { pathname, method, query, rawBody, issuer, resource, gateToken, secret } = ctx;

  // --- discovery metadata ---
  if (pathname === "/.well-known/oauth-protected-resource") {
    return json(res, 200, prMetadata(issuer, resource)), true;
  }
  if (pathname === "/.well-known/oauth-authorization-server") {
    return json(res, 200, asMetadata(issuer)), true;
  }

  // --- dynamic client registration ---
  if (pathname === "/register") {
    if (method !== "POST") return json(res, 405, { error: "method_not_allowed" }), true;
    let body = {};
    try { body = rawBody ? JSON.parse(rawBody) : {}; } catch { return json(res, 400, { error: "invalid_client_metadata" }), true; }
    return json(res, 201, registerClient(body, secret)), true;
  }

  // --- authorization endpoint ---
  if (pathname === "/authorize") {
    const p = method === "POST"
      ? Object.fromEntries(new URLSearchParams(rawBody || ""))
      : Object.fromEntries(query || new URLSearchParams());

    const client = getClient(p.client_id, secret);
    // redirect_uri / client errors must NOT redirect (RFC 6749 §4.1.2.1)
    if (!client) return html(res, 400, "invalid client_id"), true;
    if (!p.redirect_uri || !client.redirect_uris.includes(p.redirect_uri)) {
      return html(res, 400, "invalid redirect_uri"), true;
    }
    const redirectErr = (err) => {
      const u = new URL(p.redirect_uri);
      u.searchParams.set("error", err);
      if (p.state) u.searchParams.set("state", p.state);
      res.writeHead(302, { location: u.toString() });
      res.end();
      return true;
    };
    if (p.response_type !== "code") return redirectErr("unsupported_response_type");
    if (!p.code_challenge || p.code_challenge_method !== "S256") return redirectErr("invalid_request");

    if (method === "GET") return html(res, 200, consentPage(p)), true;

    // POST = consent submit; require the shared gate token
    if (!gateToken || !timingEq(p.access_token || "", gateToken)) {
      return html(res, 200, consentPage(p, { error: "Incorrect token. Try again." })), true;
    }
    const code = mint(
      { t: "code", cid: p.client_id, ruri: p.redirect_uri, cc: p.code_challenge, scope: p.scope || "tesseract", exp: Date.now() + 5 * 60_000 },
      secret,
    );
    const u = new URL(p.redirect_uri);
    u.searchParams.set("code", code);
    if (p.state) u.searchParams.set("state", p.state);
    res.writeHead(302, { location: u.toString() });
    res.end();
    return true;
  }

  // --- token endpoint ---
  if (pathname === "/token") {
    if (method !== "POST") return json(res, 405, { error: "invalid_request" }), true;
    const p = Object.fromEntries(new URLSearchParams(rawBody || ""));
    const issue = (scope) => {
      const now = Date.now();
      return {
        access_token: mint({ t: "at", sub: "tesseract", scope, iat: now, exp: now + 3600_000 }, secret),
        token_type: "Bearer",
        expires_in: 3600,
        refresh_token: mint({ t: "rt", sub: "tesseract", scope, iat: now, exp: now + 30 * 864e5 }, secret),
        scope,
      };
    };

    if (p.grant_type === "authorization_code") {
      const code = verify(p.code, secret);
      if (!code || code.t !== "code") return json(res, 400, { error: "invalid_grant" }), true;
      if (code.cid !== p.client_id || code.ruri !== p.redirect_uri) return json(res, 400, { error: "invalid_grant" }), true;
      if (!p.code_verifier || s256(p.code_verifier) !== code.cc) return json(res, 400, { error: "invalid_grant" }), true;
      return json(res, 200, issue(code.scope || "tesseract")), true;
    }
    if (p.grant_type === "refresh_token") {
      const rt = verify(p.refresh_token, secret);
      if (!rt || rt.t !== "rt") return json(res, 400, { error: "invalid_grant" }), true;
      return json(res, 200, issue(rt.scope || "tesseract")), true;
    }
    return json(res, 400, { error: "unsupported_grant_type" }), true;
  }

  return false;
};
