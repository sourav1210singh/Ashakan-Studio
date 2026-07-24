// Dynamic Client Registration (RFC 7591), stateless: the returned
// client_id is a signed blob that encodes the client's redirect_uris,
// so /authorize can validate redirect_uri later without any storage.
import { sign, baseUrl } from "../_lib/oauth.js";

export default function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("Access-Control-Allow-Origin", "*");
  if (req.method === "OPTIONS") { res.status(204).end(); return; }
  if (req.method !== "POST") { res.status(405).json({ error: "POST only" }); return; }

  const body = req.body || {};
  const redirectUris = Array.isArray(body.redirect_uris) ? body.redirect_uris.filter((u) => typeof u === "string") : [];
  if (redirectUris.length === 0) {
    res.status(400).json({ error: "invalid_client_metadata", error_description: "redirect_uris is required" });
    return;
  }

  // client_id valid for 180 days; re-registration is cheap and automatic.
  const clientId = sign("cid", { redirect_uris: redirectUris }, 180 * 24 * 3600);

  res.status(201).json({
    client_id: clientId,
    token_endpoint_auth_method: "none",
    grant_types: ["authorization_code", "refresh_token"],
    response_types: ["code"],
    redirect_uris: redirectUris,
    client_name: typeof body.client_name === "string" ? body.client_name : "Ashkan Blog Client",
    client_id_issued_at: Math.floor(Date.now() / 1000),
  });
}
