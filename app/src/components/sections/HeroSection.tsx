import { useId, useRef, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
  type MotionValue,
} from "framer-motion";

/* Vimeo BTS reel that plays inside the bold text letters */
const HERO_VIDEO_ID = "1022971286"; // Vitacca Ballet — Season Promo (motion + texture)

/* ────────────────────────────────────────────────────────────
   VideoTextWord — bold word whose letter shapes act as a
   "window" through which a Vimeo BTS reel plays continuously.
   Implementation: an SVG <mask> built from the text shape clips
   a <foreignObject> hosting the Vimeo iframe — so the video is
   only visible inside the letters; everything around stays cream.
   ──────────────────────────────────────────────────────────── */
interface VideoTextWordProps {
  children: string;
  className?: string;
  style?: React.CSSProperties;
  /** Vimeo numeric ID — defaults to HERO_VIDEO_ID */
  vimeoId?: string;
}

function VideoTextWord({
  children,
  className = "",
  style = {},
  vimeoId = HERO_VIDEO_ID,
}: VideoTextWordProps) {
  const maskId = useId().replace(/:/g, "");

  return (
    <span
      className={className}
      style={{
        position: "relative",
        display: "inline-block",
        verticalAlign: "baseline",
        ...style,
      }}
    >
      {/* Layout placeholder — invisible, but determines width/height */}
      <span style={{ visibility: "hidden", whiteSpace: "pre" }}>{children}</span>

      {/* Fallback letter color (visible if SVG/foreignObject fails) */}
      <span
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          color: "#1A1A1A",
          pointerEvents: "none",
        }}
      >
        {children}
      </span>

      {/* SVG with masked video — covers the layout box exactly */}
      <svg
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          overflow: "visible",
          pointerEvents: "none",
        }}
      >
        <defs>
          <mask id={maskId} maskUnits="userSpaceOnUse">
            <rect width="100%" height="100%" fill="black" />
            <text
              x="50%"
              y="50%"
              textAnchor="middle"
              dominantBaseline="central"
              fill="white"
              style={{
                font: "inherit",
                letterSpacing: "inherit",
              }}
            >
              {children}
            </text>
          </mask>
        </defs>
        <foreignObject
          x="-15%"
          y="-50%"
          width="130%"
          height="200%"
          mask={`url(#${maskId})`}
        >
          <iframe
            src={`https://player.vimeo.com/video/${vimeoId}?background=1&autoplay=1&loop=1&muted=1&dnt=1&controls=0`}
            title={children}
            allow="autoplay; fullscreen"
            style={{
              width: "100%",
              height: "100%",
              border: 0,
              display: "block",
              pointerEvents: "none",
            }}
          />
        </foreignObject>
      </svg>
    </span>
  );
}

/* ────────────────────────────────────────────────────────────
   MagneticWord — pulls the wrapped word toward the cursor
   while it's hovering. Used on every word in the hero copy.
   ──────────────────────────────────────────────────────────── */
interface MagneticWordProps {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
  /** how strongly the word is pulled (0–1, default 0.25) */
  strength?: number;
}

function MagneticWord({
  children,
  className = "",
  style = {},
  strength = 0.25,
}: MagneticWordProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const mvX = useMotionValue(0);
  const mvY = useMotionValue(0);
  const x = useSpring(mvX, { stiffness: 220, damping: 16, mass: 0.6 });
  const y = useSpring(mvY, { stiffness: 220, damping: 16, mass: 0.6 });

  const handleMove = (e: React.MouseEvent<HTMLSpanElement>) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    mvX.set((e.clientX - cx) * strength);
    mvY.set((e.clientY - cy) * strength);
  };

  const handleLeave = () => {
    mvX.set(0);
    mvY.set(0);
  };

  return (
    <motion.span
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{ x, y, display: "inline-block", willChange: "transform", ...style }}
      className={className}
    >
      {children}
    </motion.span>
  );
}

/* ────────────────────────────────────────────────────────────
   InlineCutout — image embedded INSIDE text flow.
   Layered motion:
     • OUTER: random multi-axis drift (continuous, faster)
     • INNER: mouse-driven parallax float
   Drift is applied via framer-motion `animate` so it composes
   cleanly with the mouse-follow x/y on the inner span.
   ──────────────────────────────────────────────────────────── */
interface InlineCutoutProps {
  src: string;
  alt: string;
  className?: string;
  width: string;
  height: string;
  driftName: "driftA" | "driftB" | "driftC";
  enterDelay: number;
  style?: React.CSSProperties;
  mouseX: MotionValue<number>;
  mouseY: MotionValue<number>;
  /** how far this cutout drifts with the mouse (px) */
  floatStrength?: number;
}

/* Random drift patterns — small amplitude (~±6px) so cutouts don't wander
   too far from their layout position. Each has a different sequence and
   duration for organic, non-synchronized motion. */
const DRIFT_PATTERNS: Record<
  "driftA" | "driftB" | "driftC",
  { x: number[]; y: number[]; rotate: number[]; duration: number }
> = {
  driftA: {
    x: [0, 4, -3, 5, -2, 3, 0],
    y: [0, -5, -7, -3, 2, -4, 0],
    rotate: [0, -1.2, 0.8, -0.4, 1, -0.6, 0],
    duration: 9,
  },
  driftB: {
    x: [0, -5, 3, -4, 6, -2, 0],
    y: [0, 4, -4, 6, -3, 5, 0],
    rotate: [0, 1, -0.8, 1.4, -0.6, 0.7, 0],
    duration: 10,
  },
  driftC: {
    x: [0, 3, -4, 2, -5, 4, 0],
    y: [0, -4, 3, -3, 5, -2, 0],
    rotate: [0, -0.7, 1.2, -1, 0.5, -0.3, 0],
    duration: 8,
  },
};

function InlineCutout({
  src,
  alt,
  className = "",
  width,
  height,
  driftName,
  enterDelay,
  style = {},
  mouseX,
  mouseY,
  floatStrength = 18,
}: InlineCutoutProps) {
  const mx = useTransform(mouseX, [-1, 1], [-floatStrength, floatStrength]);
  const my = useTransform(
    mouseY,
    [-1, 1],
    [-floatStrength * 0.6, floatStrength * 0.6]
  );

  const drift = DRIFT_PATTERNS[driftName];

  return (
    /* Outer wrapper — random multi-axis drift via framer-motion animate */
    <motion.span
      className={`inline-block align-bottom select-none group ${className}`}
      style={{
        width,
        height,
        animation: `cutoutFadeIn 0.7s ease-out ${enterDelay}s forwards`,
        willChange: "transform, opacity",
        opacity: 0,
        position: "relative",
        ...style,
      }}
      animate={{
        x: drift.x,
        y: drift.y,
        rotate: drift.rotate,
      }}
      transition={{
        duration: drift.duration,
        repeat: Infinity,
        ease: "easeInOut",
        delay: enterDelay + 0.7,
      }}
      whileHover={{ scale: 1.08 }}
    >
      {/* Inner wrapper — mouse-follow parallax (composes with outer drift) */}
      <motion.span
        className="block w-full h-full"
        style={{ x: mx, y: my }}
      >
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-contain transition-all duration-500 group-hover:brightness-110 group-hover:saturate-110"
          style={{ filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.06))" }}
        />
        {/* Subtle glow halo on hover */}
        <span
          aria-hidden
          className="absolute inset-0 -z-10 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(212,178,116,0.35) 0%, rgba(212,178,116,0) 70%)",
            filter: "blur(20px)",
            transform: "scale(1.4)",
          }}
        />
      </motion.span>
    </motion.span>
  );
}

/* ────────────────────────────────────────────────────────────
   Hero Section — Word-Integrated Cutout Composition
     [dancer] WE CREATE
     VISUAL [cameraman] STORIES
     THAT INSPIRE [portrait]

   Animation layers:
     1. Parallax scroll  — bg/text/cutouts at different speeds
     2. Mouse float      — cutouts subtly track cursor (depth feel)
     3. Magnetic hover   — every word tugs toward cursor on hover
   ──────────────────────────────────────────────────────────── */
export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);

  /* ── Parallax scroll progress for this section ── */
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const smoothScroll = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 30,
    mass: 0.5,
  });
  // Each layer gets a different translate speed → depth illusion
  const bgY = useTransform(smoothScroll, [0, 1], ["-5%", "20%"]);     // slowest
  const textY = useTransform(smoothScroll, [0, 1], ["0%", "-12%"]);    // medium (anti-scroll for depth)

  /* ── Premium scroll-out transition (when leaving viewport) ──
     Each line zooms slightly + fades + softens with progressive blur.
     Triggered between 0.55 → 0.95 of section progress (i.e. when user
     starts scrolling past hero). */
  const exitOpacity = useTransform(smoothScroll, [0.55, 0.85], [1, 0]);
  const exitScale = useTransform(smoothScroll, [0.55, 0.95], [1, 0.85]);
  const exitBlur = useTransform(
    smoothScroll,
    [0.55, 0.95],
    ["blur(0px)", "blur(10px)"]
  );

  // Per-line stagger using slightly offset ranges (premium cascade)
  const line1Lift = useTransform(smoothScroll, [0.55, 0.85], [0, -40]);
  const line2Lift = useTransform(smoothScroll, [0.58, 0.88], [0, -55]);
  const line3Lift = useTransform(smoothScroll, [0.61, 0.91], [0, -70]);

  /* ── Mouse position (normalized −1…+1) for cutout float ── */
  const mvMouseX = useMotionValue(0);
  const mvMouseY = useMotionValue(0);
  const mouseX = useSpring(mvMouseX, { stiffness: 80, damping: 22, mass: 0.7 });
  const mouseY = useSpring(mvMouseY, { stiffness: 80, damping: 22, mass: 0.7 });

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = sectionRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;  // −1…+1
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    mvMouseX.set(x);
    mvMouseY.set(y);
  };

  const handleMouseLeave = () => {
    mvMouseX.set(0);
    mvMouseY.set(0);
  };

  return (
    <section
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative flex flex-col items-center justify-center bg-cream overflow-hidden pt-32 sm:pt-40 pb-28 sm:pb-40"
      style={{ minHeight: "130vh" }}
    >
      {/* Background Pattern — parallax slowest */}
      <motion.div
        className="absolute inset-0 opacity-[0.03]"
        style={{ y: bgY }}
      >
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #1A1A1A 1px, transparent 0)`,
            backgroundSize: "40px 40px",
          }}
        />
      </motion.div>

      {/* Main content — parallax medium + scroll-out exit */}
      <motion.div
        className="relative z-10 w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 py-4 sm:py-8"
        style={{
          y: textY,
          opacity: exitOpacity,
          scale: exitScale,
          filter: exitBlur,
        }}
      >
        <div className="text-center">
          {/* ───── LINE 1: [dancer] WE CREATE — shifted slightly left ───── */}
          <motion.div
            className="mb-2 lg:mb-4"
            style={{
              opacity: 0,
              animation: "fadeInUp 0.8s ease-out 0.3s forwards",
              y: line1Lift,
              transform: "translateX(-5%)",
            }}
          >
            <InlineCutout
              src="/images/hero/dance-cutout.png"
              alt="Dance photography"
              className="hidden md:inline-block"
              width="clamp(100px, 11.5vw, 180px)"
              height="clamp(80px, 9.5vw, 145px)"
              driftName="driftA"
              enterDelay={0.6}
              style={{ marginRight: "-10px", marginTop: "-25px", top: "6px" }}
              mouseX={mouseX}
              mouseY={mouseY}
              floatStrength={22}
            />
            <MagneticWord
              className="font-hero-bold text-4xl sm:text-5xl md:text-6xl lg:text-[88px] xl:text-[110px] uppercase"
              style={{
                fontWeight: 900,
                letterSpacing: "0.02em",
                lineHeight: 0.9,
              }}
              strength={0.2}
            >
              <VideoTextWord
                className="font-hero-bold text-4xl sm:text-5xl md:text-6xl lg:text-[88px] xl:text-[110px] uppercase"
                style={{
                  fontWeight: 900,
                  letterSpacing: "0.02em",
                  lineHeight: 0.9,
                }}
              >
                WE CREATE
              </VideoTextWord>
            </MagneticWord>
          </motion.div>

          {/* ───── LINE 2: VISUAL [cameraman] STORIES ───── */}
          <motion.div
            className="mb-2 lg:mb-4"
            style={{
              opacity: 0,
              animation: "fadeInUp 0.8s ease-out 0.4s forwards",
              y: line2Lift,
            }}
          >
            <MagneticWord
              className="font-hero-bold text-4xl sm:text-5xl md:text-6xl lg:text-[88px] xl:text-[110px] uppercase"
              style={{
                fontWeight: 900,
                letterSpacing: "0.02em",
                lineHeight: 0.9,
              }}
              strength={0.2}
            >
              <VideoTextWord
                className="font-hero-bold text-4xl sm:text-5xl md:text-6xl lg:text-[88px] xl:text-[110px] uppercase"
                style={{
                  fontWeight: 900,
                  letterSpacing: "0.02em",
                  lineHeight: 0.9,
                }}
              >
                VISUAL
              </VideoTextWord>
            </MagneticWord>
            <InlineCutout
              src="/images/hero/cameraman-cutout.png"
              alt="Video production"
              className="hidden md:inline-block"
              width="clamp(88px, 9.5vw, 145px)"
              height="clamp(125px, 15vw, 230px)"
              driftName="driftB"
              enterDelay={1.1}
              style={{ margin: "0 8px 0 14px", marginTop: "-100px", top: "30px" }}
              mouseX={mouseX}
              mouseY={mouseY}
              floatStrength={28}
            />
            <span className="md:hidden"> </span>
            <MagneticWord
              className="font-hero-bold text-4xl sm:text-5xl md:text-6xl lg:text-[88px] xl:text-[110px] uppercase"
              style={{
                fontWeight: 900,
                letterSpacing: "0.02em",
                lineHeight: 0.9,
              }}
              strength={0.2}
            >
              <VideoTextWord
                className="font-hero-bold text-4xl sm:text-5xl md:text-6xl lg:text-[88px] xl:text-[110px] uppercase"
                style={{
                  fontWeight: 900,
                  letterSpacing: "0.02em",
                  lineHeight: 0.9,
                }}
              >
                STORIES
              </VideoTextWord>
            </MagneticWord>
          </motion.div>

          {/* ───── LINE 3: THAT INSPIRE [portrait] ───── */}
          <motion.div
            style={{
              opacity: 0,
              animation: "fadeInUp 0.8s ease-out 0.5s forwards",
              y: line3Lift,
            }}
          >
            <MagneticWord
              className="font-hero-bold text-4xl sm:text-5xl md:text-6xl lg:text-[88px] xl:text-[110px] uppercase"
              style={{
                fontWeight: 900,
                letterSpacing: "0.02em",
                lineHeight: 0.9,
                marginRight: "0.45em",
              }}
              strength={0.2}
            >
              <VideoTextWord
                className="font-hero-bold text-4xl sm:text-5xl md:text-6xl lg:text-[88px] xl:text-[110px] uppercase"
                style={{
                  fontWeight: 900,
                  letterSpacing: "0.02em",
                  lineHeight: 0.9,
                }}
              >
                THAT
              </VideoTextWord>
            </MagneticWord>
            <MagneticWord
              className="font-hero-bold text-4xl sm:text-5xl md:text-6xl lg:text-[88px] xl:text-[110px] uppercase"
              style={{
                fontWeight: 900,
                letterSpacing: "0.02em",
                lineHeight: 0.9,
              }}
              strength={0.2}
            >
              <VideoTextWord
                className="font-hero-bold text-4xl sm:text-5xl md:text-6xl lg:text-[88px] xl:text-[110px] uppercase"
                style={{
                  fontWeight: 900,
                  letterSpacing: "0.02em",
                  lineHeight: 0.9,
                }}
              >
                INSPIRE
              </VideoTextWord>
            </MagneticWord>
            <InlineCutout
              src="/images/hero/portrait-cutout.png"
              alt="Portrait photography"
              className="hidden md:inline-block"
              width="clamp(65px, 7.5vw, 115px)"
              height="clamp(80px, 9.5vw, 145px)"
              driftName="driftC"
              enterDelay={1.5}
              style={{ marginLeft: "20px", marginTop: "-25px", top: "-2px" }}
              mouseX={mouseX}
              mouseY={mouseY}
              floatStrength={20}
            />
          </motion.div>
        </div>

        {/* Subtext */}
        <p
          className="font-sans mx-auto text-center mt-6 sm:mt-10 text-sm sm:text-base lg:text-lg text-dark/70 leading-relaxed relative z-30 text-balance"
          style={{
            maxWidth: "600px",
            fontWeight: 400,
            opacity: 0,
            animation: "fadeInUp 0.6s ease-out 0.9s forwards",
          }}
        >
          Ashkan Studios is a Houston-based production company specializing in
          commercial photography, cinematic videography, and strategic creative
          direction. We partner with brands to craft visuals that command
          attention and define presence.
        </p>

        {/* Scroll Indicator */}
        <div
          className="flex flex-col items-center mt-8 sm:mt-12 relative z-30"
          style={{
            opacity: 0,
            animation: "fadeIn 0.6s ease-out 1.2s forwards",
          }}
        >
          <span className="font-sans text-xs sm:text-sm font-medium tracking-wider text-dark/50 mb-3">
            SCROLL FOR MORE
          </span>
          <div className="animate-bounce-slow">
            <ChevronDown className="w-5 h-5 sm:w-6 sm:h-6 text-dark/50" />
          </div>
        </div>
      </motion.div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(60px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .animate-bounce-slow {
          animation: bounceSlow 2s ease-in-out infinite;
        }
        @keyframes bounceSlow {
          0%, 100% { transform: translateY(0); }
          50%      { transform: translateY(10px); }
        }
        @keyframes cutoutFadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
      `}</style>
    </section>
  );
}
