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
  | "portfolio";

/* ── Route parsing (shared by initial load + popstate) ── */
interface ParsedRoute {
  view: View;
  slug: string | null;
  category: string | null;
}

function parseRoute(rawPathname: string): ParsedRoute {
  // Normalize: strip trailing slash (except root "/")
  const pathname = rawPathname.length > 1 ? rawPathname.replace(/\/+$/, "") : rawPathname;

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
      const catMatch = pathname.match(/^\/work\/photography\/(.+)$/);
      return { view: "photography", slug: null, category: catMatch ? catMatch[1] : null };
    }
    if (pathname.startsWith("/work/videography")) {
      const catMatch = pathname.match(/^\/work\/videography\/(.+)$/);
      return { view: "videography", slug: null, category: catMatch ? catMatch[1] : null };
    }
    if (pathname.startsWith("/work/campaigns")) {
      const catMatch = pathname.match(/^\/work\/campaigns\/(.+)$/);
      return { view: "campaigns", slug: null, category: catMatch ? catMatch[1] : null };
    }
    return { view: "work", slug: null, category: null };
  }

  // Top-level pages
  const pageMap: Record<string, View> = {
    "/services": "services",
    "/studio": "studio",
    "/contact": "contact",
    "/storytime": "storytime",
    "/press": "press",
  };
  if (pageMap[pathname]) {
    return { view: pageMap[pathname], slug: null, category: null };
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
  services: "/services/",
  studio: "/studio/",
  contact: "/contact/",
  storytime: "/storytime/",
  press: "/press/",
  portfolio: "/",
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
    if (view === "portfolio" && slug) {
      setSelectedProjectSlug(slug);
      setSelectedCategory(null);
      setCurrentView("portfolio");
      window.history.pushState(null, "", `/portfolio/${slug}/`);
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
        return <PhotographyPage onNavigate={navigateTo} activeCategory={selectedCategory} />;
      case "videography":
        return <VideographyPage onNavigate={navigateTo} activeCategory={selectedCategory} />;
      case "campaigns":
        return <CampaignsPage onNavigate={navigateTo} activeCategory={selectedCategory} />;
      case "services":
        return <ServicesPage onNavigate={navigateTo} />;
      case "studio":
        return <StudioPage onNavigate={navigateTo} />;
      case "contact":
        return <ContactPage onNavigate={navigateTo} />;
      case "storytime":
        return <StorytimePage onNavigate={navigateTo} />;
      case "press":
        return <PressPage onNavigate={navigateTo} />;
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
