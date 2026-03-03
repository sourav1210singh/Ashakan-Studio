import { useState, useEffect } from "react";
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

function App() {
  const [currentView, setCurrentView] = useState<View>("home");
  const [selectedProjectSlug, setSelectedProjectSlug] = useState<string | null>(null);

  // Parse URL hash on initial load
  useEffect(() => {
    const hash = window.location.hash;
    
    // Portfolio pages
    const portfolioMatch = hash.match(/^#\/portfolio\/(.+)$/);
    if (portfolioMatch) {
      const slug = portfolioMatch[1];
      const project = getProjectById(slug);
      if (project) {
        setSelectedProjectSlug(slug);
        setCurrentView("portfolio");
        return;
      }
    }
    
    // Main pages
    if (hash === "#/work" || hash.startsWith("#/work/")) {
      if (hash.includes("/photography")) {
        setCurrentView("photography");
      } else if (hash.includes("/videography")) {
        setCurrentView("videography");
      } else if (hash.includes("/campaigns")) {
        setCurrentView("campaigns");
      } else {
        setCurrentView("work");
      }
    } else if (hash === "#/services") {
      setCurrentView("services");
    } else if (hash === "#/studio") {
      setCurrentView("studio");
    } else if (hash === "#/contact") {
      setCurrentView("contact");
    } else if (hash === "#/storytime") {
      setCurrentView("storytime");
    } else if (hash === "#/press") {
      setCurrentView("press");
    } else {
      setCurrentView("home");
    }
  }, []);

  // Handle browser back/forward buttons
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      
      const portfolioMatch = hash.match(/^#\/portfolio\/(.+)$/);
      if (portfolioMatch) {
        const slug = portfolioMatch[1];
        const project = getProjectById(slug);
        if (project) {
          setSelectedProjectSlug(slug);
          setCurrentView("portfolio");
          return;
        }
      }
      
      if (hash === "#/work" || hash.startsWith("#/work/")) {
        if (hash.includes("/photography")) {
          setCurrentView("photography");
        } else if (hash.includes("/videography")) {
          setCurrentView("videography");
        } else if (hash.includes("/campaigns")) {
          setCurrentView("campaigns");
        } else {
          setCurrentView("work");
        }
      } else if (hash === "#/services") {
        setCurrentView("services");
      } else if (hash === "#/studio") {
        setCurrentView("studio");
      } else if (hash === "#/contact") {
        setCurrentView("contact");
      } else if (hash === "#/storytime") {
        setCurrentView("storytime");
      } else if (hash === "#/press") {
        setCurrentView("press");
      } else {
        setCurrentView("home");
      }
    };

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const navigateTo = (view: View, slug?: string) => {
    if (view === "portfolio" && slug) {
      setSelectedProjectSlug(slug);
      setCurrentView("portfolio");
      window.location.hash = `#/portfolio/${slug}`;
    } else {
      setCurrentView(view);
      const hashMap: Record<View, string> = {
        home: "",
        work: "#/work",
        photography: "#/work/photography",
        videography: "#/work/videography",
        campaigns: "#/work/campaigns",
        services: "#/services",
        studio: "#/studio",
        contact: "#/contact",
        storytime: "#/storytime",
        press: "#/press",
        portfolio: "",
      };
      window.location.hash = hashMap[view];
    }
    window.scrollTo(0, 0);
  };

  const navigateToHome = () => {
    setCurrentView("home");
    setSelectedProjectSlug(null);
    window.location.hash = "";
    window.scrollTo(0, 0);
  };

  // Render current view
  const renderContent = () => {
    switch (currentView) {
      case "home":
        return <HomePage onNavigate={navigateTo} />;
      case "work":
        return <WorkPage onNavigate={navigateTo} />;
      case "photography":
        return <PhotographyPage onNavigate={navigateTo} />;
      case "videography":
        return <VideographyPage onNavigate={navigateTo} />;
      case "campaigns":
        return <CampaignsPage onNavigate={navigateTo} />;
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
