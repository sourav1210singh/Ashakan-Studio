import { useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

/* ════════════════════════════════════════════════════════════════════
   THE WORK — photography portfolio category tiles. Different visual
   treatment from THE CAMPAIGN (rectangular tiles vs leaf cards) so
   the two sections feel distinct. Approved on /test/work-split/.
   ════════════════════════════════════════════════════════════════════ */

interface WorkCategoriesSectionProps {
  onSeeMoreClick?: () => void;
}

type WorkCard = {
  id: string;
  label: string;
  image: string;
  href: string;
};

const WORK_CARDS: WorkCard[] = [
  { id: "fashion",    label: "FASHION",     image: "/images/categories/fashion/citybook-2024-1000.jpg",            href: "/work/photography/fashion/" },
  { id: "the-arts",   label: "THE ARTS",    image: "/images/categories/the-arts/lauren-anderson-2490-edit.jpg",    href: "/work/photography/the-arts/" },
  { id: "retail",     label: "RETAIL",      image: "/images/categories/retail/mustang-095.jpg",                    href: "/work/photography/retail/" },
  { id: "industrial", label: "INDUSTRIAL",  image: "/images/categories/industrial/venus-aerospace-24443-edit.jpg", href: "/work/photography/industrial/" },
];

/* ──────────────────────────────────────────────────────────────────── */
/*  Work category tile — wider rectangular, distinct from leaf cards    */
/* ──────────────────────────────────────────────────────────────────── */
function WorkTile({
  card,
  index,
  onClick,
}: {
  card: WorkCard;
  index: number;
  onClick: () => void;
}) {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative overflow-hidden text-left flex-shrink-0"
      style={{
        width: "clamp(220px, 22vw, 280px)",
        height: "clamp(300px, 32vw, 360px)",
        boxShadow: isHovered
          ? "0 24px 56px rgba(0,0,0,0.18)"
          : "0 4px 24px rgba(0,0,0,0.08)",
        transform: isHovered ? "translateY(-4px)" : "translateY(0)",
        transition:
          "transform 0.4s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.4s ease-out",
      }}
    >
      <img
        src={card.image}
        alt={card.label}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out"
        style={{ transform: isHovered ? "scale(1.06)" : "scale(1)" }}
      />
      <div
        className="absolute inset-0 transition-colors duration-500"
        style={{
          background: `linear-gradient(180deg, rgba(0,0,0,${isHovered ? 0.4 : 0.25}) 0%, rgba(0,0,0,${isHovered ? 0.7 : 0.55}) 100%)`,
        }}
      />
      <div className="absolute inset-x-0 bottom-0 p-6">
        <p className="text-[10px] font-semibold tracking-[0.3em] text-white/70 uppercase mb-2">
          0{index + 1} / Photography
        </p>
        <p className="font-display text-2xl lg:text-3xl text-white tracking-tight">
          {card.label}
        </p>
      </div>
    </button>
  );
}

/* ──────────────────────────────────────────────────────────────────── */
/*  Section wrapper                                                     */
/* ──────────────────────────────────────────────────────────────────── */
export function WorkCategoriesSection({ onSeeMoreClick }: WorkCategoriesSectionProps) {
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

        {/* Horizontal scroll strip */}
        <div className="flex gap-4 sm:gap-6 overflow-x-auto pb-6 leaf-scroll">
          {WORK_CARDS.map((card, i) => (
            <WorkTile
              key={card.id}
              card={card}
              index={i}
              onClick={() => {
                window.history.pushState(null, "", card.href);
                window.dispatchEvent(new PopStateEvent("popstate"));
              }}
            />
          ))}
        </div>

        {/* Helper hint for desktop users — scroll cue */}
        <div className="hidden sm:flex items-center gap-3 text-xs font-medium tracking-widest text-white/40 uppercase mt-8">
          <ArrowLeft className="w-4 h-4" />
          Scroll horizontally to explore
          <ArrowRight className="w-4 h-4" />
        </div>
      </div>
    </section>
  );
}
