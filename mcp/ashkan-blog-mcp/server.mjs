#!/usr/bin/env node
// ────────────────────────────────────────────────────────────────
// ashkan-blog-mcp — MCP server that lets Claude write + publish
// Storytime blog posts on ashkanstudios.com.
//
// It is a thin bridge to the site's existing blog-api.php (the same
// backend the /admin dashboard uses): login (PHP session cookie) →
// save/upload/delete. Claude itself is the writer; this server never
// calls a text model. Images come from OpenAI gpt-image-1 and are
// uploaded into the site's /blog-uploads/ so they're self-hosted.
//
// Config (environment variables, set in the MCP client config):
//   ASHKAN_BLOG_PASSWORD  required — same password as /admin login
//   ASHKAN_SITE_URL       optional — default https://ashkanstudios.com
//   OPENAI_API_KEY        optional — only generate_blog_image needs it
// ────────────────────────────────────────────────────────────────
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { readFile } from "node:fs/promises";
import { basename, extname } from "node:path";

const SITE = (process.env.ASHKAN_SITE_URL || "https://ashkanstudios.com").replace(/\/+$/, "");
const PASSWORD = process.env.ASHKAN_BLOG_PASSWORD || "";
const OPENAI_KEY = process.env.OPENAI_API_KEY || "";
const API = `${SITE}/blog-api.php`;

// ── blog-api client with a lazy PHP-session cookie ──
let sessionCookie = null;

function captureCookie(res) {
  const cookies = typeof res.headers.getSetCookie === "function" ? res.headers.getSetCookie() : [];
  for (const c of cookies) {
    const m = c.match(/^(ashkan_blog=[^;]+)/);
    if (m) sessionCookie = m[1];
  }
}

async function api(action, body = {}, { auth = false, retry = true } = {}) {
  if (auth && !sessionCookie) await login();
  const res = await fetch(API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(sessionCookie ? { Cookie: sessionCookie } : {}),
    },
    body: JSON.stringify({ action, ...body }),
  });
  captureCookie(res);
  const text = await res.text();
  let data;
  try { data = JSON.parse(text); } catch {
    throw new Error(`blog-api ne JSON nahi diya (HTTP ${res.status}). Site theek hai? Response: ${text.slice(0, 200)}`);
  }
  if (auth && res.status === 401 && retry) {
    sessionCookie = null; // session expired — login again once
    return api(action, body, { auth, retry: false });
  }
  if (data.error) {
    throw new Error(`blog-api error on "${action}": ${data.error}`);
  }
  return data;
}

async function login() {
  if (!PASSWORD) {
    throw new Error("ASHKAN_BLOG_PASSWORD env var is not set. Add it to this MCP server's config (same password as the /admin login).");
  }
  const res = await fetch(API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "login", password: PASSWORD }),
  });
  captureCookie(res);
  const data = await res.json().catch(() => ({}));
  if (!data.ok) {
    throw new Error(`Login failed: ${data.error || "unknown error"}. Check ASHKAN_BLOG_PASSWORD.`);
  }
}

const liveUrl = (slug) => `${SITE}/storytime/${slug}/`;

const ok = (obj) => ({
  content: [{ type: "text", text: JSON.stringify(obj, null, 2) }],
  structuredContent: obj,
});

// ── server ──
const server = new McpServer(
  { name: "ashkan-blog", version: "1.0.0" },
  {
    instructions: [
      "Publishing workflow for the Ashkan Studios Storytime blog (a Houston commercial photo/video studio journal):",
      "1. Call list_recent_posts first so you never repeat a slug or topic.",
      "2. Write the article yourself in markdown: 500-900 words, a short intro, 3-5 `##` sections, natural human tone (studio journal voice - behind-the-scenes, campaigns, Houston, production craft). No AI-sounding filler.",
      "3. Images: if the client supplied them (a brief, a doc, a folder, a URL), call upload_blog_image for each one so it is self-hosted - never hotlink and never invent an AI image in its place. Only when no picture was supplied, call generate_blog_image with a short scene description.",
      "   Pass the first image to publish_blog_post as `image` (the banner), and place the rest in the markdown body as ![alt](/blog-uploads/...). An italic line right after an image renders as its caption.",
      "4. Report the live URL back to the user when done.",
      "If the user gives only a title, that's enough - write the whole post from it.",
    ].join("\n"),
  }
);

server.registerTool(
  "list_recent_posts",
  {
    description:
      "List Storytime posts (id, title, slug, createdAt, live URL). Published only by default; include_drafts=true also shows drafts (needs login). Call this before publishing to avoid duplicate slugs/topics.",
    inputSchema: {
      limit: z.number().int().min(1).max(100).optional().describe("Max posts to return (default 20)"),
      include_drafts: z.boolean().optional().describe("Also include drafts (default false)"),
    },
    annotations: { readOnlyHint: true, openWorldHint: true },
  },
  async ({ limit = 20, include_drafts = false }) => {
    const data = include_drafts ? await api("all", {}, { auth: true }) : await api("posts");
    const posts = (data.posts || []).slice(0, limit).map((p) => ({
      id: p.id,
      title: p.title,
      slug: p.slug,
      status: p.status || "published",
      createdAt: p.createdAt,
      url: liveUrl(p.slug),
    }));
    return ok({ count: posts.length, posts });
  }
);

server.registerTool(
  "generate_blog_image",
  {
    description:
      "Generate a wide banner image with OpenAI gpt-image-1 and upload it to the site's /blog-uploads/. Returns the image path to pass as `image` to publish_blog_post. Describe only the SCENE in the prompt (e.g. 'photographer adjusting studio lights around a jewelry set') - the cinematic editorial style is enforced here.",
    inputSchema: {
      prompt: z.string().min(5).describe("Short scene description, subject only, no style words"),
      slug: z.string().regex(/^[a-z0-9-]+$/).describe("kebab-case name used for the file"),
    },
    annotations: { readOnlyHint: false, destructiveHint: false, openWorldHint: true },
  },
  async ({ prompt, slug }) => {
    if (!OPENAI_KEY) {
      throw new Error("OPENAI_API_KEY is not set in this MCP server's config, so image generation is off. Either add the key, or publish without an image (publish_blog_post works fine with no `image`).");
    }
    const styled = `${prompt}. Cinematic editorial photography, warm natural light, shallow depth of field, premium commercial-studio aesthetic, photorealistic, no text, no logos, no watermarks.`;
    const res = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${OPENAI_KEY}` },
      // quality "medium" looks the same at blog-banner size and costs
      // ~4x less per image than "high" (client will generate plenty).
      // webp@82 keeps banners ~10x smaller than the default 2MB PNG.
      body: JSON.stringify({ model: "gpt-image-1", prompt: styled, size: "1536x1024", quality: "medium", n: 1, output_format: "webp", output_compression: 82 }),
    });
    const img = await res.json();
    if (!res.ok || !img.data?.[0]?.b64_json) {
      throw new Error(`OpenAI image generation failed (HTTP ${res.status}): ${img.error?.message || "no image returned"}`);
    }
    const bytes = Buffer.from(img.data[0].b64_json, "base64");

    if (!sessionCookie) await login();
    const fd = new FormData();
    fd.append("action", "upload");
    fd.append("file", new Blob([bytes], { type: "image/webp" }), `${slug}.webp`);
    const up = await fetch(API, { method: "POST", headers: { Cookie: sessionCookie }, body: fd });
    captureCookie(up);
    const upData = await up.json().catch(() => ({}));
    if (!upData.ok || !upData.url) {
      throw new Error(`Image upload to the site failed: ${upData.error || `HTTP ${up.status}`}`);
    }
    return ok({ image: upData.url, absoluteUrl: `${SITE}${upData.url}`, bytes: bytes.length });
  }
);

/* Image ke bytes se hi uska type pehchano - extension jhooth bol sakta
   hai, aur blog-api getimagesize() se asli type dekhta hai. */
function sniffImage(buf) {
  if (buf.length > 12) {
    if (buf[0] === 0xff && buf[1] === 0xd8) return ["image/jpeg", "jpg"];
    if (buf.toString("ascii", 1, 4) === "PNG") return ["image/png", "png"];
    if (buf.toString("ascii", 0, 3) === "GIF") return ["image/gif", "gif"];
    if (buf.toString("ascii", 0, 4) === "RIFF" && buf.toString("ascii", 8, 12) === "WEBP") return ["image/webp", "webp"];
  }
  return [null, null];
}

server.registerTool(
  "upload_blog_image",
  {
    description:
      "Upload an image you already have - from a client's document, a folder on this machine, or a URL - into the site's /blog-uploads/ so it is self-hosted. Returns the path to use as `image` in publish_blog_post, or to drop into the markdown body as ![alt](path). Use this (not generate_blog_image) whenever the client supplied the picture. JPG, PNG, WebP and GIF, up to 8 MB; the site downscales anything over 1800px.",
    inputSchema: {
      path: z.string().optional().describe("Absolute path to the image file on this machine"),
      url: z.string().url().optional().describe("Image URL to fetch and re-host instead of a local file"),
      name: z.string().optional().describe("Optional readable filename, e.g. 'jewelry-macro'. The site assigns its own unique name either way."),
    },
    annotations: { readOnlyHint: false, destructiveHint: false, openWorldHint: true },
  },
  async ({ path: filePath, url, name }) => {
    if (!filePath && !url) throw new Error("Give either `path` (a file on this machine) or `url`.");
    if (filePath && url) throw new Error("Give `path` or `url`, not both.");

    let bytes;
    if (filePath) {
      try {
        bytes = await readFile(filePath);
      } catch (e) {
        throw new Error(`Could not read ${filePath}: ${e.code === "ENOENT" ? "file not found" : e.message}`);
      }
    } else {
      const r = await fetch(url);
      if (!r.ok) throw new Error(`Could not download ${url} (HTTP ${r.status}).`);
      bytes = Buffer.from(await r.arrayBuffer());
    }

    const [mime, ext] = sniffImage(bytes);
    if (!mime) {
      throw new Error("That file is not a JPG, PNG, WebP or GIF - those are the only types the blog accepts. Convert it first.");
    }
    if (bytes.length > 8 * 1024 * 1024) {
      throw new Error(`Image is ${(bytes.length / 1048576).toFixed(1)} MB; the blog's limit is 8 MB. Compress it first.`);
    }

    const stem = (name || (filePath ? basename(filePath, extname(filePath)) : "image"))
      .toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "image";

    if (!sessionCookie) await login();
    const fd = new FormData();
    fd.append("action", "upload");
    fd.append("file", new Blob([bytes], { type: mime }), `${stem}.${ext}`);
    const up = await fetch(API, { method: "POST", headers: { Cookie: sessionCookie }, body: fd });
    captureCookie(up);
    const upData = await up.json().catch(() => ({}));
    if (!upData.ok || !upData.url) {
      throw new Error(`Upload to the site failed: ${upData.error || `HTTP ${up.status}`}`);
    }
    return ok({
      image: upData.url,
      absoluteUrl: `${SITE}${upData.url}`,
      markdown: `![${name || stem}](${upData.url})`,
      type: mime,
      bytes: bytes.length,
      resized: upData.resized || "",
    });
  }
);

const postFields = {
  title: z.string().min(3).describe("Post title (shown on the blog and used for the slug)"),
  content: z.string().min(100).describe("Full markdown body you wrote (## sections, 500-900 words)"),
  keywords: z.string().optional().describe("Comma-separated keywords, e.g. 'houston photography, bts'"),
  excerpt: z.string().optional().describe("1-2 sentence summary for the blog list (auto-generated if omitted)"),
  metaDescription: z.string().optional().describe("SEO meta description (~150-160 chars; falls back to excerpt)"),
  slug: z.string().regex(/^[a-z0-9-]+$/).optional().describe("URL slug (auto from title if omitted)"),
  image: z.string().optional().describe("Featured image path from generate_blog_image, e.g. /blog-uploads/x.png"),
};

server.registerTool(
  "publish_blog_post",
  {
    description:
      "Create a Storytime post on ashkanstudios.com. status 'published' makes it live immediately at /storytime/<slug>/; 'draft' keeps it hidden (visible in /admin only). Returns the live URL.",
    inputSchema: {
      ...postFields,
      status: z.enum(["published", "draft", "scheduled"]).optional().describe("Default 'published'. 'scheduled' needs publishAt."),
      publishAt: z.string().optional().describe("UTC ISO time a scheduled post goes live, e.g. 2026-07-31T14:00:00Z"),
    },
    annotations: { readOnlyHint: false, destructiveHint: false, openWorldHint: true },
  },
  async ({ status = "published", ...fields }) => {
    const data = await api("save", { ...fields, status }, { auth: true });
    return ok({
      ok: true,
      id: data.id,
      slug: data.slug,
      status,
      url: status === "published" ? liveUrl(data.slug) : `${SITE}/admin/ (draft - not public)`,
    });
  }
);

server.registerTool(
  "update_blog_post",
  {
    description:
      "Update an existing post by id (get ids from list_recent_posts). Only the fields you pass change; others keep their current value. Can also flip status between draft and published.",
    inputSchema: {
      id: z.string().describe("Post id, e.g. 'p20c5a0efa06c'"),
      title: postFields.title.optional(),
      content: postFields.content.optional(),
      keywords: postFields.keywords,
      excerpt: postFields.excerpt,
      metaDescription: postFields.metaDescription,
      slug: postFields.slug,
      image: postFields.image,
      status: z.enum(["published", "draft", "scheduled"]).optional(),
      publishAt: z.string().optional().describe("UTC ISO time for a scheduled post"),
    },
    annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: true, openWorldHint: true },
  },
  async ({ id, ...changes }) => {
    const current = (await api("get", { id }, { auth: true })).post;
    const merged = {
      id,
      title: changes.title ?? current.title,
      content: changes.content ?? current.content,
      keywords: changes.keywords ?? current.keywords,
      excerpt: changes.excerpt ?? current.excerpt,
      metaDescription: changes.metaDescription ?? current.metaDescription,
      slug: changes.slug ?? current.slug,
      image: changes.image ?? current.image,
      status: changes.status ?? current.status,
    };
    const data = await api("save", merged, { auth: true });
    return ok({
      ok: true,
      id,
      slug: data.slug,
      status: merged.status,
      url: merged.status === "published" ? liveUrl(data.slug) : `${SITE}/admin/ (draft - not public)`,
    });
  }
);

server.registerTool(
  "delete_blog_post",
  {
    description: "Permanently delete a post by id. Ask the user before calling this; confirm must be true.",
    inputSchema: {
      id: z.string().describe("Post id from list_recent_posts"),
      confirm: z.literal(true).describe("Must be true - deletion is permanent"),
    },
    annotations: { readOnlyHint: false, destructiveHint: true, openWorldHint: true },
  },
  async ({ id }) => {
    await api("delete", { id }, { auth: true });
    return ok({ ok: true, deleted: id });
  }
);

const transport = new StdioServerTransport();
await server.connect(transport);
