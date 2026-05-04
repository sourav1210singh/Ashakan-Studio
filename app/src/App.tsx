import { useState, useEffect, useCallback } from "react";
import { Header } from "@/components/layout/Header";
import { HomePage } from "@/pages/HomePage";
import { WorkPage } from "@/pages/WorkPage";
import { PhotographyPage } from "@/pages/PhotographyPage";
import { VideographyPage } from "@/pages/VideographyPage";
import { CampaignsPage } from "@/pages/CampaignsPage";
import { ServicesPage } from "@/pages/ServicesPage";
import { StudioPage } from "@/pages/StudioPage";
import { ContactPage } from "@/pages/ContactPage";
import { StorytimePage } from "@/pages/StorytimePage";
import { PortfolioPage } from "@/pages/PortfolioPage";
import { PressPage } from "@/pages/PressPage";
import { getProjectById } from "@/data/projects";
import { HeadshotsPage } from "@/pages/HeadshotsPage";
import { SeoPage } from "@/pages/SeoPage";
import { BookingPage } from "@/pages/BookingPage";
import { CampaignDetailPage } from "@/pages/CampaignDetailPage";
import { TestIndexPage } from "@/pages/TestIndexPage";
import { TestPage } from "@/pages/TestPage";
import { getSeoPageBySlug } from "@/data/seo-pages";

export type View =
  | "home"
  | "work"
  | "photography"
  | "videography"
  | "campaigns"
  | "services"
  | "studio"
  | "contact"
  | "storytime"
  | "press"
  | "portfolio"
  | "seo"
  | "booking"
  | "test";

/* ── Route parsing (shared by initial load + popstate) ── */
interface ParsedRoute {
  view: View;
  slug: string | null;
  category: string | null;
}

function parseRoute(rawPathname: string): ParsedRoute {
  // Normalize: strip trailing slash (except root "/")
  const pathname = rawPathname.length > 1 ? rawPathname.replace(/\/+$/, "") : rawPathname;

  // Test variants — internal preview pages, not linked from public nav
  if (pathname === "/test" || pathname.startsWith("/test/")) {
    const slugMatch = pathname.match(/^\/test\/([^/]+)/);
    return {
      view: "test",
      slug: null,
      category: slugMatch ? slugMatch[1] : null, // category holds variant slug
    };
  }

  // Portfolio pages
  const portfolioMatch = pathname.match(/^\/portfolio\/(.+)$/);
  if (portfolioMatch) {
    const slug = portfolioMatch[1];
    const project = getProjectById(slug);
    if (project) {
      return { view: "portfolio", slug, category: null };
    }
  }

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
    return { view: "work", slug: null, category: null };
  }

  // Top-level pages
  const pageMap: Record<string, View> = {
    "/what-we-do": "services",
    "/studio": "studio",
    "/contact/booking": "booking",
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
  work: "/work/",
  photography: "/work/photography/",
  videography: "/work/videography/",
  campaigns: "/work/campaigns/",
  services: "/what-we-do/",
  studio: "/studio/",
  contact: "/contact/",
  booking: "/contact/booking/",
  storytime: "/storytime/",
  press: "/press/",
  portfolio: "/",
  seo: "/",
  test: "/test/",
};

function App() {
  const [currentView, setCurrentView] = useState<View>("home");
  const [selectedProjectSlug, setSelectedProjectSlug] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // ── Hash migration shim + initial route parse ──
  useEffect(() => {
    // Migrate legacy hash URLs (/#/work → /work) transparently
    const hash = window.location.hash;
    if (hash.startsWith("#/")) {
      const cleanPath = hash.slice(1); // "#/work" → "/work"
      window.history.replaceState(null, "", cleanPath);
    }

    const { view, slug, category } = parseRoute(window.location.pathname);
    setCurrentView(view);
    setSelectedProjectSlug(slug);
    setSelectedCategory(category);
  }, []);

  // ── Handle browser back/forward buttons ──
  useEffect(() => {
    const handlePopState = () => {
      const { view, slug, category } = parseRoute(window.location.pathname);
      setCurrentView(view);
      setSelectedProjectSlug(slug);
      setSelectedCategory(category);
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  // ── Navigation ──
  const navigateTo = useCallback((view: View, slug?: string) => {
    if (view === "seo" && slug) {
      setSelectedProjectSlug(slug);
      setSelectedCategory(null);
      setCurrentView("seo");
      window.history.pushState(null, "", `/${slug}/`);
    } else if (view === "portfolio" && slug) {
      setSelectedProjectSlug(slug);
      setSelectedCategory(null);
      setCurrentView("portfolio");
      window.history.pushState(null, "", `/portfolio/${slug}/`);
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
    window.scrollTo(0, 0);
  }, []);

  const navigateToHome = useCallback(() => {
    setCurrentView("home");
    setSelectedProjectSlug(null);
    setSelectedCategory(null);
    window.history.pushState(null, "", "/");
    window.scrollTo(0, 0);
  }, []);

  // ── Render current view ──
  const renderContent = () => {
    switch (currentView) {
      case "home":
        return <HomePage onNavigate={navigateTo} />;
      case "work":
        return <WorkPage onNavigate={navigateTo} />;
      case "photography":
        if (selectedCategory === "headshots") {
          return <HeadshotsPage onNavigate={navigateTo} />;
        }
        return <PhotographyPage onNavigate={navigateTo} activeCategory={selectedCategory} />;
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
      case "booking":
        return <BookingPage onNavigate={navigateTo} />;
      case "storytime":
        return <StorytimePage onNavigate={navigateTo} />;
      case "press":
        return <PressPage onNavigate={navigateTo} />;
      case "test":
        if (selectedCategory) {
          return <TestPage variantSlug={selectedCategory} onNavigate={navigateTo} />;
        }
        return <TestIndexPage onNavigate={navigateTo} />;
      case "portfolio":
        if (selectedProjectSlug) {
          return (
            <PortfolioPage
              slug={selectedProjectSlug}
              onBack={() => navigateTo("work")}
              onNavigate={(slug) => navigateTo("portfolio", slug)}
            />
          );
        }
        return <WorkPage onNavigate={navigateTo} />;
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
