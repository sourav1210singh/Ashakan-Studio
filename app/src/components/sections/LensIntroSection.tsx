import { useRef } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";

/**
 * Door portal intro: a white door stands closed in the center of a soft
 * sky-gradient sky. As the user scrolls:
 *   1. The door swings open on its left hinge (rotateY)
 *   2. Through the opening, a behind-the-scenes Vimeo loop plays
 *   3. The whole door + opening zooms toward the viewer (scale up)
 *   4. Door fades; hero section underneath is revealed
 *
 * Background is a CSS gradient (sky → cream) with subtle cloud blobs.
 * Implementation uses sticky pinning over a 300vh runway so animation
 * runs smoothly while user scrolls.
 *
 * NOTE: file is still named LensIntroSection so the existing HomePage
 * import keeps working — we replaced the camera with a door portal.
 */
export function LensIntroSection() {
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress: rawProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  /* Smooth out scroll progress with spring physics so all transforms
     glide rather than snap to scroll position. */
  const scrollYProgress = useSpring(rawProgress, {
    stiffness: 120,
    damping: 28,
    restDelta: 0.0005,
  });

  /* ─── Sequential scroll choreography (gradual + smooth) ────
     Phase 1 (0%  → 22%): Left text drifts up + fades
     Phase 2 (18% → 42%): Right text drifts up + fades
     Phase 3 (40% → 70%): Door opens smoothly
     Phase 4 (65% → 95%): Portal zooms toward viewer
     Phase 5 (88% → 100%): Portal fades, hero revealed
     ─────────────────────────────────────────────────────────── */

  // Left text — gradual upward drift, fully gone by 22%
  const leftTextY = useTransform(scrollYProgress, [0, 0.22], [0, -500]);
  const leftTextOpacity = useTransform(scrollYProgress, [0, 0.10, 0.20], [1, 0.5, 0]);

  // Right text — starts as left finishes; gradual drift up
  const rightTextY = useTransform(scrollYProgress, [0.18, 0.42], [0, -500]);
  const rightTextOpacity = useTransform(scrollYProgress, [0.20, 0.30, 0.40], [1, 0.5, 0]);

  // Door opens AFTER both texts are gone
  const doorRotateY = useTransform(scrollYProgress, [0.40, 0.70], [0, -88]);

  // Portal scales toward viewer (overlaps end of door open)
  const portalScale = useTransform(scrollYProgress, [0.65, 0.95], [1, 14]);

  // Portal fades near the end so hero shows through
  const portalOpacity = useTransform(scrollYProgress, [0.88, 1], [1, 0]);

  // Sky + sea fade out as we "pass through"
  const skyOpacity = useTransform(scrollYProgress, [0.78, 1], [1, 0]);

  // Hint fades during phase 1
  const hintOpacity = useTransform(scrollYProgress, [0, 0.10], [1, 0]);

  return (
    <section
      ref={sectionRef}
      className="relative"
      style={{ height: "300vh" }}
      aria-label="Door portal intro"
    >
      {/* Sticky pinned viewport */}
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* ─── Real photo background: clouds + ocean ─── */}
        <motion.div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            opacity: skyOpacity,
            backgroundImage: "url('/images/hero/sky-ocean.jpg')",
          }}
        />

        {/* Subtle warm tone overlay so the door reads against the image */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            opacity: skyOpacity,
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.05) 0%, transparent 30%, transparent 70%, rgba(20,40,80,0.10) 100%)",
          }}
        />

        {/* ─── Left side text — bold headline (desktop only) ─── */}
        <motion.div
          className="absolute left-0 top-0 h-full pointer-events-none hidden lg:flex items-center"
          style={{ y: leftTextY, opacity: leftTextOpacity, width: "30%" }}
        >
          <div className="px-12 xl:px-16">
            <p className="text-xs xl:text-sm font-semibold tracking-[0.3em] text-dark/70 uppercase mb-8">
              Ashkan Studios
            </p>
            <h2
              className="font-display text-dark tracking-tight"
              style={{
                fontSize: "clamp(36px, 4vw, 60px)",
                fontWeight: 800,
                lineHeight: 1.05,
              }}
            >
              Step Into <em className="font-light italic">a</em> World{" "}
              <em className="font-light italic">of</em> Visual{" "}
              <em className="font-light italic">Storytelling</em>
            </h2>
          </div>
        </motion.div>

        {/* ─── Right side text — descriptive paragraph (desktop only) ─── */}
        <motion.div
          className="absolute right-0 top-0 h-full pointer-events-none hidden lg:flex items-center"
          style={{ y: rightTextY, opacity: rightTextOpacity, width: "30%" }}
        >
          <div className="px-12 xl:px-16 text-right ml-auto">
            <p className="text-xs xl:text-sm font-semibold tracking-[0.3em] text-dark/70 uppercase mb-8">
              About Us
            </p>
            <p
              className="font-display text-dark mb-8"
              style={{
                fontSize: "clamp(16px, 1.15vw, 20px)",
                lineHeight: 1.55,
                fontWeight: 500,
              }}
            >
              A Houston-based production studio crafting commercial photography,
              cinematic videography, and brand campaigns that command attention.
            </p>
            <div className="flex justify-end">
              <span className="inline-flex items-center gap-3 text-xs font-semibold tracking-[0.3em] text-dark/70 uppercase">
                <span className="w-8 h-px bg-dark/40" />
                Enter the Studio
              </span>
            </div>
          </div>
        </motion.div>

        {/* ─── Mobile: small caption above the door ─── */}
        <motion.div
          className="absolute top-24 left-0 right-0 text-center pointer-events-none lg:hidden px-4"
          style={{ y: leftTextY, opacity: leftTextOpacity }}
        >
          <p className="text-[10px] font-semibold tracking-[0.3em] text-dark/70 uppercase mb-3">
            Ashkan Studios
          </p>
          <h2
            className="font-display text-dark tracking-tight leading-[0.95] mx-auto max-w-md"
            style={{
              fontSize: "clamp(24px, 5vw, 40px)",
              fontWeight: 800,
            }}
          >
            Step Into <em className="font-light italic">a</em> World{" "}
            <em className="font-light italic">of</em> Visual{" "}
            <em className="font-light italic">Storytelling</em>
          </h2>
        </motion.div>

        {/* ─── Door portal (left-shifted, scales with scroll) ─── */}
        <div className="absolute inset-0 flex items-center justify-start pl-[34%] lg:pl-[30%] xl:pl-[28%]">
          <motion.div
            className="relative"
            style={{
              scale: portalScale,
              opacity: portalOpacity,
              perspective: "1500px",
              willChange: "transform, opacity",
            }}
          >
            {/* Door dimensions — taller than wide, like a real door */}
            <div
              className="relative"
              style={{
                width: "260px",
                height: "560px",
                perspective: "1500px",
                transformStyle: "preserve-3d",
              }}
            >
              {/* ── Door frame (outer trim + thin shadow line) ── */}
              <div
                className="absolute inset-0 bg-white"
                style={{
                  boxShadow:
                    "0 20px 50px -10px rgba(40,60,90,0.25), 0 6px 16px rgba(0,0,0,0.08)",
                  border: "8px solid #FFFFFF",
                  borderRadius: "2px",
                }}
              />

              {/* ── Through-door scene: Vimeo BTS video loop ── */}
              <div
                className="absolute overflow-hidden bg-black"
                style={{ inset: "8px" }}
              >
                <iframe
                  src="https://player.vimeo.com/video/1022971286?background=1&autoplay=1&loop=1&muted=1&dnt=1&controls=0"
                  className="absolute pointer-events-none"
                  style={{
                    top: "50%",
                    left: "50%",
                    width: "200%",
                    height: "200%",
                    transform: "translate(-50%, -50%)",
                  }}
                  frameBorder="0"
                  allow="autoplay; fullscreen"
                  title="Behind the scenes"
                />
                {/* Subtle vignette so video edges blend into door frame */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background:
                      "radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.35) 100%)",
                  }}
                />
              </div>

              {/* ── Door panel (rotates open on left hinge) ── */}
              <motion.div
                className="absolute"
                style={{
                  inset: "8px",
                  rotateY: doorRotateY,
                  transformOrigin: "left center",
                  transformStyle: "preserve-3d",
                  backfaceVisibility: "hidden",
                  background:
                    "linear-gradient(135deg, #FFFFFF 0%, #F5F5F5 60%, #EAEAEA 100%)",
                  boxShadow:
                    "inset 0 0 0 1px rgba(0,0,0,0.04), 0 12px 30px rgba(0,0,0,0.18)",
                }}
              >
                {/* Recessed top panel */}
                <div
                  className="absolute"
                  style={{
                    top: "16px",
                    left: "16px",
                    right: "16px",
                    height: "calc(48% - 12px)",
                    border: "1.5px solid #D8D8D8",
                    boxShadow:
                      "inset 0 1px 2px rgba(0,0,0,0.05), 0 0 0 1px #FFF inset",
                    borderRadius: "2px",
                    background:
                      "linear-gradient(135deg, #FAFAFA 0%, #F0F0F0 100%)",
                  }}
                >
                  {/* Inner bevel */}
                  <div
                    className="absolute inset-2"
                    style={{
                      border: "1px solid #E5E5E5",
                      borderRadius: "1px",
                    }}
                  />
                </div>

                {/* Recessed bottom panel */}
                <div
                  className="absolute"
                  style={{
                    bottom: "16px",
                    left: "16px",
                    right: "16px",
                    height: "calc(48% - 12px)",
                    border: "1.5px solid #D8D8D8",
                    boxShadow:
                      "inset 0 1px 2px rgba(0,0,0,0.05), 0 0 0 1px #FFF inset",
                    borderRadius: "2px",
                    background:
                      "linear-gradient(135deg, #FAFAFA 0%, #F0F0F0 100%)",
                  }}
                >
                  <div
                    className="absolute inset-2"
                    style={{
                      border: "1px solid #E5E5E5",
                      borderRadius: "1px",
                    }}
                  />
                </div>

                {/* Door knob — brass/amber */}
                <div
                  className="absolute"
                  style={{
                    right: "12px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    width: "10px",
                    height: "10px",
                    borderRadius: "50%",
                    background:
                      "radial-gradient(circle at 35% 35%, #E8B870 0%, #B87E3A 60%, #6B4515 100%)",
                    boxShadow:
                      "0 1px 3px rgba(0,0,0,0.4), inset 0 1px 1px rgba(255,255,255,0.5)",
                  }}
                />
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* ─── Scroll hint ─── */}
        <motion.div
          className="absolute bottom-12 left-1/2 -translate-x-1/2 text-center pointer-events-none z-10"
          style={{ opacity: hintOpacity }}
        >
          <p className="text-xs font-medium tracking-[0.3em] text-dark/60 mb-3">
            SCROLL TO ENTER
          </p>
          <div className="w-px h-12 bg-dark/30 mx-auto animate-pulse" />
        </motion.div>
      </div>
    </section>
  );
}
