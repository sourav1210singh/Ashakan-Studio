import { useEffect, useMemo, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { marked } from "marked";
import DOMPurify from "dompurify";
import { FadeIn } from "@/components/animations/FadeIn";
import { Footer } from "@/components/layout/Footer";
import { blogApi, formatPostDate, type BlogPost } from "@/lib/blog";
import { AppLink } from "@/components/AppLink";
import type { View } from "@/App";

interface StorytimePostPageProps {
  slug: string;
  onNavigate: (view: View, slug?: string) => void;
}

/* Turn a "FAQ" section of the rendered post into click-to-expand
   accordions: inside the section that starts at an h2 whose text
   mentions FAQ, every h3 becomes a <details><summary> toggle holding
   the nodes that follow it (until the next h3/h2). Everything else
   passes through untouched. Runs on sanitized HTML. */
function accordionizeFaq(html: string): string {
  if (!/faq|frequently asked/i.test(html)) return html;
  const doc = new DOMParser().parseFromString(html, "text/html");
  const headings = Array.from(doc.body.querySelectorAll("h2"));
  const faqH2 = headings.find((h) => /faq|frequently asked/i.test(h.textContent || ""));
  if (!faqH2) return html;

  let node = faqH2.nextElementSibling;
  while (node && node.tagName !== "H2") {
    if (node.tagName === "H3") {
      const details = doc.createElement("details");
      details.className = "faq-item";
      const summary = doc.createElement("summary");
      summary.textContent = node.textContent || "";
      details.appendChild(summary);
      const next = () => details.nextElementSibling;
      node.replaceWith(details);
      // pull everything up to the next h3/h2 inside this details
      let sib = next();
      while (sib && sib.tagName !== "H3" && sib.tagName !== "H2") {
        const grab = sib;
        sib = grab.nextElementSibling;
        details.appendChild(grab);
      }
      node = details.nextElementSibling;
    } else {
      node = node.nextElementSibling;
    }
  }
  return doc.body.innerHTML;
}

/**
 * Public single-post page for the Storytime blog (/storytime/<slug>/).
 * Content is authored in the /admin/blog dashboard as Markdown and
 * rendered here (marked -> DOMPurify) in the site's editorial style.
 */
export function StorytimePostPage({ slug, onNavigate }: StorytimePostPageProps) {
  const [post, setPost] = useState<BlogPost | null>(null);
  const [state, setState] = useState<"loading" | "ready" | "missing">("loading");

  useEffect(() => {
    let alive = true;
    setState("loading");
    blogApi
      .post(slug)
      .then((p) => {
        if (!alive) return;
        setPost(p);
        setState("ready");
      })
      .catch(() => alive && setState("missing"));
    return () => {
      alive = false;
    };
  }, [slug]);

  /* Per-post SEO meta - the route-level manager only knows the slug,
     so the real title/description are applied once the post loads.
     metaDescription (the admin's SEO field) wins over the excerpt. */
  useEffect(() => {
    if (!post) return;
    document.title = `${post.title} | Ashkan Studios`;
    const d = document.head.querySelector<HTMLMetaElement>('meta[name="description"]');
    const desc = post.metaDescription || post.excerpt;
    if (d && desc) d.setAttribute("content", desc.slice(0, 160));
  }, [post]);

  const html = useMemo(() => {
    if (!post) return "";
    const raw = marked.parse(post.content, { async: false, gfm: true, breaks: true }) as string;
    return accordionizeFaq(DOMPurify.sanitize(raw));
  }, [post]);

  return (
    <>
      <main className="pt-20 bg-cream min-h-screen">
        {state === "loading" && (
          <div className="max-w-[820px] mx-auto px-4 sm:px-6 py-32 text-center text-dark/50 tracking-wider text-sm">
            LOADING…
          </div>
        )}

        {state === "missing" && (
          <div className="max-w-[820px] mx-auto px-4 sm:px-6 py-32 text-center">
            <h1 className="font-display text-4xl sm:text-5xl text-dark tracking-tight mb-6">
              STORY NOT FOUND
            </h1>
            <p className="text-dark/60 mb-8">
              This story may have been moved or unpublished.
            </p>
            <AppLink
              href="/storytime/"
              onNav={() => onNavigate("storytime")}
              className="inline-flex items-center gap-2 px-6 py-3 bg-dark text-white text-sm font-medium tracking-wider"
            >
              <ArrowLeft className="w-4 h-4" /> BACK TO STORYTIME
            </AppLink>
          </div>
        )}

        {state === "ready" && post && (
          <article>
            {/* Hero image (optional) */}
            {post.image && (
              <div className="w-full max-h-[560px] overflow-hidden bg-dark">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover max-h-[560px]"
                />
              </div>
            )}

            <div className="max-w-[820px] mx-auto px-4 sm:px-6 py-14 sm:py-20">
              <FadeIn>
                <AppLink
                  href="/storytime/"
                  onNav={() => onNavigate("storytime")}
                  className="inline-flex items-center gap-2 text-xs font-medium tracking-[0.25em] text-dark/50 hover:text-dark transition-colors mb-8"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> STORYTIME
                </AppLink>

                <p className="text-xs font-semibold tracking-[0.3em] text-dark/45 uppercase mb-5">
                  {formatPostDate(post.createdAt)}
                </p>

                <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl text-dark tracking-tight leading-[1.05] mb-10">
                  {post.title}
                </h1>
              </FadeIn>

              {/* Prose is OUTSIDE the FadeIn: FadeIn's IntersectionObserver
                  needs 10% of the element in view, which a ~7000px-tall
                  long post can never satisfy in a 900px viewport - the
                  whole article stayed at opacity 0 (bug report 7/27,
                  long posts only). A plain CSS mount-fade needs no
                  intersection at all. */}
              <div
                className="blog-prose"
                style={{ animation: "blogProseIn 0.6s ease both" }}
                dangerouslySetInnerHTML={{ __html: html }}
              />
            </div>
          </article>
        )}

        {/* Editorial typography for rendered Markdown - matches the
            site's cream/dark language. Scoped under .blog-prose. */}
        <style>{`
          .blog-prose { color: rgba(26,26,26,0.8); font-size: 1.075rem; line-height: 1.8; }
          .blog-prose p { margin: 0 0 1.4em; }
          .blog-prose h2, .blog-prose h3, .blog-prose h4 {
            font-family: Anton, sans-serif; letter-spacing: -0.01em;
            color: #1A1A1A; line-height: 1.15; margin: 2em 0 0.7em;
          }
          .blog-prose h2 { font-size: 1.9rem; }
          .blog-prose h3 { font-size: 1.45rem; }
          .blog-prose h4 { font-size: 1.15rem; }
          .blog-prose a { color: #1A1A1A; text-decoration: underline; text-underline-offset: 3px; }
          .blog-prose a:hover { opacity: 0.7; }
          .blog-prose ul, .blog-prose ol { margin: 0 0 1.4em; padding-left: 1.4em; }
          .blog-prose li { margin: 0.35em 0; }
          .blog-prose img { width: 100%; height: auto; margin: 2em 0; }
          .blog-prose blockquote {
            border-left: 3px solid #1A1A1A; margin: 1.8em 0; padding: 0.2em 0 0.2em 1.2em;
            color: rgba(26,26,26,0.65); font-style: italic;
          }
          .blog-prose hr { border: none; border-top: 1px solid rgba(26,26,26,0.15); margin: 2.5em 0; }
          .blog-prose code {
            background: #E8E0D1; padding: 0.15em 0.4em; border-radius: 4px;
            font-size: 0.9em;
          }
          .blog-prose pre { background: #1A1A1A; color: #F5F5F0; padding: 1.2em; overflow-x: auto; margin: 0 0 1.4em; }
          .blog-prose pre code { background: transparent; color: inherit; padding: 0; }
          .blog-prose strong { color: #1A1A1A; }
          .blog-prose table { width: 100%; border-collapse: collapse; margin: 0 0 1.8em; font-size: 0.95em; }
          .blog-prose th { font-family: Anton, sans-serif; letter-spacing: 0.02em; text-align: left; background: #1A1A1A; color: #F5F5F0; padding: 0.7em 0.9em; }
          .blog-prose td { padding: 0.7em 0.9em; border-bottom: 1px solid rgba(26,26,26,0.12); vertical-align: top; }
          @keyframes blogProseIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: none; } }
          /* FAQ accordions (details/summary from accordionizeFaq) */
          .blog-prose details.faq-item { border: 1px solid rgba(26,26,26,0.15); margin: 0 0 0.8em; background: rgba(255,255,255,0.5); }
          .blog-prose details.faq-item summary {
            cursor: pointer; list-style: none; padding: 1em 3em 1em 1.2em; position: relative;
            font-family: Anton, sans-serif; font-size: 1.05rem; color: #1A1A1A; letter-spacing: 0.01em;
          }
          .blog-prose details.faq-item summary::-webkit-details-marker { display: none; }
          .blog-prose details.faq-item summary::after {
            content: "+"; position: absolute; right: 1.1em; top: 50%; transform: translateY(-50%);
            font-size: 1.4em; line-height: 1; color: rgba(26,26,26,0.6); transition: transform 0.25s ease;
          }
          .blog-prose details.faq-item[open] summary::after { content: "\\2212"; }
          .blog-prose details.faq-item[open] summary { border-bottom: 1px solid rgba(26,26,26,0.12); }
          .blog-prose details.faq-item > *:not(summary) { margin-left: 1.2em; margin-right: 1.2em; }
          .blog-prose details.faq-item > p:first-of-type { margin-top: 1em; }
          .blog-prose details.faq-item > *:last-child { margin-bottom: 1em; }
        `}</style>
      </main>
      <Footer onLogoClick={() => onNavigate("home")} onNavigate={onNavigate} />
    </>
  );
}
