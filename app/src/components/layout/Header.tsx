import { useState, useEffect } from "react";
import { X, ChevronDown } from "lucide-react";
import { mainNavigation } from "@/data/navigation";
import type { View } from "@/App";

interface HeaderProps {
  onLogoClick?: () => void;
  onNavigate?: (view: View, slug?: string) => void;
  currentView?: View;
}

export function Header({ onLogoClick, onNavigate, currentView }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [activeSubDropdown, setActiveSubDropdown] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  const handleLogoClick = () => {
    if (onLogoClick) {
      onLogoClick();
    } else if (onNavigate) {
      onNavigate("home");
    }
  };

  const handleNavClick = (href: string) => {
    if (!onNavigate) return;

    if (href === "/") {
      onNavigate("home");
    } else if (href === "/work") {
      onNavigate("work");
    } else if (href.startsWith("/work/photography")) {
      onNavigate("photography", href.replace("/work/photography/", "") || undefined);
    } else if (href.startsWith("/work/videography")) {
      onNavigate("videography", href.replace("/work/videography/", "") || undefined);
    } else if (href.startsWith("/work/campaigns")) {
      onNavigate("campaigns", href.replace("/work/campaigns/", "") || undefined);
    } else if (href === "/services") {
      onNavigate("services");
    } else if (href === "/studio") {
      onNavigate("studio");
    } else if (href === "/contact") {
      onNavigate("contact");
    } else if (href === "/storytime") {
      onNavigate("storytime");
    } else if (href === "/press") {
      onNavigate("press");
    }
    setActiveDropdown(null);
    setActiveSubDropdown(null);
    setIsMenuOpen(false);
  };

  const isActive = (href: string) => {
    if (href === "/" && currentView === "home") return true;
    if (href === "/work" && ["work", "photography", "videography", "campaigns"].includes(currentView || "")) return true;
    if (href === "/services" && currentView === "services") return true;
    if (href === "/studio" && currentView === "studio") return true;
    if (href === "/contact" && currentView === "contact") return true;
    if (href === "/storytime" && (currentView === "storytime" || currentView === "press")) return true;
    if (href === "/press" && currentView === "press") return true;
    return false;
  };

  // Split nav items: first 4 on left, rest on right
  const leftNav = mainNavigation.slice(0, 4);
  const rightNav = mainNavigation.slice(4);

  const renderNavItem = (item: typeof mainNavigation[0]) => (
    <div
      key={item.label}
      className="relative"
      onMouseEnter={() => {
        if (item.children) setActiveDropdown(item.label);
      }}
      onMouseLeave={() => {
        setActiveDropdown(null);
        setActiveSubDropdown(null);
      }}
    >
      <button
        onClick={() => handleNavClick(item.href)}
        className={`relative px-3 xl:px-4 py-2 text-xs xl:text-sm font-medium tracking-wider transition-colors flex items-center gap-1 whitespace-nowrap ${
          isActive(item.href)
            ? "text-dark"
            : "text-dark/70 hover:text-dark"
        }`}
      >
        {item.label}
        {item.children && (
          <ChevronDown className={`w-3.5 h-3.5 transition-transform ${activeDropdown === item.label ? "rotate-180" : ""}`} />
        )}
        {isActive(item.href) && (
          <span className="absolute bottom-0 left-3 right-3 xl:left-4 xl:right-4 h-px bg-dark" />
        )}
      </button>

      {/* Dropdown Menu */}
      {item.children && activeDropdown === item.label && (
        <div className="absolute top-full left-0 pt-2 z-50">
          <div className="bg-cream border border-dark/10 rounded-lg shadow-lg py-2 min-w-[200px]">
            {item.children.map((child) => (
              <div
                key={child.label}
                className="relative"
                onMouseEnter={() => child.children && setActiveSubDropdown(child.label)}
                onMouseLeave={() => setActiveSubDropdown(null)}
              >
                <button
                  onClick={() => handleNavClick(child.href)}
                  className="w-full text-left px-4 py-2 text-sm font-medium tracking-wider text-dark/70 hover:text-dark hover:bg-dark/5 transition-colors flex items-center justify-between"
                >
                  {child.label}
                  {child.children && (
                    <ChevronDown className="w-3 h-3 -rotate-90" />
                  )}
                </button>

                {/* Sub-dropdown (flyout right) */}
                {child.children && activeSubDropdown === child.label && (
                  <div className="absolute left-full top-0 pl-2 z-50">
                    <div className="bg-cream border border-dark/10 rounded-lg shadow-lg py-2 min-w-[180px]">
                      {child.children.map((sub) => (
                        <button
                          key={sub.label}
                          onClick={() => handleNavClick(sub.href)}
                          className="w-full text-left px-4 py-2 text-sm font-medium tracking-wider text-dark/70 hover:text-dark hover:bg-dark/5 transition-colors"
                        >
                          {sub.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-cream/95 backdrop-blur-sm shadow-sm"
            : "bg-transparent"
        }`}
        style={{
          opacity: 1,
          transform: "translateY(0)",
          animation: "fadeInDown 0.6s ease-out 0.2s both",
        }}
      >
        <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-10">
          {/* Single row: LEFT nav | LOGO | RIGHT nav + MENU */}
          <div className="flex items-center justify-between h-20">

            {/* Left Navigation (desktop only) */}
            <nav className="hidden lg:flex items-center gap-0 xl:gap-1 flex-1">
              {leftNav.map(renderNavItem)}
            </nav>

            {/* Center Logo */}
            <button
              onClick={handleLogoClick}
              className="flex-shrink-0 hover:opacity-80 transition-opacity mx-4 lg:mx-8"
            >
              <img
                src="/images/logo.png"
                alt="Ashkan Studios"
                className="h-18 sm:h-22 md:h-[96px] lg:h-[92px] w-auto"
              />
            </button>

            {/* Right Navigation (desktop) + Menu Button */}
            <div className="flex items-center gap-0 xl:gap-1 flex-1 justify-end">
              <nav className="hidden lg:flex items-center gap-0 xl:gap-1">
                {rightNav.map(renderNavItem)}
              </nav>

              {/* Menu Button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="flex items-center gap-2 text-dark hover:opacity-70 transition-opacity ml-4"
                aria-label="Toggle menu"
              >
                <span className="text-sm font-medium tracking-wider hidden sm:inline">
                  MENU
                </span>
                <div
                  className="transition-transform duration-200"
                  style={{ transform: isMenuOpen ? "rotate(90deg)" : "rotate(0)" }}
                >
                  {isMenuOpen ? (
                    <X className="w-5 h-5" />
                  ) : (
                    <div className="w-5 h-5 bg-dark" />
                  )}
                </div>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Full Screen Menu */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 z-[45] bg-cream"
          style={{ animation: "fadeIn 0.3s ease-out" }}
        >
          <div className="flex flex-col justify-between h-full pt-20 sm:pt-24">
            {/* Nav Items */}
            <nav className="max-w-[1200px] w-full mx-auto px-6 sm:px-10 lg:px-16 flex-1 flex flex-col justify-center">
              {/* WORK */}
              <div className="border-b border-dark/15">
                <button
                  onClick={() => handleNavClick("/work")}
                  className="w-full text-left font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-dark hover:opacity-60 transition-opacity tracking-tight py-4 sm:py-5"
                  style={{ opacity: 0, animation: "fadeInUp 0.4s ease-out 0.05s forwards" }}
                >
                  WORK
                </button>
              </div>

              {/* WHAT WE DO */}
              <div className="border-b border-dark/15">
                <button
                  onClick={() => handleNavClick("/services")}
                  className="w-full text-left font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-dark hover:opacity-60 transition-opacity tracking-tight py-4 sm:py-5"
                  style={{ opacity: 0, animation: "fadeInUp 0.4s ease-out 0.1s forwards" }}
                >
                  WHAT WE DO
                </button>
              </div>

              {/* THE STUDIO */}
              <div className="border-b border-dark/15">
                <button
                  onClick={() => handleNavClick("/studio")}
                  className="w-full text-left font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-dark hover:opacity-60 transition-opacity tracking-tight py-4 sm:py-5"
                  style={{ opacity: 0, animation: "fadeInUp 0.4s ease-out 0.15s forwards" }}
                >
                  THE STUDIO
                </button>
              </div>

              {/* STORYTIME & PRESS — same row */}
              <div className="border-b border-dark/15 flex items-center justify-between py-4 sm:py-5">
                <button
                  onClick={() => handleNavClick("/storytime")}
                  className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-dark hover:opacity-60 transition-opacity tracking-tight"
                  style={{ opacity: 0, animation: "fadeInUp 0.4s ease-out 0.2s forwards" }}
                >
                  STORYTIME
                </button>
                <button
                  onClick={() => handleNavClick("/press")}
                  className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-dark/50 hover:text-dark transition-colors tracking-tight"
                  style={{ opacity: 0, animation: "fadeInUp 0.4s ease-out 0.25s forwards" }}
                >
                  PRESS
                </button>
              </div>
            </nav>

            {/* Bottom Bar — socials left, contact right */}
            <div
              className="max-w-[1200px] w-full mx-auto px-6 sm:px-10 lg:px-16 pb-6 sm:pb-8"
              style={{ opacity: 0, animation: "fadeIn 0.4s ease-out 0.3s forwards" }}
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-5 border-t border-dark/15">
                {/* Social Links */}
                <div className="flex items-center gap-6 text-xs sm:text-sm font-medium tracking-wider text-dark/60">
                  <a href="https://instagram.com/ashkanstudios" target="_blank" rel="noopener noreferrer" className="hover:text-dark transition-colors">INSTAGRAM</a>
                  <a href="https://linkedin.com/company/ashkan-studios" target="_blank" rel="noopener noreferrer" className="hover:text-dark transition-colors">LINKEDIN</a>
                  <a href="https://tiktok.com/@ashkanstudios" target="_blank" rel="noopener noreferrer" className="hover:text-dark transition-colors">TIKTOK</a>
                </div>
                {/* Contact */}
                <div className="flex items-center gap-6 text-xs sm:text-sm font-medium tracking-wider text-dark/60">
                  <a href="tel:+17135551234" className="hover:text-dark transition-colors">+1 (713) 555-1234</a>
                  <a href="mailto:hello@ashkanstudios.com" className="hover:text-dark transition-colors">hello@ashkanstudios.com</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
}
