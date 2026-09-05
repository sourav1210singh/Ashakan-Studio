import { useEffect, useMemo, useRef, useState } from "react";
import {
  LogOut, Plus, Pencil, Trash2, Image as ImageIcon, Eye, EyeOff,
  ArrowLeft, Loader2, ExternalLink, BookOpen, Users, RefreshCw,
  ChevronDown, Mail, Phone, CalendarClock, Wand2,
} from "lucide-react";
import { marked } from "marked";
import DOMPurify from "dompurify";
import { blogApi, formatPostDate, type BlogPostSummary, type Lead } from "@/lib/blog";
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
  metaDescription: string;
  content: string;
  status: "draft" | "published" | "scheduled";
  /** datetime-local value ("2026-07-31T14:00") in the author's timezone. */
  publishAt: string;
}

const EMPTY: EditorState = {
  id: "", title: "", slug: "", keywords: "", image: "",
  excerpt: "", metaDescription: "", content: "", status: "published",
  publishAt: "",
};

/* datetime-local <-> UTC ISO. The input is naive local time; the API
   stores UTC, so the two conversions have to be explicit or a schedule
   set for 9am India would fire at 9am UTC. */
function localInputToIso(v: string): string {
  return v ? new Date(v).toISOString() : "";
}
function isoToLocalInput(iso: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

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
  /* Content-image flow: a second uploader that drops the uploaded
     image as Markdown at the cursor inside the content textarea, so
     posts can carry images between sections (Mahendra/doc 7/27). */
  const contentFileRef = useRef<HTMLInputElement>(null);
  const contentRef = useRef<HTMLTextAreaElement>(null);

  /* Dashboard sections: BLOG (posts) | LEADS (contact-form submissions
     logged by contact.php). /admin/leads pre-selects the Leads tab. */
  const [section, setSection] = useState<"blog" | "leads">(() =>
    typeof window !== "undefined" && window.location.pathname.startsWith("/admin/leads")
      ? "leads"
      : "blog"
  );
  const [leads, setLeads] = useState<Lead[]>([]);
  const [leadsBusy, setLeadsBusy] = useState(false);
  const [expandedLead, setExpandedLead] = useState<number | null>(null);

  const [optimizeBusy, setOptimizeBusy] = useState(false);
  const [optimizeMsg, setOptimizeMsg] = useState("");

  const refresh = () =>
    blogApi.all().then(setPosts).catch((e: Error) => setError(e.message));

  /* One-off cleanup of images uploaded before uploads were downscaled
     automatically. The server caps each call at ~20s and reports what is
     still left, so this loops until nothing remains. Filenames don't
     change, so no post needs re-editing afterwards. */
  const optimizeImages = async () => {
    setOptimizeBusy(true);
    setError("");
    setOptimizeMsg("Checking images…");
    try {
      const scan = await blogApi.optimizeImages(true);
      if (scan.oversized === 0) {
        setOptimizeMsg(`All good — ${scan.scanned} image${scan.scanned === 1 ? "" : "s"} checked, none oversized.`);
        return;
      }
      let done = 0, saved = 0, skipped = 0, pass = 0;
      for (;;) {
        setOptimizeMsg(`Resizing ${done}/${scan.oversized}…`);
        const r = await blogApi.optimizeImages();
        done += r.resized;
        saved += r.savedKb;
        skipped = r.failed;
        if (r.remaining === 0 || r.resized === 0 || ++pass > 20) break;
      }
      const size = saved >= 1024 ? `${(saved / 1024).toFixed(1)} MB` : `${saved} KB`;
      setOptimizeMsg(
        `Done — ${done} image${done === 1 ? "" : "s"} resized, ${size} saved` +
          (skipped ? `, ${skipped} left as-is (already optimal).` : ".")
      );
      refresh();
    } catch (e) {
      setError((e as Error).message);
      setOptimizeMsg("");
    } finally {
      setOptimizeBusy(false);
    }
  };

  const loadLeads = () => {
    setLeadsBusy(true);
    blogApi
      .leads()
      .then(setLeads)
      .catch((e: Error) => setError(e.message))
      .finally(() => setLeadsBusy(false));
  };

  const switchSection = (s: "blog" | "leads") => {
    setSection(s);
    setError("");
    setNotice("");
    window.history.replaceState(null, "", s === "leads" ? "/admin/leads/" : "/admin/blog/");
    if (s === "leads") loadLeads();
  };

  useEffect(() => {
    blogApi
      .me()
      .then((authed) => {
        if (authed) {
          setPhase("list");
          refresh();
          if (window.location.pathname.startsWith("/admin/leads")) loadLeads();
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
      if (section === "leads") loadLeads();
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
        image: p.image, excerpt: p.excerpt,
        metaDescription: p.metaDescription || "",
        content: p.content,
        status: (p.status as EditorState["status"]) || "draft",
        publishAt: isoToLocalInput(p.publishAt || ""),
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

  const handleSave = async (status?: EditorState["status"]) => {
    setBusy(true);
    setError("");
    setNotice("");
    try {
      const next = status ?? editor.status;
      if (next === "scheduled" && !editor.publishAt) {
        setError("Pick a date and time to schedule this post.");
        setBusy(false);
        return;
      }
      /* The picker gives naive local time; the API stores UTC, so the
         conversion has to be explicit or a 9am schedule set in India
         would fire at 9am UTC. */
      const payload = {
        ...editor,
        status: next,
        publishAt: next === "scheduled" ? localInputToIso(editor.publishAt) : "",
      };
      const r = await blogApi.save(payload);
      setEditor((s) => ({ ...s, id: r.id, slug: r.slug, status: next }));
      setNotice(
        next === "published"
          ? "Published ✓"
          : next === "scheduled"
            ? `Scheduled for ${new Date(editor.publishAt).toLocaleString()} ✓`
            : "Draft saved ✓"
      );
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

  /* Upload + insert `![alt](url)` into the content at the caret (or at
     the end when the preview is open / textarea unfocused). */
  const handleContentImage = async (file: File) => {
    setBusy(true);
    setError("");
    try {
      const url = await blogApi.upload(file);
      const alt = file.name.replace(/\.[a-z0-9]+$/i, "").replace(/[-_]+/g, " ");
      const snippet = `\n\n![${alt}](${url})\n\n`;
      setEditor((s) => {
        const at = contentRef.current?.selectionStart ?? s.content.length;
        return { ...s, content: s.content.slice(0, at) + snippet + s.content.slice(at) };
      });
      setNotice("Image inserted into content ✓");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setBusy(false);
      if (contentFileRef.current) contentFileRef.current.value = "";
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

        {/* ── Section tabs: BLOG | LEADS ── */}
        {(phase === "list" || phase === "edit") && (
          <div className="flex gap-2 mb-8 border-b border-dark/10">
            <button
              onClick={() => switchSection("blog")}
              className={`inline-flex items-center gap-2 px-5 py-3 text-sm font-semibold tracking-[0.15em] border-b-2 -mb-px transition-colors ${
                section === "blog"
                  ? "border-dark text-dark"
                  : "border-transparent text-dark/45 hover:text-dark"
              }`}
            >
              <BookOpen className="w-4 h-4" /> BLOG
            </button>
            <button
              onClick={() => switchSection("leads")}
              className={`inline-flex items-center gap-2 px-5 py-3 text-sm font-semibold tracking-[0.15em] border-b-2 -mb-px transition-colors ${
                section === "leads"
                  ? "border-dark text-dark"
                  : "border-transparent text-dark/45 hover:text-dark"
              }`}
            >
              <Users className="w-4 h-4" /> LEADS
              {leads.length > 0 && (
                <span className="text-[11px] bg-dark text-white rounded-full px-2 py-0.5">
                  {leads.length}
                </span>
              )}
            </button>
          </div>
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

        {/* ── LEADS: contact-form submissions ── */}
        {section === "leads" && (phase === "list" || phase === "edit") && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-dark/60">
                {leads.length} lead{leads.length === 1 ? "" : "s"} — every
                contact-form submission is saved here, even if its email failed.
              </p>
              <button
                onClick={loadLeads}
                disabled={leadsBusy}
                className="inline-flex items-center gap-2 px-5 py-2.5 border border-dark/25 text-dark text-sm hover:bg-dark hover:text-white transition-colors disabled:opacity-60"
              >
                <RefreshCw className={`w-4 h-4 ${leadsBusy ? "animate-spin" : ""}`} />
                Refresh
              </button>
            </div>

            <div className="border border-dark/10 rounded-lg overflow-hidden bg-white/50">
              {leads.length === 0 && (
                <p className="px-5 py-10 text-center text-dark/50 text-sm">
                  {leadsBusy ? "Loading…" : "No leads yet — form submissions will appear here."}
                </p>
              )}
              {leads.map((l, i) => (
                <div key={i} className="border-b border-dark/10 last:border-b-0">
                  <button
                    onClick={() => setExpandedLead(expandedLead === i ? null : i)}
                    className="w-full flex items-center gap-4 px-5 py-4 text-left hover:bg-dark/[0.03] transition-colors"
                  >
                    <div className="w-28 shrink-0">
                      <p className="text-xs text-dark/50">{formatPostDate(l.time)}</p>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-dark truncate">{l.name}</p>
                      <p className="text-xs text-dark/50 truncate">
                        {l.email}
                        {l.phone ? ` · ${l.phone}` : ""}
                        {l.company ? ` · ${l.company}` : ""}
                        {l.projectType ? ` · ${l.projectType}` : ""}
                      </p>
                    </div>
                    <span
                      className={`text-[11px] font-semibold tracking-wider px-2.5 py-1 rounded-full shrink-0 ${
                        l.emailStatus === "sent"
                          ? "bg-dark text-white"
                          : "bg-red-100 text-red-700"
                      }`}
                      title={l.emailStatus === "sent" ? "Notification email delivered" : "Email failed - lead saved here"}
                    >
                      {l.emailStatus === "sent" ? "EMAILED" : "SAVED"}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-dark/40 shrink-0 transition-transform ${
                        expandedLead === i ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {expandedLead === i && (
                    <div className="px-5 pb-5 pt-1">
                      <div className="bg-warmbeige/60 rounded-lg px-4 py-3 text-sm text-dark/80 whitespace-pre-wrap leading-relaxed">
                        {l.message}
                      </div>
                      <div className="mt-3 flex flex-wrap items-center gap-5">
                        <a
                          href={`mailto:${l.email}?subject=${encodeURIComponent("Re: Your enquiry with Ashkan Studios")}`}
                          className="inline-flex items-center gap-2 text-xs font-medium tracking-wider text-dark/70 hover:text-dark"
                        >
                          <Mail className="w-3.5 h-3.5" /> REPLY TO {l.name.toUpperCase()}
                        </a>
                        {/* Phone 9/5 se required hai; purani leads me nahi
                            hai, to link tabhi dikhao jab number ho. */}
                        {l.phone && (
                          <a
                            href={`tel:${l.phone.replace(/[A-Za-z].*$/, "").replace(/[^\d+]/g, "")}`}
                            className="inline-flex items-center gap-2 text-xs font-medium tracking-wider text-dark/70 hover:text-dark"
                          >
                            <Phone className="w-3.5 h-3.5" /> {l.phone}
                          </a>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Post list ── */}
        {section === "blog" && phase === "list" && (
          <>
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
              <p className="text-sm text-dark/60">
                {posts.length} post{posts.length === 1 ? "" : "s"}
              </p>
              <div className="flex items-center gap-3">
                {/* One-off: shrinks images uploaded before uploads were
                    auto-downscaled. Safe to run any time - already-small
                    images are skipped and URLs never change. */}
                <button
                  onClick={optimizeImages}
                  disabled={optimizeBusy}
                  title="Shrink oversized images already in /blog-uploads/ (safe to re-run)"
                  className="inline-flex items-center gap-2 px-5 py-3 border border-dark/20 text-dark text-sm font-medium tracking-wider hover:bg-dark/5 transition-colors disabled:opacity-50"
                >
                  {optimizeBusy ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Wand2 className="w-4 h-4" />
                  )}
                  OPTIMIZE IMAGES
                </button>
                <button
                  onClick={openNew}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-dark text-white text-sm font-medium tracking-wider"
                >
                  <Plus className="w-4 h-4" /> NEW POST
                </button>
              </div>
            </div>

            {optimizeMsg && (
              <p className="mb-4 text-sm text-dark/70 bg-warmbeige/40 border border-dark/10 px-4 py-3 rounded">
                {optimizeMsg}
              </p>
            )}

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
                        : p.status === "scheduled"
                          ? "bg-warmbeige text-dark"
                          : "bg-dark/10 text-dark/60"
                    }`}
                    title={
                      p.status === "scheduled" && p.publishAt
                        ? `Goes live ${new Date(p.publishAt).toLocaleString()}`
                        : undefined
                    }
                  >
                    {p.status === "published"
                      ? "LIVE"
                      : p.status === "scheduled"
                        ? "SCHEDULED"
                        : "DRAFT"}
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
        {section === "blog" && phase === "edit" && (
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
                    <div className="flex items-center gap-4">
                      <input
                        ref={contentFileRef}
                        type="file"
                        accept="image/jpeg,image/png,image/webp,image/gif"
                        className="hidden"
                        onChange={(e) => e.target.files?.[0] && handleContentImage(e.target.files[0])}
                      />
                      <button
                        type="button"
                        onClick={() => contentFileRef.current?.click()}
                        disabled={busy || showPreview}
                        title="Upload an image and insert it at the cursor"
                        className="inline-flex items-center gap-1.5 text-xs text-dark/60 hover:text-dark disabled:opacity-50"
                      >
                        <ImageIcon className="w-3.5 h-3.5" /> Insert image
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowPreview(!showPreview)}
                        className="inline-flex items-center gap-1.5 text-xs text-dark/60 hover:text-dark"
                      >
                        {showPreview ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        {showPreview ? "Hide preview" : "Preview"}
                      </button>
                    </div>
                  </div>
                  {!showPreview ? (
                    <textarea
                      ref={contentRef}
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

                <div>
                  <label className={label}>Meta description (SEO)</label>
                  <textarea
                    className={input + " resize-none text-sm"}
                    rows={3}
                    maxLength={170}
                    value={editor.metaDescription}
                    onChange={(e) => setEditor({ ...editor, metaDescription: e.target.value })}
                    placeholder="What Google shows under the title (~150-160 characters; falls back to the excerpt if empty)"
                  />
                  <p className="text-xs text-dark/45 mt-1.5">
                    {editor.metaDescription.length}/160
                  </p>
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

                  {/* Schedule: pick a date/time and the post goes live on
                      its own. The server flips it the first time anyone
                      loads the blog after that moment - no cron needed. */}
                  <div className="border border-dark/15 rounded-lg p-4 bg-white/50">
                    <label className={label}>Schedule publish</label>
                    <input
                      type="datetime-local"
                      className={input}
                      value={editor.publishAt}
                      min={isoToLocalInput(new Date().toISOString())}
                      onChange={(e) => setEditor({ ...editor, publishAt: e.target.value })}
                    />
                    <button
                      onClick={() => handleSave("scheduled")}
                      disabled={busy || !editor.title || !editor.content || !editor.publishAt}
                      className="w-full mt-3 inline-flex items-center justify-center gap-2 px-7 py-3 bg-warmbeige text-dark text-sm font-medium tracking-wider hover:bg-dark hover:text-white transition-colors disabled:opacity-50"
                    >
                      <CalendarClock className="w-4 h-4" />
                      {editor.status === "scheduled" ? "UPDATE SCHEDULE" : "SCHEDULE"}
                    </button>
                    <p className="text-xs text-dark/45 mt-2 leading-relaxed">
                      {editor.status === "scheduled" && editor.publishAt
                        ? `Goes live ${new Date(editor.publishAt).toLocaleString()} - hidden until then.`
                        : "Your local time. The post stays hidden until that moment."}
                    </p>
                  </div>
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
