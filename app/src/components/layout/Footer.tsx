import { useState } from "react";
import { Instagram, Linkedin, ChevronDown } from "lucide-react";
import { FadeIn } from "@/components/animations/FadeIn";
import { scrollToTopInstant } from "@/lib/scroll";
import { AppLink } from "@/components/AppLink";
import type { View } from "@/App";

interface FooterProps {
  onLogoClick?: () => void;
  onNavigate?: (view: View, slug?: string) => void;
}

/* ── OUR SERVICES mega menu (Mahendra 7/24) ──────────────────────
   All 21 SEO landing pages (8 photography + 13 videography) were
   orphaned - built during development but linked nowhere. The footer
   now exposes every one of them sitewide behind one "OUR SERVICES"
   entry. The panel's links are ALWAYS in the DOM (hidden by a
   collapsed grid row, not display:none/unmount), so the prerendered
   HTML of every page carries all 21 anchors for crawlers. */
const SERVICE_LINKS: { heading: string; pages: { label: string; slug: string }[] }[] = [
  {
    heading: "PHOTOGRAPHY",
    pages: [
      { label: "Product Photography in Houston", slug: "product-photography-in-houston" },
      { label: "Product Photographer in Houston", slug: "product-photographer-in-houston" },
      { label: "Product Photographer Houston", slug: "product-photographer-houston" },
      { label: "Commercial Photography Houston", slug: "commercial-photography-houston" },
      { label: "Houston Commercial Photography", slug: "houston-commercial-photography" },
      { label: "Commercial Photographer Houston", slug: "commercial-photographer-houston" },
      { label: "Business Marketing Photography Houston", slug: "business-marketing-photography-houston" },
      { label: "Headshot Photography Houston", slug: "headshot-photography-houston" },
        { label: "Fashion Photography in Houston", slug: "fashion-photography-in-houston" },
    ],
  },
  {
    heading: "VIDEOGRAPHY",
    pages: [
      { label: "Video Production Services Houston", slug: "video-production-services-houston" },
      { label: "Commercial Videography in Houston", slug: "commercial-videography-in-houston" },
      { label: "Commercial Videographers Houston", slug: "commercial-videographers-houston" },
      { label: "Cinematography Services in Houston", slug: "cinematography-services-in-houston" },
      { label: "Video Editing Services in Houston", slug: "video-editing-services-in-houston" },
      { label: "Videographer Houston", slug: "videographer-houston" },
      { label: "Videographer in Houston", slug: "videographer-in-houston" },
      { label: "Videography Houston", slug: "videography-houston" },
      { label: "Videography in The Woodlands", slug: "videography-in-the-woodlands" },
      { label: "Videography in Texas", slug: "videography-in-texas" },
      { label: "Video for the Arts", slug: "vsl-arts-industry" },
      { label: "Video for Retail", slug: "vsl-retail-industry" },
      { label: "Industrial & Corporate Video", slug: "vsl-li-industry" },
        { label: "Fashion Video Production Houston", slug: "fashion-video-production-services-houston" },
    ],
  },
];

export function Footer({ onLogoClick, onNavigate }: FooterProps) {
  const [servicesOpen, setServicesOpen] = useState(false);
  const [servicesSub, setServicesSub] = useState<string | null>(null);
  const hoverDevice = () =>
    typeof window !== "undefined" && window.matchMedia("(hover: hover)").matches;

  /* SEO pages always navigate via pushState + popstate (the App's
     route parser handles /<slug>/), so this works on every page
     whether or not onNavigate was passed. */
  const handleServiceClick = (slug: string) => {
    window.history.pushState(null, "", `/${slug}/`);
    window.dispatchEvent(new PopStateEvent("popstate"));
    scrollToTopInstant();
  };

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
              <AppLink
                href="/contact/"
                onNav={() => handleNavClick("contact")}
                className="inline-flex items-center gap-2 mb-4 px-5 py-2.5 bg-white text-dark text-sm sm:text-base font-medium tracking-wider hover:bg-white/90 transition-colors"
              >
                Talk to our team
              </AppLink>
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
              <AppLink
                href="/"
                onNav={handleLogoClick}
                aria-label="Ashkan Studios — home"
                className="inline-block hover:opacity-80 transition-opacity"
              >
                <img
                  src="/images/logo.png"
                  alt="Ashkan Studios"
                  className="h-40 sm:h-52 lg:h-64 xl:h-72 w-auto invert"
                />
              </AppLink>
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
          <div className="flex flex-wrap justify-center items-center gap-6 sm:gap-8 lg:gap-10">
            {(["home", "campaigns", "services", "studio", "contact", "storytime"] as View[]).map((v) => (
              <AppLink
                key={v}
                href={NAV_PATHS[v]}
                onNav={() => handleNavClick(v)}
                className="text-sm sm:text-base font-medium tracking-wider text-white/50 hover:text-white transition-colors duration-300"
              >
                {{ home: "HOME", campaigns: "CAMPAIGNS", services: "WHAT WE DO", studio: "THE STUDIO", contact: "CONTACT", storytime: "STORYTIME" }[v as string]}
              </AppLink>
            ))}

            {/* OUR SERVICES - same nested-dropdown UI as the header's
                WORK menu, but opening UPWARD as an overlay so the
                footer's height never changes. Hover opens on desktop
                (matchMedia-gated - a tap's synthetic mouseenter would
                otherwise cancel the click toggle), tap toggles on touch.
                Closed panels use `hidden`, so all 21 anchors stay in the
                DOM and in every page's prerendered HTML. */}
            <div
              className="relative"
              onMouseLeave={() => {
                if (hoverDevice()) {
                  setServicesOpen(false);
                  setServicesSub(null);
                }
              }}
            >
              <button
                type="button"
                onMouseEnter={() => {
                  if (hoverDevice()) setServicesOpen(true);
                }}
                onClick={() => setServicesOpen((o) => !o)}
                aria-expanded={servicesOpen}
                aria-controls="footer-services-menu"
                className={`inline-flex items-center gap-1.5 text-sm sm:text-base font-medium tracking-wider transition-colors duration-300 ${servicesOpen ? "text-white" : "text-white/50 hover:text-white"}`}
              >
                OUR SERVICES
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-300 ${servicesOpen ? "rotate-180" : ""}`}
                />
              </button>

              {/* Level 1: PHOTOGRAPHY / VIDEOGRAPHY (opens upward) */}
              <div
                id="footer-services-menu"
                className={`absolute bottom-full right-0 pb-2 z-50 ${servicesOpen ? "block" : "hidden"}`}
              >
                <div className="bg-cream border border-dark/10 rounded-lg shadow-lg py-2 min-w-[210px] max-h-[70vh] overflow-y-auto md:max-h-none md:overflow-visible">
                  {SERVICE_LINKS.map((col) => (
                    <div
                      key={col.heading}
                      className="relative"
                      onMouseEnter={() => {
                        if (hoverDevice()) setServicesSub(col.heading);
                      }}
                      onMouseLeave={() => {
                        if (hoverDevice()) setServicesSub(null);
                      }}
                    >
                      <button
                        type="button"
                        onClick={() =>
                          setServicesSub((s) => (s === col.heading ? null : col.heading))
                        }
                        aria-expanded={servicesSub === col.heading}
                        className={`w-full text-left px-4 py-2 text-sm font-medium tracking-wider transition-colors flex items-center justify-between gap-6 ${servicesSub === col.heading ? "text-dark bg-dark/5" : "text-dark/70 hover:text-dark hover:bg-dark/5"}`}
                      >
                        {col.heading}
                        <ChevronDown className="w-3 h-3 rotate-90" />
                      </button>

                      {/* Level 2: the pages. md+: side flyout to the LEFT,
                          bottom-aligned so the tall list grows upward.
                          Mobile: stacked inside the panel (accordion). */}
                      <div
                        className={`${servicesSub === col.heading ? "block" : "hidden"} md:absolute md:right-full md:bottom-0 md:pr-2 md:z-50`}
                      >
                        <div className="bg-cream md:border md:border-dark/10 md:rounded-lg md:shadow-lg py-1 md:py-2 md:min-w-[280px] pl-3 md:pl-0 border-l-2 border-dark/10 md:border-l">
                          {col.pages.map((p) => (
                            <AppLink
                              key={p.slug}
                              href={`/${p.slug}/`}
                              onNav={() => handleServiceClick(p.slug)}
                              className="block w-full text-left px-4 py-2 text-sm font-medium tracking-wider text-dark/70 hover:text-dark hover:bg-dark/5 transition-colors whitespace-nowrap"
                            >
                              {p.label}
                            </AppLink>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
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
