import { useState } from "react";
import { ArrowRight } from "lucide-react";

/* ════════════════════════════════════════════════════════════════════
   THE WORK — premium expanding-band accordion of photography
   categories. Four bands fill the full container width on lg+; on
   hover one band expands and the others compress (cinematic
   Locomotive / Hello Monday style). On mobile this collapses to a
   simple 2×2 grid so the layout remains touch-friendly.

   This section was upgraded from a horizontal scroll strip on
   2026-05-07 to give it a more editorial, premium feel and to use
   the full container width (the previous strip left a lot of empty
   space on the right).
   ════════════════════════════════════════════════════════════════════ */

interface WorkCategoriesSectionProps {
  onSeeMoreClick?: () => void;
}

type WorkCard = {
  id: string;
  label: string;
  /** One-line teaser shown when the band expands on hover */
  description: string;
  image: string;
  href: string;
};

const WORK_CARDS: WorkCard[] = [
  {
    id: "fashion",
    label: "FASHION",
    description: "Editorial fashion stories with cinematic light and bold styling.",
    image: "/images/categories/fashion/citybook-2024-1000.jpg",
    href: "/work/photography/fashion/",
  },
  {
    id: "the-arts",
    label: "THE ARTS",
    description: "Performance and portrait work for dancers, musicians, and artists.",
    image: "/images/categories/the-arts/lauren-anderson-2490-edit.jpg",
    href: "/work/photography/the-arts/",
  },
  {
    id: "retail",
    label: "RETAIL",
    description: "Product and lifestyle imagery for premium retail brands.",
    image: "/images/categories/retail/mustang-095.jpg",
    href: "/work/photography/retail/",
  },
  {
    id: "industrial",
    label: "INDUSTRIAL",
    description: "Clean, purposeful visuals for industrial and corporate brands.",
    image: "/images/categories/industrial/venus-aerospace-24443-edit.jpg",
    href: "/work/photography/industrial/",
  },
];

/* ──────────────────────────────────────────────────────────────────── */
/*  Single accordion band — expands when hovered, compresses when      */
/*  another band is hovered                                             */
/* ──────────────────────────────────────────────────────────────────── */
function WorkBand({
  card,
  index,
  isHovered,
  anyHovered,
  onHoverChange,
  onClick,
}: {
  card: WorkCard;
  index: number;
  isHovered: boolean;
  anyHovered: boolean;
  onHoverChange: (h: boolean) => void;
  onClick: () => void;
}) {
  /* Flex grow values:
     - hovered band: 2.5 (takes up most of the row)
     - sibling when something else is hovered: 0.7 (compresses)
     - default state: 1 (equal share)                            */
  const flexGrow = isHovered ? 2.5 : anyHovered ? 0.7 : 1;

  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => onHoverChange(true)}
      onMouseLeave={() => onHoverChange(false)}
      className="group relative overflow-hidden text-left aspect-[3/4] sm:aspect-[4/5] lg:aspect-auto lg:h-[68vh] min-w-0 w-full"
      style={{
        flex: `${flexGrow} 1 0%`,
        transition: "flex 0.7s cubic-bezier(0.16, 1, 0.3, 1)",
      }}
    >
      {/* Image with slow Ken-Burns zoom on hover */}
      <img
        src={card.image}
        alt={card.label}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1100ms] ease-out"
        style={{ transform: isHovered ? "scale(1.06)" : "scale(1)" }}
      />

      {/* Dark gradient — top-and-bottom darken so big white type stays
          legible regardless of underlying image brightness */}
      <div
        className="absolute inset-0 transition-opacity duration-500 pointer-events-none"
        style={{
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.15) 35%, rgba(0,0,0,0.20) 65%, rgba(0,0,0,0.85) 100%)",
        }}
      />

      {/* Subtle vignette on the inactive bands so the active one pops */}
      <div
        className="absolute inset-0 bg-black pointer-events-none transition-opacity duration-500"
        style={{ opacity: anyHovered && !isHovered ? 0.35 : 0 }}
      />

      {/* Editorial content overlay */}
      <div className="absolute inset-0 flex flex-col justify-between p-5 sm:p-7 lg:p-9">
        {/* Top — oversized serif/display number with discipline tag */}
        <div>
          <p
            className="font-display text-4xl sm:text-5xl lg:text-6xl xl:text-7xl tracking-tight transition-colors duration-500"
            style={{ color: isHovered ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.45)" }}
          >
            0{index + 1}
          </p>
          <p className="text-[10px] sm:text-xs font-semibold tracking-[0.3em] text-white/55 uppercase mt-2">
            Photography
          </p>
        </div>

        {/* Bottom — label + reveal-on-hover description + arrow */}
        <div>
          <h3
            className="font-display text-2xl sm:text-3xl lg:text-4xl xl:text-5xl text-white tracking-tight uppercase leading-[0.95]"
            style={{
              transform: isHovered ? "translateY(0)" : "translateY(0)",
              letterSpacing: isHovered ? "0.01em" : "0",
              transition:
                "letter-spacing 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          >
            {card.label}
          </h3>

          {/* Description — collapses to 0 height when not hovered */}
          <div
            className="overflow-hidden transition-all duration-[600ms] ease-out"
            style={{
              maxHeight: isHovered ? "8rem" : "0",
              opacity: isHovered ? 1 : 0,
            }}
          >
            <p className="text-sm sm:text-base text-white/75 leading-snug mt-3 sm:mt-4 max-w-md">
              {card.description}
            </p>
            <div className="flex items-center gap-3 mt-4 text-[11px] font-semibold tracking-[0.3em] text-white uppercase">
              <span className="block w-8 h-px bg-white/70" />
              Explore
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>

      {/* Top-edge thin accent line that brightens on hover — gives
          each band a defined silhouette without a hard border */}
      <span
        className="absolute top-0 left-0 right-0 h-px transition-colors duration-500"
        style={{ backgroundColor: isHovered ? "rgba(255,255,255,0.55)" : "rgba(255,255,255,0.12)" }}
      />
    </button>
  );
}

/* ──────────────────────────────────────────────────────────────────── */
/*  Section wrapper                                                     */
/* ──────────────────────────────────────────────────────────────────── */
export function WorkCategoriesSection({ onSeeMoreClick }: WorkCategoriesSectionProps) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const navigate = (href: string) => {
    window.history.pushState(null, "", href);
    window.dispatchEvent(new PopStateEvent("popstate"));
  };

  return (
    <section id="work" className="py-20 sm:py-28 bg-dark relative">
      <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-10">
        {/* Header */}
        <div className="flex items-end justify-between mb-12 sm:mb-16 flex-wrap gap-6">
          <div>
            <p className="text-xs font-semibold tracking-[0.3em] text-white/50 uppercase mb-3">
              Portfolio / 02
            </p>
            <h2 className="font-display text-5xl sm:text-7xl lg:text-8xl text-white tracking-tight leading-[0.9]">
              THE WORK
            </h2>
            <p className="text-base sm:text-lg text-white/60 max-w-xl mt-4">
              Browse our photography by industry — fashion editorial,
              performing arts, retail product, and industrial.
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

        {/* Accordion bands — full row width, expand on hover.
            On lg+ this is a single horizontal flex row at 70vh height.
            Below lg it collapses to a 2-column grid that's still
            premium but works on touch (no accordion expand). */}
        <div
          className="grid grid-cols-2 gap-2 sm:gap-3 lg:flex lg:flex-row lg:gap-3 lg:items-stretch"
          onMouseLeave={() => setHoveredIdx(null)}
        >
          {WORK_CARDS.map((card, i) => (
            <WorkBand
              key={card.id}
              card={card}
              index={i}
              isHovered={hoveredIdx === i}
              anyHovered={hoveredIdx !== null}
              onHoverChange={(h) => setHoveredIdx(h ? i : null)}
              onClick={() => navigate(card.href)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
