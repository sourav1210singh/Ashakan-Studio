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

/* ────────────────────────────────────────────────────────────
   White text-border constants — applied to dark text overlaid
   on the studio image. The vignette + smoke layers darken the
   corners and can swallow dark glyphs. A crisp white outline
   on each letter (not a glow) traces the character edges so
   the text reads cleanly against any background. paintOrder
   "stroke fill" puts the stroke behind the fill so only the
   letter edges get the white border, not the whole shape.
   ──────────────────────────────────────────────────────────── */
const TEXT_BORDER: React.CSSProperties = {
  WebkitTextStroke: "0.6px #FFFFFF",
  paintOrder: "stroke fill" as React.CSSProperties["paintOrder"],
};
const TEXT_BORDER_STRONG: React.CSSProperties = {
  WebkitTextStroke: "1.2px #FFFFFF",
  paintOrder: "stroke fill" as React.CSSProperties["paintOrder"],
};

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
     Phase 3 (25% → 55%): Studio bulb glows progressively brighter (warm)
     Phase 4 (50% → 85%): Flash bursts outward — turns white, fills screen
     Phase 5 (85% → 100%): White-out fades, hero section revealed
     ─────────────────────────────────────────────────────────── */

  // Left text — gradual upward drift, fully gone by 22%
  const leftTextY = useTransform(scrollYProgress, [0, 0.22], [0, -500]);
  const leftTextOpacity = useTransform(scrollYProgress, [0, 0.10, 0.20], [1, 0.5, 0]);

  // Right text — starts as left finishes; gradual drift up
  const rightTextY = useTransform(scrollYProgress, [0.18, 0.42], [0, -500]);
  const rightTextOpacity = useTransform(scrollYProgress, [0.20, 0.30, 0.40], [1, 0.5, 0]);

  // Bulb glow — warm halo charges up from 25% to 55% scroll
  const bulbGlowScale = useTransform(scrollYProgress, [0.25, 0.55], [1, 6]);
  const bulbGlowOpacity = useTransform(
    scrollYProgress,
    [0.25, 0.40, 0.55],
    [0, 0.7, 1]
  );

  // Flash burst — explosive expansion from 50% to 85%
  // 4 stops for a charge → pop → fill curve (camera flash energy)
  const flashScale = useTransform(
    scrollYProgress,
    [0.50, 0.65, 0.78, 0.85],
    [1, 8, 35, 80]
  );
  const flashOpacity = useTransform(
    scrollYProgress,
    [0.50, 0.65, 0.78, 0.85],
    [0, 0.6, 0.95, 1]
  );

  // White-out overlay (entire screen) — peak from 78% to 95%, then fade
  const whiteoutOpacity = useTransform(
    scrollYProgress,
    [0.78, 0.85, 0.95, 1],
    [0, 1, 1, 0]
  );

  // Studio background fades during the white-out (so hero reads through)
  const skyOpacity = useTransform(scrollYProgress, [0.75, 0.92], [1, 0]);

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


        {/* ─── Left side text — bold headline (desktop only) ───
             Soft white halo via text-shadow so dark text stays readable
             over the cinematic vignette / dark-corner gradient. On bright
             areas the white glow blends into the background and disappears;
             on darker areas it traces a clean outline around each glyph. */}
        <motion.div
          className="absolute left-0 top-0 h-full pointer-events-none hidden lg:flex items-center"
          style={{ y: leftTextY, opacity: leftTextOpacity, width: "30%" }}
        >
          <div className="px-12 xl:px-16">
            <p
              className="text-xs xl:text-sm font-semibold tracking-[0.3em] text-dark/70 uppercase mb-8"
              style={TEXT_BORDER}
            >
              Ashkan Studios
            </p>
            <h2
              className="font-display text-dark tracking-tight"
              style={{
                fontSize: "clamp(36px, 4vw, 60px)",
                fontWeight: 800,
                lineHeight: 1.05,
                ...TEXT_BORDER_STRONG,
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
            <p
              className="text-xs xl:text-sm font-semibold tracking-[0.3em] text-dark/70 uppercase mb-8"
              style={TEXT_BORDER}
            >
              About Us
            </p>
            <p
              className="font-display text-dark mb-8"
              style={{
                fontSize: "clamp(16px, 1.15vw, 20px)",
                lineHeight: 1.55,
                fontWeight: 500,
                ...TEXT_BORDER,
              }}
            >
              A Houston-based production studio crafting commercial photography,
              cinematic videography, and brand campaigns that command attention.
            </p>
            <div className="flex justify-end">
              <span
                className="inline-flex items-center gap-3 text-xs font-semibold tracking-[0.3em] text-dark/70 uppercase"
                style={TEXT_BORDER}
              >
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
          <p
            className="text-[10px] font-semibold tracking-[0.3em] text-dark/70 uppercase mb-3"
            style={TEXT_BORDER}
          >
            Ashkan Studios
          </p>
          <h2
            className="font-display text-dark tracking-tight leading-[0.95] mx-auto max-w-md"
            style={{
              fontSize: "clamp(24px, 5vw, 40px)",
              fontWeight: 800,
              ...TEXT_BORDER_STRONG,
            }}
          >
            Step Into <em className="font-light italic">a</em> World{" "}
            <em className="font-light italic">of</em> Visual{" "}
            <em className="font-light italic">Storytelling</em>
          </h2>
        </motion.div>

        {/* ═══════════════════════════════════════════════════════════
            CAMERA FLASH BURST — replaces the door portal.
            Originates from the top-center spotlight in the studio image.
            • Bulb halo glows progressively warmer (25→55% scroll)
            • Flash explodes outward in a hot white burst (50→85%)
            • Full-screen white-out (78→95%)
            • White-out fades, hero section revealed (85→100%)
            ═══════════════════════════════════════════════════════════ */}

        {/* Bulb glow — warm halo around the top-center spotlight */}
        <motion.div
          className="absolute pointer-events-none"
          style={{
            top: "8%",
            left: "50%",
            width: "220px",
            height: "220px",
            marginLeft: "-110px",
            background:
              "radial-gradient(circle," +
              "rgba(255,250,235,0.95) 0%," +
              "rgba(255,235,180,0.55) 25%," +
              "rgba(255,200,120,0.25) 50%," +
              "rgba(255,170,90,0.08) 75%," +
              "transparent 100%)",
            borderRadius: "50%",
            mixBlendMode: "screen",
            filter: "blur(8px)",
            scale: bulbGlowScale,
            opacity: bulbGlowOpacity,
            transformOrigin: "center center",
          }}
        />

        {/* Flash burst — explosive white expansion from the bulb */}
        <motion.div
          className="absolute pointer-events-none"
          style={{
            top: "8%",
            left: "50%",
            width: "180px",
            height: "180px",
            marginLeft: "-90px",
            background:
              "radial-gradient(circle," +
              "#FFFFFF 0%," +
              "rgba(255,255,255,0.95) 18%," +
              "rgba(255,250,230,0.7) 35%," +
              "rgba(255,230,170,0.35) 60%," +
              "rgba(255,200,120,0.1) 85%," +
              "transparent 100%)",
            borderRadius: "50%",
            mixBlendMode: "screen",
            scale: flashScale,
            opacity: flashOpacity,
            transformOrigin: "center center",
          }}
        />

        {/* Spike-rays from the bulb — 8 thin white streaks for that
            classic camera-flash starburst feel */}
        <motion.div
          className="absolute pointer-events-none"
          style={{
            top: "8%",
            left: "50%",
            width: "0",
            height: "0",
            scale: flashScale,
            opacity: flashOpacity,
            mixBlendMode: "screen",
          }}
        >
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={`ray-${i}`}
              className="absolute"
              style={{
                top: "0",
                left: "0",
                width: "1.5px",
                height: "60px",
                marginLeft: "-0.75px",
                background:
                  "linear-gradient(180deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0) 100%)",
                transformOrigin: "center top",
                transform: `rotate(${i * 45}deg)`,
              }}
            />
          ))}
        </motion.div>

        {/* Full-screen white-out — peaks at climax of flash */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "#FFFFFF",
            opacity: whiteoutOpacity,
            zIndex: 20,
          }}
        />

        {/* ─── Scroll hint ─── */}
        <motion.div
          className="absolute bottom-12 left-1/2 -translate-x-1/2 text-center pointer-events-none z-10"
          style={{ opacity: hintOpacity }}
        >
          <p
            className="text-xs font-medium tracking-[0.3em] text-dark/60 mb-3"
            style={TEXT_BORDER}
          >
            SCROLL TO ENTER
          </p>
          <div className="w-px h-12 bg-dark/30 mx-auto animate-pulse" />
        </motion.div>
      </div>
    </section>
  );
}
