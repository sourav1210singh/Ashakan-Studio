# Ashkan Studios

Production website and AI publishing system for a Houston video production and photography
studio.

**Live:** https://ashkanstudios.com

## What this is

A React single-page application that is also a fully static, search-indexable site, deployed
onto WordPress hosting, with a custom MCP server so the client can publish blog content
through an AI assistant.

Built and maintained across 687 commits and 387 deployments.

## Stack

| | |
|---|---|
| Frontend | React 18 + TypeScript, Vite |
| Styling | Tailwind CSS, shadcn/ui |
| Animation | Framer Motion |
| Backend | PHP endpoints on WP Engine |
| Publishing | Custom MCP server with OAuth |

## The interesting parts

### Prerendering — an SPA that search engines can actually read

A React SPA ships an empty HTML shell, which is bad for SEO. Rather than migrating the whole
project to a framework with SSR, there is a prerender step in `prerender/` that runs after the
Vite build and writes real static HTML for every route. `npm run build:seo` does build and
prerender in one pass.

### React to WordPress theme

The client's hosting is WP Engine. `wordpress-theme/build-wp-theme.mjs` takes the built React
output and packages it as a WordPress theme, so the same codebase serves a WordPress site.

### A custom MCP server with OAuth

`mcp/ashkan-blog-mcp/` and `wp-engine/blog-mcp.php` expose the site's blog as a Model Context
Protocol connector. The client adds it to their AI assistant, signs in, and can then write and
publish posts to their own live site in conversation.

The OAuth flow is implemented in `app/api/oauth-register.js` and `app/api/oauth-token.js`.
Credentials live on the server, never in this repository.

### SEO landing pages

Dedicated pages for each service and location, each with its own metadata, generated sitemap,
and a redirect map (`wp-engine/redirects-map.php`) that preserves the old site's URLs.

## Structure

| Path | Contents |
|---|---|
| `app/` | React application |
| `prerender/` | Static HTML generation |
| `wordpress-theme/` | WordPress theme build |
| `wp-engine/` | PHP endpoints and the MCP connector |
| `mcp/` | MCP server |
| `TechSpec.md` | Design system and component inventory |

## Security

No credentials are committed. `.gitignore` excludes `.env`, `.env.*` and local key files, and
the PHP files in this repository hold placeholders — real values are set only on the server.
