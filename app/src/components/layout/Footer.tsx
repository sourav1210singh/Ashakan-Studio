import { Instagram, Linkedin } from "lucide-react";
import { FadeIn } from "@/components/animations/FadeIn";
import { scrollToTopInstant } from "@/lib/scroll";
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

  const handleNavClick = (view: View) => {
    if (onNavigate) {
      onNavigate(view);
      return;
    }
    const path = NAV_PATHS[view];
    if (path) {
      window.history.pushState(null, "", path);
      window.dispatchEvent(new PopStateEvent("popstate"));
      /* Instant jump (not smooth) - Safari cancels a smooth scroll when
         the route re-renders, leaving the new page stuck at the footer
         (Ashkan's 7/1 bug report #2). */
      scrollToTopInstant();
    }
  };

  return (
    <footer id="contact" className="bg-dark text-white py-10 sm:py-12 lg:py-14 border-t border-white/15">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">

        {/* ============================================================ */}
        {/*  Top Row: Contact | Logo | Address                            */}
        {/* ============================================================ */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6 mb-10 sm:mb-12">

          {/* ---- LEFT: Contact Info ---- (text bumped up one step +
               'Talk to our team' is now a button to the contact page,
               per Brandi's new-PDF page 7) */}
          <FadeIn delay={0}>
            <div className="text-center md:text-left">
              <p className="text-sm sm:text-base font-medium tracking-wider text-white/60 mb-4">
                WANT TO WORK WITH US?
              </p>
              <button
                type="button"
                onClick={() => handleNavClick("contact")}
                className="inline-flex items-center gap-2 mb-4 px-5 py-2.5 bg-white text-dark text-sm sm:text-base font-medium tracking-wider hover:bg-white/90 transition-colors"
              >
                Talk to our team
              </button>
              <a
                href="mailto:info@ashkanstudios.com"
                className="block text-lg sm:text-xl font-medium hover:text-warmbeige transition-colors mb-3"
              >
                info@ashkanstudios.com
              </a>
              <a
                href="tel:+13463357973"
                className="block text-lg sm:text-xl font-medium hover:text-warmbeige transition-colors"
              >
                (346) 335-7973
              </a>
            </div>
          </FadeIn>

          {/* ---- CENTER: Logo (enlarged again per Brandi new-PDF page 7) ---- */}
          <FadeIn delay={0.1}>
            <div className="flex flex-col items-center justify-center text-center">
              <button
                onClick={handleLogoClick}
                className="hover:opacity-80 transition-opacity"
              >
                <img
                  src="/images/logo.png"
                  alt="Ashkan Studios"
                  className="h-40 sm:h-52 lg:h-64 xl:h-72 w-auto invert"
                />
              </button>
            </div>
          </FadeIn>

          {/* ---- RIGHT: Address with "FIND US" title ---- */}
          <FadeIn delay={0.2}>
            <div className="text-center md:text-right">
              <p className="text-sm sm:text-base font-medium tracking-wider text-white/60 mb-4">
                FIND US
              </p>
              <a
                href="https://maps.google.com/?q=1502+Sawyer+St+%23108,+Houston,+TX+77007"
                target="_blank"
                rel="noopener noreferrer"
                className="text-base sm:text-lg text-white/80 hover:text-white transition-colors leading-relaxed"
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
            <button onClick={() => handleNavClick("home")} className="text-sm sm:text-base font-medium tracking-wider text-white/50 hover:text-white transition-colors duration-300">HOME</button>
            <button onClick={() => handleNavClick("campaigns")} className="text-sm sm:text-base font-medium tracking-wider text-white/50 hover:text-white transition-colors duration-300">CAMPAIGNS</button>
            <button onClick={() => handleNavClick("services")} className="text-sm sm:text-base font-medium tracking-wider text-white/50 hover:text-white transition-colors duration-300">WHAT WE DO</button>
            <button onClick={() => handleNavClick("studio")} className="text-sm sm:text-base font-medium tracking-wider text-white/50 hover:text-white transition-colors duration-300">THE STUDIO</button>
            <button onClick={() => handleNavClick("contact")} className="text-sm sm:text-base font-medium tracking-wider text-white/50 hover:text-white transition-colors duration-300">CONTACT</button>
            <button onClick={() => handleNavClick("storytime")} className="text-sm sm:text-base font-medium tracking-wider text-white/50 hover:text-white transition-colors duration-300">STORYTIME</button>
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
          {/* TikTok icon removed per Brandi's new-PDF page 7. */}
        </div>

        {/* ============================================================ */}
        {/*  Copyright                                                     */}
        {/* ============================================================ */}
        <div className="pt-6 border-t border-white/10">
          <p className="text-xs sm:text-sm text-white/40 text-center">
            © {new Date().getFullYear()} ASHKAN STUDIOS | ALL RIGHTS RESERVED
          </p>
          {/* Agency credit - same muted color/size as the copyright,
              normal case (no uppercase / no bold), link brightens on
              hover. Placed on its own line below so it stays subtle.
              Wording per Ashkan (Discord 7/1): "Created by Incrementors.
              We walk you through every aspect of the design on this
              website." replaces the previous "Designed by Incrementors". */}
          <p className="text-xs sm:text-sm text-white/40 text-center mt-1.5">
            Created by{" "}
            <a
              href="https://www.incrementors.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white/80 transition-colors"
            >
              Incrementors
            </a>
            . We walk you through every aspect of the design on this website.
          </p>
        </div>
      </div>
    </footer>
  );
}
