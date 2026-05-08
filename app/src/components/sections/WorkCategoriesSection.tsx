import { useState } from "react";
import { ArrowRight } from "lucide-react";

/* ════════════════════════════════════════════════════════════════════
   THE WORK — nine static category tiles (mixed Photography +
   Videography), arranged in a 3x3 grid on lg+ and 2-col on mobile.

   Brandi's 5/7/26 review notes for this section (page 8):
     • Replace description with: 'Browse our photography and videography
       by industry — fashion/editorial, performing arts, retail,
       industrial, documentary and more.'
     • Tile list (in this exact order):
         P/Retail · V/Retail · P/The Arts · V/The Arts · P/Fashion ·
         V/Documentary · P/Industrial · V/Industrial · V/Narrative

   The previous expanding-accordion-band layout (4 photography-only
   tiles) was replaced on 2026-05-08. With nine tiles a 3-column grid
   reads cleaner than narrow accordion bands, and the static 4:5
   aspect tiles visually match THE CAMPAIGN section directly above.
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
/*  Single tile — 4:5 aspect, click-to-navigate, static hover           */
/* ──────────────────────────────────────────────────────────────────── */
function WorkTileCard({ tile, onClick }: { tile: WorkTile; onClick: () => void }) {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative overflow-hidden text-left aspect-[3/4] sm:aspect-[4/5] min-w-0 w-full"
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
/*  Section wrapper                                                     */
/* ──────────────────────────────────────────────────────────────────── */
export function WorkCategoriesSection({ onSeeMoreClick }: WorkCategoriesSectionProps) {
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

        {/* 3x3 grid on lg+, 2-column grid on mobile / sm. Tile order
            follows Brandi's exact spec on page 8 of her review notes. */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3 lg:gap-4">
          {WORK_TILES.map((tile) => (
            <WorkTileCard
              key={tile.id}
              tile={tile}
              onClick={() => navigate(tile.href)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
