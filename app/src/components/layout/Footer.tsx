import { Instagram, Linkedin } from "lucide-react";
import { FadeIn } from "@/components/animations/FadeIn";
import type { View } from "@/App";

interface FooterProps {
  onLogoClick?: () => void;
  onNavigate?: (view: View, slug?: string) => void;
}

export function Footer({ onLogoClick, onNavigate }: FooterProps) {
  const handleLogoClick = () => {
    if (onLogoClick) {
      onLogoClick();
    } else if (onNavigate) {
      onNavigate("home");
    }
  };

  /* Direct path map so the footer can navigate even on pages that
     mount it without passing the onNavigate prop (e.g. HomePage
     only passes onLogoClick). Falls back to the prop when present
     so the App's setState path is still preferred. */
  const NAV_PATHS: Record<View, string> = {
    home: "/",
    photography: "/work/photography/",
    videography: "/work/videography/",
    campaigns: "/work/campaigns/",
    services: "/what-we-do/",
    studio: "/studio/",
    contact: "/contact/",
    booking: "/contact/booking/",
    storytime: "/storytime/",
    press: "/press/",
    seo: "/",
    test: "/test/",
  };

  const handleNavClick = (view: View) => {
    if (onNavigate) {
      onNavigate(view);
      return;
    }
    const path = NAV_PATHS[view];
    if (path) {
      window.history.pushState(null, "", path);
      window.dispatchEvent(new PopStateEvent("popstate"));
      window.scrollTo(0, 0);
    }
  };

  return (
    <footer id="contact" className="bg-dark text-white py-10 sm:py-12 lg:py-14">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">

        {/* ============================================================ */}
        {/*  Top Row: Contact | Logo | Address                            */}
        {/* ============================================================ */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6 mb-10 sm:mb-12">

          {/* ---- LEFT: Contact Info ---- */}
          <FadeIn delay={0}>
            <div className="text-center md:text-left">
              <p className="text-xs sm:text-sm font-medium tracking-wider text-white/60 mb-4">
                WANT TO WORK WITH US?
              </p>
              <p className="text-sm sm:text-base text-white/80 mb-3">
                Talk to our team
              </p>
              <a
                href="mailto:info@ashkanstudios.com"
                className="block text-base sm:text-lg font-medium hover:text-warmbeige transition-colors mb-3"
              >
                info@ashkanstudios.com
              </a>
              <a
                href="tel:+13463357973"
                className="block text-base sm:text-lg font-medium hover:text-warmbeige transition-colors"
              >
                (346) 335-7973
              </a>
            </div>
          </FadeIn>

          {/* ---- CENTER: Logo (5x larger, no tagline) ---- */}
          <FadeIn delay={0.1}>
            <div className="flex flex-col items-center justify-center text-center">
              <button
                onClick={handleLogoClick}
                className="hover:opacity-80 transition-opacity"
              >
                <img
                  src="/images/logo.png"
                  alt="Ashkan Studios"
                  className="h-28 sm:h-36 lg:h-44 xl:h-52 w-auto invert"
                />
              </button>
            </div>
          </FadeIn>

          {/* ---- RIGHT: Address with "FIND US" title ---- */}
          <FadeIn delay={0.2}>
            <div className="text-center md:text-right">
              <p className="text-xs sm:text-sm font-medium tracking-wider text-white/60 mb-4">
                FIND US
              </p>
              <a
                href="https://maps.google.com/?q=1502+Sawyer+St+%23108,+Houston,+TX+77007"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm sm:text-base text-white/80 hover:text-white transition-colors leading-relaxed"
              >
                1502 Sawyer St #108
                <br />
                Houston, TX 77007
              </a>
            </div>
          </FadeIn>
        </div>

        {/* ============================================================ */}
        {/*  Navigation - Center aligned, even spacing                    */}
        {/* ============================================================ */}
        <div className="pt-6 border-t border-white/10 mb-6">
          <div className="flex flex-wrap justify-center gap-6 sm:gap-8 lg:gap-10">
            <button onClick={() => handleNavClick("home")} className="text-xs sm:text-sm font-medium tracking-wider text-white/50 hover:text-white transition-colors duration-300">HOME</button>
            <button onClick={() => handleNavClick("campaigns")} className="text-xs sm:text-sm font-medium tracking-wider text-white/50 hover:text-white transition-colors duration-300">CAMPAIGNS</button>
            <button onClick={() => handleNavClick("services")} className="text-xs sm:text-sm font-medium tracking-wider text-white/50 hover:text-white transition-colors duration-300">WHAT WE DO</button>
            <button onClick={() => handleNavClick("studio")} className="text-xs sm:text-sm font-medium tracking-wider text-white/50 hover:text-white transition-colors duration-300">THE STUDIO</button>
            <button onClick={() => handleNavClick("contact")} className="text-xs sm:text-sm font-medium tracking-wider text-white/50 hover:text-white transition-colors duration-300">CONTACT</button>
            <button onClick={() => handleNavClick("storytime")} className="text-xs sm:text-sm font-medium tracking-wider text-white/50 hover:text-white transition-colors duration-300">STORYTIME</button>
          </div>
        </div>

        {/* ============================================================ */}
        {/*  Social Icons - Bottom center, no circles, no label           */}
        {/* ============================================================ */}
        <div className="flex justify-center items-center gap-6 sm:gap-8 mb-6 sm:mb-8">
          <a
            href="https://instagram.com/ashkanstudios"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/50 hover:text-white hover:-translate-y-0.5 transition-all duration-300"
            aria-label="Instagram"
          >
            <Instagram className="w-5 h-5" />
          </a>
          <a
            href="https://linkedin.com/company/ashkan-studios"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/50 hover:text-white hover:-translate-y-0.5 transition-all duration-300"
            aria-label="LinkedIn"
          >
            <Linkedin className="w-5 h-5" />
          </a>
          <a
            href="https://tiktok.com/@ashkanstudios"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/50 hover:text-white hover:-translate-y-0.5 transition-all duration-300"
            aria-label="TikTok"
          >
            <svg
              className="w-5 h-5"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
            </svg>
          </a>
        </div>

        {/* ============================================================ */}
        {/*  Copyright                                                     */}
        {/* ============================================================ */}
        <div className="pt-6 border-t border-white/10">
          <p className="text-xs sm:text-sm text-white/40 text-center">
            © 2025 ASHKAN STUDIOS | ALL RIGHTS RESERVED
          </p>
          {/* Agency credit - same muted color/size as the copyright,
              normal case (no uppercase / no bold), link brightens on
              hover. Placed on its own line below so it stays subtle. */}
          <p className="text-xs sm:text-sm text-white/40 text-center mt-1.5">
            Designed by{" "}
            <a
              href="https://www.incrementors.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white/80 transition-colors"
            >
              Incrementors
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
