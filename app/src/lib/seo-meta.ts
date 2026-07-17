// ────────────────────────────────────────────────────────────────
// Per-route SEO meta manager for the client-side SPA.
//
// The whole site is a single index.html, so without this every route
// shared ONE <title>/description and had NO <link rel="canonical">
// (flagged by SEO crawlers as duplicate titles + "Canonical: Missing").
//
// applyRouteMeta() runs on every route change and updates, in the live
// DOM: <title>, meta[name=description], a self-referencing
// <link rel="canonical">, the Open Graph tags, and meta[name=robots].
// Google renders JS before indexing, so these are picked up on crawl;
// browser SEO extensions read the rendered DOM, so they show correctly.
// (True SSR/prerender would also cover non-JS scrapers — a later step.)
// ────────────────────────────────────────────────────────────────
import { getSeoPageBySlug } from "@/data/seo-pages";
import type { View } from "@/App";

const SITE_NAME = "Ashkan Studios";
/* Canonical/OG URLs always use the PRODUCTION origin - never
   window.location.origin. Two reasons: (1) the prerender pipeline
   renders on a localhost server, and origin-based URLs would bake
   "http://127.0.0.1:..." into the static HTML; (2) preview domains
   (vercel.app) should canonicalize to the live site anyway. */
const SITE_ORIGIN = "https://ashkanstudios.com";
/* Home description per Mahendra's 7/17 on-page sheet (also the
   fallback for admin/test/unknown routes). */
const DEFAULT_DESC =
  "Ashkan Studios is Houston's full-service video production company and photography studio. Explore our work and start your project today.";

export interface RouteInput {
  view: View;
  category: string | null;
  slug: string | null;
}

interface RouteMeta {
  title: string;
  description: string;
  /** Canonical path, always with a leading + trailing slash. */
  path: string;
  noindex?: boolean;
}

/** "eye-gallery" -> "Eye Gallery" */
function titleCase(s: string): string {
  return s.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export function getRouteMeta({ view, category, slug }: RouteInput): RouteMeta {
  switch (view) {
    // Titles/descriptions for the 8 core pages follow Mahendra's 7/17
    // on-page SEO sheet verbatim (location + service keywords, "-"
    // separator instead of "|").
    case "home":
      return {
        title: `Video Production Company Houston, TX - ${SITE_NAME}`,
        description: DEFAULT_DESC,
        path: "/",
      };

    case "photography":
      if (category) {
        const c = titleCase(category);
        return {
          title: `${c} Photography in Houston | ${SITE_NAME}`,
          description: `${c} commercial photography by ${SITE_NAME}, a Houston-based production studio. View our ${c.toLowerCase()} portfolio.`,
          path: `/work/photography/${category}/`,
        };
      }
      return {
        title: `Professional Product Photographer Houston - ${SITE_NAME}`,
        description:
          "Ashkan Studios is a professional product and commercial photographer in Houston with 12+ years experience. View our portfolio and book a shoot.",
        path: "/work/photography/",
      };

    case "videography":
      if (category) {
        const c = titleCase(category);
        return {
          title: `${c} Videography in Houston | ${SITE_NAME}`,
          description: `${c} commercial videography by ${SITE_NAME}, a Houston production company. Watch our ${c.toLowerCase()} reel and project work.`,
          path: `/work/videography/${category}/`,
        };
      }
      return {
        title: `Video Production Agency Houston, TX - ${SITE_NAME}`,
        description:
          "Ashkan Studios is a Houston video production agency specializing in commercial, documentary and narrative videography. Start your project today.",
        path: "/work/videography/",
      };

    case "campaigns":
      if (category) {
        const c = titleCase(category);
        return {
          title: `${c} Campaign | ${SITE_NAME}`,
          description: `A closer look at the ${c} campaign by ${SITE_NAME} — commercial photography and video production for brands in Houston and beyond.`,
          path: `/work/campaigns/${category}/`,
        };
      }
      return {
        title: `Brand Video Production & Campaigns Houston - ${SITE_NAME}`,
        description:
          "See how Ashkan Studios' brand video production and campaign work has helped Houston businesses tell their story. View our campaign portfolio.",
        path: "/work/campaigns/",
      };

    case "headshots":
      return {
        title: `Professional Headshots in Houston | ${SITE_NAME}`,
        description:
          "Professional headshot photography in Houston by Ashkan Studios — polished, on-brand portraits for teams, executives, actors, and creatives.",
        path: "/photography/headshots/",
      };

    case "services":
      return {
        title: `Photography & Videography Services Houston - ${SITE_NAME}`,
        description:
          "Explore Ashkan Studios' full range of photography and videography services in Houston, from concept to final delivery. Get in touch today.",
        path: "/what-we-do/",
      };

    case "studio":
      return {
        title: `Houston Photography Studio Space - ${SITE_NAME}`,
        description:
          "Tour Ashkan Studios' dedicated Houston photography studio space in Sawyer Yards. Full production facility, in-house team. Book a visit today.",
        path: "/studio/",
      };

    case "contact":
      return {
        title: `Video Production Services Houston - Contact ${SITE_NAME}`,
        description:
          "Ready to hire a Houston production company for video production services or commercial photography? Contact Ashkan Studios today or call (346) 335-7973.",
        path: "/contact/",
      };

    case "storytime":
      return {
        title: `Houston Production Company Blog - ${SITE_NAME} StoryTime`,
        description:
          "Behind-the-scenes stories, campaign recaps and press features from Ashkan Studios, Houston's production company. Subscribe for updates.",
        path: "/storytime/",
      };

    case "storytimePost":
      // Generic shell - StorytimePostPage overwrites title/description
      // with the real post data once it loads from the blog API.
      return {
        title: `Storytime | ${SITE_NAME}`,
        description:
          "A story from the Ashkan Studios journal — studio updates, behind-the-scenes, campaign recaps, and thoughts from the industry.",
        path: slug ? `/storytime/${slug}/` : "/storytime/",
      };

    case "admin":
      // Client-only dashboard - never index.
      return {
        title: `Storytime Admin | ${SITE_NAME}`,
        description: DEFAULT_DESC,
        path: "/admin/blog/",
        noindex: true,
      };

    case "press":
      return {
        title: `Press | ${SITE_NAME}`,
        description:
          "Press features, recognition, and media coverage for Ashkan Studios — a Houston-based commercial photography and video production company.",
        path: "/press/",
      };

    case "seo": {
      const data = slug ? getSeoPageBySlug(slug) : null;
      if (data) {
        return {
          title: data.metaTitle || `${data.title} | ${SITE_NAME}`,
          description: data.metaDescription || DEFAULT_DESC,
          path: `/${slug}/`,
        };
      }
      return {
        title: `${SITE_NAME} | Full-Service Production Company`,
        description: DEFAULT_DESC,
        path: "/",
      };
    }

    case "test":
      // Internal review pages — never index. `category` holds the variant slug.
      return {
        title: `Preview | ${SITE_NAME}`,
        description: DEFAULT_DESC,
        path: category ? `/test/${category}/` : "/test/",
        noindex: true,
      };

    default:
      return {
        title: `${SITE_NAME} | Full-Service Production Company`,
        description: DEFAULT_DESC,
        path: "/",
      };
  }
}

/** Create-or-update a <meta name="..."> tag. */
function setMetaByName(name: string, content: string): void {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[name="${name}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute("name", name);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

/** Create-or-update a <meta property="..."> (Open Graph) tag. */
function setMetaByProp(property: string, content: string): void {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[property="${property}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute("property", property);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

/** Create-or-update the <link rel="canonical"> tag. */
function setCanonical(href: string): void {
  let el = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", "canonical");
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

/**
 * Apply all SEO meta for the given route to the document head.
 * Canonical is self-referencing (uses the current origin), so it stays
 * correct on the Vercel preview domain today and on ashkanstudios.com
 * once the site is pointed there.
 */
export function applyRouteMeta(input: RouteInput): void {
  const meta = getRouteMeta(input);
  const canonical = SITE_ORIGIN + meta.path;

  document.title = meta.title;
  setMetaByName("description", meta.description);
  setMetaByName("robots", meta.noindex ? "noindex, nofollow" : "index, follow");

  const ogImage = SITE_ORIGIN + "/og-image.jpg";
  setMetaByProp("og:title", meta.title);
  setMetaByProp("og:description", meta.description);
  setMetaByProp("og:url", canonical);
  setMetaByProp("og:type", "website");
  setMetaByProp("og:site_name", SITE_NAME);
  setMetaByProp("og:image", ogImage);
  setMetaByName("twitter:card", "summary_large_image");
  setMetaByName("twitter:title", meta.title);
  setMetaByName("twitter:description", meta.description);
  setMetaByName("twitter:image", ogImage);

  setCanonical(canonical);
}
