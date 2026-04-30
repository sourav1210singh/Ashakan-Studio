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
   Photorealistic DSLR camera — front-facing professional rig.
   Built like a Canon 5D / Sony Alpha:
     • Large protruding lens (zoom telephoto)
     • Pentaprism viewfinder hump on top
     • Right-side grip with rubberized texture
     • Multiple control dials, shutter, AF assist
     • Realistic metal + matte plastic differentiation
   ───────────────────────────────────────────────────────────── */
function CameraSVG() {
  return (
    <svg
      width="380"
      height="290"
      viewBox="0 0 380 290"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        filter:
          "drop-shadow(0 25px 40px rgba(0,0,0,0.5)) drop-shadow(0 8px 16px rgba(0,0,0,0.3))",
      }}
    >
      <defs>
        {/* Main body — top-down lighting */}
        <linearGradient id="dslrBody" x1="0.5" y1="0" x2="0.5" y2="1">
          <stop offset="0%" stopColor="#2E2E2E" />
          <stop offset="15%" stopColor="#1A1A1A" />
          <stop offset="55%" stopColor="#0F0F0F" />
          <stop offset="100%" stopColor="#050505" />
        </linearGradient>

        {/* Side wrap shading */}
        <linearGradient id="dslrSide" x1="0" y1="0.5" x2="1" y2="0.5">
          <stop offset="0%" stopColor="#3A3A3A" stopOpacity="0.5" />
          <stop offset="12%" stopColor="#000" stopOpacity="0" />
          <stop offset="88%" stopColor="#000" stopOpacity="0" />
          <stop offset="100%" stopColor="#000" stopOpacity="0.7" />
        </linearGradient>

        {/* Pentaprism (top hump) */}
        <linearGradient id="prismGrad" x1="0.5" y1="0" x2="0.5" y2="1">
          <stop offset="0%" stopColor="#3A3A3A" />
          <stop offset="40%" stopColor="#1E1E1E" />
          <stop offset="100%" stopColor="#0C0C0C" />
        </linearGradient>

        {/* Grip rubber */}
        <linearGradient id="gripRubber" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#1A1A1A" />
          <stop offset="50%" stopColor="#252525" />
          <stop offset="100%" stopColor="#0A0A0A" />
        </linearGradient>

        {/* Lens barrel — long zoom lens shading */}
        <radialGradient id="lensBarrel" cx="0.5" cy="0.5" r="0.55">
          <stop offset="0%" stopColor="#2C2C2C" />
          <stop offset="70%" stopColor="#151515" />
          <stop offset="100%" stopColor="#000" />
        </radialGradient>

        {/* Chrome ring (between lens sections) */}
        <linearGradient id="chromeRing" x1="0.5" y1="0" x2="0.5" y2="1">
          <stop offset="0%" stopColor="#B8B8B8" />
          <stop offset="35%" stopColor="#6E6E6E" />
          <stop offset="65%" stopColor="#383838" />
          <stop offset="100%" stopColor="#1A1A1A" />
        </linearGradient>

        {/* Lens front element glass */}
        <radialGradient id="frontGlass" cx="0.32" cy="0.28" r="0.85">
          <stop offset="0%" stopColor="#7090A8" stopOpacity="0.95" />
          <stop offset="20%" stopColor="#2A4458" stopOpacity="0.9" />
          <stop offset="55%" stopColor="#0A1820" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#000" stopOpacity="1" />
        </radialGradient>

        {/* Inner glass — depth tunnel */}
        <radialGradient id="innerGlass" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#0A1218" />
          <stop offset="70%" stopColor="#000" />
          <stop offset="100%" stopColor="#000" />
        </radialGradient>

        {/* Aperture iris hint */}
        <radialGradient id="iris" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#000" />
          <stop offset="80%" stopColor="#000" />
          <stop offset="100%" stopColor="#1A2530" stopOpacity="0.5" />
        </radialGradient>
      </defs>

      {/* ════════════════════════════════════════════════════════
         PENTAPRISM — top viewfinder hump (iconic DSLR feature)
         ════════════════════════════════════════════════════════ */}
      {/* Hot shoe rails (above prism) */}
      <rect x="170" y="20" width="38" height="14" rx="1" fill="#0A0A0A" />
      <rect x="172" y="22" width="34" height="2" rx="0.5" fill="#2A2A2A" />
      <rect x="178" y="26" width="22" height="2" rx="0.5" fill="#000" />
      <rect x="182" y="30" width="14" height="2" rx="0.5" fill="#0F0F0F" />

      {/* Pentaprism trapezoid shape */}
      <path
        d="M 145 60 L 158 34 L 220 34 L 233 60 Z"
        fill="url(#prismGrad)"
      />
      {/* Prism top highlight edge */}
      <line x1="158" y1="34" x2="220" y2="34" stroke="#4A4A4A" strokeWidth="1" opacity="0.7" />
      {/* Prism brand badge */}
      <text
        x="189"
        y="51"
        fontSize="6"
        fontFamily="sans-serif"
        fontWeight="700"
        fill="#777"
        letterSpacing="1.2"
        textAnchor="middle"
      >
        ASHKAN
      </text>

      {/* ════════════════════════════════════════════════════════
         MAIN BODY
         ════════════════════════════════════════════════════════ */}
      {/* Body shape with subtle right-side grip bulge */}
      <path
        d="M 30 60
           L 145 60
           L 158 60
           L 220 60
           L 233 60
           L 305 60
           Q 320 60 320 75
           L 320 165
           Q 320 180 305 180
           L 280 180
           Q 285 200 305 215
           L 290 245
           Q 280 255 260 250
           L 50 250
           Q 30 250 30 230
           L 30 75
           Q 30 60 30 60 Z"
        fill="url(#dslrBody)"
      />
      {/* Body wrap shading */}
      <path
        d="M 30 60
           L 145 60
           L 158 60
           L 220 60
           L 233 60
           L 305 60
           Q 320 60 320 75
           L 320 165
           Q 320 180 305 180
           L 280 180
           Q 285 200 305 215
           L 290 245
           Q 280 255 260 250
           L 50 250
           Q 30 250 30 230
           L 30 75
           Q 30 60 30 60 Z"
        fill="url(#dslrSide)"
      />
      {/* Body top highlight */}
      <path
        d="M 30 62 L 305 62"
        stroke="#5A5A5A"
        strokeWidth="1"
        opacity="0.5"
      />

      {/* ════════════════════════════════════════════════════════
         RIGHT GRIP (rubberized texture)
         ════════════════════════════════════════════════════════ */}
      <path
        d="M 270 65
           L 305 65
           Q 318 65 318 78
           L 318 175
           Q 318 188 305 188
           L 282 188
           Q 287 208 302 220
           L 286 240
           Q 280 246 268 240
           L 270 65 Z"
        fill="url(#gripRubber)"
      />
      {/* Grip rubber dimple texture */}
      {Array.from({ length: 24 }).map((_, i) => {
        const row = Math.floor(i / 4);
        const col = i % 4;
        return (
          <circle
            key={`dimple-${i}`}
            cx={278 + col * 8}
            cy={80 + row * 18}
            r="1.5"
            fill="#000"
            opacity="0.8"
          />
        );
      })}
      {/* Grip vertical highlight */}
      <line x1="306" y1="68" x2="306" y2="180" stroke="#3A3A3A" strokeWidth="0.8" opacity="0.6" />

      {/* Shutter button on top of grip */}
      <ellipse cx="295" cy="62" rx="14" ry="6" fill="#1A1A1A" />
      <ellipse cx="295" cy="60" rx="11" ry="4" fill="#2A2A2A" />
      <ellipse cx="295" cy="58" rx="8" ry="2.5" fill="#4A4A4A" />
      {/* Shutter highlight */}
      <ellipse cx="293" cy="57" rx="5" ry="1" fill="#7A7A7A" opacity="0.7" />

      {/* Front control dial (just below shutter) */}
      <circle cx="278" cy="78" r="6" fill="#0A0A0A" />
      <circle cx="278" cy="78" r="4" fill="url(#chromeRing)" opacity="0.5" />

      {/* ════════════════════════════════════════════════════════
         LEFT-SIDE BODY DETAILS
         ════════════════════════════════════════════════════════ */}
      {/* Brand text on left of body */}
      <text
        x="48"
        y="82"
        fontSize="11"
        fontFamily="sans-serif"
        fontWeight="800"
        fill="#999"
        letterSpacing="2"
      >
        ASHKAN
      </text>
      <text
        x="48"
        y="94"
        fontSize="5.5"
        fontFamily="sans-serif"
        fontWeight="500"
        fill="#555"
        letterSpacing="3"
      >
        EOS DIGITAL
      </text>

      {/* Lens release button (left of lens) */}
      <circle cx="62" cy="135" r="5" fill="#0A0A0A" />
      <circle cx="62" cy="135" r="3" fill="#2A2A2A" />

      {/* AF assist beam window */}
      <rect x="48" y="170" width="20" height="6" rx="2" fill="#220A0A" />
      <rect x="50" y="172" width="16" height="2" rx="1" fill="#3D1010" opacity="0.8" />

      {/* Mode dial (top left) */}
      <circle cx="78" cy="56" r="14" fill="#0A0A0A" />
      <circle cx="78" cy="56" r="14" fill="none" stroke="#383838" strokeWidth="1.5" />
      <circle cx="78" cy="56" r="10" fill="url(#prismGrad)" />
      {/* Mode dial markings */}
      {["M", "AV", "TV", "P", "A", "S"].map((label, i) => {
        const a = (i * 60 - 90) * (Math.PI / 180);
        return (
          <text
            key={`mode-${i}`}
            x={78 + Math.cos(a) * 8}
            y={56 + Math.sin(a) * 8 + 2}
            fontSize="3.5"
            fontWeight="700"
            fill="#999"
            textAnchor="middle"
            fontFamily="sans-serif"
          >
            {label}
          </text>
        );
      })}
      {/* Center indicator dot */}
      <circle cx="78" cy="56" r="1.2" fill="#CC2A2A" />

      {/* ════════════════════════════════════════════════════════
         LENS ASSEMBLY — Large protruding zoom lens
         ════════════════════════════════════════════════════════ */}
      {/* Outer barrel (largest, deepest) */}
      <circle cx="175" cy="155" r="92" fill="url(#lensBarrel)" />
      {/* Barrel outer ring shadow */}
      <circle cx="175" cy="155" r="92" fill="none" stroke="#000" strokeWidth="2" />
      {/* Barrel top-left highlight */}
      <path
        d="M 110 110 A 92 92 0 0 1 200 70"
        stroke="#4A4A4A"
        strokeWidth="2"
        fill="none"
        opacity="0.7"
      />

      {/* Chrome ring (separates barrel sections) */}
      <circle cx="175" cy="155" r="86" fill="none" stroke="url(#chromeRing)" strokeWidth="3" />

      {/* Zoom ring (with rubber texture) */}
      <circle cx="175" cy="155" r="82" fill="#0F0F0F" />
      {Array.from({ length: 60 }).map((_, i) => {
        const a = (i * 6 * Math.PI) / 180;
        return (
          <line
            key={`zoom-${i}`}
            x1={175 + Math.cos(a) * 78}
            y1={155 + Math.sin(a) * 78}
            x2={175 + Math.cos(a) * 82}
            y2={155 + Math.sin(a) * 82}
            stroke="#000"
            strokeWidth="0.8"
            opacity="0.9"
          />
        );
      })}

      {/* Focal length text on barrel */}
      <text
        x="175"
        y="86"
        fontSize="6"
        fontFamily="sans-serif"
        fontWeight="600"
        fill="#999"
        textAnchor="middle"
        letterSpacing="1.5"
      >
        70-200mm f/2.8
      </text>

      {/* Inner chrome ring (between zoom & focus) */}
      <circle cx="175" cy="155" r="74" fill="url(#chromeRing)" opacity="0.6" />
      <circle cx="175" cy="155" r="71" fill="#0A0A0A" />

      {/* Focus ring */}
      <circle cx="175" cy="155" r="68" fill="#151515" />
      {Array.from({ length: 48 }).map((_, i) => {
        const a = (i * 7.5 * Math.PI) / 180;
        return (
          <line
            key={`focus-${i}`}
            x1={175 + Math.cos(a) * 64}
            y1={155 + Math.sin(a) * 64}
            x2={175 + Math.cos(a) * 68}
            y2={155 + Math.sin(a) * 68}
            stroke="#000"
            strokeWidth="0.7"
            opacity="0.85"
          />
        );
      })}

      {/* Lens hood inner edge */}
      <circle cx="175" cy="155" r="60" fill="none" stroke="url(#chromeRing)" strokeWidth="2" />

      {/* Front element glass */}
      <circle cx="175" cy="155" r="56" fill="#000" />
      <circle cx="175" cy="155" r="56" fill="url(#frontGlass)" />

      {/* Glass inner depth */}
      <circle cx="175" cy="155" r="44" fill="url(#innerGlass)" />

      {/* Aperture iris (subtle hex blade hint) */}
      <circle cx="175" cy="155" r="32" fill="url(#iris)" />
      <polygon
        points="175,123 203,139 203,171 175,187 147,171 147,139"
        fill="none"
        stroke="#1A2A38"
        strokeWidth="1"
        opacity="0.55"
      />

      {/* Glass reflections — main highlight */}
      <ellipse
        cx="148"
        cy="128"
        rx="18"
        ry="10"
        fill="#FFFFFF"
        opacity="0.22"
        transform="rotate(-25 148 128)"
      />
      {/* Bright pinpoint */}
      <ellipse cx="142" cy="120" rx="6" ry="3" fill="#FFFFFF" opacity="0.6" />
      <ellipse cx="140" cy="118" rx="2" ry="1" fill="#FFFFFF" opacity="0.95" />
      {/* Lens flare dots */}
      <circle cx="200" cy="180" r="3" fill="#FFFFFF" opacity="0.25" />
      <circle cx="210" cy="170" r="1.5" fill="#FFFFFF" opacity="0.4" />

      {/* Red ring (pro lens marker) — Canon-style */}
      <circle
        cx="175"
        cy="155"
        r="63"
        fill="none"
        stroke="#B81818"
        strokeWidth="1.5"
        opacity="0.9"
      />

      {/* ════════════════════════════════════════════════════════
         LED + DETAILS
         ════════════════════════════════════════════════════════ */}
      {/* Recording LED (pulse) */}
      <circle cx="50" cy="74" r="2.5" fill="#FF2A2A" />
      <circle cx="50" cy="74" r="2.5" fill="#FF2A2A" opacity="0.5">
        <animate attributeName="r" values="2.5;6;2.5" dur="2s" repeatCount="indefinite" />
        <animate
          attributeName="opacity"
          values="0.5;0;0.5"
          dur="2s"
          repeatCount="indefinite"
        />
      </circle>
    </svg>
  );
}
