import { useState, useRef, type ReactNode } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { clientLogos, priorityClientLogos, type ClientLogo } from "@/data/portfolio";

/* ════════════════════════════════════════════════════════════════════
   OUR FRIENDS - Marquee + Magnetic combo. Two infinite-scrolling rows
   in opposite directions; each logo is magnetic and snaps toward the
   cursor on hover.

   Updated 2026-05-07 to render real client logos instead of text.
   Brandi delivered 41 PNGs (~410 KB total); the 20 priority ones
   ride the top row, the rest fill the bottom row.
   ════════════════════════════════════════════════════════════════════ */

/* ──────────────────────────────────────────────────────────────────── */
/*  MagneticItem - pulls the wrapped child toward the cursor on hover   */
/* ──────────────────────────────────────────────────────────────────── */
function MagneticItem({
  children,
  strength = 0.4,
}: {
  children: ReactNode;
  strength?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const mvX = useMotionValue(0);
  const mvY = useMotionValue(0);
  const x = useSpring(mvX, { stiffness: 280, damping: 18, mass: 0.6 });
  const y = useSpring(mvY, { stiffness: 280, damping: 18, mass: 0.6 });
  const [hover, setHover] = useState(false);

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    mvX.set((e.clientX - cx) * strength);
    mvY.set((e.clientY - cy) * strength);
  };
  const onLeave = () => {
    mvX.set(0);
    mvY.set(0);
    setHover(false);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={onLeave}
      style={{ x, y, display: "inline-block", willChange: "transform" }}
      animate={{ scale: hover ? 1.12 : 1 }}
      transition={{ type: "spring", stiffness: 240, damping: 20 }}
    >
      {children}
    </motion.div>
  );
}

/* ──────────────────────────────────────────────────────────────────── */
/*  LogoItem - single logo image. Brandi's logos are dark-on-transparent,
    so on the dark section background we force them white via brightness(0)
    + invert(1). Default: 55% opacity (subtle); hover: 100% opacity (pops).
    Keeping the monochrome treatment (no original colour even on hover)
    gives the marquee a uniform premium agency feel.                    */
/* ──────────────────────────────────────────────────────────────────── */
function LogoItem({ logo, size }: { logo: ClientLogo; size: "lg" | "sm" }) {
  const [hover, setHover] = useState(false);
  /* Priority logos render bigger (top row); secondary logos slightly
     smaller (bottom row) so the visual hierarchy mirrors Brandi's
     priority list at a glance. */
  const heightClass =
    size === "lg"
      ? "h-12 sm:h-14 lg:h-16 xl:h-20"
      : "h-10 sm:h-12 lg:h-14 xl:h-16";

  const img = (
    <img
      src={logo.src}
      alt={logo.name}
      loading="lazy"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className={`${heightClass} w-auto select-none transition-all duration-500 cursor-pointer`}
      style={{
        filter: hover
          ? "brightness(0) invert(1) opacity(1)"
          : "brightness(0) invert(1) opacity(0.55)",
        maxWidth: "none",
      }}
    />
  );

  /* When the brand has a confirmed website, the logo links to it
     (new tab) per Brandi's new-PDF page 5. Logos without a URL yet
     stay as plain images until the client sends the full list. */
  if (logo.website) {
    return (
      <a
        href={logo.website}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Visit ${logo.name}`}
        className="inline-block"
      >
        {img}
      </a>
    );
  }
  return img;
}

/* ──────────────────────────────────────────────────────────────────── */
/*  MarqueeRow - infinite horizontal scroll with magnetic logos inside  */
/* ──────────────────────────────────────────────────────────────────── */
function MarqueeRow({
  logos,
  direction = "left",
  speedSec = 50,
  size = "lg",
}: {
  logos: ClientLogo[];
  direction?: "left" | "right";
  speedSec?: number;
  size?: "lg" | "sm";
}) {
  /* Duplicate the list so the marquee loops seamlessly */
  const repeated = [...logos, ...logos, ...logos];
  const fromX = direction === "left" ? "0%" : "-66.6667%";
  const toX = direction === "left" ? "-66.6667%" : "0%";

  return (
    <div className="overflow-hidden py-4">
      <motion.div
        className="flex items-center gap-10 sm:gap-14 lg:gap-16 xl:gap-20 whitespace-nowrap"
        animate={{ x: [fromX, toX] }}
        transition={{ duration: speedSec, repeat: Infinity, ease: "linear" }}
        style={{ width: "max-content", willChange: "transform" }}
      >
        {repeated.map((logo, idx) => (
          <MagneticItem key={`${logo.name}-${idx}`} strength={0.3}>
            <LogoItem logo={logo} size={size} />
          </MagneticItem>
        ))}
      </motion.div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────── */
/*  Section wrapper                                                     */
/* ──────────────────────────────────────────────────────────────────── */
export function FriendsMarqueeSection() {
  /* Top row - priority logos (Brandi's top 20)
     Bottom row - remaining logos */
  const rowA = priorityClientLogos;
  const rowB = clientLogos.filter((l) => !l.priority);

  return (
    <section className="py-20 sm:py-28 bg-dark relative overflow-hidden">
      {/* Soft glow blobs in background - warmer accents on the dark theme */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[28rem] h-[28rem] bg-amber-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-[28rem] h-[28rem] bg-white/20 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10">
        {/* Section header - center. Per Brandi's new-PDF page 5:
            small eyebrow 'BRANDS WE ARE' above the big 'TRUSTED BY'
            (reads 'BRANDS WE ARE TRUSTED BY'). Replaces the old
            'Brands We've Worked With' / 'OUR FRIENDS' pairing. */}
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 text-center mb-10 sm:mb-14">
          <p className="text-xs sm:text-sm font-semibold tracking-[0.3em] text-white/50 uppercase mb-3 sm:mb-4">
            Brands We Are
          </p>
          <h2 className="font-display text-6xl sm:text-7xl md:text-8xl lg:text-[105px] xl:text-[132px] text-white tracking-tight leading-none">
            TRUSTED BY
          </h2>
        </div>

        {/* Two marquee rows - opposite directions, larger logos on top.
            Speeds slowed WAY down per Brandi's new-PDF page 5
            (55s/65s -> 130s/150s) so the logos drift gently. */}
        <div className="space-y-2 sm:space-y-4">
          <MarqueeRow logos={rowA} direction="left"  speedSec={130} size="lg" />
          {/* Thin divider line - light variant for the dark background */}
          <div className="h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
          <MarqueeRow logos={rowB} direction="right" speedSec={150} size="sm" />
        </div>
      </div>
    </section>
  );
}
