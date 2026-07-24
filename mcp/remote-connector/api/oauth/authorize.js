// Authorization endpoint. GET renders the login page; POST checks the
// username + password and, on success, issues a short-lived auth code
// and redirects back to the client. This is the "login" the user sees
// when they connect the connector.
import crypto from "crypto";
import { sign, verify, baseUrl } from "../_lib/oauth.js";

function timingEqual(a, b) {
  const x = Buffer.from(String(a));
  const y = Buffer.from(String(b));
  if (x.length !== y.length) return false;
  return crypto.timingSafeEqual(x, y);
}

function validateClientAndRedirect(clientId, redirectUri) {
  const client = verify("cid", clientId);
  if (!client) return { error: "invalid client_id (re-register or reconnect)" };
  if (!client.redirect_uris.includes(redirectUri)) return { error: "redirect_uri not registered for this client" };
  return { ok: true };
}

function loginPage({ base, q, error }) {
  const hidden = ["client_id", "redirect_uri", "state", "code_challenge", "code_challenge_method", "response_type", "scope"]
    .map((k) => `<input type="hidden" name="${k}" value="${escapeHtml(q[k] || "")}">`)
    .join("");
  return `<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Sign in — Ashkan Studios Blog</title>
<style>
  :root{color-scheme:light dark}
  *{box-sizing:border-box}
  body{margin:0;min-height:100vh;display:grid;place-items:center;background:#1A1A1A;
    font-family:"Helvetica Neue",Helvetica,Arial,sans-serif;color:#F5F5F0;padding:24px}
  .card{width:100%;max-width:380px;background:#F5F5F0;color:#1A1A1A;padding:40px 34px}
  .brand{font-weight:700;font-size:26px;letter-spacing:8px;text-align:center}
  .sub{font-size:11px;letter-spacing:5px;color:#8f8a7f;text-align:center;margin-top:4px}
  h1{font-size:15px;letter-spacing:2px;text-transform:uppercase;margin:28px 0 6px}
  p.hint{font-size:13px;color:#6f6a60;margin:0 0 22px;line-height:1.5}
  label{display:block;font-size:11px;letter-spacing:1.5px;text-transform:uppercase;color:#9a958a;margin:16px 0 6px}
  input[type=text],input[type=password]{width:100%;padding:12px 14px;border:1px solid #d8d3c6;
    background:#fff;font-size:15px;color:#1A1A1A}
  input:focus{outline:2px solid #1A1A1A;outline-offset:0}
  button{width:100%;margin-top:26px;padding:14px;background:#1A1A1A;color:#F5F5F0;border:0;
    font-size:12px;font-weight:700;letter-spacing:2px;text-transform:uppercase;cursor:pointer}
  .err{margin-top:18px;padding:10px 12px;background:#f6dcdc;color:#8a1c1c;font-size:13px}
  .foot{margin-top:24px;font-size:11px;color:#9a958a;text-align:center;letter-spacing:.3px}
</style></head><body>
<form class="card" method="post" action="${base}/api/oauth/authorize">
  <div class="brand">ASHKAN</div><div class="sub">— STUDIOS —</div>
  <h1>Blog Connector Sign-in</h1>
  <p class="hint">Enter the connector username and password to let this app publish to the Storytime blog.</p>
  ${error ? `<div class="err">${escapeHtml(error)}</div>` : ""}
  <label>Username</label>
  <input type="text" name="username" autocomplete="username" autofocus required>
  <label>Password</label>
  <input type="password" name="password" autocomplete="current-password" required>
  ${hidden}
  <button type="submit">Sign in &amp; allow</button>
  <div class="foot">Ashkan Studios · secure connector</div>
</form></body></html>`;
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

export default function handler(req, res) {
  const base = baseUrl(req);
  res.setHeader("Cache-Control", "no-store");
  const q = req.method === "POST" ? { ...(req.body || {}) } : { ...(req.query || {}) };

  // Shared validation
  if (q.response_type !== "code") {
    res.status(400).send("response_type must be 'code'");
    return;
  }
  if (q.code_challenge_method !== "S256" || !q.code_challenge) {
    res.status(400).send("PKCE S256 code_challenge is required");
    return;
  }
  const check = validateClientAndRedirect(q.client_id, q.redirect_uri);
  if (check.error) {
    res.status(400).send(check.error);
    return;
  }

  if (req.method === "GET") {
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.status(200).send(loginPage({ base, q, error: null }));
    return;
  }
  if (req.method !== "POST") {
    res.status(405).send("GET or POST only");
    return;
  }

  // POST: verify credentials
  const user = process.env.MCP_LOGIN_USER || "";
  const pass = process.env.MCP_LOGIN_PASS || "";
  if (!user || !pass) {
    res.status(500).send("Connector login is not configured (MCP_LOGIN_USER / MCP_LOGIN_PASS).");
    return;
  }
  const good = timingEqual(q.username || "", user) & timingEqual(q.password || "", pass);
  if (!good) {
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.status(401).send(loginPage({ base, q, error: "Wrong username or password. Try again." }));
    return;
  }

  // Success → issue auth code (5 min), bound to redirect_uri + PKCE.
  const code = sign("code", {
    redirect_uri: q.redirect_uri,
    code_challenge: q.code_challenge,
    client_id: q.client_id,
  }, 300);

  const url = new URL(q.redirect_uri);
  url.searchParams.set("code", code);
  if (q.state) url.searchParams.set("state", q.state);
  res.setHeader("Location", url.toString());
  res.status(302).end();
}
