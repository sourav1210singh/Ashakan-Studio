// Blog tools — same 5 as the local MCP, talking to the site's
// blog-api.php over HTTPS (proven to work from Vercel). Claude is the
// writer; nothing here calls a text model.
const SITE = (process.env.ASHKAN_SITE_URL || "https://ashkanstudios.com").replace(/\/+$/, "");
const API = `${SITE}/blog-api.php`;

let sessionCookie = null;

function captureCookie(res) {
  const cookies = typeof res.headers.getSetCookie === "function" ? res.headers.getSetCookie() : [];
  for (const c of cookies) {
    const m = c.match(/^(ashkan_blog=[^;]+)/);
    if (m) sessionCookie = m[1];
  }
}

async function login() {
  const pw = process.env.ASHKAN_BLOG_PASSWORD || "";
  if (!pw) throw new Error("ASHKAN_BLOG_PASSWORD env var is not set on the server.");
  const res = await fetch(API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "login", password: pw }),
  });
  captureCookie(res);
  const data = await res.json().catch(() => ({}));
  if (!data.ok) throw new Error(`Blog login failed: ${data.error || "unknown"}`);
}

async function api(action, body = {}, { auth = false, retry = true } = {}) {
  if (auth && !sessionCookie) await login();
  const res = await fetch(API, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...(sessionCookie ? { Cookie: sessionCookie } : {}) },
    body: JSON.stringify({ action, ...body }),
  });
  captureCookie(res);
  if (auth && res.status === 401 && retry) {
    sessionCookie = null;
    return api(action, body, { auth, retry: false });
  }
  const data = await res.json().catch(() => null);
  if (!data) throw new Error(`blog-api returned non-JSON (HTTP ${res.status})`);
  if (data.error) throw new Error(`blog-api "${action}": ${data.error}`);
  return data;
}

const liveUrl = (slug) => `${SITE}/storytime/${slug}/`;

export const INSTRUCTIONS = [
  "Publishing workflow for the Ashkan Studios Storytime blog (Houston commercial photo/video studio journal):",
  "1. Call list_recent_posts first so you never repeat a slug or topic.",
  "2. Write the article yourself in markdown: 500-900 words, short intro, 3-5 ## sections, natural human studio-journal voice. No AI-sounding filler.",
  "3. Call generate_blog_image with a short scene description, then publish_blog_post with the returned image path.",
  "4. Report the live URL back to the user. If the user gives only a title, that's enough - write the whole post from it.",
].join("\n");

export const TOOLS = [
  {
    name: "list_recent_posts",
    description:
      "List Storytime posts (id, title, slug, status, live URL). include_drafts=true also shows drafts. Call before publishing to avoid duplicate slugs/topics.",
    inputSchema: {
      type: "object",
      properties: {
        limit: { type: "number", description: "Max posts (default 20, max 100)" },
        include_drafts: { type: "boolean", description: "Also include drafts (default false)" },
      },
    },
    handler: async ({ limit = 20, include_drafts = false }) => {
      const data = include_drafts ? await api("all", {}, { auth: true }) : await api("posts");
      const posts = (data.posts || []).slice(0, Math.min(limit, 100)).map((p) => ({
        id: p.id, title: p.title, slug: p.slug,
        status: p.status || "published", createdAt: p.createdAt, url: liveUrl(p.slug),
      }));
      return { count: posts.length, posts };
    },
  },
  {
    name: "generate_blog_image",
    description:
      "Generate a wide banner image (OpenAI gpt-image-1) and upload it to the site's /blog-uploads/. Returns the image path for publish_blog_post. Describe only the SCENE - the cinematic editorial style is enforced server-side.",
    inputSchema: {
      type: "object",
      properties: {
        prompt: { type: "string", description: "Short scene description, subject only" },
        slug: { type: "string", description: "kebab-case filename" },
      },
      required: ["prompt", "slug"],
    },
    handler: async ({ prompt, slug }) => {
      const key = process.env.OPENAI_API_KEY || "";
      if (!key) throw new Error("OPENAI_API_KEY is not set on the server, so image generation is off. Publish without an image, or add the key in the Vercel project settings.");
      const styled = `${prompt}. Cinematic editorial photography, warm natural light, shallow depth of field, premium commercial-studio aesthetic, photorealistic, no text, no logos, no watermarks.`;
      const res = await fetch("https://api.openai.com/v1/images/generations", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
        body: JSON.stringify({ model: "gpt-image-1", prompt: styled, size: "1536x1024", quality: "medium", n: 1, output_format: "webp", output_compression: 82 }),
      });
      const img = await res.json();
      if (!res.ok || !img.data?.[0]?.b64_json) {
        throw new Error(`OpenAI image failed (HTTP ${res.status}): ${img.error?.message || "no image"}`);
      }
      const bytes = Buffer.from(img.data[0].b64_json, "base64");
      if (!sessionCookie) await login();
      const fd = new FormData();
      fd.append("action", "upload");
      fd.append("file", new Blob([bytes], { type: "image/webp" }), `${String(slug).replace(/[^a-z0-9-]/g, "")}.webp`);
      const up = await fetch(API, { method: "POST", headers: { Cookie: sessionCookie }, body: fd });
      captureCookie(up);
      const upData = await up.json().catch(() => ({}));
      if (!upData.ok || !upData.url) throw new Error(`Upload to site failed: ${upData.error || `HTTP ${up.status}`}`);
      return { image: upData.url, absoluteUrl: `${SITE}${upData.url}`, bytes: bytes.length };
    },
  },
  {
    name: "publish_blog_post",
    description:
      "Create a Storytime post on ashkanstudios.com. Write the full markdown yourself (500-900 words, ## sections, studio-journal tone). status 'published' = live immediately; 'draft' = hidden. Returns the live URL.",
    inputSchema: {
      type: "object",
      properties: {
        title: { type: "string" },
        content: { type: "string", description: "Full markdown body" },
        keywords: { type: "string", description: "Comma-separated keywords" },
        excerpt: { type: "string", description: "1-2 sentence summary (auto if omitted)" },
        slug: { type: "string", description: "URL slug (auto from title if omitted)" },
        image: { type: "string", description: "Path from generate_blog_image, e.g. /blog-uploads/x.webp" },
        status: { type: "string", enum: ["published", "draft"], description: "Default published" },
      },
      required: ["title", "content"],
    },
    handler: async ({ status = "published", ...fields }) => {
      const data = await api("save", { ...fields, status }, { auth: true });
      return {
        ok: true, id: data.id, slug: data.slug, status,
        url: status === "published" ? liveUrl(data.slug) : `${SITE}/admin/ (draft - not public)`,
      };
    },
  },
  {
    name: "update_blog_post",
    description: "Update an existing post by id (ids from list_recent_posts). Only passed fields change. Can flip draft/published via status.",
    inputSchema: {
      type: "object",
      properties: {
        id: { type: "string" },
        title: { type: "string" }, content: { type: "string" },
        keywords: { type: "string" }, excerpt: { type: "string" },
        slug: { type: "string" }, image: { type: "string" },
        status: { type: "string", enum: ["published", "draft"] },
      },
      required: ["id"],
    },
    handler: async ({ id, ...changes }) => {
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
      return {
        ok: true, id, slug: data.slug, status: merged.status,
        url: merged.status === "published" ? liveUrl(data.slug) : `${SITE}/admin/ (draft - not public)`,
      };
    },
  },
  {
    name: "delete_blog_post",
    description: "Permanently delete a post by id. Ask the user first; confirm must be true.",
    inputSchema: {
      type: "object",
      properties: {
        id: { type: "string" },
        confirm: { type: "boolean", description: "Must be true - deletion is permanent" },
      },
      required: ["id", "confirm"],
    },
    handler: async ({ id, confirm }) => {
      if (confirm !== true) throw new Error("confirm must be true - deletion is permanent.");
      await api("delete", { id }, { auth: true });
      return { ok: true, deleted: id };
    },
  },
];
