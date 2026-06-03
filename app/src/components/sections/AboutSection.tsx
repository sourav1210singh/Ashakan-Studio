import { useRef, useState } from "react";
import { ArrowRight } from "lucide-react";
import { FadeIn } from "@/components/animations/FadeIn";
import { Lightbox } from "@/components/ui/Lightbox";

const ABOUT_IMAGE = {
  src: "/images/sections/studio-2026.jpg",
  alt: "Ashkan Studios - studio interior",
};

export function AboutSection() {
  /* sectionRef + imageY parallax removed 2026-05-12 - the image is
     now rendered at its natural aspect ratio (no overscale / crop)
     so there is no inner element to translate on scroll. */
  const sectionRef = useRef<HTMLDivElement>(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="py-14 sm:py-24 lg:py-28 bg-cream overflow-hidden"
    >
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* ============================================================ */}
          {/*  LEFT - Background heading + paragraph + button              */}
          {/* ============================================================ */}
          <div className="order-2 lg:order-1 relative">

            {/* Main heading - Brandi's new-PDF page 7:
                'Established in 2015 | Based in Houston, Texas'. Split
                across two lines for a readable big display heading. */}
            <FadeIn>
              <h2 className="font-display text-dark tracking-tight leading-[0.95] mb-6 sm:mb-8">
                <span className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl">
                  Established in 2015
                  <br />
                  Based in Houston, Texas
                </span>
              </h2>
            </FadeIn>

            {/* Body copy - Brandi's new-PDF page 7. The client's source
                used em-dashes; converted to clean punctuation per the
                site-wide no-dash rule. */}
            <FadeIn delay={0.15}>
              <p className="text-base sm:text-lg text-dark/70 leading-relaxed mb-5 sm:mb-6 max-w-lg">
                We operate from Houston because it's a city of makers. Here,
                we've invested in the infrastructure to execute at the highest
                level: a full production facility, in-house teams, and the
                depth to realize visions others would call impossible.
              </p>
            </FadeIn>

            <FadeIn delay={0.22}>
              <p className="text-base sm:text-lg text-dark/70 leading-relaxed mb-5 sm:mb-6 max-w-lg">
                This isn't about having equipment. It's about what mastery
                looks like when vision meets craftsmanship. We control every
                element, from lighting and color to motion and storytelling,
                because the difference between good work and exceptional work
                lives in those details. The kind that only emerge when one
                team owns the entire creative process.
              </p>
            </FadeIn>

            <FadeIn delay={0.28}>
              <p className="text-base sm:text-lg text-dark/70 leading-relaxed mb-8 sm:mb-10 max-w-lg">
                We choose projects that challenge us. If your vision demands
                absolute precision and artistic integrity, that's the
                conversation we want to have.
              </p>
            </FadeIn>

            {/* LET'S CREATE Button - Brandi's new-PDF page 7: relabeled
                from 'ABOUT US' and now leads to the contact page. */}
            <FadeIn delay={0.35}>
              <button
                type="button"
                onClick={() => {
                  window.history.pushState(null, "", "/contact/");
                  window.dispatchEvent(new PopStateEvent("popstate"));
                  window.scrollTo(0, 0);
                }}
                className="inline-flex items-center gap-2 sm:gap-3 text-dark group transition-transform duration-200 hover:translate-x-1"
              >
                <span className="text-sm sm:text-base font-medium tracking-wider">
                  LET'S CREATE
                </span>
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-dark flex items-center justify-center group-hover:bg-dark group-hover:text-white transition-colors">
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
              </button>
            </FadeIn>
          </div>

          {/* ============================================================ */}
          {/*  RIGHT - Horizontal landscape image                          */}
          {/* ============================================================ */}
          <div className="order-1 lg:order-2 relative">
            <FadeIn direction="left" delay={0.2}>
              {/* Click the studio photo to open it large in the lightbox.
                  Single-image lightbox (no thumbnails or arrows shown
                  because there's only one image to view here).

                  2026-05-12: removed the fixed aspect-[3/2] container,
                  h-[120%] over-scaling and parallax translateY - they
                  were cropping the bottom of the studio photo. The
                  image now renders at its natural aspect ratio (full
                  height) inside a block-level wrapper. The hover scale
                  + dark overlay are preserved. */}
              <button
                type="button"
                onClick={() => setLightboxOpen(true)}
                aria-label="Enlarge studio photo"
                className="block w-full relative overflow-hidden cursor-zoom-in group"
              >
                <img
                  src={ABOUT_IMAGE.src}
                  alt={ABOUT_IMAGE.alt}
                  className="w-full h-auto block transition-transform duration-1000 group-hover:scale-105"
                />
                <span className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 pointer-events-none" />
              </button>
            </FadeIn>
          </div>
        </div>
      </div>

      {/* Lightbox - single-image */}
      <Lightbox
        images={[ABOUT_IMAGE]}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
      />
    </section>
  );
}
