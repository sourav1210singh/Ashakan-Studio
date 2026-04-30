import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

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

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  // Door swings open on left hinge (0% → 35% scroll)
  const doorRotateY = useTransform(scrollYProgress, [0, 0.4], [0, -88]);

  // Door + frame scales toward viewer (15% → 85% scroll)
  const portalScale = useTransform(scrollYProgress, [0.15, 0.85], [1, 14]);

  // Portal fades near the end so hero shows through
  const portalOpacity = useTransform(scrollYProgress, [0.78, 0.95], [1, 0]);

  // Sky background fades out as we "pass through"
  const skyOpacity = useTransform(scrollYProgress, [0.7, 1], [1, 0]);

  // Hint fades quickly
  const hintOpacity = useTransform(scrollYProgress, [0, 0.12], [1, 0]);

  return (
    <section
      ref={sectionRef}
      className="relative"
      style={{ height: "300vh" }}
      aria-label="Door portal intro"
    >
      {/* Sticky pinned viewport */}
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* ─── Sky gradient + cloud blobs ─── */}
        <motion.div
          className="absolute inset-0"
          style={{
            opacity: skyOpacity,
            background:
              "linear-gradient(180deg, #B5D4E8 0%, #DCE9F0 35%, #F0EDE3 75%, #F5F1E8 100%)",
          }}
        />
        {/* Cloud blobs (very soft) */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            opacity: skyOpacity,
            background:
              "radial-gradient(ellipse 60% 40% at 18% 28%, rgba(255,255,255,0.55) 0%, transparent 65%)," +
              "radial-gradient(ellipse 50% 35% at 82% 35%, rgba(255,255,255,0.45) 0%, transparent 60%)," +
              "radial-gradient(ellipse 70% 30% at 50% 90%, rgba(255,255,255,0.35) 0%, transparent 55%)",
          }}
        />

        {/* ─── Door portal (centered, scales with scroll) ─── */}
        <div className="absolute inset-0 flex items-center justify-center">
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
                height: "440px",
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

        {/* ─── Water reflection (subtle, bottom 25% of viewport) ─── */}
        <motion.div
          className="absolute inset-x-0 bottom-0 pointer-events-none"
          style={{
            height: "25%",
            opacity: skyOpacity,
            background:
              "linear-gradient(180deg, transparent 0%, rgba(120,160,200,0.18) 40%, rgba(140,170,200,0.32) 100%)",
            backdropFilter: "blur(2px)",
            WebkitBackdropFilter: "blur(2px)",
          }}
        />

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
