import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { scrollToTopInstant } from "@/lib/scroll";
import { AppLink } from "@/components/AppLink";

/* ════════════════════════════════════════════════════════════════════
   THE CAMPAIGN - featured campaigns shown as four static 4:5 cards.

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
  /** Hero image - one per campaign, matching the 4:5 aspect well */
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
  /* Order: Eye Gallery before Weissman, and new covers per Ashkan 6/12. */
  {
    id: "eye-gallery",
    label: "THE EYE GALLERY",
    image: "/images/campaigns/eye-gallery/eye-gallery-cover-home.jpg",
    slug: "eye-gallery",
  },
  {
    id: "weissman",
    label: "WEISSMAN ELITE",
    image: "/images/campaigns/weissman/weissman-cover-home.jpg",
    slug: "weissman",
  },
  {
    id: "monarch-school",
    label: "THE MONARCH SCHOOL",
    image: "/images/campaigns/monarch/monarch-cover-home.jpg",
    slug: "monarch-school",
  },
];

/* ──────────────────────────────────────────────────────────────────── */
/*  Single campaign card - 4:5 aspect, click-to-navigate, no expand     */
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
    <AppLink
      href={`/work/campaigns/${card.slug}/`}
      onNav={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative block overflow-hidden text-left aspect-[3/4] sm:aspect-[4/5] lg:aspect-auto lg:h-[68vh] min-w-0 w-full"
    >
      {/* Image with slow zoom on hover */}
      <img
        src={card.image}
        alt={card.label}
        loading="lazy"
        decoding="async"
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

      {/* Bottom - campaign name */}
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

      {/* Hairline accent at top - brightens on hover */}
      <span
        className="absolute top-0 left-0 right-0 h-px transition-colors duration-500 pointer-events-none"
        style={{ backgroundColor: isHovered ? "rgba(255,255,255,0.55)" : "rgba(255,255,255,0.12)" }}
      />
    </AppLink>
  );
}

/* ──────────────────────────────────────────────────────────────────── */
/*  Section wrapper                                                     */
/* ──────────────────────────────────────────────────────────────────── */
export function CampaignSection({ onProjectClick }: CampaignSectionProps) {
  return (
    <section id="campaign" className="py-20 sm:py-28 bg-cream relative overflow-hidden">
      <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-10">
        {/* Header - Brandi new-PDF page 3:
            • paragraph moved ABOVE the heading
            • CAMPAIGNS made WAY larger (still dark)
            • slide-in funky entrance on the word (scroll-triggered) */}
        <div className="mb-12 sm:mb-16">
          <p className="text-base sm:text-lg text-dark/60 max-w-xl mb-5 sm:mb-7">
            A deeper dive into brand-defining campaigns, highlighting the
            full scale of work - creative production, execution, and
            overall campaign impact.
          </p>
          <motion.h2
            initial={{ opacity: 0, x: -120, skewX: 8 }}
            whileInView={{ opacity: 1, x: 0, skewX: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="font-display text-7xl sm:text-8xl lg:text-9xl xl:text-[150px] text-dark tracking-tight leading-[0.85]"
          >
            CAMPAIGNS
          </motion.h2>
        </div>

        {/* Four campaign tiles - full row width on lg+, 2x2 grid on mobile.
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

        {/* Call to action - Brandi new-PDF page 3: 'add a Call to Action
            + button with Get in Touch that leads to the contact page,
            whatever works best wording wise for SEO'. */}
        <div className="mt-12 sm:mt-16 flex flex-col items-center text-center">
          <p className="text-base sm:text-lg lg:text-xl text-dark/70 max-w-2xl mb-6">
            Ready to create a campaign that defines your brand? Partner with
            our Houston photography and video team to bring your next story to life.
          </p>
          <AppLink
            href="/contact/"
            onNav={() => {
              window.history.pushState(null, "", "/contact/");
              window.dispatchEvent(new PopStateEvent("popstate"));
              scrollToTopInstant();
            }}
            className="group inline-flex items-center gap-3 px-7 sm:px-9 py-3.5 sm:py-4 bg-dark text-white font-medium tracking-[0.2em] text-xs sm:text-sm uppercase hover:bg-dark/90 transition-colors duration-300 cursor-pointer"
          >
            Get in Touch
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </AppLink>
        </div>
      </div>
    </section>
  );
}
