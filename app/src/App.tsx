import { useState, useEffect, useCallback } from "react";
import { Header } from "@/components/layout/Header";
import { HomePage } from "@/pages/HomePage";
import { PhotographyPage } from "@/pages/PhotographyPage";
import { VideographyPage } from "@/pages/VideographyPage";
import { CampaignsPage } from "@/pages/CampaignsPage";
import { ServicesPage } from "@/pages/ServicesPage";
import { StudioPage } from "@/pages/StudioPage";
import { ContactPage } from "@/pages/ContactPage";
import { StorytimePage } from "@/pages/StorytimePage";
import { StorytimePostPage } from "@/pages/StorytimePostPage";
import { BlogAdminPage } from "@/pages/BlogAdminPage";
import { PressPage } from "@/pages/PressPage";
import { HeadshotsPage } from "@/pages/HeadshotsPage";
import { SeoPage } from "@/pages/SeoPage";
import { CampaignDetailPage } from "@/pages/CampaignDetailPage";
import { TestIndexPage } from "@/pages/TestIndexPage";
import { TestPage } from "@/pages/TestPage";
import { getSeoPageBySlug } from "@/data/seo-pages";
import { applyRouteMeta } from "@/lib/seo-meta";
import { scrollToTopInstant } from "@/lib/scroll";

export type View =
  | "home"
  | "photography"
  | "headshots"
  | "videography"
  | "campaigns"
  | "services"
  | "studio"
  | "contact"
  | "storytime"
  | "storytimePost"
  | "admin"
  | "press"
  | "seo"
  | "test";

/* ── Legacy URL map: OLD ashkanstudios.com (WordPress) → new site ──
   The REAL 301s live in the WP Engine portal's Redirect Rules (server
   level - that's what transfers rankings). This map is the in-app
   safety net: the static-hosting catch-all serves the SPA for ANY
   path, so without it an un-redirected old URL would render the HOME
   page. Instead we replaceState to the right new page (visitors land
   correctly, and Google's JS render sees the target content +
   canonical). Sources from the 2026-07-01 old-site audit CSV. */
const LEGACY_REDIRECTS: Record<string, string> = {
  "/about-me": "/studio/",
  "/portfolios": "/work/photography/",
  "/portfolios-new": "/work/photography/",
  "/production-studio-in-houston-2": "/what-we-do/",
  "/houston-production-studio": "/what-we-do/",
  "/portfolios/brandon-blackwood": "/work/photography/retail/",
  "/portfolios/audaja-skincare": "/work/photography/retail/",
  "/portfolios/elastique-athletics": "/work/photography/retail/",
  "/portfolios/cacao-cardamom": "/work/photography/retail/",
  "/portfolios/cecilia-duarte": "/work/photography/the-arts/",
  "/portfolios/lauren-anderson": "/work/photography/the-arts/",
  "/portfolios/vitacca-ballet": "/work/photography/the-arts/",
  "/portfolios/fashion": "/work/photography/fashion/",
  "/portfolios/publications": "/work/photography/",
  "/portfolios/miscellaneous": "/work/photography/",
  "/portfolios/car-collections": "/work/photography/",
  "/portfolios/weissman-elite": "/work/campaigns/weissman/",
  "/portfolios/eye-gallery": "/work/campaigns/eye-gallery/",
  "/portfolios/deutsch-fine-jewelry": "/work/campaigns/deutsch/",
  "/portfolios/the-monarch-school-and-institute": "/work/campaigns/monarch-school/",
  "/portfolios/kinetik": "/work/videography/narrative/",
  "/portfolios/radiomedix": "/work/videography/industrial/",
};

/** Returns the new-site path for a legacy old-site URL, else null. */
function resolveLegacyPath(rawPathname: string): string | null {
  const pathname =
    rawPathname.length > 1 ? rawPathname.replace(/\/+$/, "") : rawPathname;
  return LEGACY_REDIRECTS[pathname] ?? null;
}

/* ── Route parsing (shared by initial load + popstate) ── */
interface ParsedRoute {
  view: View;
  slug: string | null;
  category: string | null;
}

function parseRoute(rawPathname: string): ParsedRoute {
  // Normalize: strip trailing slash (except root "/")
  const pathname = rawPathname.length > 1 ? rawPathname.replace(/\/+$/, "") : rawPathname;

  // Test variants - internal preview pages, not linked from public nav
  if (pathname === "/test" || pathname.startsWith("/test/")) {
    const slugMatch = pathname.match(/^\/test\/([^/]+)/);
    return {
      view: "test",
      slug: null,
      category: slugMatch ? slugMatch[1] : null, // category holds variant slug
    };
  }

  /* Brand-specific /portfolio/<slug>/ pages were removed on 2026-05-07 per
     Brandi's instruction to keep only category-based portfolio pages
     (/work/photography/<cat>/ and /work/videography/<cat>/) plus the four
     featured campaign pages (/work/campaigns/<slug>/). Old /portfolio/...
     URLs now fall through to the home page; we may add 301 redirects in
     vercel.json for the most-linked ones in a later cleanup pass. */

  // Work sub-routes
  if (pathname === "/work" || pathname.startsWith("/work/")) {
    if (pathname.startsWith("/work/photography")) {
      const catMatch = pathname.match(/^\/work\/photography\/([^/]+)/);
      return { view: "photography", slug: null, category: catMatch ? catMatch[1] : null };
    }
    if (pathname.startsWith("/work/videography")) {
      const catMatch = pathname.match(/^\/work\/videography\/([^/]+)/);
      return { view: "videography", slug: null, category: catMatch ? catMatch[1] : null };
    }
    if (pathname.startsWith("/work/campaigns")) {
      const catMatch = pathname.match(/^\/work\/campaigns\/([^/]+)/);
      return { view: "campaigns", slug: null, category: catMatch ? catMatch[1] : null };
    }
    /* The standalone /work/ landing page was removed 2026-05-08 per
       Brandi's review notes (pages 14-18 - 'NO WORK PAGE' repeated
       multiple times). Bare /work or /work/ now falls through to the
       home page; the WORK dropdown in the header still exposes the
       photography / videography / campaigns sub-routes. */
    return { view: "home", slug: null, category: null };
  }

  // Dedicated standalone Headshots page - lives at /photography/headshots
  // (outside the /work/ portfolio tree). Unarchived 2026-06-26.
  if (pathname === "/photography/headshots") {
    return { view: "headshots", slug: null, category: null };
  }

  // Storytime blog: /storytime/<slug>/ = single post (authored via the
  // /admin/blog dashboard). Bare /storytime stays the listing page.
  if (pathname.startsWith("/storytime/")) {
    const slugMatch = pathname.match(/^\/storytime\/([^/]+)/);
    if (slugMatch) {
      return { view: "storytimePost", slug: slugMatch[1], category: null };
    }
  }

  // Blog admin dashboard (login-protected, noindex).
  if (pathname === "/admin" || pathname === "/admin/blog") {
    return { view: "admin", slug: null, category: null };
  }

  // Top-level pages
  const pageMap: Record<string, View> = {
    "/what-we-do": "services",
    "/studio": "studio",
    "/contact": "contact",
    "/storytime": "storytime",
    "/press": "press",
  };
  if (pageMap[pathname]) {
    return { view: pageMap[pathname], slug: null, category: null };
  }

  // SEO landing pages (top-level slugs like /product-photography-in-houston/)
  const seoSlug = pathname.replace(/^\//, "");
  if (seoSlug && getSeoPageBySlug(seoSlug)) {
    return { view: "seo", slug: seoSlug, category: null };
  }

  return { view: "home", slug: null, category: null };
}

/* ── Path map: View → clean URL ── */
const pathMap: Record<View, string> = {
  home: "/",
  photography: "/work/photography/",
  headshots: "/photography/headshots/",
  videography: "/work/videography/",
  campaigns: "/work/campaigns/",
  services: "/what-we-do/",
  studio: "/studio/",
  contact: "/contact/",
  storytime: "/storytime/",
  storytimePost: "/storytime/",
  admin: "/admin/blog/",
  press: "/press/",
  seo: "/",
  test: "/test/",
};

function App() {
  const [currentView, setCurrentView] = useState<View>("home");
  const [selectedProjectSlug, setSelectedProjectSlug] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // ── Hash migration shim + initial route parse ──
  useEffect(() => {
    /* SPA owns scroll positioning on history navigation. Without this,
       Safari asynchronously restores the previous scroll position after
       popstate (back/forward), overriding our scroll-to-top and leaving
       pages stuck mid-scroll (part of Ashkan's 7/1 Safari bug report). */
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    // Migrate legacy hash URLs (/#/work → /work) transparently
    const hash = window.location.hash;
    if (hash.startsWith("#/")) {
      const cleanPath = hash.slice(1); // "#/work" → "/work"
      window.history.replaceState(null, "", cleanPath);
    }

    // Old-site URL landed directly (bookmark/Google) → swap to the
    // new-site path before routing.
    const legacy = resolveLegacyPath(window.location.pathname);
    if (legacy) {
      window.history.replaceState(null, "", legacy);
    }

    const { view, slug, category } = parseRoute(window.location.pathname);
    setCurrentView(view);
    setSelectedProjectSlug(slug);
    setSelectedCategory(category);
  }, []);

  // ── Handle browser back/forward + programmatic pushState ──
  useEffect(() => {
    const handlePopState = () => {
      // Old-site URL arriving via history navigation → normalize first.
      const legacy = resolveLegacyPath(window.location.pathname);
      if (legacy) {
        window.history.replaceState(null, "", legacy);
      }
      const { view, slug, category } = parseRoute(window.location.pathname);
      setCurrentView(view);
      setSelectedProjectSlug(slug);
      setSelectedCategory(category);
      /* Scroll to top on every route change - covers browser
         back/forward AND any programmatic `pushState +
         dispatchEvent(PopStateEvent)` call from sections /
         footer / etc. Per user request 2026-05-12: every page
         should land at the hero/top, never mid- or bottom-scroll.
         Instant (not smooth) so Safari can't cancel it mid-render. */
      scrollToTopInstant();
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  // ── Per-route SEO meta (title, description, canonical, OG, robots) ──
  // Runs on initial load and after every route change so each page gets
  // its own <title>/description and a self-referencing canonical instead
  // of sharing the single static index.html meta.
  useEffect(() => {
    applyRouteMeta({
      view: currentView,
      category: selectedCategory,
      slug: selectedProjectSlug,
    });
  }, [currentView, selectedCategory, selectedProjectSlug]);

  // ── Navigation ──
  const navigateTo = useCallback((view: View, slug?: string) => {
    if (view === "seo" && slug) {
      setSelectedProjectSlug(slug);
      setSelectedCategory(null);
      setCurrentView("seo");
      window.history.pushState(null, "", `/${slug}/`);
    } else if (view === "storytimePost" && slug) {
      setSelectedProjectSlug(slug);
      setSelectedCategory(null);
      setCurrentView("storytimePost");
      window.history.pushState(null, "", `/storytime/${slug}/`);
    } else if (view === "test" && slug) {
      setSelectedCategory(slug);
      setCurrentView("test");
      window.history.pushState(null, "", `/test/${slug}/`);
    } else if ((view === "photography" || view === "videography" || view === "campaigns") && slug) {
      setSelectedCategory(slug);
      setCurrentView(view);
      const base =
        view === "photography" ? "/work/photography/" :
        view === "videography" ? "/work/videography/" :
        "/work/campaigns/";
      window.history.pushState(null, "", `${base}${slug}/`);
    } else {
      setCurrentView(view);
      setSelectedCategory(null);
      window.history.pushState(null, "", pathMap[view]);
    }
    scrollToTopInstant();
  }, []);

  const navigateToHome = useCallback(() => {
    setCurrentView("home");
    setSelectedProjectSlug(null);
    setSelectedCategory(null);
    window.history.pushState(null, "", "/");
    scrollToTopInstant();
  }, []);

  // ── Render current view ──
  const renderContent = () => {
    switch (currentView) {
      case "home":
        return <HomePage onNavigate={navigateTo} />;
      case "photography":
        return <PhotographyPage onNavigate={navigateTo} activeCategory={selectedCategory} />;
      case "headshots":
        /* Dedicated standalone Headshots page at /photography/headshots
           (unarchived 2026-06-26). Separate from the WORK gallery at
           /work/photography/headshots/. */
        return <HeadshotsPage onNavigate={navigateTo} />;
      case "videography":
        return <VideographyPage onNavigate={navigateTo} activeCategory={selectedCategory} />;
      case "campaigns":
        if (selectedCategory) {
          return <CampaignDetailPage campaignSlug={selectedCategory} onNavigate={navigateTo} />;
        }
        return <CampaignsPage onNavigate={navigateTo} activeCategory={selectedCategory} />;
      case "services":
        return <ServicesPage onNavigate={navigateTo} />;
      case "studio":
        return <StudioPage onNavigate={navigateTo} />;
      case "contact":
        return <ContactPage onNavigate={navigateTo} />;
      case "storytime":
        return <StorytimePage onNavigate={navigateTo} />;
      case "storytimePost":
        if (selectedProjectSlug) {
          return <StorytimePostPage slug={selectedProjectSlug} onNavigate={navigateTo} />;
        }
        return <StorytimePage onNavigate={navigateTo} />;
      case "admin":
        return <BlogAdminPage onNavigate={navigateTo} />;
      case "press":
        return <PressPage onNavigate={navigateTo} />;
      case "test":
        if (selectedCategory) {
          return <TestPage variantSlug={selectedCategory} onNavigate={navigateTo} />;
        }
        return <TestIndexPage onNavigate={navigateTo} />;
      case "seo": {
        const seoData = selectedProjectSlug ? getSeoPageBySlug(selectedProjectSlug) : null;
        if (seoData) {
          return <SeoPage data={seoData} onNavigate={navigateTo} />;
        }
        return <HomePage onNavigate={navigateTo} />;
      }
      default:
        return <HomePage onNavigate={navigateTo} />;
    }
  };

  return (
    <div className="min-h-screen bg-cream">
      <Header onLogoClick={navigateToHome} onNavigate={navigateTo} currentView={currentView} />
      {renderContent()}
    </div>
  );
}

export default App;
