# Ashkan Studios blog — Claude setup

This gives Claude Desktop seven tools for the Ashkan Studios Storytime blog:
it can read a brief (a Google Doc link or a Word file), host the pictures
inside it, write the post, and publish it to
`https://ashkanstudios.com/storytime/`.

It runs on your own machine and talks to the site directly. There is no
connector URL to add and nothing to sign in to.

Setup takes about five minutes.

---

## What you need first

**Node.js 18 or newer.** Check by opening Command Prompt and typing:

```
node -v
```

If you get a version number (`v18…`, `v20…`, `v22…`), you are set. If you get
"not recognized", install the **LTS** build from <https://nodejs.org> — click
through the installer with the defaults, then close and reopen Command Prompt.

---

## Step 1 — Put this folder somewhere permanent

Move the whole `ashkan-blog-mcp` folder to a place you will not clean out,
for example:

```
C:\ashkan-blog-mcp
```

Avoid Downloads or Desktop, and avoid any folder with a space in its name.
Keep `node_modules` with it — that is what makes `npm install` unnecessary.

## Step 2 — Open the Claude config file

Press `Win + R`, paste this, press Enter:

```
%APPDATA%\Claude\claude_desktop_config.json
```

If Windows asks how to open it, choose Notepad.

If the file does not exist: open Claude Desktop → Settings → Developer →
**Edit Config**. That creates it.

## Step 3 — Add the blog server

The file is JSON. If it is empty, or just `{}`, replace everything with the
block below. If it already has content, add the `"mcpServers"` section
alongside what is there — and mind the commas.

```json
{
  "mcpServers": {
    "ashkan-blog": {
      "type": "stdio",
      "command": "node",
      "args": ["C:/ashkan-blog-mcp/server.mjs"],
      "env": {
        "ASHKAN_BLOG_PASSWORD": "PASTE_THE_BLOG_PASSWORD_HERE",
        "OPENAI_API_KEY": "PASTE_THE_OPENAI_KEY_HERE"
      }
    }
  }
}
```

Three things to change:

1. **The path** — if you put the folder somewhere other than
   `C:\ashkan-blog-mcp`, correct it. Use forward slashes `/`, not `\`.
2. **`ASHKAN_BLOG_PASSWORD`** — Sourav will send this separately. Required.
3. **`OPENAI_API_KEY`** — optional. Only `generate_blog_image` needs it.
   Without it everything else works; leave the placeholder or delete the line
   (then remove the comma on the line above it).

Save and close.

## Step 4 — Check it before opening Claude

In Command Prompt:

```
cd C:\ashkan-blog-mcp
node check.mjs
```

It verifies Node, the files, the config, and then actually logs into the blog
and reads a few posts. Anything wrong is printed in plain language. Fix and
run it again until it ends with **"All good."**

## Step 5 — Restart Claude Desktop

Close it completely — including the icon in the system tray, right-click →
Quit — then open it again. The tools load when the app starts, so a reload is
not enough.

You should now see the blog tools available in a new chat.

---

## Using it

**From a brief.** This is the normal case:

> Read this doc and publish it to the Ashkan Studios blog:
> https://docs.google.com/document/d/…

Claude pulls the text and the pictures out of the document, hosts the pictures
on the site, and publishes. A Google Doc has to be shared as
**"Anyone with the link — Viewer"**, otherwise Google returns a sign-in page
instead of the document. A `.docx` on your machine works too — just give the
file path.

**From a topic.** Also fine:

> Write and publish a blog post for Ashkan Studios on "product photography
> lighting for ecommerce". Keywords: product photography houston, ecommerce
> product photos.

**Other things you can ask for:**

- "What is already on the blog?" — so you do not repeat a topic
- "Publish that as a draft instead" — hidden from the public, visible in /admin
- "Change the title of …" / "Fix the third paragraph of …"
- "Delete the post …"

Two habits worth keeping:

- Ask for a **draft** first if you want to read it before it is public.
- Tell Claude when the client supplied the pictures. It should host those, not
  invent an AI image in their place.

---

## The seven tools

| Tool | What it does |
|---|---|
| `read_doc` | Reads a Google Doc or `.docx` and hosts the pictures inside it |
| `upload_blog_image` | Hosts one image from a file or a URL |
| `generate_blog_image` | Makes an AI banner (needs the OpenAI key) |
| `list_recent_posts` | Shows what is already published |
| `publish_blog_post` | Creates the post, live or draft |
| `update_blog_post` | Edits an existing post |
| `delete_blog_post` | Removes a post permanently |

---

## If something goes wrong

**Claude shows no blog tools.** Run `node check.mjs`. Nine times out of ten the
config is not valid JSON — a missing or extra comma. The checker says so.

**"ASHKAN_BLOG_PASSWORD is not set".** The placeholder is still in the config,
or the app was not fully restarted after the edit.

**"Login failed".** Wrong password. Ask Sourav for it again.

**"Google returned a sign-in page".** The doc is private. Open it, Share, set
**Anyone with the link — Viewer**.

**"image generation is off".** The OpenAI key is missing. Publish without a
banner, or give Claude an image URL and ask it to use that.

**A post looks wrong after publishing.** Ask Claude to fix it — it can edit or
delete. Nothing here is one-way.

Anything else, send Sourav the output of `node check.mjs`; it says what broke.

---

## A note on the password

It sits in plain text inside your Claude config, which is how Claude Desktop
takes credentials. Anyone who can use your Windows account can read it and
publish to the blog. Do not paste that config into a chat or a screenshot.
