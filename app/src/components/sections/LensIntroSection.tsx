import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

/**
 * Cinematic intro: a 3D-looking camera floats gently in the center of the
 * viewport. Random shutter flashes fire periodically. As the user scrolls,
 * the camera rotates + zooms toward the viewer until its lens fills the
 * entire screen — then the hero section is revealed underneath.
 *
 * Effects:
 *  - Idle: subtle random tilt + drift (camera "breathes")
 *  - Flash: periodic white shutter flash (~every 3–6s)
 *  - Scroll: extra flash triggered on scroll/descroll events
 *  - Dive: rotate + scale on scroll progress, lens grows huge
 */
export function LensIntroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [flashKey, setFlashKey] = useState(0);
  const lastFlashScrollY = useRef(0);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  // Camera rotates + scales as user scrolls
  const rotate = useTransform(scrollYProgress, [0, 0.7], [0, 360]);
  const scale = useTransform(scrollYProgress, [0, 0.85], [1, 28]);
  const cameraOpacity = useTransform(scrollYProgress, [0, 0.75, 0.95], [1, 1, 0]);
  const hintOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
  const bgOpacity = useTransform(scrollYProgress, [0, 0.6, 1], [0, 0.45, 0]);

  /** Periodic flash — fires at random intervals between 2.5–6 seconds */
  useEffect(() => {
    let mounted = true;
    const triggerFlash = () => {
      if (!mounted) return;
      setFlashKey((k) => k + 1);
      const next = 2500 + Math.random() * 3500;
      setTimeout(triggerFlash, next);
    };
    const initial = setTimeout(triggerFlash, 1800);
    return () => {
      mounted = false;
      clearTimeout(initial);
    };
  }, []);

  /** Flash on scroll/descroll — debounced so it fires roughly per 100px scrolled */
  useEffect(() => {
    const handler = () => {
      const y = window.scrollY;
      if (Math.abs(y - lastFlashScrollY.current) > 200) {
        lastFlashScrollY.current = y;
        setFlashKey((k) => k + 1);
      }
    };
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative bg-cream"
      style={{ height: "250vh" }}
      aria-label="Camera lens intro"
    >
      {/* Sticky pinned viewport */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">
        {/* Backdrop that darkens on dive */}
        <motion.div
          className="absolute inset-0 bg-black pointer-events-none"
          style={{ opacity: bgOpacity }}
        />

        {/* White flash overlay — keyed to retrigger animation */}
        <motion.div
          key={flashKey}
          className="absolute inset-0 bg-white pointer-events-none z-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.95, 0] }}
          transition={{ duration: 0.18, ease: "easeOut", times: [0, 0.15, 1] }}
        />

        {/* Camera — outer wrapper handles scroll rotate/scale */}
        <motion.div
          className="relative will-change-transform"
          style={{
            rotate,
            scale,
            transformOrigin: "center center",
          }}
        >
          {/* Inner wrapper handles idle float + opacity fade */}
          <motion.div
            style={{ opacity: cameraOpacity }}
            animate={{
              y: [0, -6, 3, -2, 0],
              x: [0, 2, -3, 1, 0],
              rotate: [0, 0.8, -0.6, 0.4, 0],
            }}
            transition={{
              duration: 7,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <CameraSVG />
          </motion.div>
        </motion.div>

        {/* Scroll hint */}
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

/* ─────────────────────────────────────────────────────────────
   Highly detailed 3D-rendered-looking camera (pure SVG).
   Uses layered radial/linear gradients to fake 3D depth:
     • Curved metallic body with side-lit shading
     • Recessed lens with multi-layer glass reflections
     • Chrome lens bezel with bevel highlights
     • Top hot-shoe with subtle inner shadow
     • LED ring + flash bulb for realism
   ───────────────────────────────────────────────────────────── */
function CameraSVG() {
  return (
    <svg
      width="320"
      height="230"
      viewBox="0 0 320 230"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        filter:
          "drop-shadow(0 20px 30px rgba(0,0,0,0.45)) drop-shadow(0 6px 12px rgba(0,0,0,0.25))",
      }}
    >
      <defs>
        {/* Body gradient — top highlight, bottom shadow */}
        <linearGradient id="bodyGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3A3A3A" />
          <stop offset="35%" stopColor="#1F1F1F" />
          <stop offset="100%" stopColor="#080808" />
        </linearGradient>

        {/* Body side curve (left edge highlight) */}
        <linearGradient id="bodySideGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#4A4A4A" stopOpacity="0.6" />
          <stop offset="20%" stopColor="#000" stopOpacity="0" />
          <stop offset="80%" stopColor="#000" stopOpacity="0" />
          <stop offset="100%" stopColor="#101010" stopOpacity="0.8" />
        </linearGradient>

        {/* Grip texture gradient */}
        <linearGradient id="gripGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2C2C2C" />
          <stop offset="100%" stopColor="#161616" />
        </linearGradient>

        {/* Chrome lens bezel — radial for metallic ring */}
        <radialGradient id="bezelGrad" cx="0.5" cy="0.4" r="0.6">
          <stop offset="0%" stopColor="#9A9A9A" />
          <stop offset="50%" stopColor="#5A5A5A" />
          <stop offset="100%" stopColor="#1A1A1A" />
        </radialGradient>

        {/* Inner lens ring (matte black with subtle bevel) */}
        <radialGradient id="ringGrad" cx="0.5" cy="0.4" r="0.7">
          <stop offset="0%" stopColor="#2A2A2A" />
          <stop offset="60%" stopColor="#0F0F0F" />
          <stop offset="100%" stopColor="#000" />
        </radialGradient>

        {/* Lens glass — deep blue/teal sheen */}
        <radialGradient id="lensGlass" cx="0.32" cy="0.28" r="0.85">
          <stop offset="0%" stopColor="#5A7080" stopOpacity="0.95" />
          <stop offset="25%" stopColor="#243540" stopOpacity="0.85" />
          <stop offset="60%" stopColor="#0A1218" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#000" stopOpacity="1" />
        </radialGradient>

        {/* Inner aperture darkness */}
        <radialGradient id="innerDark" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#000" />
          <stop offset="100%" stopColor="#000" stopOpacity="0.7" />
        </radialGradient>

        {/* Top hump highlight */}
        <linearGradient id="humpGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#444" />
          <stop offset="60%" stopColor="#1C1C1C" />
          <stop offset="100%" stopColor="#0A0A0A" />
        </linearGradient>

        {/* Body inner shadow filter */}
        <filter id="innerShadow">
          <feGaussianBlur in="SourceGraphic" stdDeviation="2" />
        </filter>
      </defs>

      {/* ── Top hump (viewfinder housing) ── */}
      <rect x="115" y="20" width="90" height="28" rx="4" fill="url(#humpGrad)" />
      {/* Top highlight on hump */}
      <rect x="118" y="22" width="84" height="1.5" rx="0.5" fill="#5A5A5A" opacity="0.6" />
      {/* Hot shoe slot */}
      <rect x="138" y="14" width="44" height="10" rx="1" fill="#0A0A0A" />
      <rect x="140" y="16" width="40" height="2" rx="0.5" fill="#2A2A2A" />
      <rect x="146" y="18" width="28" height="3" rx="0.5" fill="#000" />

      {/* ── Camera body ── */}
      <rect x="20" y="48" width="280" height="155" rx="14" fill="url(#bodyGrad)" />
      {/* Body side shading overlay */}
      <rect x="20" y="48" width="280" height="155" rx="14" fill="url(#bodySideGrad)" />
      {/* Top body highlight strip */}
      <rect x="26" y="50" width="268" height="1.5" rx="0.5" fill="#5A5A5A" opacity="0.5" />
      {/* Bottom body inner shadow */}
      <rect x="26" y="200" width="268" height="2" rx="0.5" fill="#000" opacity="0.6" />

      {/* ── Right-side grip with vertical ridges ── */}
      <rect x="248" y="58" width="46" height="135" rx="8" fill="url(#gripGrad)" />
      {/* Grip ridges */}
      {Array.from({ length: 9 }).map((_, i) => (
        <rect
          key={`grip-${i}`}
          x="254"
          y={66 + i * 14}
          width="34"
          height="1.5"
          rx="0.75"
          fill="#000"
          opacity="0.7"
        />
      ))}
      {/* Grip highlight */}
      <rect x="248" y="58" width="2" height="135" rx="1" fill="#5A5A5A" opacity="0.4" />

      {/* ── Brand label (top-left of body) ── */}
      <text
        x="38"
        y="68"
        fontSize="10"
        fontFamily="sans-serif"
        fontWeight="700"
        fill="#888"
        letterSpacing="2.5"
      >
        ASHKAN
      </text>
      <text
        x="38"
        y="80"
        fontSize="6"
        fontFamily="sans-serif"
        fontWeight="500"
        fill="#555"
        letterSpacing="3"
      >
        STUDIOS
      </text>

      {/* ── Mode dial (bottom-left) ── */}
      <circle cx="62" cy="178" r="14" fill="#0A0A0A" />
      <circle cx="62" cy="178" r="14" fill="none" stroke="#3A3A3A" strokeWidth="1" />
      <circle cx="62" cy="178" r="9" fill="url(#ringGrad)" />
      {/* Dial notches */}
      {Array.from({ length: 8 }).map((_, i) => {
        const a = (i * 45 * Math.PI) / 180;
        return (
          <line
            key={`dial-${i}`}
            x1={62 + Math.cos(a) * 7}
            y1={178 + Math.sin(a) * 7}
            x2={62 + Math.cos(a) * 9}
            y2={178 + Math.sin(a) * 9}
            stroke="#666"
            strokeWidth="0.8"
          />
        );
      })}

      {/* ── Shutter button (top-left of body) ── */}
      <ellipse cx="55" cy="46" rx="9" ry="5" fill="#1A1A1A" />
      <ellipse cx="55" cy="46" rx="9" ry="5" fill="none" stroke="#3A3A3A" strokeWidth="0.8" />
      <ellipse cx="55" cy="44" rx="6" ry="3" fill="#404040" />
      <ellipse cx="55" cy="43" rx="4" ry="1.5" fill="#666" opacity="0.6" />

      {/* ── Flash bulb (top-right of body) ── */}
      <rect x="220" y="56" width="22" height="10" rx="2" fill="#0F0F0F" />
      <rect x="222" y="58" width="18" height="6" rx="1" fill="#F5F5DC" opacity="0.9" />
      <rect x="223" y="59" width="16" height="2" rx="0.5" fill="#FFFFEE" opacity="0.7" />

      {/* ── Lens assembly ── */}
      {/* Outer chrome bezel */}
      <circle cx="155" cy="125" r="72" fill="url(#bezelGrad)" />
      {/* Bezel inner edge */}
      <circle cx="155" cy="125" r="68" fill="#1A1A1A" />
      {/* Bezel highlight (top-left) */}
      <path
        d="M 105 95 A 72 72 0 0 1 175 60"
        stroke="#B5B5B5"
        strokeWidth="1.5"
        fill="none"
        opacity="0.5"
      />

      {/* Lens focus ring */}
      <circle cx="155" cy="125" r="64" fill="url(#ringGrad)" />
      {/* Focus ring rubber grip */}
      <circle cx="155" cy="125" r="64" fill="none" stroke="#0A0A0A" strokeWidth="2" />
      {Array.from({ length: 36 }).map((_, i) => {
        const a = (i * 10 * Math.PI) / 180;
        return (
          <line
            key={`focus-${i}`}
            x1={155 + Math.cos(a) * 60}
            y1={125 + Math.sin(a) * 60}
            x2={155 + Math.cos(a) * 64}
            y2={125 + Math.sin(a) * 64}
            stroke="#000"
            strokeWidth="1"
            opacity="0.7"
          />
        );
      })}

      {/* Aperture ring */}
      <circle cx="155" cy="125" r="55" fill="#0A0A0A" />
      <circle cx="155" cy="125" r="55" fill="none" stroke="#2A2A2A" strokeWidth="1" />

      {/* Lens glass (deep) */}
      <circle cx="155" cy="125" r="48" fill="#000" />
      <circle cx="155" cy="125" r="48" fill="url(#lensGlass)" />

      {/* Inner aperture blades shadow */}
      <circle cx="155" cy="125" r="38" fill="url(#innerDark)" opacity="0.85" />

      {/* Aperture petals (subtle hexagonal highlight) */}
      <polygon
        points="155,93 178,107 178,143 155,157 132,143 132,107"
        fill="none"
        stroke="#1A2530"
        strokeWidth="1"
        opacity="0.5"
      />

      {/* Glass reflection — primary highlight */}
      <ellipse
        cx="135"
        cy="106"
        rx="14"
        ry="8"
        fill="#FFFFFF"
        opacity="0.22"
        transform="rotate(-25 135 106)"
      />
      {/* Glass reflection — secondary tiny gleam */}
      <ellipse cx="130" cy="100" rx="5" ry="2.5" fill="#FFFFFF" opacity="0.55" />
      {/* Lens flare hint (small bright dot) */}
      <circle cx="172" cy="142" r="2" fill="#FFFFFF" opacity="0.3" />

      {/* ── Recording LED (top-right) ── */}
      <circle cx="270" cy="64" r="3.5" fill="#FF2A2A" />
      <circle cx="270" cy="64" r="3.5" fill="#FF2A2A" opacity="0.5">
        <animate
          attributeName="r"
          values="3.5;7;3.5"
          dur="1.8s"
          repeatCount="indefinite"
        />
        <animate
          attributeName="opacity"
          values="0.5;0;0.5"
          dur="1.8s"
          repeatCount="indefinite"
        />
      </circle>
      {/* LED bright center */}
      <circle cx="269" cy="63" r="1.2" fill="#FFAAAA" opacity="0.9" />
    </svg>
  );
}
