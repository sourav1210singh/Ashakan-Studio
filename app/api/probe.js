// TEMPORARY diagnostic (delete after use).
//
// Claude's browser-side calls to ashkanstudios.com arrive fine, but no
// request from Claude's BACKEND (client registration, token exchange)
// has ever reached the connector's log. This probe runs on Vercel - a
// datacenter, like Anthropic's backend - and makes the same POST, so we
// can tell whether such requests are being blocked at the edge
// (Cloudflare/WP Engine) before they reach PHP.
export default async function handler(req, res) {
  const out = { ranAt: new Date().toISOString() };

  // 1. Server-to-server POST, exactly like an OAuth token exchange.
  try {
    const r = await fetch("https://ashkanstudios.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code: "PROBE-FROM-VERCEL",
        redirect_uri: "https://claude.ai/api/mcp/auth_callback",
        code_verifier: "probe",
        client_id: "ashkan-blog-connector",
      }).toString(),
    });
    out.post = {
      status: r.status,
      server: r.headers.get("server"),
      cfRay: r.headers.get("cf-ray"),
      cfMitigated: r.headers.get("cf-mitigated"),
      contentType: r.headers.get("content-type"),
      body: (await r.text()).slice(0, 200),
    };
  } catch (e) {
    out.post = { error: String(e).slice(0, 200) };
  }

  // 2. Plain GET for comparison.
  try {
    const g = await fetch("https://ashkanstudios.com/.well-known/oauth-authorization-server");
    out.get = { status: g.status, contentType: g.headers.get("content-type") };
  } catch (e) {
    out.get = { error: String(e).slice(0, 200) };
  }

  res.setHeader("Cache-Control", "no-store");
  res.status(200).json(out);
}
