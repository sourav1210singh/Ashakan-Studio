import { useState, useEffect } from "react";
import { X, ChevronDown } from "lucide-react";
import { mainNavigation } from "@/data/navigation";
import type { View } from "@/App";

interface HeaderProps {
  onLogoClick?: () => void;
  onNavigate?: (view: View, slug?: string) => void;
  currentView?: View;
}

/** Pages that use a dark background - header needs white text initially */
const DARK_PAGES: View[] = ["photography", "videography", "campaigns", "headshots"];

export function Header({ onLogoClick, onNavigate, currentView }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [activeSubDropdown, setActiveSubDropdown] = useState<string | null>(null);

  const isDarkPage = DARK_PAGES.includes(currentView as View);

  useEffect(() => {
    /* Always reveal the header when the route changes. Without this,
       if the page was scrolled down (isHidden=true) when the user
       navigated, the hidden state carried over to the new page - on
       Safari this left the menu invisible until a refresh (Ashkan's
       7/1 bug report #1). */
    setIsHidden(false);

    /* Clamp: Safari's rubber-band overscroll reports NEGATIVE scrollY
       at the top of the page, which corrupts the delta math below. */
    let lastY = Math.max(0, window.scrollY);
    let ticking = false;

    const handleScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = Math.max(0, window.scrollY);

        // On home page, keep header transparent for the entire door-portal
        // intro section (~3 viewports tall). Other pages use the small
        // 100px threshold as before.
        const opaqueThreshold =
          currentView === "home" ? window.innerHeight * 2.6 : 100;
        setIsScrolled(y > opaqueThreshold);

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

    // Run once on mount/view-change so threshold is correct after navigation
    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [currentView]);

  /* Safety net for the iOS Safari "header gone at the top of the page"
     report (Ashkan 7/2). The scroll handler only re-evaluates on scroll
     events, so if the hidden state ever gets stuck (same-view navigation
     like logo-click while already on home doesn't change currentView,
     iOS toolbar collapse/expand fires resize not scroll, bfcache
     restores...), nothing un-hides the header. These listeners force it
     visible on every SPA navigation (popstate), page restore (pageshow),
     tab return, and on resize/orientation change while near the top. */
  useEffect(() => {
    const show = () => setIsHidden(false);
    const showIfNearTop = () => {
      if (Math.max(0, window.scrollY) < 120) show();
    };
    const onVisibility = () => {
      if (!document.hidden) showIfNearTop();
    };
    window.addEventListener("popstate", show);
    window.addEventListener("pageshow", show);
    window.addEventListener("resize", showIfNearTop);
    window.addEventListener("orientationchange", show);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      window.removeEventListener("popstate", show);
      window.removeEventListener("pageshow", show);
      window.removeEventListener("resize", showIfNearTop);
      window.removeEventListener("orientationchange", show);
      document.removeEventListener("visibilitychange", onVisibility);
    };
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
      /* Standalone /work/ page was removed 2026-05-08 per Brandi.
         Clicking the WORK label should not navigate anywhere; the
         dropdown shows the sub-routes (photography / videography /
         campaigns) which still work. We close any open dropdown
         below at the end of this function so a tap on mobile still
         feels responsive. */
      return;
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
    if (href === "/work" && ["photography", "videography", "campaigns"].includes(currentView || "")) return true;
    if (href === "/what-we-do" && currentView === "services") return true;
    if (href === "/studio" && currentView === "studio") return true;
    if (href === "/contact" && currentView === "contact") return true;
    if (href === "/storytime" && (currentView === "storytime" || currentView === "press")) return true;
    if (href === "/press" && currentView === "press") return true;
    return false;
  };

  // Brandi review (2026-05-21, PDF page 1): the top bar shows WORK (with
  // its dropdown), moved to the right next to MENU. Home / What We Do /
  // The Studio / Storytime stay only in the full-screen menu.
  // 2026-06-04 (Discord): Brandi asked to RETURN the Contact item to the
  // header, so CONTACT is now shown in the top bar alongside WORK.
  const topBarNav = mainNavigation.filter(
    (item) => item.label === "WORK" || item.label === "CONTACT"
  );

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

      {/* Dropdown Menu - anchored to the RIGHT edge of the trigger so it
          extends leftward (the WORK item sits near the right edge of the
          viewport, so a left-anchored panel used to spill off-screen). */}
      {item.children && activeDropdown === item.label && (
        <div className="absolute top-full right-0 pt-2 z-50">
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
                    <ChevronDown className="w-3 h-3 rotate-90" />
                  )}
                </button>

                {/* Sub-dropdown (flyout LEFT) - opens toward the centre of
                    the screen so it never gets clipped by the right edge. */}
                {child.children && activeSubDropdown === child.label && (
                  <div className="absolute right-full top-0 pr-2 z-50">
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

            {/* Left spacer - the left nav cluster was emptied per the
                2026-05-21 review (only WORK remains, moved to the right).
                Kept as a flex-1 spacer so the centre logo stays centred. */}
            <div className="hidden lg:flex flex-1" />

            {/* Center Logo */}
            <button
              onClick={handleLogoClick}
              className="flex-shrink-0 hover:opacity-80 transition-opacity mx-4 lg:mx-8"
            >
              <img
                src="/images/logo.png"
                alt="Ashkan Studios"
                className="h-20 sm:h-24 md:h-28 lg:h-[160px] xl:h-[190px] w-auto transition-all duration-300"
                style={{
                  filter: isDarkPage && !isScrolled && !isMenuOpen ? "brightness(0) invert(1)" : "none",
                }}
              />
            </button>

            {/* Right Navigation (WORK only) + Menu Button */}
            <div className="flex items-center gap-0 xl:gap-1 flex-1 justify-end">
              <nav className="hidden lg:flex items-center gap-0 xl:gap-1">
                {topBarNav.map(renderNavItem)}
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

      {/* Full Screen Menu - Brandi's 5/7/26 review (PDF pages 82-83):
          • 'No colors, only black bars (love the movement)' - uniform
            dark sweep replaces the per-item rainbow sweep.
          • 'No cutouts here' - the cameraman/dance/portrait cutouts
            that previously slid in on hover have been removed.
          • Menu list updated to 5 items (PHOTO / VIDEO / CAMPAIGNS /
            WHAT WE DO / THE STUDIO) - 'THE WORK' parent dropdown is
            gone; its three sub-routes now sit as top-level items.
          • Bottom bar: TIKTOK label replaced with STORYTIME (linking
            to /storytime/ instead of an external TikTok account).
            'No colors' applied to the marquee text. Phone + email
            updated to the real Ashkan Studios values (matching the
            ContactPage). */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 z-[45] bg-cream overflow-y-auto"
          style={{ animation: "fadeIn 0.3s ease-out" }}
        >
          {/* min-h-full so the flex-col distribution still spreads
              items vertically when content fits, but the overflow-y-auto
              on the outer wrapper lets the menu scroll if the viewport
              is shorter than the content (small laptops at 100 % zoom). */}
          <div className="flex flex-col justify-between min-h-full pt-16 sm:pt-20">
            {/* Nav Items - each row stretches (flex-1) so the five items
                fill the full menu height with no empty gap at the top
                (client 6/11: 'unnecessary white gap, please remove'). */}
            <nav className="w-full flex-1 flex flex-col">
              {[
                { label: "PHOTO", href: "/work/photography", delay: 0.05 },
                { label: "VIDEO", href: "/work/videography", delay: 0.1 },
                { label: "CAMPAIGNS", href: "/work/campaigns", delay: 0.15 },
                { label: "WHAT WE DO", href: "/what-we-do", delay: 0.2 },
                { label: "THE STUDIO", href: "/studio", delay: 0.25 },
              ].map((item) => (
                <div key={item.label} className="border-b border-dark/10 group relative flex-1 flex min-h-0">
                  {/* Uniform black sweep - same animation, no per-item color */}
                  <div className="absolute inset-0 overflow-hidden">
                    <div
                      className="absolute inset-0 origin-right scale-x-0 group-hover:scale-x-100 group-hover:origin-left transition-transform duration-500 ease-[cubic-bezier(0.77,0,0.175,1)] bg-dark"
                    />
                  </div>
                  {/* Font sizes + vertical padding reduced one step
                      2026-05-12 so all five items + bottom bar fit on
                      a standard 100 %-zoom laptop viewport (was cutting
                      off THE STUDIO + footer at ~768 px tall screens). */}
                  <button
                    onClick={() => handleNavClick(item.href)}
                    className="relative z-20 w-full self-stretch flex items-center text-left font-hero-bold text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl text-dark tracking-[0.04em] px-6 sm:px-10 lg:px-16 transition-colors duration-300 group-hover:text-white uppercase font-black"
                    style={{ opacity: 0, animation: `fadeInUp 0.4s ease-out ${item.delay}s forwards` }}
                  >
                    {/* nudge the all-caps text down ~0.05em so the visible
                        letters sit at the true vertical centre of the bar
                        (the font reserves more empty space below the caps
                        than above, so a flex-centred line box reads high). */}
                    <span className="inline-block translate-y-[0.05em] leading-none">
                      {item.label}
                    </span>
                  </button>
                </div>
              ))}
            </nav>

            {/* Bottom Bar - socials & contact with sweep hover.
                Brandi 5/7/26: 'No colors, correct phone and email please'.
                TIKTOK swapped to STORYTIME per her 'CHANGE THIS TO TIKTOK
                - STORYTIME' annotation. */}
            <div
              className="w-full"
              style={{ opacity: 0, animation: "fadeIn 0.4s ease-out 0.3s forwards" }}
            >
              <div className="flex flex-col sm:flex-row border-t border-dark/10">
                {[
                  { label: "INSTAGRAM", href: "https://instagram.com/ashkanstudios", external: true },
                  { label: "LINKEDIN", href: "https://linkedin.com/company/ashkan-studios", external: true },
                  { label: "STORYTIME", href: "/storytime", external: false, internal: true as const },
                  { label: "PRESS", href: "/press", external: false, internal: true as const },
                  { label: "T - (346) 335-7973", href: "tel:3463357973", external: false },
                  { label: "E - info@ashkanstudios.com", href: "mailto:info@ashkanstudios.com", external: false },
                ].map((link) => {
                  const handleClick = link.internal
                    ? (e: React.MouseEvent) => {
                        e.preventDefault();
                        handleNavClick(link.href);
                      }
                    : undefined;
                  return (
                    <a
                      key={link.label}
                      href={link.href}
                      onClick={handleClick}
                      {...(link.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                      className="group/link overflow-hidden flex-1 border-r border-dark/10 last:border-r-0 relative"
                    >
                      {/* Static text - visible by default, hidden on hover */}
                      <span className="block px-6 sm:px-8 py-4 sm:py-5 text-xs sm:text-sm font-medium tracking-wider text-dark/60 transition-opacity duration-300 group-hover/link:opacity-0">
                        {link.label}
                      </span>
                      {/* Continuous marquee - hidden by default, plays on hover.
                          Brandi: 'no colors' - marquee text stays dark, no per-item tint. */}
                      <span className="absolute inset-0 flex items-center overflow-hidden opacity-0 group-hover/link:opacity-100 transition-opacity duration-300">
                        <span className={`flex whitespace-nowrap text-dark ${link.external ? "menu-marquee-fast" : "menu-marquee-track"}`}>
                          <span className="px-6 sm:px-8 text-xs sm:text-sm font-medium tracking-wider">{link.label}</span>
                          <span className="px-6 sm:px-8 text-xs sm:text-sm font-medium tracking-wider">{link.label}</span>
                        </span>
                      </span>
                    </a>
                  );
                })}
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
