# Ashkan Blog — OAuth connector (on WP Engine)

A shareable claude.ai **custom connector**, hosted on the live site
itself (`blog-mcp.php` on WP Engine, next to blog-api.php). Whoever adds
it signs in with a **username + password**, then Claude can write and
publish Storytime blog posts.

No Vercel, no separate host — it deploys with the normal dist upload.

## What to upload

Two files (both are in the deploy `dist/` with secrets already set):

1. **`blog-mcp.php`** — the connector (OAuth server + MCP tools)
2. **`index.php`** — updated to route the two `/.well-known/oauth-*`
   discovery paths into blog-mcp.php

They sit in the webroot next to `blog-api.php`. A normal full-dist SFTP
upload includes them.

## The 5 settings inside blog-mcp.php

Set on the server copy only (the repo keeps placeholders). In the
deploy `dist/` these are already filled:

| define | meaning |
|---|---|
| `BLOG_ADMIN_PASSWORD` | same as the /admin login |
| `MCP_OAUTH_SECRET` | random token-signing key — change it to log everyone out |
| `MCP_LOGIN_USER` | the connector username people sign in with |
| `MCP_LOGIN_PASS` | the connector password |
| `OPENAI_API_KEY` | OpenAI key (only image generation needs it) |

## Add it in Claude

1. claude.ai → **Settings → Connectors → Add custom connector**
2. URL: **`https://ashkanstudios.com/blog-mcp.php`**
3. A **sign-in page** appears → enter `MCP_LOGIN_USER` / `MCP_LOGIN_PASS`
4. In any chat: *"Publish a blog: Behind the scenes of a Houston fashion shoot"*

## Security

- The connector URL is not the secret — the username + password are.
- **Revoke everyone instantly:** change `MCP_OAUTH_SECRET` on the server
  and re-upload; every signed-in session must log in again.
- Change who can sign in by editing `MCP_LOGIN_USER` / `MCP_LOGIN_PASS`.
- Access tokens last 24h and refresh for 90 days; the blog password and
  OpenAI key never leave the server.
- Full OAuth 2.1 (Dynamic Client Registration + PKCE + login gate);
  tokens are stateless HMAC-signed (no database).

## Verified

End-to-end locally, 20/20: discovery → registration → login
(right/wrong password) → PKCE code → token → authenticated
publish/delete against the live blog, plus open-redirect and
tampered-token guards.
