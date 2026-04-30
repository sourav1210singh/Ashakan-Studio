import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

/**
 * Cinematic intro: a camera sits in the center of the viewport.
 * As the user scrolls, the camera rotates and zooms toward the viewer
 * until its lens fills the entire screen — then the hero section
 * is revealed underneath.
 *
 * Implementation notes:
 *  - Section is 250vh tall — gives scroll runway for the dive.
 *  - Inner container is `sticky top-0 h-screen` so the camera stays
 *    pinned center while the page scrolls behind it.
 *  - useScroll tracks progress 0→1 across the section.
 *  - rotate / scale / opacity transforms map progress to motion.
 */
export function LensIntroSection() {
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  // Camera rotates a full turn while scrolling
  const rotate = useTransform(scrollYProgress, [0, 0.7], [0, 360]);

  // Camera scales massive — lens grows large enough to fill screen
  const scale = useTransform(scrollYProgress, [0, 0.85], [1, 28]);

  // Fade out the entire camera near the end so hero shows through
  const cameraOpacity = useTransform(scrollYProgress, [0, 0.75, 0.95], [1, 1, 0]);

  // Hint text fades during the journey
  const hintOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);

  // Background darkens slightly as we "dive in"
  const bgOpacity = useTransform(scrollYProgress, [0, 0.6, 1], [0, 0.4, 0]);

  return (
    <section
      ref={sectionRef}
      className="relative bg-cream"
      style={{ height: "250vh" }}
      aria-label="Camera lens intro"
    >
      {/* Sticky pinned viewport — camera stays centered while user scrolls */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">
        {/* Background overlay that darkens during dive */}
        <motion.div
          className="absolute inset-0 bg-black pointer-events-none"
          style={{ opacity: bgOpacity }}
        />

        {/* Camera SVG — rotates + scales with scroll */}
        <motion.div
          className="relative will-change-transform"
          style={{
            rotate,
            scale,
            transformOrigin: "center center",
          }}
        >
          <motion.div style={{ opacity: cameraOpacity }}>
            <CameraSVG />
          </motion.div>
        </motion.div>

        {/* Scroll hint — fades quickly */}
        <motion.div
          className="absolute bottom-12 left-1/2 -translate-x-1/2 text-center pointer-events-none"
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

/* ─────────────────────────────────────────────────────────────
   Inline camera illustration — drawn entirely in SVG so it
   scales crisply at any zoom factor (no raster blurring).
   The lens is the visual focal point — when scaled 28×, the
   inner glass element grows large enough to envelop the screen.
   ───────────────────────────────────────────────────────────── */
function CameraSVG() {
  return (
    <svg
      width="280"
      height="200"
      viewBox="0 0 280 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="drop-shadow-2xl"
    >
      {/* Top hump (viewfinder) */}
      <rect x="105" y="20" width="70" height="20" rx="3" fill="#1A1A1A" />
      {/* Hot shoe */}
      <rect x="125" y="14" width="30" height="8" rx="1" fill="#0A0A0A" />

      {/* Camera body */}
      <rect x="20" y="40" width="240" height="135" rx="10" fill="#1A1A1A" />

      {/* Body grip texture (right side) */}
      <rect x="220" y="50" width="35" height="115" rx="6" fill="#2A2A2A" />
      {Array.from({ length: 8 }).map((_, i) => (
        <rect
          key={i}
          x="225"
          y={58 + i * 12}
          width="25"
          height="2"
          rx="1"
          fill="#0A0A0A"
        />
      ))}

      {/* Brand text (left top of body) */}
      <text
        x="35"
        y="58"
        fontSize="9"
        fontFamily="sans-serif"
        fontWeight="bold"
        fill="#888"
        letterSpacing="2"
      >
        ASHKAN
      </text>

      {/* Mode dial (top left of body) */}
      <circle cx="55" cy="155" r="12" fill="#0A0A0A" />
      <circle cx="55" cy="155" r="8" fill="#2A2A2A" />

      {/* Shutter button */}
      <circle cx="50" cy="38" r="6" fill="#3A3A3A" />
      <circle cx="50" cy="38" r="3" fill="#1A1A1A" />

      {/* ── Lens assembly ── */}
      {/* Outer lens ring — chrome bezel */}
      <circle cx="135" cy="107" r="62" fill="#2A2A2A" />
      <circle cx="135" cy="107" r="62" fill="none" stroke="#444" strokeWidth="2" />

      {/* Lens focus ring */}
      <circle cx="135" cy="107" r="55" fill="#1A1A1A" />
      <circle cx="135" cy="107" r="55" fill="none" stroke="#3A3A3A" strokeWidth="1" />

      {/* Lens aperture ring with notches */}
      <circle cx="135" cy="107" r="48" fill="#0F0F0F" />
      {Array.from({ length: 24 }).map((_, i) => {
        const angle = (i * 15 * Math.PI) / 180;
        const x1 = 135 + Math.cos(angle) * 46;
        const y1 = 107 + Math.sin(angle) * 46;
        const x2 = 135 + Math.cos(angle) * 50;
        const y2 = 107 + Math.sin(angle) * 50;
        return (
          <line
            key={i}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="#2A2A2A"
            strokeWidth="1"
          />
        );
      })}

      {/* Inner lens glass — the "tunnel" the user dives into */}
      <circle cx="135" cy="107" r="40" fill="#000" />

      {/* Glass reflection — gradient for depth */}
      <defs>
        <radialGradient id="lensGlass" cx="0.35" cy="0.35" r="0.7">
          <stop offset="0%" stopColor="#3A4A5A" stopOpacity="0.9" />
          <stop offset="40%" stopColor="#1A2530" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#000" stopOpacity="1" />
        </radialGradient>
        <radialGradient id="lensInner" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#0A1520" />
          <stop offset="80%" stopColor="#000" />
          <stop offset="100%" stopColor="#000" />
        </radialGradient>
      </defs>
      <circle cx="135" cy="107" r="40" fill="url(#lensGlass)" />
      <circle cx="135" cy="107" r="32" fill="url(#lensInner)" />

      {/* Inner aperture blades hint */}
      <circle cx="135" cy="107" r="24" fill="#000" opacity="0.85" />

      {/* Highlight gleam */}
      <ellipse cx="118" cy="92" rx="10" ry="6" fill="#fff" opacity="0.18" />
      <ellipse cx="115" cy="89" rx="4" ry="2" fill="#fff" opacity="0.4" />

      {/* Small viewfinder LED */}
      <circle cx="240" cy="55" r="2.5" fill="#FF3B3B" />
      <circle cx="240" cy="55" r="2.5" fill="#FF3B3B" opacity="0.4">
        <animate
          attributeName="r"
          values="2.5;5;2.5"
          dur="2s"
          repeatCount="indefinite"
        />
      </circle>
    </svg>
  );
}
