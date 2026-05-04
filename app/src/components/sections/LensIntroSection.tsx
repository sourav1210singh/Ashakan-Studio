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
     glide rather than snap to scroll position. Lower stiffness + higher
     damping = more luxurious, gradual motion (especially on big scale). */
  const scrollYProgress = useSpring(rawProgress, {
    stiffness: 70,
    damping: 32,
    mass: 0.9,
    restDelta: 0.0002,
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

  // Door opens AFTER both texts are gone — POSITIVE rotateY = swings open from LEFT.
  // Cap at 85° so we never cross the 90° perpendicular line where the panel
  // turns its back to the viewer (which would make backface-hidden flicker).
  const doorRotateY = useTransform(scrollYProgress, [0.40, 0.70], [0, 85]);

  // Portal scales toward viewer — wider range + intermediate stops
  // so the zoom ramps gradually instead of accelerating abruptly.
  const portalScale = useTransform(
    scrollYProgress,
    [0.55, 0.70, 0.85, 0.98],
    [1, 2.4, 6, 16]
  );

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
        {/* ═══════════════════════════════════════════════════════════
            FILM STUDIO BACKGROUND with cinematic atmosphere
            • Photo with slow Ken Burns zoom (subtle scene breathing)
            • Cinematic vignette pulse (dark edges that breathe)
            • Warm light flicker (studio-lamp ambient glow)
            • Lens flare streak (top-left, subtle warm bloom)
            • Drifting smoke/dust particles (atmospheric depth)
            • Film grain texture (subtle moving noise)
            ═══════════════════════════════════════════════════════════ */}

        {/* Photo background — slow Ken Burns zoom */}
        <motion.div
          className="absolute inset-0 overflow-hidden"
          style={{ opacity: skyOpacity }}
        >
          <motion.div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: "url('/images/hero/film-studio.webp')",
              transformOrigin: "center center",
            }}
            animate={{ scale: [1.05, 1.12, 1.05] }}
            transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>

        {/* Cinematic vignette — dark edges that pulse softly */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            opacity: skyOpacity,
            background:
              "radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.45) 100%)",
          }}
          animate={{ opacity: [0.85, 1, 0.85] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Top warm-light bloom — simulates studio lamps spilling light */}
        <motion.div
          className="absolute inset-x-0 top-0 pointer-events-none"
          style={{
            opacity: skyOpacity,
            height: "45%",
            background:
              "radial-gradient(ellipse 80% 100% at 50% 0%, rgba(255,200,130,0.18) 0%, transparent 70%)",
            mixBlendMode: "screen",
          }}
          animate={{ opacity: [0.7, 1, 0.85, 1, 0.7] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* LENS FLARE — warm streak from top-left */}
        <motion.div
          className="absolute pointer-events-none"
          style={{
            opacity: skyOpacity,
            top: "5%",
            left: "8%",
            width: "320px",
            height: "320px",
            background:
              "radial-gradient(circle at 30% 30%, rgba(255,220,150,0.45) 0%, rgba(255,180,100,0.15) 25%, transparent 60%)",
            filter: "blur(20px)",
            mixBlendMode: "screen",
          }}
          animate={{ opacity: [0.4, 0.8, 0.4], scale: [0.95, 1.05, 0.95] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        />
        {/* Lens flare ghost — secondary bloom diagonally opposite */}
        <motion.div
          className="absolute pointer-events-none"
          style={{
            opacity: skyOpacity,
            bottom: "15%",
            right: "12%",
            width: "180px",
            height: "180px",
            background:
              "radial-gradient(circle, rgba(255,200,140,0.25) 0%, rgba(255,180,100,0.08) 40%, transparent 70%)",
            filter: "blur(15px)",
            mixBlendMode: "screen",
          }}
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1.2 }}
        />

        {/* DRIFTING SMOKE / DUST PARTICLES — atmospheric depth */}
        <motion.div
          className="absolute inset-0 pointer-events-none overflow-hidden"
          style={{ opacity: skyOpacity, mixBlendMode: "screen" }}
        >
          <motion.div
            className="absolute"
            style={{
              top: "30%",
              width: "260%",
              height: "120px",
              background:
                "radial-gradient(ellipse 14% 80% at 12% 50%, rgba(220,210,200,0.18) 0%, transparent 70%)," +
                "radial-gradient(ellipse 11% 70% at 32% 60%, rgba(220,210,200,0.15) 0%, transparent 70%)," +
                "radial-gradient(ellipse 12% 75% at 55% 45%, rgba(220,210,200,0.20) 0%, transparent 70%)," +
                "radial-gradient(ellipse 10% 65% at 75% 55%, rgba(220,210,200,0.16) 0%, transparent 70%)," +
                "radial-gradient(ellipse 13% 78% at 92% 50%, rgba(220,210,200,0.18) 0%, transparent 70%)",
              filter: "blur(12px)",
            }}
            animate={{ x: ["-60%", "0%"] }}
            transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            className="absolute"
            style={{
              top: "55%",
              width: "260%",
              height: "80px",
              background:
                "radial-gradient(ellipse 16% 100% at 25% 50%, rgba(220,210,200,0.14) 0%, transparent 65%)," +
                "radial-gradient(ellipse 18% 100% at 65% 50%, rgba(220,210,200,0.12) 0%, transparent 65%)",
              filter: "blur(15px)",
            }}
            animate={{ x: ["0%", "-60%"] }}
            transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
          />
        </motion.div>

        {/* FILM GRAIN — subtle SVG noise texture for that cinematic feel */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            opacity: skyOpacity,
            mixBlendMode: "overlay",
          }}
        >
          <motion.div
            className="absolute inset-0"
            style={{
              opacity: 0.18,
              backgroundImage:
                'url("data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 200 200%22><filter id=%22n%22><feTurbulence type=%22fractalNoise%22 baseFrequency=%221.2%22 numOctaves=%222%22/><feColorMatrix values=%220 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.6 0%22/></filter><rect width=%22200%22 height=%22200%22 filter=%22url(%23n)%22/></svg>")',
              backgroundSize: "200px 200px",
            }}
            animate={{ x: [0, -20, 10, -5, 0], y: [0, 15, -10, 5, 0] }}
            transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
          />
        </motion.div>


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
              Step Into{" "}
              <em className="font-light italic">a</em> World{" "}
              <em className="font-light italic" style={{ marginRight: "0.35em" }}>
                of
              </em>
              Visual{" "}
              <em className="font-light italic">Storytelling</em>
            </h2>
          </div>
        </motion.div>

        {/* ─── Right side text — descriptive paragraph (desktop only) ─── */}
        <motion.div
          className="absolute right-0 top-0 h-full pointer-events-none hidden lg:flex items-end pb-20 xl:pb-28"
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

        {/* ─── Door portal (centered + slight downward offset) ─── */}
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{ paddingTop: "4vh" }}
        >
          <motion.div
            className="relative"
            style={{
              scale: portalScale,
              opacity: portalOpacity,
              perspective: "1500px",
              willChange: "transform, opacity",
            }}
          >
            {/* Premium real door — frame, panel, hinges, knob */}
            <div
              className="relative"
              style={{
                width: "238px",
                height: "510px",
                perspective: "1800px",
                transformStyle: "preserve-3d",
              }}
            >
              {/* ── Door frame (architrave / casing — recessed jamb) ── */}
              {/* Outer trim with bevel highlights */}
              <div
                className="absolute -inset-4"
                style={{
                  background:
                    "linear-gradient(135deg, #FAFAFA 0%, #E8E8E8 100%)",
                  boxShadow:
                    "0 30px 60px -15px rgba(20,40,80,0.45)," +
                    "0 12px 24px rgba(0,0,0,0.18)," +
                    "inset 0 1px 0 rgba(255,255,255,0.9)," +
                    "inset 0 -1px 0 rgba(0,0,0,0.08)",
                  borderRadius: "3px",
                }}
              />
              {/* Inner frame trim (deeper) */}
              <div
                className="absolute -inset-1"
                style={{
                  background:
                    "linear-gradient(135deg, #FFFFFF 0%, #F2F2F2 100%)",
                  boxShadow:
                    "inset 0 1px 0 rgba(255,255,255,1)," +
                    "inset 1px 0 0 rgba(255,255,255,0.7)," +
                    "inset -1px 0 0 rgba(0,0,0,0.08)," +
                    "inset 0 -1px 0 rgba(0,0,0,0.10)",
                  borderRadius: "2px",
                }}
              />

              {/* ── Doorway interior (deep shadow + video) ── */}
              <div
                className="absolute inset-0 overflow-hidden bg-black"
                style={{
                  boxShadow:
                    "inset 4px 0 12px rgba(0,0,0,0.55)," +
                    "inset -4px 0 8px rgba(0,0,0,0.35)," +
                    "inset 0 4px 12px rgba(0,0,0,0.45)," +
                    "inset 0 -4px 10px rgba(0,0,0,0.45)",
                }}
              >
                <iframe
                  src="https://player.vimeo.com/video/1022971286?background=1&autoplay=1&loop=1&muted=1&dnt=1&controls=0"
                  className="absolute pointer-events-none"
                  style={{
                    top: "50%",
                    left: "50%",
                    width: "220%",
                    height: "220%",
                    transform: "translate(-50%, -50%)",
                  }}
                  frameBorder="0"
                  allow="autoplay; fullscreen"
                  title="Behind the scenes"
                />
                {/* Vignette so video blends into doorway shadows */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background:
                      "radial-gradient(ellipse at center, transparent 35%, rgba(0,0,0,0.55) 100%)",
                  }}
                />
              </div>

              {/* ── Door panel — opens on RIGHT hinge (left edge swings out) ── */}
              <motion.div
                className="absolute inset-0"
                style={{
                  rotateY: doorRotateY,
                  transformOrigin: "right center",
                  transformStyle: "preserve-3d",
                  backfaceVisibility: "hidden",
                }}
              >
                {/* Door body — painted white wood */}
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(90deg, #F4F4F4 0%, #FAFAFA 8%, #FFFFFF 30%, #FFFFFF 70%, #F8F8F8 92%, #ECECEC 100%)",
                    boxShadow:
                      "inset 0 1px 0 rgba(255,255,255,1)," +
                      "inset 0 -1px 2px rgba(0,0,0,0.08)," +
                      "inset 1px 0 0 rgba(255,255,255,0.7)," +
                      "inset -1px 0 0 rgba(0,0,0,0.06)," +
                      "0 14px 30px rgba(0,0,0,0.22)",
                  }}
                />

                {/* Top stile (horizontal divider at top) */}
                <div
                  className="absolute"
                  style={{
                    top: "16px",
                    left: "16px",
                    right: "16px",
                    height: "calc(38% - 16px)",
                    background:
                      "linear-gradient(135deg, #F2F2F2 0%, #E8E8E8 100%)",
                    boxShadow:
                      "inset 0 2px 4px rgba(0,0,0,0.10)," +
                      "inset 0 -1px 0 rgba(255,255,255,0.85)," +
                      "inset 1px 0 2px rgba(0,0,0,0.06)," +
                      "inset -1px 0 0 rgba(255,255,255,0.6)",
                    borderRadius: "1px",
                  }}
                >
                  {/* Bevel inset 1 */}
                  <div
                    className="absolute"
                    style={{
                      inset: "8px",
                      background:
                        "linear-gradient(135deg, #FAFAFA 0%, #EFEFEF 100%)",
                      boxShadow:
                        "inset 0 1px 1px rgba(255,255,255,0.9)," +
                        "inset 0 -1px 1px rgba(0,0,0,0.08)",
                    }}
                  >
                    {/* Bevel inset 2 (deepest recess) */}
                    <div
                      className="absolute"
                      style={{
                        inset: "6px",
                        background:
                          "linear-gradient(135deg, #FFFFFF 0%, #F4F4F4 100%)",
                        boxShadow:
                          "inset 1px 1px 2px rgba(0,0,0,0.05)," +
                          "inset -1px -1px 1px rgba(255,255,255,0.8)",
                      }}
                    />
                  </div>
                </div>

                {/* Bottom stile */}
                <div
                  className="absolute"
                  style={{
                    bottom: "16px",
                    left: "16px",
                    right: "16px",
                    height: "calc(50% - 16px)",
                    background:
                      "linear-gradient(135deg, #F2F2F2 0%, #E8E8E8 100%)",
                    boxShadow:
                      "inset 0 2px 4px rgba(0,0,0,0.10)," +
                      "inset 0 -1px 0 rgba(255,255,255,0.85)," +
                      "inset 1px 0 2px rgba(0,0,0,0.06)," +
                      "inset -1px 0 0 rgba(255,255,255,0.6)",
                    borderRadius: "1px",
                  }}
                >
                  <div
                    className="absolute"
                    style={{
                      inset: "8px",
                      background:
                        "linear-gradient(135deg, #FAFAFA 0%, #EFEFEF 100%)",
                      boxShadow:
                        "inset 0 1px 1px rgba(255,255,255,0.9)," +
                        "inset 0 -1px 1px rgba(0,0,0,0.08)",
                    }}
                  >
                    <div
                      className="absolute"
                      style={{
                        inset: "6px",
                        background:
                          "linear-gradient(135deg, #FFFFFF 0%, #F4F4F4 100%)",
                        boxShadow:
                          "inset 1px 1px 2px rgba(0,0,0,0.05)," +
                          "inset -1px -1px 1px rgba(255,255,255,0.8)",
                      }}
                    />
                  </div>
                </div>

                {/* Hinge — RIGHT side (where door pivots) */}
                {[0.18, 0.5, 0.82].map((pos, i) => (
                  <div
                    key={`hinge-${i}`}
                    className="absolute"
                    style={{
                      right: "-2px",
                      top: `calc(${pos * 100}% - 14px)`,
                      width: "5px",
                      height: "28px",
                      background:
                        "linear-gradient(90deg, #C2A472 0%, #A8884A 50%, #8A6E36 100%)",
                      borderRadius: "1px",
                      boxShadow:
                        "0 1px 2px rgba(0,0,0,0.4)," +
                        "inset 0 1px 0 rgba(255,255,255,0.4)," +
                        "inset 0 -1px 0 rgba(0,0,0,0.3)",
                    }}
                  >
                    {/* Hinge screws */}
                    <div
                      className="absolute"
                      style={{
                        top: "5px",
                        left: "50%",
                        transform: "translateX(-50%)",
                        width: "1.5px",
                        height: "1.5px",
                        background: "#5A4A28",
                        borderRadius: "50%",
                      }}
                    />
                    <div
                      className="absolute"
                      style={{
                        bottom: "5px",
                        left: "50%",
                        transform: "translateX(-50%)",
                        width: "1.5px",
                        height: "1.5px",
                        background: "#5A4A28",
                        borderRadius: "50%",
                      }}
                    />
                  </div>
                ))}

                {/* Hardware wrapper — true 3D protruding knob with cast
                    shadow on the door surface. Stays glued to the door
                    panel via shared `transform-style: preserve-3d`. */}
                <div
                  className="absolute"
                  style={{
                    left: "8px",
                    top: "calc(50% - 26px)",
                    width: "22px",
                    height: "52px",
                    transformStyle: "preserve-3d",
                    backfaceVisibility: "hidden",
                    WebkitBackfaceVisibility: "hidden",
                  }}
                >
                  {/* Cast shadow on the door (below + right of the knob) —
                      simulates the knob protruding outward catching light */}
                  <div
                    className="absolute pointer-events-none"
                    style={{
                      top: "calc(50% - 6px)",
                      left: "6px",
                      width: "24px",
                      height: "20px",
                      background:
                        "radial-gradient(ellipse 60% 50% at 30% 40%, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.25) 50%, transparent 80%)",
                      filter: "blur(3px)",
                    }}
                  />

                  {/* Knob backplate (escutcheon) — rectangular brass plate */}
                  <div
                    className="absolute inset-x-0"
                    style={{
                      top: "4px",
                      bottom: "4px",
                      left: "4px",
                      right: "4px",
                      background:
                        "linear-gradient(135deg, #E8C988 0%, #C09650 35%, #8A6428 70%, #5C4218 100%)",
                      borderRadius: "3px",
                      boxShadow:
                        "0 2px 4px rgba(0,0,0,0.35)," +
                        "0 1px 1px rgba(0,0,0,0.25)," +
                        "inset 0 1px 1px rgba(255,255,255,0.55)," +
                        "inset 0 -1px 1px rgba(0,0,0,0.4)," +
                        "inset 1px 0 1px rgba(255,255,255,0.3)," +
                        "inset -1px 0 1px rgba(0,0,0,0.3)",
                    }}
                  >
                    {/* Inner bevel highlight */}
                    <div
                      className="absolute inset-1"
                      style={{
                        background:
                          "linear-gradient(135deg, rgba(255,235,180,0.45) 0%, transparent 50%, rgba(0,0,0,0.18) 100%)",
                        borderRadius: "2px",
                      }}
                    />
                    {/* Top screw */}
                    <div
                      className="absolute"
                      style={{
                        top: "3px",
                        left: "50%",
                        marginLeft: "-1.5px",
                        width: "3px",
                        height: "3px",
                        background:
                          "radial-gradient(circle at 35% 35%, #B89060 0%, #6B4818 70%, #2A1A08 100%)",
                        borderRadius: "50%",
                        boxShadow: "inset 0 0 1px rgba(0,0,0,0.5)",
                      }}
                    />
                    {/* Bottom screw */}
                    <div
                      className="absolute"
                      style={{
                        bottom: "3px",
                        left: "50%",
                        marginLeft: "-1.5px",
                        width: "3px",
                        height: "3px",
                        background:
                          "radial-gradient(circle at 35% 35%, #B89060 0%, #6B4818 70%, #2A1A08 100%)",
                        borderRadius: "50%",
                        boxShadow: "inset 0 0 1px rgba(0,0,0,0.5)",
                      }}
                    />
                  </div>

                  {/* Knob neck/stem — short cylinder connecting plate to ball.
                      Gives the protruding-from-door feel. */}
                  <div
                    className="absolute"
                    style={{
                      top: "calc(50% - 5px)",
                      left: "calc(50% - 4px)",
                      width: "8px",
                      height: "10px",
                      background:
                        "linear-gradient(180deg, #B89060 0%, #8A6428 50%, #5C4218 100%)",
                      borderRadius: "2px",
                      boxShadow:
                        "0 2px 3px rgba(0,0,0,0.45)," +
                        "inset 1px 0 1px rgba(255,235,180,0.4)," +
                        "inset -1px 0 1px rgba(0,0,0,0.35)",
                    }}
                  />

                  {/* Brass knob — true 3D sphere look with strong protrusion */}
                  <div
                    className="absolute"
                    style={{
                      top: "calc(50% - 13px)",
                      left: "calc(50% - 13px)",
                      width: "26px",
                      height: "26px",
                      borderRadius: "50%",
                      // 8-stop radial gradient creates pronounced spherical depth
                      background:
                        "radial-gradient(circle at 28% 22%," +
                        "rgba(255,253,235,1) 0%," +
                        "#FFEAB0 6%," +
                        "#F8D88C 14%," +
                        "#F0C470 24%," +
                        "#D49C40 40%," +
                        "#A07028 60%," +
                        "#5A3E14 80%," +
                        "#1F1408 100%)",
                      boxShadow:
                        // Strong cast shadow on the door surface (lower-right)
                        "5px 7px 12px rgba(0,0,0,0.55)," +
                        "3px 4px 6px rgba(0,0,0,0.45)," +
                        // Tight contact shadow
                        "0 2px 2px rgba(0,0,0,0.4)," +
                        // Inner rim — bottom-right shadow + top-left highlight
                        "inset -3px -4px 6px rgba(0,0,0,0.55)," +
                        "inset 3px 3px 5px rgba(255,235,180,0.55)," +
                        // Subtle outer ring (chrome edge)
                        "0 0 0 0.5px rgba(0,0,0,0.3)",
                    }}
                  >
                    {/* Primary specular highlight — bright sphere shine */}
                    <div
                      className="absolute"
                      style={{
                        top: "3px",
                        left: "5px",
                        width: "9px",
                        height: "6px",
                        background:
                          "radial-gradient(ellipse 60% 100% at 50% 50%, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0) 70%)",
                        borderRadius: "50%",
                        transform: "rotate(-30deg)",
                      }}
                    />
                    {/* Pinpoint glint at the brightest spot */}
                    <div
                      className="absolute"
                      style={{
                        top: "4px",
                        left: "6px",
                        width: "2.5px",
                        height: "2.5px",
                        background: "#FFFFFF",
                        borderRadius: "50%",
                        opacity: 1,
                        boxShadow: "0 0 2px rgba(255,255,255,0.8)",
                      }}
                    />
                    {/* Soft secondary highlight (rim light) */}
                    <div
                      className="absolute"
                      style={{
                        bottom: "4px",
                        right: "6px",
                        width: "5px",
                        height: "2.5px",
                        background:
                          "radial-gradient(ellipse, rgba(255,200,120,0.5) 0%, transparent 70%)",
                        borderRadius: "50%",
                      }}
                    />
                  </div>
                </div>

                {/* Subtle vertical paint streak (right side, near hinge — adds realism) */}
                <div
                  className="absolute"
                  style={{
                    top: "0",
                    bottom: "0",
                    right: "0",
                    width: "1px",
                    background:
                      "linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.04) 30%, rgba(0,0,0,0.06) 70%, transparent 100%)",
                  }}
                />
              </motion.div>

              {/* ── Door grounded on studio floor ──
                   Subtle warm shadow under the door so it sits naturally
                   on the wooden floor of the studio scene (no water now). */}

              {/* Soft contact shadow at door base (grounds it on the floor) */}
              <div
                className="absolute pointer-events-none"
                style={{
                  bottom: "-14px",
                  left: "-22px",
                  right: "-22px",
                  height: "22px",
                  background:
                    "radial-gradient(ellipse at center top, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.18) 50%, transparent 80%)",
                  filter: "blur(8px)",
                }}
              />
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
