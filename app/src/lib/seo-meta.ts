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
const DEFAULT_DESC =
  "Ashkan Studios - Full-service production company specializing in commercial photography, videography, and creative direction. Based in Houston, TX.";

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
    case "home":
      return {
        title: `${SITE_NAME} | Full-Service Production Company`,
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
        title: `Commercial Photography Portfolio | ${SITE_NAME}`,
        description:
          "Explore the Ashkan Studios commercial photography portfolio — retail, the arts, fashion, industrial, and headshots, produced in Houston, TX.",
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
        title: `Commercial Videography Portfolio | ${SITE_NAME}`,
        description:
          "Cinematic commercial videography from Ashkan Studios — retail, the arts, industrial, documentary, and narrative work produced in Houston, TX.",
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
        title: `Brand Campaigns | ${SITE_NAME}`,
        description:
          "Featured brand campaigns by Ashkan Studios — full-service commercial photography and video production for retail, dance, and lifestyle brands.",
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
        title: `What We Do — Photography, Video & Creative Direction | ${SITE_NAME}`,
        description:
          "Ashkan Studios is a full-service Houston production company offering commercial photography, cinematic videography, and creative direction.",
        path: "/what-we-do/",
      };

    case "studio":
      return {
        title: `The Studio | ${SITE_NAME}`,
        description:
          "Meet Ashkan Studios — a Houston-based creative production team uniting Ashkan Image and Ashkan Media into one full-service studio.",
        path: "/studio/",
      };

    case "contact":
      return {
        title: `Contact | ${SITE_NAME}`,
        description:
          "Get in touch with Ashkan Studios in Houston, TX. Tell us about your commercial photography, videography, or creative direction project.",
        path: "/contact/",
      };

    case "storytime":
      return {
        title: `Storytime — Studio Journal & Behind the Scenes | ${SITE_NAME}`,
        description:
          "Storytime is the Ashkan Studios journal — studio updates, behind-the-scenes from shoots, campaign recaps, press features, and thoughts from the industry.",
        path: "/storytime/",
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
  const canonical = window.location.origin + meta.path;

  document.title = meta.title;
  setMetaByName("description", meta.description);
  setMetaByName("robots", meta.noindex ? "noindex, nofollow" : "index, follow");

  setMetaByProp("og:title", meta.title);
  setMetaByProp("og:description", meta.description);
  setMetaByProp("og:url", canonical);
  setMetaByProp("og:type", "website");
  setMetaByProp("og:site_name", SITE_NAME);

  setCanonical(canonical);
}
