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
const HERO_VIDEO_ID = "1022971286"; // Vitacca Ballet - Season Promo (motion + texture)

/* ────────────────────────────────────────────────────────────
   VideoTextWord - bold word whose letter shapes act as a
   "window" through which a Vimeo BTS reel plays continuously.
   Implementation: an SVG <mask> built from the text shape clips
   a <foreignObject> hosting the Vimeo iframe - so the video is
   only visible inside the letters; everything around stays cream.
   ──────────────────────────────────────────────────────────── */
interface VideoTextWordProps {
  children: string;
  className?: string;
  style?: React.CSSProperties;
  /** Vimeo numeric ID - defaults to HERO_VIDEO_ID */
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
      {/* Layout placeholder - invisible, but determines width/height */}
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

      {/* SVG with masked video - covers the layout box exactly */}
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
   MagneticWord - pulls the wrapped word toward the cursor
   while it's hovering. Used on every word in the hero copy.
   ──────────────────────────────────────────────────────────── */
interface MagneticWordProps {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
  /** how strongly the word is pulled (0-1, default 0.25) */
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
   InlineCutout - image embedded INSIDE text flow.
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

/* Random drift patterns - small amplitude (~±6px) so cutouts don't wander
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
    /* Outer wrapper - random multi-axis drift via framer-motion animate */
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
      {/* Inner wrapper - mouse-follow parallax (composes with outer drift) */}
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
   Hero Section - Word-Integrated Cutout Composition
     [dancer] WE CREATE
     VISUAL [cameraman] STORIES
     THAT INSPIRE [portrait]

   Animation layers:
     1. Parallax scroll  - bg/text/cutouts at different speeds
     2. Mouse float      - cutouts subtly track cursor (depth feel)
     3. Magnetic hover   - every word tugs toward cursor on hover
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
      className="relative flex flex-col items-center justify-center bg-cream overflow-hidden pt-24 sm:pt-28 pb-8 sm:pb-12"
      style={{ minHeight: "100vh" }}
    >
      {/* Background Pattern - parallax slowest */}
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

      {/* Main content - parallax medium + scroll-out exit */}
      <motion.div
        className="relative z-10 w-full max-w-[1650px] mx-auto px-4 sm:px-6 lg:px-10 py-4 sm:py-8"
        style={{
          y: textY,
          opacity: exitOpacity,
          scale: exitScale,
          filter: exitBlur,
        }}
      >
        <div className="text-center">
          {/* ───── LINE 1: [vitacca-pro-868] WE CREATE [isabella-decandido-22138] ─────
              User-directed swap (2026-05-12): replace the old cameraman cutout
              left of WE with the Vitacca Pro-868 dancer, and add an Isabella
              DeCandido portrait to the right of CREATE. */}
          <motion.div
            className="mb-2 lg:mb-4"
            style={{
              opacity: 0,
              animation: "heroSlideUp 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.15s forwards",
              y: line1Lift,
            }}
          >
            <InlineCutout
              src="/images/hero/cutouts/vitacca-pro-868.png"
              alt="Vitacca Pro dancer cutout"
              className="hidden md:inline-block"
              /* +30% on every clamp value (third pass 2026-05-12) -
                 user asked this cutout to grow another 30% on top
                 of the previous +30%. Net growth vs original ~+69%. */
              width="clamp(203px, 23.4vw, 365px)"
              height="clamp(162px, 19.5vw, 295px)"
              driftName="driftA"
              enterDelay={0.6}
              /* Position 2026-05-12 (fourth pass): pushed further
                 right + further up per user feedback. marginRight
                 -130 → -170 (~40px more right, additional overlap
                 with WE), marginTop -120 → -140 (~20px higher). */
              style={{ marginRight: "-170px", marginTop: "-140px", top: "0" }}
              mouseX={mouseX}
              mouseY={mouseY}
              floatStrength={22}
            />
            {/* WE CREATE - Inter (font-sans), no video-in-text per
                Brandi's 5/7/26 notes ('we, create, that' use Inter).
                letterSpacing tightened 40% (0.02em → 0.012em) and
                each glyph compressed horizontally to 70% via
                transform: scaleX(0.7) per user request 2026-05-12.
                Vertical height untouched - only the per-letter
                horizontal footprint shrinks, so 'W' / 'E' / 'C' etc.
                now read at roughly the same width as the heavier
                display-font letters in VISUAL / STORIES / INSPIRE. */}
            <MagneticWord
              className="font-sans text-4xl sm:text-5xl md:text-7xl lg:text-[106px] xl:text-[132px] uppercase"
              style={{
                fontWeight: 200,
                letterSpacing: "0.012em",
                lineHeight: 0.9,
              }}
              strength={0.2}
            >
              <span
                className="font-sans text-4xl sm:text-5xl md:text-7xl lg:text-[106px] xl:text-[132px] uppercase inline-block"
                style={{
                  fontWeight: 200,
                  letterSpacing: "0.012em",
                  lineHeight: 0.9,
                  color: "#1A1A1A",
                  transform: "scaleX(0.7)",
                  transformOrigin: "center",
                }}
              >
                WE CREATE
              </span>
            </MagneticWord>
            <InlineCutout
              src="/images/hero/cutouts/isabella-decandido-22138.png"
              alt="Isabella DeCandido portrait cutout"
              className="hidden md:inline-block"
              /* Size reduced 2026-05-12 (third pass) - user said
                 the figure was too large after the page-6-reference
                 enlargement. Roughly -30% on every clamp value so
                 Isabella still reads as a tall figure but no longer
                 overpowers the composition. */
              width="clamp(102px, 12vw, 185px)"
              height="clamp(168px, 19.2vw, 302px)"
              driftName="driftC"
              enterDelay={0.85}
              /* Position 2026-05-12 (sixth pass): another small
                 left + down nudge on ONLY this cutout.
                 marginLeft -80 → -100 (~20px more left);
                 top 20 → 40 (~20px more down). */
              style={{ marginLeft: "-100px", marginTop: "-80px", top: "40px" }}
              mouseX={mouseX}
              mouseY={mouseY}
              floatStrength={20}
            />
          </motion.div>

          {/* ───── LINE 2: VISUAL [cameraman] STORIES ─────
              Position nudge 2026-05-12 (eighth pass - match line 3
              gap): user asked the WE CREATE → VISUAL STORIES gap
              to exactly match the VISUAL STORIES → THAT INSPIRE
              gap below. Line 2 marginTop pulled from -145px → -45px
              so it equals line 3's marginTop. Both gaps now share
              the same negative offset and the vertical rhythm
              between every line is identical. */}
          {/* RESPONSIVE FIX 2026-05-12: the -45px marginTop was a
              fixed value tuned for the xl (110px) hero font. On
              mobile/tablet the font shrinks (text-4xl=36px etc.) but
              -45px did not, so VISUAL STORIES collapsed up onto WE
              CREATE (measured -49px overlap at 375px). marginTop is
              now a responsive Tailwind scale that grows with the
              font: 0 on mobile → -45px at xl (the exact desktop value
              the user finalized stays intact). */}
          <motion.div
            className="mb-2 lg:mb-4 mt-0 sm:mt-[-12px] md:mt-[-15px] lg:mt-[-36px] xl:mt-[-45px]"
            style={{
              opacity: 0,
              animation: "heroSlideUp 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.35s forwards",
              y: line2Lift,
            }}
          >
            {/* VISUAL - kept in display font (Bebas Neue), no video.
                Brandi: STORIES is the only word with video behind.
                position: relative + top: -15px added 2026-05-12 so
                ONLY the text lifts up on line 2. The sunglasses
                cutout to the right stays in its current spot -
                it's a sibling in the same inline row but doesn't
                pick up the offset because top is scoped to this
                MagneticWord span only. */}
            {/* RESPONSIVE FIX 2026-05-12: the -15px top offset only
                exists to align VISUAL with the cutout between it and
                STORIES - but that cutout is hidden below md. So the
                offset is now `top-0` on mobile (clean even rhythm,
                no cutout to align with) and `md:top-[-15px]` from
                tablet up where the cutout appears. relative class
                added so the top offset applies. */}
            <MagneticWord
              className="font-hero-bold text-4xl sm:text-5xl md:text-7xl lg:text-[106px] xl:text-[132px] uppercase relative top-0 lg:top-[-15px]"
              style={{
                fontWeight: 900,
                letterSpacing: "0.02em",
                lineHeight: 0.9,
              }}
              strength={0.2}
            >
              <span
                className="font-hero-bold text-4xl sm:text-5xl md:text-7xl lg:text-[106px] xl:text-[132px] uppercase"
                style={{
                  fontWeight: 900,
                  letterSpacing: "0.02em",
                  lineHeight: 0.9,
                  color: "#1A1A1A",
                }}
              >
                VISUAL
              </span>
            </MagneticWord>
            {/* User-directed swap (2026-05-12): the car between VISUAL and
                STORIES is replaced with the 8Q1A1315 cutout. The Ferrari
                moves to line 3 (left of THAT) per the same brief. */}
            <InlineCutout
              src="/images/hero/cutouts/cutout-8Q1A1315.png"
              alt="Editorial product cutout"
              className="hidden md:inline-block"
              /* +30% on every clamp value */
              width="clamp(137px, 15vw, 227px)"
              height="clamp(196px, 23.4vw, 359px)"
              driftName="driftB"
              enterDelay={1.1}
              /* Position nudge 2026-05-12: shifted ~30px down via `top`
                 (30px → 60px). marginTop kept at -100px so the cutout
                 still hangs off the top of its line; the larger `top`
                 pulls it back down into a more centered position
                 between VISUAL and STORIES.

                 Horizontal breathing room expanded ~10% on user request:
                 left margin 14px → 25px, right margin 8px → 19px so
                 VISUAL and STORIES sit a bit further apart with the
                 cutout sitting comfortably between them. */
              style={{ margin: "0 19px 0 25px", marginTop: "-100px", top: "60px" }}
              mouseX={mouseX}
              mouseY={mouseY}
              floatStrength={28}
            />
            <span className="md:hidden"> </span>
            {/* STORIES - display font with video-in-text mask.
                position: relative + top: -15px matches VISUAL -
                only the text lifts; sunglasses cutout stays put. */}
            {/* RESPONSIVE FIX 2026-05-12: top offset only aligns
                STORIES with the hidden-on-mobile sunglasses cutout -
                top-0 on mobile, md:top-[-15px] from tablet up. */}
            <MagneticWord
              className="font-hero-bold text-4xl sm:text-5xl md:text-7xl lg:text-[106px] xl:text-[132px] uppercase relative top-0 lg:top-[-15px]"
              style={{
                fontWeight: 900,
                letterSpacing: "0.02em",
                lineHeight: 0.9,
              }}
              strength={0.2}
            >
              <VideoTextWord
                className="font-hero-bold text-4xl sm:text-5xl md:text-7xl lg:text-[106px] xl:text-[132px] uppercase"
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

          {/* ───── LINE 3: [car-296gtb-121] THAT INSPIRE [deutsch-brandi-615] ─────
              User-directed swap (2026-05-12): add the Ferrari 296GTB to the
              left of THAT (moved here from line 2) and replace the previous
              portrait right of INSPIRE with the Deutsch Brandi-615 portrait.

              Position nudge 2026-05-12 (sixth pass - open-up more):
              user asked for a bit more breathing room on the
              VISUAL STORIES → THAT INSPIRE gap. marginTop relaxed
              -60px → -45px (~15px more space). */}
          {/* RESPONSIVE FIX 2026-05-12: same as line 2 - the fixed
              -45px marginTop is now a font-proportional responsive
              scale so THAT INSPIRE doesn't collapse onto VISUAL
              STORIES on mobile/tablet. Desktop (xl) keeps -45px. */}
          <motion.div
            className="mt-0 sm:mt-[-12px] md:mt-[-15px] lg:mt-[-36px] xl:mt-[-45px]"
            style={{
              opacity: 0,
              animation: "heroSlideUp 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.55s forwards",
              y: line3Lift,
            }}
          >
            <InlineCutout
              src="/images/hero/cutouts/car-296gtb-121.png"
              alt="Ferrari 296GTB cutout"
              className="hidden md:inline-block"
              /* +30% on every clamp value */
              width="clamp(149px, 16.2vw, 258px)"
              height="clamp(109px, 12.6vw, 196px)"
              driftName="driftA"
              enterDelay={1.3}
              /* Position 2026-05-12 (page-6-reference pass): Brandi's
                 design floats the Ferrari in the GAP between VISUAL
                 STORIES and THAT INSPIRE rather than inline beside
                 THAT. marginTop is now -130px so the car hangs well
                 above the line; marginRight -50px lets it sit
                 slightly closer to / overlapping THAT. The car
                 effectively reads as a third visual band between
                 the two text lines.

                 Nudge 2026-05-12: top: 0 → -20px to lift the car
                 slightly higher per user request - only the Ferrari
                 moves, everything else on line 3 stays put. */
              style={{ marginRight: "-50px", marginTop: "-130px", top: "-20px" }}
              mouseX={mouseX}
              mouseY={mouseY}
              floatStrength={26}
            />
            {/* THAT - Inter (font-sans), no video-in-text.
                Same treatment as WE CREATE on line 1 - letterSpacing
                0.012em + scaleX(0.7) so Inter glyphs match the
                horizontal density of the display-font words above.
                Right margin reduced 40% three times in a row per
                repeat user requests: 0.45em → 0.27em → 0.16em →
                0.10em. THAT and INSPIRE now sit very tight.

                position: relative + top: 18px added 2026-05-12 so
                ONLY the text drops down on line 3. The Ferrari
                cutout to the left and Oyster cutout to the right
                stay in their current positions - they're siblings
                in the same inline-block row but don't get the
                offset because the top property is scoped to the
                MagneticWord span. */}
            {/* RESPONSIVE FIX 2026-05-12: +18px top offset only
                exists to drop THAT down to match the line-3 cutout
                rhythm (Ferrari/Oyster hidden on mobile) - top-0 on
                mobile, md:top-[18px] from tablet up. */}
            <MagneticWord
              className="font-sans text-4xl sm:text-5xl md:text-7xl lg:text-[106px] xl:text-[132px] uppercase relative top-0 lg:top-[18px]"
              style={{
                fontWeight: 200,
                letterSpacing: "0.012em",
                lineHeight: 0.9,
                marginRight: "0.10em",
              }}
              strength={0.2}
            >
              <span
                className="font-sans text-4xl sm:text-5xl md:text-7xl lg:text-[106px] xl:text-[132px] uppercase inline-block"
                style={{
                  fontWeight: 200,
                  letterSpacing: "0.012em",
                  lineHeight: 0.9,
                  color: "#1A1A1A",
                  transform: "scaleX(0.7)",
                  transformOrigin: "center",
                }}
              >
                THAT
              </span>
            </MagneticWord>
            {/* INSPIRE - kept in display font, no video.
                position: relative + top: 18px added 2026-05-12 to
                match THAT - drops the text down without moving the
                Ferrari (left of THAT) or Oyster (right of INSPIRE)
                cutouts. */}
            {/* RESPONSIVE FIX 2026-05-12: matches THAT - top-0 on
                mobile, md:top-[18px] from tablet up. */}
            <MagneticWord
              className="font-hero-bold text-4xl sm:text-5xl md:text-7xl lg:text-[106px] xl:text-[132px] uppercase relative top-0 lg:top-[18px]"
              style={{
                fontWeight: 900,
                letterSpacing: "0.02em",
                lineHeight: 0.9,
              }}
              strength={0.2}
            >
              <span
                className="font-hero-bold text-4xl sm:text-5xl md:text-7xl lg:text-[106px] xl:text-[132px] uppercase"
                style={{
                  fontWeight: 900,
                  letterSpacing: "0.02em",
                  lineHeight: 0.9,
                  color: "#1A1A1A",
                }}
              >
                INSPIRE
              </span>
            </MagneticWord>
            <InlineCutout
              src="/images/hero/cutouts/deutsch-brandi-615.png"
              alt="Deutsch Brandi portrait cutout"
              className="hidden md:inline-block"
              /* +30% earlier, then +20% more on 2026-05-12 - net
                 ~+56% from the original baseline. This cutout alone
                 was singled out by the user as needing extra weight. */
              width="clamp(131px, 15.1vw, 235px)"
              height="clamp(168px, 19.4vw, 300px)"
              driftName="driftC"
              enterDelay={1.5}
              /* Position 2026-05-12 (third pass): user asked this
                 cutout to sit at the VERTICAL CENTER of the INSPIRE
                 text rather than hanging off the baseline. Switched
                 from the default `align-bottom` behaviour to
                 verticalAlign: "middle" via inline style (overrides
                 the InlineCutout component's hardcoded class).
                 Reset `top` and `marginTop` so vertical-align:middle
                 alone drives the placement - no extra offsets fighting
                 the alignment. Horizontal spacing (marginLeft 20px)
                 unchanged. Layout flow untouched, so line 3 text and
                 the 4th cutout stay exactly where they are. */
              style={{
                marginLeft: "20px",
                marginTop: 0,
                top: 0,
                verticalAlign: "middle",
              }}
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
        /* Stronger entrance reveal added 2026-05-21 per Brandi page-1
           note: add entrance animation to the words (fades or slides)
           for more movement. Bigger translateY than fadeInUp so the
           lines sweep up more dramatically. Kept on the translateY axis
           to compose cleanly with the per-line scroll parallax. */
        @keyframes heroSlideUp {
          from { opacity: 0; transform: translateY(110px); }
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
