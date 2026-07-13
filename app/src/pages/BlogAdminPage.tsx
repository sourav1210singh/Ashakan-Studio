import { useEffect, useMemo, useRef, useState } from "react";
import {
  LogOut, Plus, Pencil, Trash2, Image as ImageIcon, Eye, EyeOff,
  ArrowLeft, Loader2, ExternalLink,
} from "lucide-react";
import { marked } from "marked";
import DOMPurify from "dompurify";
import { blogApi, formatPostDate, type BlogPostSummary } from "@/lib/blog";
import type { View } from "@/App";

interface BlogAdminPageProps {
  onNavigate: (view: View, slug?: string) => void;
}

interface EditorState {
  id: string;
  title: string;
  slug: string;
  keywords: string;
  image: string;
  excerpt: string;
  content: string;
  status: "draft" | "published";
}

const EMPTY: EditorState = {
  id: "", title: "", slug: "", keywords: "", image: "",
  excerpt: "", content: "", status: "published",
};

/**
 * /admin/blog - password-protected Storytime dashboard for the client.
 * Login -> list of posts (drafts + published) -> create / edit (title,
 * slug, keywords, featured image upload, Markdown content with live
 * preview, draft/publish) -> delete with confirm. Backend:
 * wp-engine/blog-api.php (PHP session auth). noindex via seo-meta.
 */
export function BlogAdminPage({ onNavigate }: BlogAdminPageProps) {
  const [phase, setPhase] = useState<"checking" | "login" | "list" | "edit">("checking");
  const [password, setPassword] = useState("");
  const [posts, setPosts] = useState<BlogPostSummary[]>([]);
  const [editor, setEditor] = useState<EditorState>(EMPTY);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const refresh = () =>
    blogApi.all().then(setPosts).catch((e: Error) => setError(e.message));

  useEffect(() => {
    blogApi
      .me()
      .then((authed) => {
        if (authed) {
          setPhase("list");
          refresh();
        } else {
          setPhase("login");
        }
      })
      .catch(() => {
        setError(
          "Blog service is not reachable on this host. It runs on the live site (ashkanstudios.com) where blog-api.php is installed."
        );
        setPhase("login");
      });
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      await blogApi.login(password);
      setPassword("");
      setPhase("list");
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed.");
    } finally {
      setBusy(false);
    }
  };

  const handleLogout = async () => {
    try { await blogApi.logout(); } catch { /* session already gone */ }
    setPhase("login");
  };

  const openNew = () => {
    setEditor(EMPTY);
    setShowPreview(false);
    setError("");
    setNotice("");
    setPhase("edit");
  };

  const openEdit = async (id: string) => {
    setBusy(true);
    setError("");
    try {
      const p = await blogApi.get(id);
      setEditor({
        id: p.id, title: p.title, slug: p.slug, keywords: p.keywords,
        image: p.image, excerpt: p.excerpt, content: p.content,
        status: (p.status as "draft" | "published") || "draft",
      });
      setShowPreview(false);
      setNotice("");
      setPhase("edit");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load the post.");
    } finally {
      setBusy(false);
    }
  };

  const handleSave = async (status?: "draft" | "published") => {
    setBusy(true);
    setError("");
    setNotice("");
    try {
      const payload = { ...editor, status: status ?? editor.status };
      const r = await blogApi.save(payload);
      setEditor((s) => ({ ...s, id: r.id, slug: r.slug, status: payload.status }));
      setNotice(payload.status === "published" ? "Published ✓" : "Draft saved ✓");
      refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save.");
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Delete "${title}"? This cannot be undone.`)) return;
    setBusy(true);
    setError("");
    try {
      await blogApi.remove(id);
      await refresh();
      if (editor.id === id) setPhase("list");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not delete.");
    } finally {
      setBusy(false);
    }
  };

  const handleUpload = async (file: File) => {
    setBusy(true);
    setError("");
    try {
      const url = await blogApi.upload(file);
      setEditor((s) => ({ ...s, image: url }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setBusy(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const previewHtml = useMemo(() => {
    if (!showPreview) return "";
    const raw = marked.parse(editor.content || "*Nothing to preview yet…*", {
      async: false, gfm: true, breaks: true,
    }) as string;
    return DOMPurify.sanitize(raw);
  }, [showPreview, editor.content]);

  const input =
    "w-full px-4 py-3 border border-dark/20 rounded-lg focus:border-dark focus:outline-none transition-colors bg-white/60 text-dark";
  const label = "block text-xs font-semibold tracking-[0.2em] text-dark/60 mb-2 uppercase";

  return (
    <main className="pt-24 sm:pt-28 pb-24 bg-cream min-h-screen">
      <div className="max-w-[1100px] mx-auto px-4 sm:px-6">
        {/* ── Header row ── */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <p className="text-xs font-semibold tracking-[0.3em] text-dark/45 uppercase mb-2">
              Ashkan Studios
            </p>
            <h1 className="font-display text-4xl sm:text-5xl text-dark tracking-tight">
              STORYTIME ADMIN
            </h1>
          </div>
          {(phase === "list" || phase === "edit") && (
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 text-sm text-dark/60 hover:text-dark transition-colors"
            >
              <LogOut className="w-4 h-4" /> Log out
            </button>
          )}
        </div>

        {error && (
          <div className="mb-6 px-4 py-3 border border-red-300 bg-red-50 text-red-700 text-sm rounded-lg">
            {error}
          </div>
        )}
        {notice && (
          <div className="mb-6 px-4 py-3 border border-dark/15 bg-white/70 text-dark text-sm rounded-lg">
            {notice}
          </div>
        )}

        {phase === "checking" && (
          <p className="text-dark/50 text-sm tracking-wider">CHECKING SESSION…</p>
        )}

        {/* ── Login ── */}
        {phase === "login" && (
          <form onSubmit={handleLogin} className="max-w-sm">
            <label className={label}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={input}
              placeholder="Admin password"
              autoFocus
            />
            <button
              type="submit"
              disabled={busy || !password}
              className="mt-4 inline-flex items-center gap-2 px-7 py-3.5 bg-dark text-white text-sm font-medium tracking-wider disabled:opacity-60"
            >
              {busy && <Loader2 className="w-4 h-4 animate-spin" />} LOG IN
            </button>
          </form>
        )}

        {/* ── Post list ── */}
        {phase === "list" && (
          <>
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-dark/60">
                {posts.length} post{posts.length === 1 ? "" : "s"}
              </p>
              <button
                onClick={openNew}
                className="inline-flex items-center gap-2 px-6 py-3 bg-dark text-white text-sm font-medium tracking-wider"
              >
                <Plus className="w-4 h-4" /> NEW POST
              </button>
            </div>

            <div className="border border-dark/10 rounded-lg overflow-hidden bg-white/50">
              {posts.length === 0 && (
                <p className="px-5 py-10 text-center text-dark/50 text-sm">
                  No posts yet — click NEW POST to write the first story.
                </p>
              )}
              {posts.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center gap-4 px-5 py-4 border-b border-dark/10 last:border-b-0"
                >
                  {p.image ? (
                    <img src={p.image} alt="" className="w-14 h-10 object-cover rounded" />
                  ) : (
                    <div className="w-14 h-10 rounded bg-dark/10 flex items-center justify-center">
                      <ImageIcon className="w-4 h-4 text-dark/40" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-dark truncate">{p.title}</p>
                    <p className="text-xs text-dark/50">
                      {formatPostDate(p.createdAt)} · /storytime/{p.slug}/
                    </p>
                  </div>
                  <span
                    className={`text-[11px] font-semibold tracking-wider px-2.5 py-1 rounded-full ${
                      p.status === "published"
                        ? "bg-dark text-white"
                        : "bg-dark/10 text-dark/60"
                    }`}
                  >
                    {p.status === "published" ? "LIVE" : "DRAFT"}
                  </span>
                  {p.status === "published" && (
                    <button
                      title="View live"
                      onClick={() => onNavigate("storytimePost", p.slug)}
                      className="p-2 text-dark/50 hover:text-dark"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    title="Edit"
                    onClick={() => openEdit(p.id)}
                    className="p-2 text-dark/50 hover:text-dark"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    title="Delete"
                    onClick={() => handleDelete(p.id, p.title)}
                    className="p-2 text-dark/50 hover:text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </>
        )}

        {/* ── Editor ── */}
        {phase === "edit" && (
          <div>
            <button
              onClick={() => { setPhase("list"); refresh(); }}
              className="inline-flex items-center gap-2 text-xs font-medium tracking-[0.25em] text-dark/50 hover:text-dark mb-8"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> ALL POSTS
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left: main fields */}
              <div className="lg:col-span-2 space-y-6">
                <div>
                  <label className={label}>Title *</label>
                  <input
                    className={input}
                    value={editor.title}
                    onChange={(e) => setEditor({ ...editor, title: e.target.value })}
                    placeholder="Post title"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className={label + " mb-0"}>
                      Content * <span className="normal-case font-normal">(Markdown)</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowPreview(!showPreview)}
                      className="inline-flex items-center gap-1.5 text-xs text-dark/60 hover:text-dark"
                    >
                      {showPreview ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      {showPreview ? "Hide preview" : "Preview"}
                    </button>
                  </div>
                  {!showPreview ? (
                    <textarea
                      className={input + " font-mono text-sm resize-y"}
                      rows={18}
                      value={editor.content}
                      onChange={(e) => setEditor({ ...editor, content: e.target.value })}
                      placeholder={"## A heading\n\nWrite your story here…\n\n- bullet point\n- another one\n\n**bold**, *italic*, [a link](https://example.com)"}
                    />
                  ) : (
                    <div
                      className="blog-prose border border-dark/15 rounded-lg bg-white/70 px-5 py-4 min-h-[300px]"
                      dangerouslySetInnerHTML={{ __html: previewHtml }}
                    />
                  )}
                </div>
              </div>

              {/* Right: meta fields */}
              <div className="space-y-6">
                <div>
                  <label className={label}>Featured image</label>
                  {editor.image && (
                    <img
                      src={editor.image}
                      alt="Featured"
                      className="w-full h-40 object-cover rounded-lg mb-3 border border-dark/10"
                    />
                  )}
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    className="hidden"
                    onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])}
                  />
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => fileRef.current?.click()}
                      disabled={busy}
                      className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 border border-dark/25 text-dark text-sm hover:bg-dark hover:text-white transition-colors disabled:opacity-60"
                    >
                      <ImageIcon className="w-4 h-4" /> Upload image
                    </button>
                    {editor.image && (
                      <button
                        type="button"
                        onClick={() => setEditor({ ...editor, image: "" })}
                        className="px-3 py-2.5 border border-dark/25 text-dark/60 text-sm hover:text-red-600"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>

                <div>
                  <label className={label}>Keywords</label>
                  <input
                    className={input}
                    value={editor.keywords}
                    onChange={(e) => setEditor({ ...editor, keywords: e.target.value })}
                    placeholder="houston photography, bts, campaign"
                  />
                </div>

                <div>
                  <label className={label}>URL slug</label>
                  <input
                    className={input}
                    value={editor.slug}
                    onChange={(e) => setEditor({ ...editor, slug: e.target.value })}
                    placeholder="auto-generated from title"
                  />
                  <p className="text-xs text-dark/45 mt-1.5">
                    /storytime/{editor.slug || "auto-from-title"}/
                  </p>
                </div>

                <div>
                  <label className={label}>Excerpt (optional)</label>
                  <textarea
                    className={input + " resize-none text-sm"}
                    rows={3}
                    value={editor.excerpt}
                    onChange={(e) => setEditor({ ...editor, excerpt: e.target.value })}
                    placeholder="Short summary shown on the blog list (auto-generated if left empty)"
                  />
                </div>

                <div className="pt-2 space-y-3">
                  <button
                    onClick={() => handleSave("published")}
                    disabled={busy || !editor.title || !editor.content}
                    className="w-full inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-dark text-white text-sm font-medium tracking-wider disabled:opacity-60"
                  >
                    {busy && <Loader2 className="w-4 h-4 animate-spin" />}
                    {editor.status === "published" && editor.id ? "UPDATE (LIVE)" : "PUBLISH"}
                  </button>
                  <button
                    onClick={() => handleSave("draft")}
                    disabled={busy || !editor.title || !editor.content}
                    className="w-full px-7 py-3 border border-dark/30 text-dark text-sm font-medium tracking-wider hover:bg-dark hover:text-white transition-colors disabled:opacity-60"
                  >
                    SAVE AS DRAFT
                  </button>
                  {editor.id && (
                    <button
                      onClick={() => handleDelete(editor.id, editor.title)}
                      disabled={busy}
                      className="w-full px-7 py-3 text-red-600/80 text-sm font-medium tracking-wider hover:text-red-700"
                    >
                      DELETE POST
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Reuse the public prose styles for the preview */}
            <style>{`
              .blog-prose { color: rgba(26,26,26,0.8); font-size: 1rem; line-height: 1.75; }
              .blog-prose p { margin: 0 0 1.2em; }
              .blog-prose h2, .blog-prose h3, .blog-prose h4 {
                font-family: Anton, sans-serif; color: #1A1A1A; line-height: 1.15; margin: 1.6em 0 0.6em;
              }
              .blog-prose h2 { font-size: 1.6rem; }
              .blog-prose h3 { font-size: 1.3rem; }
              .blog-prose a { text-decoration: underline; }
              .blog-prose ul, .blog-prose ol { margin: 0 0 1.2em; padding-left: 1.3em; }
              .blog-prose img { max-width: 100%; margin: 1.2em 0; }
              .blog-prose blockquote { border-left: 3px solid #1A1A1A; padding-left: 1em; color: rgba(26,26,26,0.65); font-style: italic; }
              .blog-prose code { background: #E8E0D1; padding: 0.1em 0.35em; border-radius: 4px; font-size: 0.9em; }
            `}</style>
          </div>
        )}
      </div>
    </main>
  );
}
