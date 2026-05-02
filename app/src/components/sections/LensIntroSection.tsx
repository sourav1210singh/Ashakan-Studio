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

  // Door opens AFTER both texts are gone — POSITIVE rotateY = swings open from LEFT
  const doorRotateY = useTransform(scrollYProgress, [0.40, 0.70], [0, 92]);

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
            REAL PHOTO BACKGROUND with subtle premium motion
            (matches travelnextlvl.de — photographic, not cartoonish)
            • Photo as base layer with very slow Ken-Burns zoom
            • Subtle warm gradient overlay
            • Faint ripple highlights ONLY on water area (very subtle)
            ═══════════════════════════════════════════════════════════ */}

        {/* Photo background — slow Ken Burns effect (very subtle zoom + drift) */}
        <motion.div
          className="absolute inset-0 overflow-hidden"
          style={{ opacity: skyOpacity }}
        >
          <motion.div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: "url('/images/hero/sky-ocean.jpg')",
              transformOrigin: "center 40%",
            }}
            animate={{ scale: [1.02, 1.08, 1.02] }}
            transition={{
              duration: 30,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </motion.div>

        {/* Subtle warm tone overlay so the door reads against the image */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            opacity: skyOpacity,
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.04) 0%, transparent 30%, transparent 70%, rgba(20,40,80,0.10) 100%)",
          }}
        />

        {/* DRIFTING CLOUDS — soft white whisps drift faster across the sky
            portion of the photo (mix-blend screen so they enhance, not
            replace, the photographic clouds underneath). */}
        <motion.div
          className="absolute inset-x-0 top-0 pointer-events-none overflow-hidden"
          style={{ opacity: skyOpacity, height: "55%", mixBlendMode: "screen" }}
        >
          <motion.div
            className="absolute"
            style={{
              top: "18%",
              width: "260%",
              height: "100px",
              background:
                "radial-gradient(ellipse 12% 80% at 8%  60%, rgba(255,255,255,0.55) 0%, transparent 70%)," +
                "radial-gradient(ellipse 10% 95% at 22% 50%, rgba(255,255,255,0.65) 0%, transparent 70%)," +
                "radial-gradient(ellipse 14% 85% at 38% 55%, rgba(255,255,255,0.5)  0%, transparent 70%)," +
                "radial-gradient(ellipse 11% 90% at 60% 50%, rgba(255,255,255,0.6)  0%, transparent 70%)," +
                "radial-gradient(ellipse 10% 75% at 80% 60%, rgba(255,255,255,0.5)  0%, transparent 70%)",
              filter: "blur(6px)",
            }}
            animate={{ x: ["-60%", "0%"] }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            className="absolute"
            style={{
              top: "38%",
              width: "260%",
              height: "60px",
              background:
                "radial-gradient(ellipse 18% 100% at 30% 50%, rgba(255,255,255,0.4) 0%, transparent 70%)," +
                "radial-gradient(ellipse 22% 100% at 70% 50%, rgba(255,255,255,0.45) 0%, transparent 70%)",
              filter: "blur(8px)",
            }}
            animate={{ x: ["0%", "-60%"] }}
            transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
          />
        </motion.div>

        {/* WATER RIPPLES — subtle baseline + scroll-intensified layer.
            As user scrolls (door opens), the wave amplitude increases
            and a second more dramatic wave layer fades in. */}
        <motion.svg
          className="absolute inset-x-0 bottom-0 pointer-events-none w-full"
          style={{ opacity: skyOpacity, height: "32%" }}
          viewBox="0 0 1600 400"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Baseline gentle ripples — always visible, photographic */}
          <motion.path
            stroke="#FFFFFF"
            strokeWidth="0.9"
            fill="none"
            opacity="0.22"
            animate={{
              d: [
                "M 0 120 Q 400 116 800 120 T 1600 120",
                "M 0 120 Q 400 124 800 120 T 1600 120",
                "M 0 120 Q 400 116 800 120 T 1600 120",
              ],
            }}
            transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.path
            stroke="#FFFFFF"
            strokeWidth="0.9"
            fill="none"
            opacity="0.2"
            animate={{
              d: [
                "M 0 195 Q 350 190 700 195 T 1400 195 L 1600 195",
                "M 0 195 Q 350 200 700 195 T 1400 195 L 1600 195",
                "M 0 195 Q 350 190 700 195 T 1400 195 L 1600 195",
              ],
            }}
            transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
          />
          <motion.path
            stroke="#FFFFFF"
            strokeWidth="1.1"
            fill="none"
            opacity="0.28"
            animate={{
              d: [
                "M 0 280 Q 300 272 600 280 T 1200 280 T 1600 280",
                "M 0 280 Q 300 288 600 280 T 1200 280 T 1600 280",
                "M 0 280 Q 300 272 600 280 T 1200 280 T 1600 280",
              ],
            }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
          />
        </motion.svg>


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
              <em className="font-light italic">of</em>{" "}Visual{" "}
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
                width: "280px",
                height: "600px",
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

                {/* Knob backplate (escutcheon) */}
                <div
                  className="absolute"
                  style={{
                    left: "14px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    width: "22px",
                    height: "60px",
                    background:
                      "linear-gradient(135deg, #E0BC7E 0%, #B58840 50%, #8A6428 100%)",
                    borderRadius: "3px",
                    boxShadow:
                      "0 1px 3px rgba(0,0,0,0.3)," +
                      "inset 0 1px 1px rgba(255,255,255,0.5)," +
                      "inset 0 -1px 1px rgba(0,0,0,0.3)",
                  }}
                />

                {/* Brass knob (3D ball with shine) */}
                <div
                  className="absolute"
                  style={{
                    left: "12px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    width: "26px",
                    height: "26px",
                    borderRadius: "50%",
                    background:
                      "radial-gradient(circle at 32% 28%," +
                      "#FFEAB8 0%," +
                      "#E8C77A 18%," +
                      "#C49A48 45%," +
                      "#7A5A22 80%," +
                      "#3F2C0E 100%)",
                    boxShadow:
                      "0 3px 6px rgba(0,0,0,0.4)," +
                      "0 1px 2px rgba(0,0,0,0.3)," +
                      "inset 0 1px 1px rgba(255,255,255,0.4)",
                  }}
                >
                  {/* Bright highlight reflection */}
                  <div
                    className="absolute"
                    style={{
                      top: "4px",
                      left: "5px",
                      width: "8px",
                      height: "5px",
                      background:
                        "radial-gradient(ellipse, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0) 70%)",
                      borderRadius: "50%",
                    }}
                  />
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

              {/* ── Subtle water "dip" at the door base ──
                   The bottom ~32px of the door appears partially in water:
                   • A soft blue tint creeps up the bottom edge (water
                     coloring the wood that's submerged)
                   • A very subtle horizontal blur shimmer at the waterline
                   • A small dark splash shadow grounds the door
                   No reflection, no concentric circles — just a natural,
                   barely-there hint that the door is sitting in water. */}

              {/* Soft water tint on the lower portion of the door */}
              <div
                className="absolute pointer-events-none"
                style={{
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: "32px",
                  background:
                    "linear-gradient(180deg, transparent 0%, rgba(60,110,150,0.12) 60%, rgba(60,110,150,0.22) 100%)",
                  zIndex: 4,
                }}
              />

              {/* Soft horizontal shimmer band right at the waterline */}
              <motion.div
                className="absolute pointer-events-none"
                style={{
                  bottom: "20px",
                  left: "-8px",
                  right: "-8px",
                  height: "5px",
                  background:
                    "linear-gradient(180deg, transparent 0%, rgba(255,255,255,0.35) 50%, transparent 100%)",
                  filter: "blur(1.5px)",
                  zIndex: 5,
                }}
                animate={{ opacity: [0.6, 1, 0.6], scaleX: [1, 1.02, 1] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              />

              {/* Subtle dark splash shadow at door base (grounds it in water) */}
              <div
                className="absolute pointer-events-none"
                style={{
                  bottom: "-12px",
                  left: "-18px",
                  right: "-18px",
                  height: "18px",
                  background:
                    "radial-gradient(ellipse at center top, rgba(10,30,55,0.4) 0%, rgba(10,30,55,0.12) 50%, transparent 80%)",
                  filter: "blur(6px)",
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
