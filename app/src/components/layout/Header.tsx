import { useState, useEffect } from "react";
import { X, ChevronDown } from "lucide-react";
import { mainNavigation } from "@/data/navigation";
import type { View } from "@/App";

interface HeaderProps {
  onLogoClick?: () => void;
  onNavigate?: (view: View, slug?: string) => void;
  currentView?: View;
}

/** Pages that use a dark background — header needs white text initially */
const DARK_PAGES: View[] = ["work", "photography", "videography", "campaigns", "portfolio", "booking"];

export function Header({ onLogoClick, onNavigate, currentView }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [activeSubDropdown, setActiveSubDropdown] = useState<string | null>(null);

  const isDarkPage = DARK_PAGES.includes(currentView as View);

  useEffect(() => {
    let lastY = window.scrollY;
    let ticking = false;

    const handleScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        setIsScrolled(y > 100);

        // Hide on scroll-down past threshold; show on scroll-up
        const delta = y - lastY;
        if (y > 40 && delta > 1) {
          setIsHidden(true); // scrolling DOWN → hide
        } else if (delta < -1 || y < 40) {
          setIsHidden(false); // scrolling UP (or near top) → show
        }
        lastY = y;
        ticking = false;
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Always show header when menu is open
  const headerHidden = isHidden && !isMenuOpen;

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
      const cat = href.replace(/^\/work\/photography\/?/, "") || undefined;
      onNavigate("photography", cat);
    } else if (href.startsWith("/work/videography")) {
      const cat = href.replace(/^\/work\/videography\/?/, "") || undefined;
      onNavigate("videography", cat);
    } else if (href.startsWith("/work/campaigns")) {
      const cat = href.replace(/^\/work\/campaigns\/?/, "") || undefined;
      onNavigate("campaigns", cat);
    } else if (href === "/what-we-do") {
      onNavigate("services");
    } else if (href === "/studio") {
      onNavigate("studio");
    } else if (href === "/contact/booking") {
      onNavigate("booking");
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
    if (href === "/what-we-do" && currentView === "services") return true;
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
            ? isDarkPage && !isScrolled && !isMenuOpen ? "text-white" : "text-dark"
            : isDarkPage && !isScrolled && !isMenuOpen ? "text-white/70 hover:text-white" : "text-dark/70 hover:text-dark"
        }`}
      >
        {item.label}
        {item.children && (
          <ChevronDown className={`w-3.5 h-3.5 transition-transform ${activeDropdown === item.label ? "rotate-180" : ""}`} />
        )}
        {isActive(item.href) && (
          <span className={`absolute bottom-0 left-3 right-3 xl:left-4 xl:right-4 h-px ${isDarkPage && !isScrolled && !isMenuOpen ? "bg-white" : "bg-dark"}`} />
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
        className={`fixed top-0 left-0 right-0 z-50 ${
          isMenuOpen
            ? "bg-cream"
            : isScrolled
              ? "bg-cream/95 backdrop-blur-sm shadow-sm"
              : "bg-transparent"
        }`}
        style={{
          opacity: headerHidden ? 0 : 1,
          transform: headerHidden ? "translateY(-100%)" : "translateY(0)",
          transition:
            "transform 0.45s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.35s ease-out, background-color 0.4s ease-out, box-shadow 0.4s ease-out",
          pointerEvents: headerHidden ? "none" : "auto",
          willChange: "transform, opacity",
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
                className="h-16 sm:h-20 md:h-24 lg:h-[120px] xl:h-[140px] w-auto transition-all duration-300"
                style={{
                  filter: isDarkPage && !isScrolled && !isMenuOpen ? "brightness(0) invert(1)" : "none",
                }}
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
                className={`flex items-center gap-2 hover:opacity-70 transition-all ml-4 ${
                  isDarkPage && !isScrolled && !isMenuOpen ? "text-white" : "text-dark"
                }`}
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
                    <div className={`w-5 h-5 ${isDarkPage && !isScrolled && !isMenuOpen ? "bg-white" : "bg-dark"}`} />
                  )}
                </div>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Full Screen Menu — MCJ-style with color sweep + cutout images */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 z-[45] bg-cream"
          style={{ animation: "fadeIn 0.3s ease-out" }}
        >
          <div className="flex flex-col justify-between h-full pt-16 sm:pt-20">
            {/* Nav Items */}
            <nav className="w-full flex-1 flex flex-col justify-end">
              {[
                { label: "THE WORK", href: "/work", delay: 0.05, color: "#2563eb", image: "/images/hero/cameraman-cutout.png" },
                { label: "WHAT WE DO", href: "/what-we-do", delay: 0.1, color: "#16a34a", image: "/images/hero/dance-cutout.png" },
                { label: "THE STUDIO", href: "/studio", delay: 0.15, color: "#eab308", image: "/images/hero/portrait-cutout.png" },
                { label: "STORYTIME", href: "/storytime", delay: 0.2, color: "#ec4899", image: "/images/hero/dance-cutout.png" },
              ].map((item) => (
                <div key={item.label} className="border-b border-dark/10 group relative">
                  {/* Color sweep wrapper — overflow-hidden only on the sweep, not the image */}
                  <div className="absolute inset-0 overflow-hidden">
                    <div
                      className="absolute inset-0 origin-right scale-x-0 group-hover:scale-x-100 group-hover:origin-left transition-transform duration-500 ease-[cubic-bezier(0.77,0,0.175,1)]"
                      style={{ backgroundColor: item.color }}
                    />
                  </div>
                  {/* Cutout image — fades in on hover */}
                  <img
                    src={item.image}
                    alt=""
                    className="absolute right-[25%] top-1/2 -translate-y-1/2 h-[220%] w-auto object-contain opacity-0 group-hover:opacity-100 transition-all duration-500 ease-out group-hover:translate-x-0 translate-x-8 pointer-events-none select-none z-10"
                    style={{ filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.15))" }}
                  />
                  <button
                    onClick={() => handleNavClick(item.href)}
                    className="relative z-20 w-full text-left font-hero-bold text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl text-dark tracking-tight px-6 sm:px-10 lg:px-16 py-4 sm:py-5 lg:py-6 transition-colors duration-300 group-hover:text-white uppercase font-black"
                    style={{ opacity: 0, animation: `fadeInUp 0.4s ease-out ${item.delay}s forwards` }}
                  >
                    {item.label}
                  </button>
                </div>
              ))}
            </nav>

            {/* Bottom Bar — socials & contact with sweep hover */}
            <div
              className="w-full"
              style={{ opacity: 0, animation: "fadeIn 0.4s ease-out 0.3s forwards" }}
            >
              <div className="flex flex-col sm:flex-row border-t border-dark/10">
                {/* Social Links */}
                {[
                  { label: "INSTAGRAM", href: "https://instagram.com/ashkanstudios", color: "#ec4899", external: true },
                  { label: "LINKEDIN", href: "https://linkedin.com/company/ashkan-studios", color: "#2563eb", external: true },
                  { label: "TIKTOK", href: "https://tiktok.com/@ashkanstudios", color: "#16a34a", external: true },
                  { label: "T — +1 (713) 555-1234", href: "tel:+17135551234", color: "#eab308", external: false },
                  { label: "E — hello@ashkanstudios.com", href: "mailto:hello@ashkanstudios.com", color: "#dc2626", external: false },
                ].map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    {...(link.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    className="group/link overflow-hidden flex-1 border-r border-dark/10 last:border-r-0 relative"
                  >
                    {/* Static text — visible by default, hidden on hover */}
                    <span className="block px-6 sm:px-8 py-4 sm:py-5 text-xs sm:text-sm font-medium tracking-wider text-dark/60 transition-opacity duration-300 group-hover/link:opacity-0">
                      {link.label}
                    </span>
                    {/* Continuous marquee — hidden by default, plays on hover */}
                    <span className="absolute inset-0 flex items-center overflow-hidden opacity-0 group-hover/link:opacity-100 transition-opacity duration-300">
                      <span className={`flex whitespace-nowrap ${link.external ? "menu-marquee-fast" : "menu-marquee-track"}`} style={{ color: link.color }}>
                        <span className="px-6 sm:px-8 text-xs sm:text-sm font-medium tracking-wider">{link.label}</span>
                        <span className="px-6 sm:px-8 text-xs sm:text-sm font-medium tracking-wider">{link.label}</span>
                      </span>
                    </span>
                  </a>
                ))}
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
        @keyframes marqueeLoop {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .group\\/link:hover .menu-marquee-track {
          animation: marqueeLoop 1.2s linear infinite;
        }
        .group\\/link:hover .menu-marquee-fast {
          animation: marqueeLoop 0.6s linear infinite;
        }
      `}</style>
    </>
  );
}
