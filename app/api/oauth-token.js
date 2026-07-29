// Token-endpoint relay on Vercel.
//
// Claude's browser hits ashkanstudios.com fine, but no request from its
// BACKEND has ever reached the connector - not the old registration
// POST, not the token exchange, even though the same POST from Vercel
// arrives normally. This relay puts the token endpoint on a host that
// is provably reachable (no Cloudflare in front) and forwards to the
// real endpoint, so either the exchange starts working or the WP Engine
// log stays empty and proves Claude never calls it at all.
export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") return res.status(405).json({ error: "invalid_request" });

  // Vercel parses form bodies into an object; rebuild the encoded form.
  let body = "";
  if (typeof req.body === "string") body = req.body;
  else if (req.body && typeof req.body === "object") body = new URLSearchParams(req.body).toString();

  try {
    const r = await fetch("https://ashkanstudios.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
    });
    const text = await r.text();
    res.status(r.status);
    res.setHeader("Content-Type", r.headers.get("content-type") || "application/json");
    return res.send(text);
  } catch (e) {
    return res.status(502).json({ error: "server_error", error_description: String(e).slice(0, 200) });
  }
}
