import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";

/* ════════════════════════════════════════════════════════════════════
   THE CAMPAIGN — featured campaigns shown as alternating image+video
   leaf cards.

   Desktop (lg+): the section is pinned to the viewport and a
   horizontal strip of cards translates left as the user scrolls
   vertically — every leaf card passes through the centre of the
   viewport before the page continues to THE WORK section.

   Mobile / tablet: pinning is disabled (it conflicts with touch
   scrolling); the strip is a regular swipeable horizontal scroller.
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
  /** Vimeo privacy hash — required for Brandi's private videos.
   *  Without this the hover iframe shows "Private video" error. */
  vimeoHash?: string;
  slug: string;
};

/* Latest assets per campaign (refreshed 2026-05-07).
   Each campaign has TWO cards:
     • image card  → a hero photo from Brandi's most recent delivery
     • video card  → the most recent video from Brandi's catalog,
                     thumbnail = a real campaign photo so private-video
                     vumbnail.com 404s never appear before hover.

   Local thumbnails come from app/public/images/campaigns/<slug>/. */
const CAMPAIGN_CARDS: CampaignCard[] = [
  // Deutsch — image: 2025 Holiday signature piece, video: BTS at the shoot
  { id: "deutsch-img",  label: "DEUTSCH FINE JEWELRY", type: "image", image: "/images/campaigns/deutsch/deutsch-2025-holiday-485.jpg", slug: "deutsch" },
  { id: "deutsch-vid",  label: "DEUTSCH FINE JEWELRY", type: "video", image: "/images/campaigns/deutsch/deutsch-brandi-871.jpg",       vimeoId: "1147057440", slug: "deutsch" },

  // Weissman — image: latest cover styling, video: Spring 2026 (the newest season Brandi delivered)
  { id: "weissman-img", label: "WEISSMAN ELITE",       type: "image", image: "/images/campaigns/weissman/weissman-01.jpg",  slug: "weissman" },
  { id: "weissman-vid", label: "WEISSMAN ELITE",       type: "video", image: "/images/campaigns/weissman/weissman-06.jpg",  vimeoId: "1145783498", vimeoHash: "6e07bd9e26", slug: "weissman" },

  // Eye Gallery — image: Aug 2025 cover, video: Summer 2025 Campaign Ad (most recent finished spot)
  { id: "eye-img",      label: "THE EYE GALLERY",      type: "image", image: "/images/campaigns/eye-gallery/eye-gallery-01.jpg", slug: "eye-gallery" },
  { id: "eye-vid",      label: "THE EYE GALLERY",      type: "video", image: "/images/campaigns/eye-gallery/eye-gallery-05.jpg", vimeoId: "1145748255", slug: "eye-gallery" },

  // Monarch — image: Gala 25 venue wide, video: Transforming Lives 25-26 (the newest annual film)
  { id: "monarch-img",  label: "THE MONARCH SCHOOL",   type: "image", image: "/images/campaigns/monarch/monarch-09.jpg", slug: "monarch-school" },
  { id: "monarch-vid",  label: "THE MONARCH SCHOOL",   type: "video", image: "/images/campaigns/monarch/monarch-10.jpg", vimeoId: "1151967437", vimeoHash: "000a715e4a", slug: "monarch-school" },
];

/* Card sizing — bumped on 2026-05-07 per user request to make cards
   feel taller and more poster-like. Compact width also bumped so
   the strip becomes wider than the viewport, which gives the
   pinned horizontal scroll something meaningful to translate. */
const COMPACT_W = "clamp(160px, 17vw, 240px)";
const HOVERED_W = "clamp(320px, 30vw, 420px)";
const CARD_H    = "clamp(460px, 56vw, 640px)";

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
        width: isVideo && isHovered ? HOVERED_W : COMPACT_W,
        height: CARD_H,
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
            src={`https://player.vimeo.com/video/${card.vimeoId}?autoplay=1&muted=1&loop=1&title=0&byline=0&portrait=0&controls=0${
              card.vimeoHash ? `&h=${card.vimeoHash}` : ""
            }`}
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
/*  Section wrapper — pinned horizontal scroll on lg+, swipe on mobile  */
/* ──────────────────────────────────────────────────────────────────── */
export function CampaignSection({ onProjectClick }: CampaignSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const stripRef = useRef<HTMLDivElement>(null);
  const [translateRange, setTranslateRange] = useState(0);

  /* Measure the strip and figure out how far it must translate so
     the LAST card lines up with the right edge of the viewport. We
     re-measure on resize and whenever the strip's intrinsic width
     changes (e.g. a card's hover-expand). */
  useEffect(() => {
    const measure = () => {
      const isDesktop = window.innerWidth >= 1024;
      if (!isDesktop || !stripRef.current) {
        setTranslateRange(0);
        return;
      }
      const stripW = stripRef.current.scrollWidth;
      const viewW = window.innerWidth;
      // 80px buffer so the last card has a small gap from the right edge
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

  /* Spring softens the mapping so the cards glide rather than snapping
     to scroll position — feels cinematic, less mechanical. */
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 28,
    mass: 0.6,
  });

  const x = useTransform(smoothProgress, [0, 1], [0, -translateRange]);

  return (
    <section
      ref={sectionRef}
      id="campaign"
      className="relative bg-cream lg:h-[300vh]"
    >
      {/* On desktop this inner container is sticky and pinned to the
          viewport for the duration of the 300vh runway. On mobile the
          sticky/h-screen classes drop, the section becomes a normal
          flow block, and the strip swipes horizontally on touch. */}
      <div className="lg:sticky lg:top-0 lg:h-screen lg:flex lg:flex-col lg:justify-center lg:overflow-hidden py-20 sm:py-28 lg:py-0">
        {/* Header */}
        <div className="max-w-[1800px] mx-auto w-full px-4 sm:px-6 lg:px-10 mb-12 sm:mb-14 lg:mb-16">
          <div className="flex items-end justify-between flex-wrap gap-6">
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
            <p className="hidden lg:block text-xs font-semibold tracking-[0.3em] text-dark/40 uppercase">
              Scroll to explore →
            </p>
          </div>
        </div>

        {/* Horizontal strip — translates with scroll on lg+, swipe on mobile */}
        <div className="overflow-x-auto lg:overflow-hidden leaf-scroll">
          <motion.div
            ref={stripRef}
            style={{ x }}
            className="flex gap-4 sm:gap-6 px-4 sm:px-6 lg:px-10 pb-6 lg:pb-0 will-change-transform"
          >
            {CAMPAIGN_CARDS.map((c, i) => (
              <LeafCard
                key={c.id}
                card={c}
                index={i}
                onClick={() => onProjectClick(c.slug)}
              />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
