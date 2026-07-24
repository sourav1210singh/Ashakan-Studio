# Ashkan Blog — OAuth-secured remote connector

A shareable **custom connector** for claude.ai. Whoever adds it must
sign in with a **username + password** — then Claude can write and
publish Storytime blog posts on ashkanstudios.com (writes the article,
generates a banner image, publishes, returns the live link).

Nothing to install locally. It runs as its **own small Vercel project**
(clean routing, isolated from the main site). Full OAuth 2.1
(Dynamic Client Registration + PKCE + login gate); tokens are
stateless/HMAC-signed so no database is needed.

## One-time deploy (create the Vercel project)

1. Go to **vercel.com → Add New → Project → Import** the same GitHub repo
   (`sourav1210singh/Ashakan-Studio`).
2. **Root Directory:** click *Edit* and choose **`mcp/remote-connector`**.
   (This is what keeps it separate from the site project.)
3. **Framework Preset:** Other. Leave build/output empty.
4. Before deploying, add **Environment Variables** (Settings → Environment
   Variables, apply to Production):

   | Name | Value |
   |---|---|
   | `MCP_OAUTH_SECRET` | a long random string — token signing key (see below) |
   | `MCP_LOGIN_USER` | the connector username you want (e.g. `ashkan`) |
   | `MCP_LOGIN_PASS` | the connector password you want |
   | `ASHKAN_BLOG_PASSWORD` | the `/admin` blog password |
   | `OPENAI_API_KEY` | OpenAI key (only needed for image generation) |
   | `ASHKAN_SITE_URL` | *(optional)* defaults to `https://ashkanstudios.com` |

   Generate a strong `MCP_OAUTH_SECRET` with:
   `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`

5. **Deploy.** Note the project URL, e.g. `https://ashkan-blog-mcp.vercel.app`.
   After the first deploy, every `git push` to `main` redeploys automatically.

## Add it in Claude (the login moment)

1. claude.ai → **Settings → Connectors → Add custom connector**.
2. URL: **`https://<your-project>.vercel.app/api/mcp`**
3. Claude opens a **sign-in page** — enter `MCP_LOGIN_USER` / `MCP_LOGIN_PASS`.
4. Done. In any chat: *"Publish a blog: Behind the scenes of a Houston fashion shoot"*.

## Security notes

- The connector **URL is not a secret** — the username + password are the
  gate. Only people who sign in can publish.
- **Revoke everyone instantly:** change `MCP_OAUTH_SECRET` in Vercel and
  redeploy — every existing login is invalidated and must sign in again.
- Change who can log in by editing `MCP_LOGIN_USER` / `MCP_LOGIN_PASS`.
- Access tokens last 24h and auto-refresh for 90 days; the blog password
  and OpenAI key never leave the server.

## Endpoints (for reference)

| Path | Purpose |
|---|---|
| `/api/mcp` | MCP endpoint (Bearer-gated) |
| `/api/oauth/authorize` | login page + code issuance |
| `/api/oauth/token` | code/refresh → access token |
| `/api/oauth/register` | dynamic client registration |
| `/.well-known/oauth-authorization-server` | AS metadata (rewritten) |
| `/.well-known/oauth-protected-resource` | resource metadata (rewritten) |

Verified end-to-end locally (23/23): discovery → registration →
login (right/wrong password) → PKCE code → token → authenticated
publish/delete against the live blog, plus open-redirect and
tampered-token guards.
