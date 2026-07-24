// Token endpoint. Exchanges an authorization code (+ PKCE verifier) for
// an access token + refresh token, and refreshes access tokens. All
// tokens are stateless HMAC-signed (see _lib/oauth.js).
import { sign, verify, pkceMatches } from "../_lib/oauth.js";

const ACCESS_TTL = 24 * 3600;        // 24 hours
const REFRESH_TTL = 90 * 24 * 3600;  // 90 days

function issueTokens() {
  return {
    access_token: sign("at", { scope: "blog" }, ACCESS_TTL),
    token_type: "Bearer",
    expires_in: ACCESS_TTL,
    refresh_token: sign("rt", { scope: "blog" }, REFRESH_TTL),
    scope: "blog",
  };
}

export default function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("Access-Control-Allow-Origin", "*");
  if (req.method === "OPTIONS") { res.status(204).end(); return; }
  if (req.method !== "POST") { res.status(405).json({ error: "invalid_request", error_description: "POST only" }); return; }

  const b = req.body || {};
  const grant = b.grant_type;

  if (grant === "authorization_code") {
    const payload = verify("code", b.code);
    if (!payload) {
      res.status(400).json({ error: "invalid_grant", error_description: "code invalid or expired" });
      return;
    }
    if (payload.redirect_uri !== b.redirect_uri) {
      res.status(400).json({ error: "invalid_grant", error_description: "redirect_uri mismatch" });
      return;
    }
    if (!pkceMatches(b.code_verifier, payload.code_challenge)) {
      res.status(400).json({ error: "invalid_grant", error_description: "PKCE verification failed" });
      return;
    }
    res.status(200).json(issueTokens());
    return;
  }

  if (grant === "refresh_token") {
    const payload = verify("rt", b.refresh_token);
    if (!payload) {
      res.status(400).json({ error: "invalid_grant", error_description: "refresh_token invalid or expired" });
      return;
    }
    res.status(200).json(issueTokens());
    return;
  }

  res.status(400).json({ error: "unsupported_grant_type", error_description: `grant_type '${grant}' not supported` });
}
