// Protected Resource metadata (RFC 9728). Points the client at this
// deployment as its own authorization server.
import { baseUrl } from "../_lib/oauth.js";

export default function handler(req, res) {
  const base = baseUrl(req);
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.status(200).json({
    resource: `${base}/api/mcp`,
    authorization_servers: [base],
    scopes_supported: ["blog"],
    bearer_methods_supported: ["header"],
  });
}
