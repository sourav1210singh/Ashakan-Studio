import { useState, useEffect, useRef } from "react";
import { ArrowRight } from "lucide-react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";

/* ════════════════════════════════════════════════════════════════════
   THE WORK — nine static category tiles (mixed Photography +
   Videography), arranged in a single horizontal row.

   Brandi's 5/7/26 review notes for this section (page 8):
     • Tile list (in this exact order):
         P/Retail · V/Retail · P/The Arts · V/The Arts · P/Fashion ·
         V/Documentary · P/Industrial · V/Industrial · V/Narrative
     • Description copy provided.

   Layout (rebuilt 2026-05-08 per user request):
     • Desktop (lg+): scroll-pinned horizontal strip — section is
       sticky to the viewport while the row of 9 tiles translates
       left as the user scrolls vertically. Every tile passes the
       centre of the screen before the page continues.
     • Mobile / tablet: regular swipeable horizontal scroller
       (sticky pinning conflicts with touch scrolling).
   ════════════════════════════════════════════════════════════════════ */

interface WorkCategoriesSectionProps {
  onSeeMoreClick?: () => void;
}

type WorkTile = {
  id: string;
  /** PHOTOGRAPHY or VIDEOGRAPHY — shown as a small caps tag at top */
  type: "PHOTOGRAPHY" | "VIDEOGRAPHY";
  /** Category label shown big at the bottom of the tile */
  category: string;
  /** One-line teaser shown subtly on hover */
  description: string;
  image: string;
  href: string;
};

const WORK_TILES: WorkTile[] = [
  // P/Retail
  {
    id: "photo-retail",
    type: "PHOTOGRAPHY",
    category: "RETAIL",
    description: "Editorial product and lifestyle imagery for premium retail brands.",
    image: "/images/categories/retail/mustang-095.jpg",
    href: "/work/photography/retail/",
  },
  // V/Retail
  {
    id: "video-retail",
    type: "VIDEOGRAPHY",
    category: "RETAIL",
    description: "Brand films and product motion for retail clients.",
    image: "/images/categories/retail/296gtb-070.jpg",
    href: "/work/videography/retail/",
  },
  // P/The Arts
  {
    id: "photo-the-arts",
    type: "PHOTOGRAPHY",
    category: "THE ARTS",
    description: "Performance and portrait photography for dancers, musicians, and artists.",
    image: "/images/categories/the-arts/lauren-anderson-2490-edit.jpg",
    href: "/work/photography/the-arts/",
  },
  // V/The Arts
  {
    id: "video-the-arts",
    type: "VIDEOGRAPHY",
    category: "THE ARTS",
    description: "Cinematic videography of performances, dance, and artistic expression.",
    image: "/images/categories/the-arts/_east-side-perfromming-art-584-edit.jpg",
    href: "/work/videography/the-arts/",
  },
  // P/Fashion
  {
    id: "photo-fashion",
    type: "PHOTOGRAPHY",
    category: "FASHION",
    description: "Editorial fashion stories with cinematic light and bold styling.",
    image: "/images/categories/fashion/citybook-2024-1000.jpg",
    href: "/work/photography/fashion/",
  },
  // V/Documentary
  {
    id: "video-documentary",
    type: "VIDEOGRAPHY",
    category: "DOCUMENTARY",
    description: "Mission-driven storytelling for nonprofits, organizations, and communities.",
    image: "/images/portfolio/8-4Q7A9046-2.jpeg",
    href: "/work/videography/documentary/",
  },
  // P/Industrial
  {
    id: "photo-industrial",
    type: "PHOTOGRAPHY",
    category: "INDUSTRIAL",
    description: "Clean, purposeful imagery for industrial and corporate brands.",
    image: "/images/categories/industrial/venus-aerospace-24443-edit.jpg",
    href: "/work/photography/industrial/",
  },
  // V/Industrial
  {
    id: "video-industrial",
    type: "VIDEOGRAPHY",
    category: "INDUSTRIAL",
    description: "Corporate, medical, and industrial videography that highlights process and precision.",
    image: "/images/categories/industrial/2venus-aerospace-24470-2.jpg",
    href: "/work/videography/industrial/",
  },
  // V/Narrative
  {
    id: "video-narrative",
    type: "VIDEOGRAPHY",
    category: "NARRATIVE",
    description: "Story-driven short films and brand narratives for organizations.",
    image: "/images/categories/industrial/4q7a0824.jpg",
    href: "/work/videography/narrative/",
  },
];

/* ──────────────────────────────────────────────────────────────────── */
/*  Single tile — 4:5 aspect, fixed width inside the strip              */
/* ──────────────────────────────────────────────────────────────────── */
function WorkTileCard({ tile, onClick }: { tile: WorkTile; onClick: () => void }) {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative overflow-hidden text-left flex-shrink-0 aspect-[4/5]"
      style={{
        width: "clamp(240px, 22vw, 340px)",
        scrollSnapAlign: "start",
      }}
    >
      {/* Image with slow Ken-Burns zoom on hover */}
      <img
        src={tile.image}
        alt={`${tile.type} — ${tile.category}`}
        loading="lazy"
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1100ms] ease-out"
        style={{ transform: isHovered ? "scale(1.06)" : "scale(1)" }}
      />

      {/* Top + bottom dark gradient for white-text legibility */}
      <div
        className="absolute inset-0 transition-opacity duration-500 pointer-events-none"
        style={{
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.10) 35%, rgba(0,0,0,0.20) 65%, rgba(0,0,0,0.85) 100%)",
        }}
      />

      {/* Top-left — type tag (PHOTOGRAPHY / VIDEOGRAPHY) */}
      <div className="absolute top-5 left-5 sm:top-6 sm:left-6 lg:top-7 lg:left-7">
        <p
          className="text-[10px] sm:text-xs font-semibold tracking-[0.3em] uppercase transition-colors duration-500"
          style={{ color: isHovered ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.7)" }}
        >
          {tile.type}
        </p>
      </div>

      {/* Bottom — big category name + description teaser */}
      <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6 lg:p-7">
        <h3
          className="font-display text-2xl sm:text-3xl lg:text-4xl text-white tracking-tight uppercase leading-[0.95]"
          style={{
            letterSpacing: isHovered ? "0.01em" : "0",
            transition: "letter-spacing 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          {tile.category}
        </h3>
        {/* Description — collapses to 0 height when not hovered */}
        <div
          className="overflow-hidden transition-all duration-[600ms] ease-out"
          style={{
            maxHeight: isHovered ? "5rem" : "0",
            opacity: isHovered ? 1 : 0,
          }}
        >
          <p className="text-xs sm:text-sm text-white/75 leading-snug mt-2 sm:mt-3">
            {tile.description}
          </p>
        </div>
      </div>

      {/* Hairline accent at top — brightens on hover */}
      <span
        className="absolute top-0 left-0 right-0 h-px transition-colors duration-500 pointer-events-none"
        style={{ backgroundColor: isHovered ? "rgba(255,255,255,0.55)" : "rgba(255,255,255,0.12)" }}
      />
    </button>
  );
}

/* ──────────────────────────────────────────────────────────────────── */
/*  Section wrapper — scroll-pinned horizontal strip on lg, swipe row   */
/*  on mobile / tablet                                                  */
/* ──────────────────────────────────────────────────────────────────── */
export function WorkCategoriesSection({ onSeeMoreClick }: WorkCategoriesSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const stripRef = useRef<HTMLDivElement>(null);
  const [translateRange, setTranslateRange] = useState(0);

  /* Measure the strip and figure out how far it must translate so the
     LAST tile lines up with the right edge of the viewport. We re-
     measure on resize and whenever the strip's intrinsic width changes. */
  useEffect(() => {
    const measure = () => {
      const isDesktop = window.innerWidth >= 1024;
      if (!isDesktop || !stripRef.current) {
        setTranslateRange(0);
        return;
      }
      const stripW = stripRef.current.scrollWidth;
      const viewW = window.innerWidth;
      // 80px buffer so the last tile has a small gap from the right edge
      setTranslateRange(Math.max(0, stripW - viewW + 80));
    };
    measure();
    window.addEventListener("resize", measure);
    let resizeObs: ResizeObserver | null = null;
    if (stripRef.current && typeof ResizeObserver !== "undefined") {
      resizeObs = new ResizeObserver(measure);
      resizeObs.observe(stripRef.current);
    }
    return () => {
      window.removeEventListener("resize", measure);
      resizeObs?.disconnect();
    };
  }, []);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  /* Spring-smoothed scroll progress so the strip glides instead of
     snapping to the raw scroll position. */
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 28,
    mass: 0.6,
  });

  const x = useTransform(smoothProgress, [0, 1], [0, -translateRange]);

  const navigate = (href: string) => {
    window.history.pushState(null, "", href);
    window.dispatchEvent(new PopStateEvent("popstate"));
  };

  return (
    <section
      ref={sectionRef}
      id="work"
      className="relative bg-dark lg:h-[400vh] mb-12 sm:mb-16 lg:mb-20"
    >
      {/* On desktop this inner is sticky and pinned for the duration of
          the 400vh runway. lg:pt-16 + lg:pb-12 gives the header a
          predictable position, the strip falls below with a known
          amount of space. On mobile the sticky/h-screen classes drop
          and the strip becomes a regular swipeable horizontal scroller. */}
      <div className="lg:sticky lg:top-0 lg:h-screen lg:flex lg:flex-col lg:overflow-hidden py-20 sm:py-28 lg:pt-16 lg:pb-12">
        {/* Header */}
        <div className="max-w-[1800px] mx-auto w-full px-4 sm:px-6 lg:px-10 mb-12 sm:mb-14 lg:mb-10">
          <div className="flex items-end justify-between flex-wrap gap-6">
            <div>
              <p className="text-xs font-semibold tracking-[0.3em] text-white/50 uppercase mb-3">
                Portfolio / 02
              </p>
              <h2 className="font-display text-5xl sm:text-7xl lg:text-8xl text-white tracking-tight leading-[0.9]">
                THE WORK
              </h2>
              <p className="text-base sm:text-lg text-white/60 max-w-xl mt-4">
                Browse our photography and videography by industry — fashion/editorial,
                performing arts, retail, industrial, documentary and more.
              </p>
            </div>
            {onSeeMoreClick && (
              <button
                onClick={onSeeMoreClick}
                className="group inline-flex items-center gap-3 text-sm font-semibold tracking-[0.3em] text-white hover:text-white/70 uppercase border-b border-white/40 hover:border-white/70 pb-1 transition-colors"
              >
                See All Work
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            )}
          </div>
        </div>

        {/* Horizontal strip — translates with scroll on lg+, swipe on mobile */}
        <div
          className="overflow-x-auto lg:overflow-hidden leaf-scroll"
          style={{ scrollSnapType: "x mandatory" }}
        >
          <motion.div
            ref={stripRef}
            style={{ x }}
            className="flex gap-3 sm:gap-4 px-4 sm:px-6 lg:px-10 pb-6 lg:pb-0 will-change-transform"
          >
            {WORK_TILES.map((tile) => (
              <WorkTileCard
                key={tile.id}
                tile={tile}
                onClick={() => navigate(tile.href)}
              />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
