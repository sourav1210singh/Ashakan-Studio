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

  /* ─── Sequential scroll choreography ───────────────────────
     Phase 1 (0% → 10%):  Left text scrolls up
     Phase 2 (10% → 22%): Right text scrolls up
     Phase 3 (22% → 60%): Door opens smoothly (38% scroll range)
     Phase 4 (60% → 90%): Portal zooms toward viewer
     Phase 5 (85% → 98%): Portal fades, hero revealed
     ─────────────────────────────────────────────────────────── */

  // Left text — fades + scrolls up first
  const leftTextY = useTransform(scrollYProgress, [0, 0.10], [0, -350]);
  const leftTextOpacity = useTransform(scrollYProgress, [0, 0.06, 0.10], [1, 0.6, 0]);

  // Right text — fades + scrolls up after left
  const rightTextY = useTransform(scrollYProgress, [0.08, 0.22], [0, -350]);
  const rightTextOpacity = useTransform(scrollYProgress, [0.10, 0.18, 0.22], [1, 0.5, 0]);

  // Door opens smoothly across a wide scroll range (= slow & smooth)
  const doorRotateY = useTransform(scrollYProgress, [0.22, 0.60], [0, -88]);

  // Portal scales toward viewer (after door is fully open)
  const portalScale = useTransform(scrollYProgress, [0.55, 0.92], [1, 14]);

  // Portal fades near the end so hero shows through
  const portalOpacity = useTransform(scrollYProgress, [0.85, 0.98], [1, 0]);

  // Sky + sea fade out as we "pass through"
  const skyOpacity = useTransform(scrollYProgress, [0.75, 1], [1, 0]);

  // Hint fades during phase 1
  const hintOpacity = useTransform(scrollYProgress, [0, 0.08], [1, 0]);

  return (
    <section
      ref={sectionRef}
      className="relative"
      style={{ height: "300vh" }}
      aria-label="Door portal intro"
    >
      {/* Sticky pinned viewport */}
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* ─── Sky gradient (top) → Sea gradient (bottom) ─── */}
        <motion.div
          className="absolute inset-0"
          style={{
            opacity: skyOpacity,
            background:
              "linear-gradient(180deg," +
              "  #6BA8D6 0%," +     /* deep sky top */
              "  #A8CDE6 30%," +    /* mid sky */
              "  #E8F1F5 55%," +    /* horizon haze */
              "  #C8DDE8 60%," +    /* horizon line */
              "  #7FA8C0 75%," +    /* shallow sea */
              "  #4A7A98 95%," +    /* deeper sea */
              "  #2E5575 100%" +
              ")",
          }}
        />

        {/* ─── Real clouds (top half — fluffy SVG shapes) ─── */}
        <motion.svg
          className="absolute inset-x-0 top-0 pointer-events-none w-full"
          style={{ opacity: skyOpacity, height: "55%" }}
          viewBox="0 0 1600 500"
          preserveAspectRatio="xMidYMid slice"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <filter id="cloudBlur">
              <feGaussianBlur stdDeviation="6" />
            </filter>
            <radialGradient id="cloudGrad">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
              <stop offset="60%" stopColor="#FFFFFF" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Distant haze clouds (smaller, softer) */}
          <g filter="url(#cloudBlur)" opacity="0.6">
            <ellipse cx="200" cy="120" rx="140" ry="35" fill="#FFFFFF" />
            <ellipse cx="900" cy="80" rx="180" ry="32" fill="#FFFFFF" />
            <ellipse cx="1400" cy="140" rx="160" ry="38" fill="#FFFFFF" />
          </g>

          {/* Mid clouds (puffy) */}
          <g opacity="0.85">
            {/* Cloud 1 — left */}
            <ellipse cx="180" cy="200" rx="80" ry="32" fill="#FFFFFF" />
            <ellipse cx="240" cy="190" rx="70" ry="40" fill="#FFFFFF" />
            <ellipse cx="300" cy="200" rx="60" ry="30" fill="#FFFFFF" />
            <ellipse cx="220" cy="215" rx="100" ry="22" fill="#FFFFFF" />

            {/* Cloud 2 — center-left */}
            <ellipse cx="600" cy="160" rx="70" ry="28" fill="#FFFFFF" />
            <ellipse cx="660" cy="148" rx="55" ry="35" fill="#FFFFFF" />
            <ellipse cx="720" cy="158" rx="60" ry="26" fill="#FFFFFF" />
            <ellipse cx="640" cy="172" rx="90" ry="18" fill="#FFFFFF" />

            {/* Cloud 3 — center-right */}
            <ellipse cx="1080" cy="220" rx="90" ry="36" fill="#FFFFFF" />
            <ellipse cx="1150" cy="205" rx="75" ry="42" fill="#FFFFFF" />
            <ellipse cx="1220" cy="218" rx="65" ry="32" fill="#FFFFFF" />
            <ellipse cx="1130" cy="235" rx="110" ry="22" fill="#FFFFFF" />

            {/* Cloud 4 — right edge */}
            <ellipse cx="1480" cy="180" rx="60" ry="26" fill="#FFFFFF" />
            <ellipse cx="1540" cy="172" rx="50" ry="32" fill="#FFFFFF" />
            <ellipse cx="1600" cy="180" rx="55" ry="28" fill="#FFFFFF" />
          </g>

          {/* Foreground wisps (lighter, near horizon) */}
          <g opacity="0.5" filter="url(#cloudBlur)">
            <ellipse cx="350" cy="320" rx="180" ry="18" fill="#FFFFFF" />
            <ellipse cx="900" cy="310" rx="220" ry="16" fill="#FFFFFF" />
            <ellipse cx="1350" cy="330" rx="180" ry="20" fill="#FFFFFF" />
          </g>
        </motion.svg>

        {/* ─── Sea / water (bottom — wave ripples) ─── */}
        <motion.svg
          className="absolute inset-x-0 bottom-0 pointer-events-none w-full"
          style={{ opacity: skyOpacity, height: "32%" }}
          viewBox="0 0 1600 300"
          preserveAspectRatio="xMidYMax slice"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="seaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#A8C5D8" stopOpacity="0" />
              <stop offset="20%" stopColor="#8FB0C8" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#3F6B8C" stopOpacity="0.85" />
            </linearGradient>
            <linearGradient id="waveLight" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Sea body */}
          <rect x="0" y="0" width="1600" height="300" fill="url(#seaGrad)" />

          {/* Wave ripples — distant (subtle horizontal lines) */}
          <g opacity="0.4">
            <path
              d="M 0 35 Q 200 30 400 35 T 800 35 T 1200 35 T 1600 35"
              stroke="#FFFFFF"
              strokeWidth="1"
              fill="none"
              opacity="0.5"
            />
            <path
              d="M 0 65 Q 250 60 500 65 T 1000 65 T 1500 65 L 1600 65"
              stroke="#FFFFFF"
              strokeWidth="1"
              fill="none"
              opacity="0.4"
            />
            <path
              d="M 0 95 Q 180 92 360 95 T 720 95 T 1080 95 T 1440 95 L 1600 95"
              stroke="#FFFFFF"
              strokeWidth="1"
              fill="none"
              opacity="0.35"
            />
          </g>

          {/* Mid waves */}
          <g opacity="0.55">
            <path
              d="M 0 140 Q 150 128 300 140 T 600 140 T 900 140 T 1200 140 T 1500 140 L 1600 140"
              stroke="#FFFFFF"
              strokeWidth="1.5"
              fill="none"
            />
            <path
              d="M 0 175 Q 200 162 400 175 T 800 175 T 1200 175 T 1600 175"
              stroke="#FFFFFF"
              strokeWidth="1.5"
              fill="none"
              opacity="0.6"
            />
          </g>

          {/* Closer wave crests with subtle highlight */}
          <g opacity="0.7">
            <path
              d="M 0 215 Q 150 200 320 215 T 640 215 T 980 215 T 1320 215 T 1600 215 L 1600 240 Q 1300 235 980 240 T 640 240 T 320 240 T 0 240 Z"
              fill="url(#waveLight)"
              opacity="0.45"
            />
            <path
              d="M 0 215 Q 150 200 320 215 T 640 215 T 980 215 T 1320 215 T 1600 215"
              stroke="#FFFFFF"
              strokeWidth="2"
              fill="none"
              opacity="0.7"
            />
          </g>

          {/* Foreground swell with reflective sheen */}
          <g opacity="0.85">
            <path
              d="M 0 270 Q 200 250 420 270 T 820 270 T 1180 270 T 1600 270 L 1600 300 L 0 300 Z"
              fill="#3F6B8C"
              opacity="0.4"
            />
            <path
              d="M 0 270 Q 200 250 420 270 T 820 270 T 1180 270 T 1600 270"
              stroke="#FFFFFF"
              strokeWidth="2"
              fill="none"
              opacity="0.55"
            />
          </g>
        </motion.svg>

        {/* Soft horizon haze — blends sky and sea */}
        <motion.div
          className="absolute inset-x-0 pointer-events-none"
          style={{
            opacity: skyOpacity,
            top: "53%",
            height: "8%",
            background:
              "linear-gradient(180deg, transparent 0%, rgba(255,255,255,0.5) 50%, transparent 100%)",
          }}
        />

        {/* ─── Left side text — bold headline (desktop only) ─── */}
        <motion.div
          className="absolute left-0 top-0 h-full pointer-events-none hidden lg:flex items-center"
          style={{ y: leftTextY, opacity: leftTextOpacity, width: "32%" }}
        >
          <div className="px-10 xl:px-16">
            <p className="text-xs xl:text-sm font-medium tracking-[0.3em] text-dark/50 uppercase mb-6">
              Ashkan Studios
            </p>
            <h2
              className="font-display text-dark tracking-tight leading-[0.95]"
              style={{
                fontSize: "clamp(36px, 4vw, 64px)",
                fontWeight: 800,
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
          className="absolute right-0 top-0 h-full pointer-events-none hidden lg:flex items-end pb-32 xl:pb-40"
          style={{ y: rightTextY, opacity: rightTextOpacity, width: "30%" }}
        >
          <div className="px-10 xl:px-16 text-right ml-auto">
            <p className="text-base xl:text-lg text-dark/70 leading-relaxed mb-6">
              A Houston-based production studio crafting commercial photography,
              cinematic videography, and brand campaigns that command attention.
            </p>
            <div className="flex justify-end">
              <span className="inline-flex items-center gap-3 text-xs font-medium tracking-[0.3em] text-dark/60 uppercase">
                <span className="w-8 h-px bg-dark/30" />
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
          <p className="text-[10px] font-medium tracking-[0.3em] text-dark/50 uppercase mb-3">
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
