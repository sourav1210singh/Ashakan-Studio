import { useState, useEffect, useRef } from "react";

/* ════════════════════════════════════════════════════════════════════
   THE CAMPAIGN — featured campaigns shown as alternating image+video
   leaf cards. Approved on /test/work-split/ before promotion to home.
   ════════════════════════════════════════════════════════════════════ */

interface CampaignSectionProps {
  onProjectClick: (slug: string) => void;
}

type CampaignCard = {
  id: string;
  label: string;
  type: "image" | "video";
  image: string;
  vimeoId?: string;
  slug: string;
};

const CAMPAIGN_CARDS: CampaignCard[] = [
  { id: "deutsch-img",  label: "DEUTSCH FINE JEWELRY", type: "image", image: "/images/portfolio/deutsch-jewelry.jpg",         slug: "deutsch" },
  { id: "deutsch-vid",  label: "DEUTSCH FINE JEWELRY", type: "video", image: "/images/portfolio/deutsch-jewelry.jpg",         slug: "deutsch" },
  { id: "weissman-img", label: "WEISSMAN ELITE",       type: "image", image: "/images/portfolio/weissman-elite.jpg",          slug: "weissman" },
  { id: "weissman-vid", label: "WEISSMAN ELITE",       type: "video", image: "https://vumbnail.com/950064546_large.jpg",      vimeoId: "950064546", slug: "weissman" },
  { id: "eye-img",      label: "THE EYE GALLERY",      type: "image", image: "/images/portfolio/eye-gallery.jpg",             slug: "eye-gallery" },
  { id: "eye-vid",      label: "THE EYE GALLERY",      type: "video", image: "https://vumbnail.com/529432034_large.jpg",      vimeoId: "529432034", slug: "eye-gallery" },
  { id: "monarch-img",  label: "THE MONARCH SCHOOL",   type: "image", image: "/images/portfolio/8-4Q7A9046-2.jpeg",           slug: "monarch-school" },
  { id: "monarch-vid",  label: "THE MONARCH SCHOOL",   type: "video", image: "https://vumbnail.com/896674527_large.jpg",      vimeoId: "896674527", slug: "monarch-school" },
];

/* ──────────────────────────────────────────────────────────────────── */
/*  Leaf card — alternating border-radius + hover video for video cards */
/* ──────────────────────────────────────────────────────────────────── */
function LeafCard({
  card,
  index,
  onClick,
}: {
  card: CampaignCard;
  index: number;
  onClick: () => void;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef<HTMLButtonElement>(null);
  const isVideo = card.type === "video" && !!card.vimeoId;

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.12 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const leafRadius =
    index % 2 === 0 ? "80px 6px 80px 6px" : "6px 80px 6px 80px";

  return (
    <button
      ref={cardRef}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative flex-shrink-0 text-left focus:outline-none"
      style={{
        width:
          isVideo && isHovered ? "clamp(280px, 26vw, 360px)" : "clamp(120px, 13vw, 180px)",
        height: "clamp(400px, 48vw, 540px)",
        borderRadius: leafRadius,
        overflow: "hidden",
        scrollSnapAlign: "start",
        opacity: isVisible ? 1 : 0,
        transform: isVisible
          ? `translateY(${isHovered ? "-4px" : "0px"})`
          : "translateY(40px)",
        transition: isVisible
          ? "width 0.5s cubic-bezier(0.16, 1, 0.3, 1), transform 0.3s ease-out, box-shadow 0.3s ease-out"
          : `opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${index * 0.1}s, transform 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${index * 0.1}s`,
        boxShadow: isHovered
          ? "0 24px 56px rgba(0,0,0,0.18)"
          : "0 4px 24px rgba(0,0,0,0.08)",
        willChange: "transform, opacity, width",
      }}
    >
      <img
        src={card.image}
        alt={card.label}
        className="absolute inset-0 w-full h-full object-cover"
        style={{
          transition: "transform 0.7s ease-out",
          transform: isHovered && !isVideo ? "scale(1.06)" : "scale(1)",
        }}
      />

      {isVideo && isHovered && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <iframe
            src={`https://player.vimeo.com/video/${card.vimeoId}?autoplay=1&muted=1&loop=1&title=0&byline=0&portrait=0&controls=0`}
            className="absolute pointer-events-none"
            style={{
              top: "50%",
              left: "50%",
              width: "300%",
              height: "300%",
              transform: "translate(-50%, -50%)",
            }}
            frameBorder="0"
            allow="autoplay"
            title={card.label}
          />
        </div>
      )}

      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `linear-gradient(180deg, transparent 30%, rgba(0,0,0,${isHovered ? 0.55 : 0.3}) 100%)`,
          transition: "background 0.4s ease-out",
        }}
      />

      {card.type === "video" && (
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/80 flex items-center justify-center transition-opacity duration-300 pointer-events-none"
          style={{ opacity: isHovered ? 0 : 1 }}
        >
          <div className="w-0 h-0 border-t-[7px] border-t-transparent border-l-[12px] border-l-dark border-b-[7px] border-b-transparent ml-1" />
        </div>
      )}

      <div className="absolute bottom-8 right-3 pointer-events-none">
        <span
          className="font-display text-white text-lg lg:text-xl tracking-[0.15em] uppercase"
          style={{
            writingMode: "vertical-rl",
            textOrientation: "mixed",
            opacity: isHovered ? 1 : 0.9,
            transition: "opacity 0.3s ease-out",
          }}
        >
          {card.label}
        </span>
      </div>
    </button>
  );
}

/* ──────────────────────────────────────────────────────────────────── */
/*  Section wrapper                                                     */
/* ──────────────────────────────────────────────────────────────────── */
export function CampaignSection({ onProjectClick }: CampaignSectionProps) {
  return (
    <section id="campaign" className="py-20 sm:py-28 bg-cream">
      <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-10">
        {/* Header */}
        <div className="flex items-end justify-between mb-12 sm:mb-16">
          <div>
            <p className="text-xs font-semibold tracking-[0.3em] text-dark/50 uppercase mb-3">
              Featured / 01
            </p>
            <h2 className="font-display text-5xl sm:text-7xl lg:text-8xl text-dark tracking-tight leading-[0.9]">
              THE CAMPAIGN
            </h2>
            <p className="text-base sm:text-lg text-dark/60 max-w-xl mt-4">
              Brand-defining campaigns we've produced end-to-end —
              photography, videography, and creative direction in one body of work.
            </p>
          </div>
        </div>

        {/* Horizontal scroll strip */}
        <div
          className="flex gap-4 sm:gap-6 overflow-x-auto pb-6 leaf-scroll"
          style={{ scrollSnapType: "x mandatory" }}
        >
          {CAMPAIGN_CARDS.map((c, i) => (
            <LeafCard
              key={c.id}
              card={c}
              index={i}
              onClick={() => onProjectClick(c.slug)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
