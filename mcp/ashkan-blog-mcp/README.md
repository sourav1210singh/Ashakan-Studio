# ashkan-blog-mcp

MCP server that lets Claude write and publish Storytime blog posts on
ashkanstudios.com. You give Claude a title, Claude writes the article,
generates a banner image (OpenAI), and publishes it live - all through
the site's existing `blog-api.php` backend (same one `/admin` uses).

## Tools

| Tool | What it does |
|---|---|
| `list_recent_posts` | Lists posts (id/slug/status/url). `include_drafts: true` shows drafts too. |
| `generate_blog_image` | OpenAI `gpt-image-1` banner → uploaded to `/blog-uploads/` on the site. |
| `publish_blog_post` | Creates a post. `status: "published"` = live immediately, `"draft"` = hidden. |
| `update_blog_post` | Edits any field of an existing post by id, can flip draft/published. |
| `delete_blog_post` | Permanent delete (needs `confirm: true`). |

## Setup

```
cd mcp/ashkan-blog-mcp
npm install
```

### Register in Claude Code (CLI)

```
claude mcp add ashkan-blog -e ASHKAN_BLOG_PASSWORD=<admin password> -e OPENAI_API_KEY=<openai key> -- node <absolute path>/mcp/ashkan-blog-mcp/server.mjs
```

### Register in Claude Desktop

Add to `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "ashkan-blog": {
      "command": "node",
      "args": ["C:/Ashakan-Studio/mcp/ashkan-blog-mcp/server.mjs"],
      "env": {
        "ASHKAN_BLOG_PASSWORD": "<admin password>",
        "OPENAI_API_KEY": "<openai key>"
      }
    }
  }
}
```

Env vars:
- `ASHKAN_BLOG_PASSWORD` (required) - the `/admin` login password. Never commit it.
- `OPENAI_API_KEY` (optional) - only image generation needs it. Without it,
  everything else still works and the image tool explains itself.
- `ASHKAN_SITE_URL` (optional) - defaults to `https://ashkanstudios.com`.
  Point it at the staging domain to test there instead.

## Use

In any Claude chat with this server connected:

> "Publish a blog: Winter fashion shoot behind the scenes"

Claude will check recent posts, write the article, generate + upload a
banner, publish, and hand back the live `/storytime/...` link.

Content and images live on the server (`blog-data/`, `blog-uploads/`),
so site redeploys never touch them.
