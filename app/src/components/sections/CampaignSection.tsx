import { useState } from "react";

/* ════════════════════════════════════════════════════════════════════
   THE CAMPAIGN — featured campaigns shown as four static 4:5 cards.

   Brandi's 5/7/26 review notes for this section:
     • "No more leaf cuts. Match the same 4:5 you have under 'the work'
       on next page."
     • "Only 4 campaigns should show here." (one card per campaign,
       not the previous image+video pair × 4 = 8.)
     • New description copy provided.

   The earlier scroll-pinned horizontal strip + leaf-shaped cards +
   hover-expand video preview were all replaced on 2026-05-08. The
   layout now visually mirrors THE WORK accordion bands so the two
   sections feel like a matched pair, but without the expand-on-hover
   behaviour (per user direction: static cards, click navigates).
   ════════════════════════════════════════════════════════════════════ */

interface CampaignSectionProps {
  onProjectClick: (slug: string) => void;
}

type CampaignCard = {
  id: string;
  label: string;
  /** Hero image — one per campaign, matching the 4:5 aspect well */
  image: string;
  /** Project slug used to navigate to the campaign detail page */
  slug: string;
};

const CAMPAIGN_CARDS: CampaignCard[] = [
  {
    id: "deutsch",
    label: "DEUTSCH FINE JEWELRY",
    image: "/images/campaigns/deutsch/deutsch-2025-holiday-485.jpg",
    slug: "deutsch",
  },
  {
    id: "weissman",
    label: "WEISSMAN ELITE",
    image: "/images/campaigns/weissman/weissman-01.jpg",
    slug: "weissman",
  },
  {
    id: "eye-gallery",
    label: "THE EYE GALLERY",
    image: "/images/campaigns/eye-gallery/eye-gallery-01.jpg",
    slug: "eye-gallery",
  },
  {
    id: "monarch-school",
    label: "THE MONARCH SCHOOL",
    image: "/images/campaigns/monarch/monarch-09.jpg",
    slug: "monarch-school",
  },
];

/* ──────────────────────────────────────────────────────────────────── */
/*  Single campaign card — 4:5 aspect, click-to-navigate, no expand     */
/* ──────────────────────────────────────────────────────────────────── */
function CampaignCardTile({
  card,
  index,
  onClick,
}: {
  card: CampaignCard;
  index: number;
  onClick: () => void;
}) {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative overflow-hidden text-left aspect-[3/4] sm:aspect-[4/5] lg:aspect-auto lg:h-[68vh] min-w-0 w-full"
    >
      {/* Image with slow zoom on hover */}
      <img
        src={card.image}
        alt={card.label}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1100ms] ease-out"
        style={{ transform: isHovered ? "scale(1.06)" : "scale(1)" }}
      />

      {/* Top-and-bottom darken so big white type stays legible
          regardless of underlying image brightness */}
      <div
        className="absolute inset-0 transition-opacity duration-500 pointer-events-none"
        style={{
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.10) 35%, rgba(0,0,0,0.20) 65%, rgba(0,0,0,0.80) 100%)",
        }}
      />

      {/* Editorial number + Featured tag at top */}
      <div className="absolute top-5 left-5 sm:top-7 sm:left-7 lg:top-9 lg:left-9">
        <p
          className="font-display text-3xl sm:text-4xl lg:text-5xl xl:text-6xl tracking-tight transition-colors duration-500"
          style={{ color: isHovered ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.55)" }}
        >
          0{index + 1}
        </p>
        <p className="text-[10px] sm:text-xs font-semibold tracking-[0.3em] text-white/55 uppercase mt-2">
          Featured
        </p>
      </div>

      {/* Bottom — campaign name */}
      <div className="absolute inset-x-0 bottom-0 p-5 sm:p-7 lg:p-9">
        <h3
          className="font-display text-2xl sm:text-3xl lg:text-4xl xl:text-5xl text-white tracking-tight uppercase leading-[0.95]"
          style={{
            letterSpacing: isHovered ? "0.01em" : "0",
            transition: "letter-spacing 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          {card.label}
        </h3>
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
export function CampaignSection({ onProjectClick }: CampaignSectionProps) {
  return (
    <section id="campaign" className="py-20 sm:py-28 bg-cream relative">
      <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-10">
        {/* Header */}
        <div className="flex items-end justify-between mb-12 sm:mb-16 flex-wrap gap-6">
          <div>
            {/* 'Featured / 01' eyebrow removed 2026-05-12 per user request. */}
            <h2 className="font-display text-5xl sm:text-7xl lg:text-8xl text-dark tracking-tight leading-[0.9]">
              CAMPAIGNS
            </h2>
            <p className="text-base sm:text-lg text-dark/60 max-w-xl mt-4">
              A deeper dive into brand-defining campaigns, highlighting the
              full scale of work — creative production, execution, and
              overall campaign impact.
            </p>
          </div>
        </div>

        {/* Four campaign tiles — full row width on lg+, 2x2 grid on mobile.
            Aspect class set to match THE WORK section exactly, so the two
            sections read as a visually-matched pair on the home page. */}
        <div className="grid grid-cols-2 gap-2 sm:gap-3 lg:flex lg:flex-row lg:gap-3 lg:items-stretch">
          {CAMPAIGN_CARDS.map((card, i) => (
            <CampaignCardTile
              key={card.id}
              card={card}
              index={i}
              onClick={() => onProjectClick(card.slug)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
