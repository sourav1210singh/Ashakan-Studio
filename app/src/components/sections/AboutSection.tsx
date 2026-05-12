import { useEffect, useRef, useState } from "react";
import { ArrowRight, Play } from "lucide-react";
import { FadeIn } from "@/components/animations/FadeIn";
import { Lightbox } from "@/components/ui/Lightbox";

const ABOUT_IMAGE = {
  src: "/images/sections/studio-2026.jpg",
  alt: "Ashkan Studios — studio interior",
};

export function AboutSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [imageY, setImageY] = useState(10);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect();
        const scrollProgress = -rect.top / (rect.height + window.innerHeight);
        setImageY(10 - scrollProgress * 20);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="py-14 sm:py-24 lg:py-28 bg-cream overflow-hidden"
    >
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* ============================================================ */}
          {/*  LEFT — Background heading + paragraph + button              */}
          {/* ============================================================ */}
          <div className="order-2 lg:order-1 relative">

            {/* Main heading */}
            <FadeIn>
              <h2 className="font-display text-dark tracking-tight leading-[0.95] mb-6 sm:mb-8">
                <span className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl">
                  BASED IN
                  <br />
                  HOUSTON, TX
                </span>
                <br />
                <span className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl text-midgray">
                  2 DEPARTMENTS, 1 COMPANY.
                </span>
              </h2>
            </FadeIn>

            {/* Paragraph 1 */}
            <FadeIn delay={0.1}>
              <p className="text-base sm:text-lg text-dark/70 leading-relaxed mb-5 sm:mb-6 max-w-lg">
                Ashkan Studios is the parent company of{" "}
                <span className="font-semibold text-dark">Ashkan Image</span> and{" "}
                <span className="font-semibold text-dark">Ashkan Media</span>.
                We specialize in commercial photography, videography, and
                creative production.
              </p>
            </FadeIn>

            {/* Paragraph 2 */}
            <FadeIn delay={0.2}>
              <p className="text-base sm:text-lg text-dark/70 leading-relaxed mb-5 sm:mb-6 max-w-lg">
                Every project at Ashkan Studios begins with a story — yours.
                We guide it from concept to completion, handling all aspects of
                production in-house with care, precision, and intention.
              </p>
            </FadeIn>

            {/* Paragraph 3 */}
            <FadeIn delay={0.25}>
              <p className="text-base sm:text-lg text-dark/70 leading-relaxed mb-8 sm:mb-10 max-w-lg">
                Crazy concept? Bring it. Big production? No problem.
                Need total artistic guidance? Can't wait.
              </p>
            </FadeIn>

            {/* CTA line */}
            <FadeIn delay={0.3}>
              <p className="text-sm sm:text-base text-dark/70 italic mb-6 sm:mb-8">
                Curious? Meet the studio behind the work.
              </p>
            </FadeIn>

            {/* ABOUT US Button */}
            <FadeIn delay={0.35}>
              <button
                type="button"
                className="inline-flex items-center gap-2 sm:gap-3 text-dark group transition-transform duration-200 hover:translate-x-1"
              >
                <span className="text-sm sm:text-base font-medium tracking-wider">
                  ABOUT US
                </span>
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-dark flex items-center justify-center group-hover:bg-dark group-hover:text-white transition-colors">
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
              </button>
            </FadeIn>
          </div>

          {/* ============================================================ */}
          {/*  RIGHT — Horizontal landscape image                          */}
          {/* ============================================================ */}
          <div className="order-1 lg:order-2 relative">
            <FadeIn direction="left" delay={0.2}>
              {/* Click the studio photo to open it large in the lightbox.
                  Single-image lightbox (no thumbnails or arrows shown
                  because there's only one image to view here).

                  Brandi's 5/7/26 review notes (STUDIO page section,
                  PDF page 65 — flagged 'Changes here should match
                  exactly on changes requested to this section on home
                  page'): she wants a BTS in-studio video here in place
                  of the photo, with a placeholder until the clip is
                  delivered. We keep the studio photo for visual
                  continuity and overlay a 'BTS Film · Coming Soon'
                  badge so it reads as a video placeholder. Once Brandi
                  delivers the BTS clip, this can be swapped to a Vimeo
                  background iframe (FullServiceHybridSection has the
                  pattern). */}
              <button
                type="button"
                onClick={() => setLightboxOpen(true)}
                aria-label="Enlarge studio photo"
                className="block w-full relative aspect-[3/2] overflow-hidden cursor-zoom-in group"
              >
                <div
                  className="absolute inset-0"
                  style={{ transform: `translateY(${imageY}%)` }}
                >
                  <img
                    src={ABOUT_IMAGE.src}
                    alt={ABOUT_IMAGE.alt}
                    className="w-full h-[120%] object-cover transition-transform duration-1000 group-hover:scale-105"
                  />
                </div>
                {/* Dark overlay so the placeholder play UI stays legible */}
                <span className="absolute inset-0 bg-black/35 group-hover:bg-black/25 transition-colors duration-300 pointer-events-none" />
                {/* BTS video placeholder UI */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="flex flex-col items-center gap-3 text-white">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 border-white/45 flex items-center justify-center backdrop-blur-sm bg-white/5 group-hover:bg-white/10 transition-colors">
                      <Play className="w-6 h-6 sm:w-7 sm:h-7 fill-white text-white ml-1" />
                    </div>
                    <span className="text-[0.65rem] sm:text-xs font-semibold tracking-[0.35em] uppercase text-white/75">
                      BTS Film · Coming Soon
                    </span>
                  </div>
                </div>
              </button>
            </FadeIn>
          </div>
        </div>
      </div>

      {/* Lightbox — single-image */}
      <Lightbox
        images={[ABOUT_IMAGE]}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
      />
    </section>
  );
}
