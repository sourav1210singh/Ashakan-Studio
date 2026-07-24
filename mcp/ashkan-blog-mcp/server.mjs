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
      "3. Call generate_blog_image with a short scene description, then publish_blog_post with the returned image path.",
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
      body: JSON.stringify({ model: "gpt-image-1", prompt: styled, size: "1536x1024", quality: "high", n: 1 }),
    });
    const img = await res.json();
    if (!res.ok || !img.data?.[0]?.b64_json) {
      throw new Error(`OpenAI image generation failed (HTTP ${res.status}): ${img.error?.message || "no image returned"}`);
    }
    const bytes = Buffer.from(img.data[0].b64_json, "base64");

    if (!sessionCookie) await login();
    const fd = new FormData();
    fd.append("action", "upload");
    fd.append("file", new Blob([bytes], { type: "image/png" }), `${slug}.png`);
    const up = await fetch(API, { method: "POST", headers: { Cookie: sessionCookie }, body: fd });
    captureCookie(up);
    const upData = await up.json().catch(() => ({}));
    if (!upData.ok || !upData.url) {
      throw new Error(`Image upload to the site failed: ${upData.error || `HTTP ${up.status}`}`);
    }
    return ok({ image: upData.url, absoluteUrl: `${SITE}${upData.url}`, bytes: bytes.length });
  }
);

const postFields = {
  title: z.string().min(3).describe("Post title (shown on the blog and used for the slug)"),
  content: z.string().min(100).describe("Full markdown body you wrote (## sections, 500-900 words)"),
  keywords: z.string().optional().describe("Comma-separated keywords, e.g. 'houston photography, bts'"),
  excerpt: z.string().optional().describe("1-2 sentence summary for the blog list (auto-generated if omitted)"),
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
      status: z.enum(["published", "draft"]).optional().describe("Default 'published'"),
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
      slug: postFields.slug,
      image: postFields.image,
      status: z.enum(["published", "draft"]).optional(),
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
