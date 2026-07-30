// Client for the Storytime blog backend (wp-engine/blog-api.php on the
// live WP Engine host). Every call is a POST - WP Engine's edge cache
// normalizes away query strings on GETs, which would cross-cache
// responses between actions. On hosts without the PHP backend (Vercel
// preview / local dev) calls fail and callers fall back gracefully
// (the public Storytime page shows its Coming Soon state).

export interface BlogPostSummary {
  id: string;
  slug: string;
  title: string;
  keywords: string;
  image: string;
  excerpt: string;
  /** SEO meta description (falls back to excerpt when empty). */
  metaDescription?: string;
  /** UTC ISO time a scheduled post goes live (empty unless scheduled). */
  publishAt?: string;
  createdAt: string;
  updatedAt: string;
  status?: "draft" | "published" | "scheduled";
}

export interface BlogPost extends BlogPostSummary {
  content: string;
}

/** A contact-form submission logged by contact.php on the live host. */
export interface Lead {
  time: string;
  name: string;
  email: string;
  company: string;
  projectType: string;
  message: string;
  emailStatus: "sent" | "failed" | "not-configured" | string;
}

/** One pass of the /blog-uploads/ image cleanup (see blogApi.optimizeImages). */
export interface OptimizeResult {
  ok: true;
  dryRun: boolean;
  /** Images looked at in this pass. */
  scanned: number;
  /** Of those, how many are over the 1800px limit. */
  oversized: number;
  /** How many this pass actually shrank. */
  resized: number;
  /** Left untouched because resizing them wouldn't have helped. */
  failed: number;
  savedKb: number;
  /** Still oversized when the pass ran out of time - call again. */
  remaining: number;
  changes: Array<{ file: string; from?: string; resize?: string; kb: string | number }>;
}

async function call<T>(action: string, data: Record<string, unknown> = {}): Promise<T> {
  const res = await fetch("/blog-api.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "same-origin",
    body: JSON.stringify({ action, ...data }),
  });
  const json: unknown = await res.json().catch(() => null);
  if (!json || typeof json !== "object") {
    throw new Error("Blog service is not available on this host.");
  }
  if (!res.ok || (json as { ok?: boolean }).ok !== true) {
    throw new Error((json as { error?: string }).error || "Request failed.");
  }
  return json as T;
}

export const blogApi = {
  /** Published posts, newest first (public). */
  posts: () => call<{ posts: BlogPostSummary[] }>("posts").then((r) => r.posts),
  /** One published post by slug (public). */
  post: (slug: string) => call<{ post: BlogPost }>("post", { slug }).then((r) => r.post),

  login: (password: string) => call("login", { password }),
  logout: () => call("logout"),
  me: () => call<{ authed: boolean }>("me").then((r) => r.authed),

  /** All posts incl. drafts (admin). */
  all: () => call<{ posts: BlogPostSummary[] }>("all").then((r) => r.posts),
  /** Contact-form leads, newest first (admin). */
  leads: () => call<{ leads: Lead[] }>("leads").then((r) => r.leads),
  get: (id: string) => call<{ post: BlogPost }>("get", { id }).then((r) => r.post),
  save: (post: Partial<BlogPost>) =>
    call<{ id: string; slug: string }>("save", post as Record<string, unknown>),
  remove: (id: string) => call("delete", { id }),

  /** Shrink already-uploaded oversized images (admin, one-off cleanup).
      The server works for ~20s per call and reports what is left, so the
      caller loops until `remaining` is 0. */
  optimizeImages: (dryRun = false) =>
    call<OptimizeResult>("optimize", { dryRun }),

  /** Multipart image upload (admin) -> public URL. */
  async upload(file: File): Promise<string> {
    const fd = new FormData();
    fd.append("action", "upload");
    fd.append("file", file);
    const res = await fetch("/blog-api.php", {
      method: "POST",
      credentials: "same-origin",
      body: fd,
    });
    const json: unknown = await res.json().catch(() => null);
    if (!json || typeof json !== "object" || (json as { ok?: boolean }).ok !== true) {
      throw new Error(((json as { error?: string }) || {}).error || "Upload failed.");
    }
    return (json as { url: string }).url;
  },
};

/** Format an ISO date like "July 5, 2026". */
export function formatPostDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return iso;
  }
}
