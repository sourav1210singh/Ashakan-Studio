import { useState, useEffect, useRef } from "react";
import { ArrowRight } from "lucide-react";
import { portfolioItems } from "@/data/portfolio";
import { getProjectById } from "@/data/projects";

interface PortfolioSectionProps {
  onProjectClick: (slug: string) => void;
  onSeeMoreClick?: () => void;
}

/* ------------------------------------------------------------------ */
/*  Curated featured items for the flowing editorial strip             */
/* ------------------------------------------------------------------ */
const FEATURED_IDS = [
  "brandon-blackwood",
  "fashion",
  "vitacca-ballet",
  "deutsch-fine-jewelry",
  "audaja-skincare",
  "cecilia-duarte",
  "monarch-school",
  "elastique-athletics",
];

/* ------------------------------------------------------------------ */
/*  Leaf / Pill Card — Desktop & Tablet                                */
/*  Elongated vertical pill with hover image-swap + lift               */
/* ------------------------------------------------------------------ */
function LeafCard({
  item,
  index,
  onClick,
}: {
  item: (typeof portfolioItems)[0];
  index: number;
  onClick: () => void;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef<HTMLButtonElement>(null);

  /* Look up project for secondary gallery image */
  const project = getProjectById(item.id);
  const gallery = project?.gallery || [];
  const hasMultipleImages = gallery.length > 1;
  const secondaryImage = hasMultipleImages ? gallery[1].src : null;

  /* Scroll-triggered entrance */
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

  /* Staggered heights for organic rhythm */
  const heights = [420, 490, 440, 510, 460, 430, 500, 450];
  const cardHeight = heights[index % heights.length];

  /* Leaf shape: alternating diagonal rounded corners */
  const leafRadius =
    index % 2 === 0
      ? "130px 20px 130px 20px"
      : "20px 130px 20px 130px";

  return (
    <button
      ref={cardRef}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative flex-shrink-0 text-left focus:outline-none"
      style={{
        width: "clamp(180px, 15vw, 260px)",
        height: `${cardHeight}px`,
        borderRadius: leafRadius,
        overflow: "hidden",
        scrollSnapAlign: "start",
        /* Entrance animation */
        opacity: isVisible ? 1 : 0,
        transform: isVisible
          ? `translateY(${isHovered ? "-4px" : "0px"})`
          : "translateY(40px)",
        transition: isVisible
          ? "transform 0.3s ease-out, box-shadow 0.3s ease-out"
          : `opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${index * 0.1}s, transform 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${index * 0.1}s`,
        /* Hover shadow */
        boxShadow: isHovered
          ? "0 24px 56px rgba(0,0,0,0.18)"
          : "0 4px 24px rgba(0,0,0,0.08)",
        willChange: "transform, opacity",
      }}
    >
      {/* ---- Primary Image ---- */}
      <img
        src={item.image}
        alt={item.title}
        className="absolute inset-0 w-full h-full object-cover"
        style={{
          transition: "opacity 0.7s ease-out, transform 0.7s ease-out",
          opacity: isHovered && secondaryImage ? 0 : 1,
          transform: isHovered && !secondaryImage ? "scale(1.06)" : "scale(1)",
        }}
      />

      {/* ---- Secondary Image (hover swap) ---- */}
      {secondaryImage && (
        <img
          src={secondaryImage}
          alt={`${item.title} — alternate`}
          className="absolute inset-0 w-full h-full object-cover"
          style={{
            transition: "opacity 0.7s ease-out, transform 0.7s ease-out",
            opacity: isHovered ? 1 : 0,
            transform: isHovered ? "scale(1)" : "scale(1.06)",
          }}
        />
      )}

      {/* ---- Bottom gradient overlay ---- */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `linear-gradient(180deg, transparent 45%, rgba(0,0,0,${isHovered ? 0.65 : 0.35}) 100%)`,
          transition: "background 0.4s ease-out",
        }}
      />

      {/* ---- Text label ---- */}
      <div
        className="absolute bottom-0 left-0 right-0 px-8 pb-14 text-white text-center"
        style={{
          transform: isHovered ? "translateY(0)" : "translateY(6px)",
          opacity: isHovered ? 1 : 0.85,
          transition: "transform 0.3s ease-out, opacity 0.3s ease-out",
        }}
      >
        <p className="text-[10px] font-medium tracking-[0.2em] mb-1 text-white/70">
          {item.category}
        </p>
        <h3 className="font-display text-base lg:text-lg tracking-tight leading-tight">
          {item.title}
        </h3>
      </div>
    </button>
  );
}

/* ------------------------------------------------------------------ */
/*  Tablet Leaf Card — grid-based, no stagger offset                   */
/* ------------------------------------------------------------------ */
function TabletLeafCard({
  item,
  index,
  onClick,
}: {
  item: (typeof portfolioItems)[0];
  index: number;
  onClick: () => void;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef<HTMLButtonElement>(null);

  const project = getProjectById(item.id);
  const gallery = project?.gallery || [];
  const secondaryImage = gallery.length > 1 ? gallery[1].src : null;

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
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <button
      ref={cardRef}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative w-full text-left focus:outline-none"
      style={{
        height: "420px",
        borderRadius:
          index % 2 === 0
            ? "110px 16px 110px 16px"
            : "16px 110px 16px 110px",
        overflow: "hidden",
        opacity: isVisible ? 1 : 0,
        transform: isVisible
          ? `translateY(${isHovered ? "-4px" : "0px"})`
          : "translateY(30px)",
        transition: isVisible
          ? "transform 0.3s ease-out, box-shadow 0.3s ease-out"
          : `opacity 0.7s ease-out ${index * 0.08}s, transform 0.7s ease-out ${index * 0.08}s`,
        boxShadow: isHovered
          ? "0 20px 48px rgba(0,0,0,0.16)"
          : "0 4px 20px rgba(0,0,0,0.06)",
      }}
    >
      <img
        src={item.image}
        alt={item.title}
        className="absolute inset-0 w-full h-full object-cover"
        style={{
          transition: "opacity 0.6s ease-out, transform 0.6s ease-out",
          opacity: isHovered && secondaryImage ? 0 : 1,
          transform: isHovered && !secondaryImage ? "scale(1.05)" : "scale(1)",
        }}
      />
      {secondaryImage && (
        <img
          src={secondaryImage}
          alt={`${item.title} — alternate`}
          className="absolute inset-0 w-full h-full object-cover"
          style={{
            transition: "opacity 0.6s ease-out, transform 0.6s ease-out",
            opacity: isHovered ? 1 : 0,
            transform: isHovered ? "scale(1)" : "scale(1.05)",
          }}
        />
      )}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `linear-gradient(180deg, transparent 45%, rgba(0,0,0,${isHovered ? 0.6 : 0.35}) 100%)`,
          transition: "background 0.3s ease-out",
        }}
      />
      <div
        className="absolute bottom-0 left-0 right-0 px-8 pb-12 text-white text-center"
        style={{
          transform: isHovered ? "translateY(0)" : "translateY(4px)",
          opacity: isHovered ? 1 : 0.85,
          transition: "transform 0.3s ease-out, opacity 0.3s ease-out",
        }}
      >
        <p className="text-[10px] font-medium tracking-[0.2em] mb-1 text-white/70">
          {item.category}
        </p>
        <h3 className="font-display text-lg tracking-tight leading-tight">
          {item.title}
        </h3>
      </div>
    </button>
  );
}

/* ------------------------------------------------------------------ */
/*  Mobile Leaf Card — simpler, no heavy animations                    */
/* ------------------------------------------------------------------ */
function MobileLeafCard({
  item,
  index,
  onClick,
}: {
  item: (typeof portfolioItems)[0];
  index: number;
  onClick: () => void;
}) {
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef<HTMLButtonElement>(null);

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
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <button
      ref={cardRef}
      onClick={onClick}
      className="group relative w-full text-left focus:outline-none"
      style={{
        height: "360px",
        borderRadius:
          index % 2 === 0
            ? "90px 14px 90px 14px"
            : "14px 90px 14px 90px",
        overflow: "hidden",
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0)" : "translateY(24px)",
        transition: `opacity 0.6s ease-out ${index * 0.06}s, transform 0.6s ease-out ${index * 0.06}s`,
      }}
    >
      <img
        src={item.image}
        alt={item.title}
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(180deg, transparent 45%, rgba(0,0,0,0.5) 100%)",
        }}
      />
      <div className="absolute bottom-0 left-0 right-0 px-8 pb-12 text-white text-center">
        <p className="text-[10px] font-medium tracking-[0.2em] mb-1 text-white/70">
          {item.category}
        </p>
        <h3 className="font-display text-lg tracking-tight leading-tight">
          {item.title}
        </h3>
      </div>
    </button>
  );
}

/* ================================================================== */
/*  Portfolio Section — THE WORK                                       */
/* ================================================================== */
export function PortfolioSection({ onProjectClick, onSeeMoreClick }: PortfolioSectionProps) {
  const [headingVisible, setHeadingVisible] = useState(false);
  const headingRef = useRef<HTMLDivElement>(null);

  /* Heading scroll-trigger */
  useEffect(() => {
    const el = headingRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHeadingVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.1, rootMargin: "-60px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  /* Filter to curated featured items (preserves order) */
  const featured = FEATURED_IDS
    .map((id) => portfolioItems.find((p) => p.id === id))
    .filter(Boolean) as (typeof portfolioItems)[number][];

  return (
    <section id="work" className="py-14 sm:py-24 lg:py-28 bg-cream overflow-hidden">
      <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-10">
        {/* ============================================================ */}
        {/*  Animated Heading — subtle letter-spacing expansion + fade    */}
        {/* ============================================================ */}
        <div ref={headingRef} className="mb-8 sm:mb-12 lg:mb-16">
          <h2
            className="font-display text-6xl sm:text-7xl md:text-8xl lg:text-[130px] xl:text-[158px] text-dark leading-none thework-heading-float"
            style={{
              opacity: headingVisible ? 1 : 0,
              letterSpacing: headingVisible ? "-0.02em" : "0.05em",
              transition:
                "opacity 0.8s ease-out, letter-spacing 1.2s cubic-bezier(0.16, 1, 0.3, 1)",
              willChange: "transform",
            }}
          >
            THE WORK
          </h2>
        </div>

        {/* ============================================================ */}
        {/*  Desktop (lg+): Horizontal Flowing Leaf Strip                 */}
        {/*  Staggered heights, horizontal scroll, snap                   */}
        {/* ============================================================ */}
        <div className="hidden lg:block">
          <div
            className="leaf-scroll flex items-start gap-6 xl:gap-8 overflow-x-auto pb-8 -mx-10 px-10"
            style={{
              scrollSnapType: "x proximity",
              WebkitOverflowScrolling: "touch",
            }}
          >
            {featured.map((item, index) => (
              <LeafCard
                key={item.id}
                item={item}
                index={index}
                onClick={() => onProjectClick(item.id)}
              />
            ))}
          </div>
        </div>

        {/* ============================================================ */}
        {/*  Tablet (sm–lg): 2–3 column grid, pill shapes                 */}
        {/* ============================================================ */}
        <div className="hidden sm:grid lg:hidden grid-cols-2 md:grid-cols-3 gap-5">
          {featured.map((item, index) => (
            <TabletLeafCard
              key={item.id}
              item={item}
              index={index}
              onClick={() => onProjectClick(item.id)}
            />
          ))}
        </div>

        {/* ============================================================ */}
        {/*  Mobile (<sm): Single column stacked pills                    */}
        {/* ============================================================ */}
        <div className="sm:hidden flex flex-col gap-5">
          {featured.slice(0, 6).map((item, index) => (
            <MobileLeafCard
              key={item.id}
              item={item}
              index={index}
              onClick={() => onProjectClick(item.id)}
            />
          ))}
        </div>

        {/* ============================================================ */}
        {/*  CTA                                                          */}
        {/* ============================================================ */}
        <div
          className="mt-12 sm:mt-16 lg:mt-20 text-right"
          style={{
            opacity: headingVisible ? 1 : 0,
            transform: headingVisible ? "translateY(0)" : "translateY(20px)",
            transition:
              "opacity 0.6s ease-out 0.5s, transform 0.6s ease-out 0.5s",
          }}
        >
          <button
            onClick={() => {
              if (onSeeMoreClick) {
                onSeeMoreClick();
              }
            }}
            className="inline-flex items-center gap-2 sm:gap-3 text-dark group transition-transform duration-200 hover:translate-x-1"
          >
            <span className="text-sm sm:text-base font-medium tracking-wider">
              SEE MORE WORK
            </span>
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-dark flex items-center justify-center group-hover:bg-dark group-hover:text-white transition-colors">
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
          </button>
        </div>
      </div>

      {/* Hide scrollbar on the horizontal scroll strip */}
      <style>{`
        .leaf-scroll::-webkit-scrollbar { display: none; }
        .leaf-scroll { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes theworkFloat {
          0%, 100% { transform: translate3d(0, 0, 0); }
          50%      { transform: translate3d(0, -16px, 0); }
        }
        .thework-heading-float {
          animation: theworkFloat 4.5s ease-in-out infinite;
        }
        @media (max-width: 1024px) {
          @keyframes theworkFloat {
            0%, 100% { transform: translate3d(0, 0, 0); }
            50%      { transform: translate3d(0, -10px, 0); }
          }
        }
        @media (max-width: 640px) {
          .thework-heading-float { animation: none; }
        }
        @media (prefers-reduced-motion: reduce) {
          .thework-heading-float { animation: none; }
        }
      `}</style>
    </section>
  );
}
