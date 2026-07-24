// Authorization Server metadata (RFC 8414). claude.ai fetches this at
// /.well-known/oauth-authorization-server (rewritten here in vercel.json).
import { baseUrl } from "../_lib/oauth.js";

export default function handler(req, res) {
  const base = baseUrl(req);
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.status(200).json({
    issuer: base,
    authorization_endpoint: `${base}/api/oauth/authorize`,
    token_endpoint: `${base}/api/oauth/token`,
    registration_endpoint: `${base}/api/oauth/register`,
    response_types_supported: ["code"],
    grant_types_supported: ["authorization_code", "refresh_token"],
    code_challenge_methods_supported: ["S256"],
    token_endpoint_auth_methods_supported: ["none"],
    scopes_supported: ["blog"],
  });
}
