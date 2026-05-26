import { useState } from "react";
import { ArrowRight, ChevronDown } from "lucide-react";
import { FadeIn } from "@/components/animations/FadeIn";
import { Footer } from "@/components/layout/Footer";
import type { View } from "@/App";

interface ServicesPageProps {
  onNavigate: (view: View, slug?: string) => void;
}

/* ── Capabilities accordion data ──────────────────────────────────
   Source: Brandi's 5/7/26 review notes, PDF pages 59-62.
   Order is verbatim from the PDF (Brandi: 'please note the new order
   by the order of paragraphs provided'). Body copy is verbatim. */
const CAPABILITIES = [
  {
    title: "PHOTOGRAPHY",
    body:
      "High-end photography for brands, products, and people across studio and on-location environments. Built to serve campaigns, commerce, and storytelling with precision, consistency, and creative intent.",
  },
  {
    title: "VIDEOGRAPHY",
    body:
      "Cinematic video production for brands and organizations, from narrative storytelling to commercial content. Directed and captured by filmmakers and supported by full production teams to ensure impact and extended deliverable purposes.",
  },
  {
    title: "CREATIVE DIRECTION",
    body:
      "Concept development and visual strategy that connects client vision with creative execution. We shape the look, feel, and storytelling approach across campaigns to ensure consistency from idea through production.",
  },
  {
    title: "CAMPAIGN PRODUCTION",
    body:
      "End-to-end production of photography and video campaigns built from concept to final delivery. We align creative direction with client goals to produce cohesive visual systems executed across a full production team.",
  },
  {
    title: "POST PRODUCTION",
    body:
      "Editing, color, sound, and finishing for photography and video. We refine raw production into final campaign assets optimized for digital, print, and marketing use across platforms.",
  },
];

/* ── Work Applications list ────────────────────────────────────────
   Brandi's 5/7/26 note: 'change to: Work Applications' (renamed from
   SERVICES) + 'UPDATE THIS LIST' with the 15 items below in this
   exact order. Five items new vs old list:
   Aerial Videography, Script Assistance, Voiceover/Interviews,
   Film Editing, Music Videos. Removed: Event Coverage, Motion Graphics. */
const WORK_APPLICATIONS = [
  "Commercial Photography",
  "Product Photography",
  "Corporate Headshots & Portraits",
  "Editorial & Fashion Photography",
  "Lifestyle & Branding Photography",
  "Architectural & Interior Photography",
  "Brand Films & Commercials",
  "Aerial Videography",
  "Documentary & Narrative",
  "Social Media Content",
  "Retouching & Color Grading",
  "Script Assistance",
  "Voiceover/Interviews",
  "Film Editing",
  "Music Videos",
];

export function ServicesPage({ onNavigate }: ServicesPageProps) {
  /* Single-open accordion - clicking an item closes any other open one. */
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <>
      <main className="pt-20">
        {/* ━━━ SECTION 1 - Hero / overview ━━━
            Brandi's 5/7/26 verbatim intro replaces the old marketing copy. */}
        <section className="py-20 sm:py-32 bg-cream">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">
            <FadeIn>
              <h1 className="font-display text-6xl sm:text-8xl md:text-9xl lg:text-[120px] xl:text-[150px] text-dark tracking-tight leading-none mb-8">
                WHAT WE DO
              </h1>
              <div className="max-w-3xl">
                <p className="text-xl sm:text-2xl text-dark/80 leading-relaxed">
                  We create photography and cinematography content for brands and
                  organizations - building full campaigns through creative direction,
                  production, and execution designed to create meaningful impact.
                </p>
              </div>
            </FadeIn>
          </div>
        </section>

        {/* ━━━ SECTION 2 - Capabilities accordion ━━━
            Brandi's 5/7/26 note: 'turn this into an accordion that opens
            when clicked'. Single-open behavior - clicking another item
            auto-closes the previously open one (cleaner premium feel). */}
        {/* Removed the section's top py + the inner div's duplicate
            border-t on 2026-05-12 so the accordion sits flush under
            the hero copy with a single separator line. The empty
            vertical band between two horizontal lines that the user
            flagged is gone; the section now opens directly with the
            first PHOTOGRAPHY accordion row. */}
        <section className="pb-16 sm:pb-24 border-t border-dark/10">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">
            <div>
              {CAPABILITIES.map((item, index) => {
                const isOpen = openIndex === index;
                return (
                  <FadeIn key={item.title} delay={index * 0.08}>
                    <div className="border-b border-dark/10">
                      <button
                        type="button"
                        onClick={() => setOpenIndex(isOpen ? null : index)}
                        aria-expanded={isOpen}
                        aria-controls={`capability-body-${index}`}
                        className="w-full py-6 sm:py-8 flex items-center justify-between gap-4 sm:gap-8 group text-left"
                      >
                        <span className="font-display text-2xl sm:text-3xl lg:text-4xl text-dark tracking-tight">
                          {item.title}
                        </span>
                        {/* '01 / 02 / 03 ...' index badges removed
                            2026-05-12 per user request - only the
                            ChevronDown stays on the right side. */}
                        <ChevronDown
                          className={`w-5 h-5 sm:w-6 sm:h-6 text-dark/40 transition-transform duration-500 ease-out shrink-0 ${
                            isOpen ? "rotate-180 text-dark" : ""
                          }`}
                        />
                      </button>
                      {/* Body - animates via grid-template-rows trick:
                          rows go from 0fr (collapsed) to 1fr (expanded)
                          with overflow-hidden on the inner wrapper. This
                          gives a smooth height transition without needing
                          a measured pixel value. */}
                      <div
                        id={`capability-body-${index}`}
                        className={`grid transition-[grid-template-rows] duration-500 ease-out ${
                          isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                        }`}
                      >
                        <div className="overflow-hidden">
                          <p
                            className={`text-base sm:text-lg text-dark/65 leading-relaxed max-w-3xl pb-6 sm:pb-8 transition-opacity duration-500 ${
                              isOpen ? "opacity-100" : "opacity-0"
                            }`}
                          >
                            {item.body}
                          </p>
                        </div>
                      </div>
                    </div>
                  </FadeIn>
                );
              })}
            </div>
          </div>
        </section>

        {/* ━━━ SECTION 3 - Work Applications ━━━
            Brandi 5/7/26: renamed from 'SERVICES' to 'WORK APPLICATIONS'.
            The previous 'OUR TEAM' column was 'completely removed' per her
            note. The 15 items split into 2 columns (8 + 7) on desktop for
            balanced height, stacked on mobile.

            2026-05-12: trimmed the section's top padding (py-16/sm:py-24
            → pt-12/sm:pt-16) AND dropped its border-t - the empty band
            + double horizontal line above WORK APPLICATIONS is gone
            (the last accordion item's border-b is now the only
            separator). Some breathing room above the heading remains
            so the section still reads as its own block. */}
        <section className="pt-12 sm:pt-16 pb-16 sm:pb-24 bg-cream">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">
            <FadeIn>
              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-dark tracking-tight mb-12 sm:mb-16">
                WORK APPLICATIONS
              </h2>
            </FadeIn>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 lg:gap-x-20 gap-y-0">
              {WORK_APPLICATIONS.map((item, idx) => (
                <FadeIn key={item} delay={Math.min(idx * 0.04, 0.4)}>
                  <div className="border-b border-dark/10 py-4 sm:py-5">
                    <span className="text-base sm:text-lg text-dark/75 leading-relaxed">
                      {item}
                    </span>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        {/* ━━━ SECTION 4 - CTA: See Our Campaigns ━━━ */}
        <section className="py-20 sm:py-32 bg-dark text-white">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 text-center">
            <FadeIn>
              <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl tracking-tight mb-6">
                SEE OUR CAMPAIGNS
              </h2>
              <p className="text-lg text-white/60 mb-10 max-w-xl mx-auto">
                Explore how we bring brands to life through strategic visual storytelling.
              </p>
              <button
                onClick={() => onNavigate("campaigns")}
                className="inline-flex items-center gap-3 px-8 py-4 bg-white text-dark font-medium tracking-wider text-sm group"
              >
                VIEW CAMPAIGNS
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </FadeIn>
          </div>
        </section>

        {/* Removed per Brandi's 5/7/26 review notes:
            • 'OUR TEAM' team-roles column ('Completely remove')
            • 'MEDIA CONTENT PACKAGES' section (user confirmed full removal)
            • 'OUR PROCESS' 5-step row ('Completely remove this process row')
        */}
      </main>
      <Footer onLogoClick={() => onNavigate("home")} />
    </>
  );
}
