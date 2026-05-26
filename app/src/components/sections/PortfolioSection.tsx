import { useState, useEffect, useRef } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface PortfolioSectionProps {
  onProjectClick: (slug: string) => void;
  onSeeMoreClick?: () => void;
}

/* ------------------------------------------------------------------ */
/*  Campaign cards: alternating Image → Video for each campaign        */
/* ------------------------------------------------------------------ */
type CampaignCard = {
  id: string;
  label: string;
  type: "image" | "video";
  image: string;
  vimeoId?: string;
  slug: string; // project slug for navigation
};

const CAMPAIGN_CARDS: CampaignCard[] = [
  { id: "deutsch-img",    label: "DEUTSCH FINE JEWELRY",  type: "image", image: "/images/portfolio/deutsch-jewelry.jpg",    slug: "deutsch" },
  { id: "deutsch-vid",    label: "DEUTSCH FINE JEWELRY",  type: "video", image: "/images/portfolio/deutsch-jewelry.jpg",    slug: "deutsch" },
  { id: "weissman-img",   label: "WEISSMAN ELITE",        type: "image", image: "/images/portfolio/weissman-elite.jpg",     slug: "weissman" },
  { id: "weissman-vid",   label: "WEISSMAN ELITE",        type: "video", image: "https://vumbnail.com/950064546_large.jpg",      vimeoId: "950064546", slug: "weissman" },
  { id: "eye-img",        label: "THE EYE GALLERY",       type: "image", image: "/images/portfolio/eye-gallery.jpg",        slug: "eye-gallery" },
  { id: "eye-vid",        label: "THE EYE GALLERY",       type: "video", image: "https://vumbnail.com/529432034_large.jpg",       vimeoId: "529432034", slug: "eye-gallery" },
  { id: "monarch-img",    label: "THE MONARCH SCHOOL",    type: "image", image: "/images/portfolio/8-4Q7A9046-2.jpeg",      slug: "monarch-school" },
  { id: "monarch-vid",    label: "THE MONARCH SCHOOL",    type: "video", image: "https://vumbnail.com/896674527_large.jpg",       vimeoId: "896674527", slug: "monarch-school" },
];

/* ------------------------------------------------------------------ */
/*  Leaf Card - Desktop: Thin tall leaf with vertical brand name       */
/*  Supports both image-only and video-on-hover modes                  */
/* ------------------------------------------------------------------ */
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

  /* Diagonal leaf: opposite corners rounded */
  const leafRadius =
    index % 2 === 0
      ? "80px 6px 80px 6px"
      : "6px 80px 6px 80px";

  /* Video card expands visually on hover WITHOUT pushing siblings */
  const videoExpanded = isVideo && isHovered;

  return (
    <button
      ref={cardRef}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative flex-shrink-0 text-left focus:outline-none"
      style={{
        /* Layout width stays fixed - no siblings shift */
        width: "clamp(120px, 13vw, 180px)",
        height: "clamp(400px, 48vw, 540px)",
        scrollSnapAlign: "start",
        opacity: isVisible ? 1 : 0,
        transform: isVisible
          ? `translateY(${isHovered ? "-4px" : "0px"})`
          : "translateY(40px)",
        transition: isVisible
          ? "transform 0.3s ease-out, box-shadow 0.3s ease-out"
          : `opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${index * 0.1}s, transform 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${index * 0.1}s`,
        willChange: "transform, opacity",
        /* Raise video card above neighbors when expanded */
        zIndex: videoExpanded ? 20 : 1,
      }}
    >
      {/* Inner visual container - pops out for video cards */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: videoExpanded ? "clamp(380px, 35vw, 500px)" : "100%",
          height: videoExpanded ? "clamp(450px, 50vw, 580px)" : "100%",
          borderRadius: leafRadius,
          overflow: "hidden",
          transform: videoExpanded
            ? "translate(-50%, -50%) scale(1.05)"
            : "translate(-50%, -50%) scale(1)",
          transition: "width 0.45s cubic-bezier(0.34, 1.56, 0.64, 1), height 0.45s cubic-bezier(0.34, 1.56, 0.64, 1), transform 0.45s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.3s ease-out",
          boxShadow: videoExpanded
            ? "0 32px 64px rgba(0,0,0,0.25)"
            : isHovered
              ? "0 24px 56px rgba(0,0,0,0.18)"
              : "0 4px 24px rgba(0,0,0,0.08)",
        }}
      >
        {/* ---- Image ---- */}
        <img
          src={card.image}
          alt={card.label}
          className="absolute inset-0 w-full h-full object-cover"
          style={{
            transition: "transform 0.7s ease-out",
            transform: isHovered && !isVideo ? "scale(1.06)" : "scale(1)",
          }}
        />

        {/* ---- Vimeo video on hover (video cards only) ---- */}
        {isVideo && isHovered && (
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <iframe
              src={`https://player.vimeo.com/video/${card.vimeoId}?autoplay=1&muted=1&loop=1&quality=1080p&title=0&byline=0&portrait=0&controls=0`}
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

        {/* ---- Gradient overlay ---- */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `linear-gradient(180deg, transparent 30%, rgba(0,0,0,${isHovered ? 0.55 : 0.3}) 100%)`,
            transition: "background 0.4s ease-out",
          }}
        />

        {/* ---- Play icon for video cards ---- */}
        {card.type === "video" && (
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/80 flex items-center justify-center transition-opacity duration-300 pointer-events-none"
            style={{ opacity: isHovered ? 0 : 1 }}
          >
            <div className="w-0 h-0 border-t-[7px] border-t-transparent border-l-[12px] border-l-dark border-b-[7px] border-b-transparent ml-1" />
          </div>
        )}

        {/* ---- Vertical brand name - bottom right ---- */}
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
      </div>
    </button>
  );
}

/* ------------------------------------------------------------------ */
/*  Tablet Leaf Card - thin leaf with vertical text                    */
/* ------------------------------------------------------------------ */
function TabletLeafCard({
  card,
  index,
  onClick,
}: {
  card: CampaignCard;
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

  const leafRadius =
    index % 2 === 0
      ? "70px 6px 70px 6px"
      : "6px 70px 6px 70px";

  return (
    <button
      ref={cardRef}
      onClick={onClick}
      className="group relative w-full text-left focus:outline-none"
      style={{
        height: "400px",
        borderRadius: leafRadius,
        overflow: "hidden",
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0)" : "translateY(30px)",
        transition: `opacity 0.7s ease-out ${index * 0.08}s, transform 0.7s ease-out ${index * 0.08}s`,
      }}
    >
      <img
        src={card.image}
        alt={card.label}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-dark/40 via-dark/10 to-transparent" />
      {card.type === "video" && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/80 flex items-center justify-center">
          <div className="w-0 h-0 border-t-[7px] border-t-transparent border-l-[12px] border-l-dark border-b-[7px] border-b-transparent ml-1" />
        </div>
      )}
      {/* Type badge hidden */}
      <div className="absolute bottom-6 right-2 pointer-events-none">
        <span
          className="font-display text-white text-base tracking-[0.15em] uppercase"
          style={{ writingMode: "vertical-rl", textOrientation: "mixed" }}
        >
          {card.label}
        </span>
      </div>
    </button>
  );
}

/* ------------------------------------------------------------------ */
/*  Mobile Leaf Card - thin leaf with vertical text                    */
/* ------------------------------------------------------------------ */
function MobileLeafCard({
  card,
  index,
  onClick,
}: {
  card: CampaignCard;
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

  const leafRadius =
    index % 2 === 0
      ? "60px 6px 60px 6px"
      : "6px 60px 6px 60px";

  return (
    <button
      ref={cardRef}
      onClick={onClick}
      className="group relative text-left focus:outline-none"
      style={{
        width: "100%",
        height: "320px",
        borderRadius: leafRadius,
        overflow: "hidden",
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0)" : "translateY(24px)",
        transition: `opacity 0.6s ease-out ${index * 0.06}s, transform 0.6s ease-out ${index * 0.06}s`,
      }}
    >
      <img
        src={card.image}
        alt={card.label}
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-dark/50 via-dark/15 to-transparent" />
      {card.type === "video" && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 flex items-center justify-center">
          <div className="w-0 h-0 border-t-[6px] border-t-transparent border-l-[10px] border-l-dark border-b-[6px] border-b-transparent ml-1" />
        </div>
      )}
      {/* Type badge hidden */}
      <div className="absolute bottom-5 right-2 pointer-events-none">
        <span
          className="font-display text-white text-base tracking-[0.15em] uppercase"
          style={{ writingMode: "vertical-rl", textOrientation: "mixed" }}
        >
          {card.label}
        </span>
      </div>
    </button>
  );
}

/* ================================================================== */
/*  Portfolio Section - THE WORK                                       */
/* ================================================================== */
export function PortfolioSection({ onProjectClick, onSeeMoreClick }: PortfolioSectionProps) {
  const [headingVisible, setHeadingVisible] = useState(false);
  const headingRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isScrolledToEnd, setIsScrolledToEnd] = useState(false);
  const [isScrolledFromStart, setIsScrolledFromStart] = useState(false);

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

  /* Track scroll position to know when we've reached the end */
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const checkScroll = () => {
      const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 20;
      setIsScrolledToEnd(atEnd);
      setIsScrolledFromStart(el.scrollLeft > 100);
    };
    el.addEventListener("scroll", checkScroll);
    checkScroll();
    return () => el.removeEventListener("scroll", checkScroll);
  }, []);

  /* Scroll the strip right, or navigate to Work page if at end */
  const handleScrollRight = () => {
    const el = scrollRef.current;
    if (el && !isScrolledToEnd) {
      el.scrollBy({ left: el.clientWidth * 0.7, behavior: "smooth" });
    } else if (onSeeMoreClick) {
      onSeeMoreClick();
    }
  };

  /* Scroll the strip back to the left */
  const handleScrollLeft = () => {
    const el = scrollRef.current;
    if (el) {
      el.scrollBy({ left: -(el.clientWidth * 0.7), behavior: "smooth" });
    }
  };

  return (
    <section id="work" className="pt-4 pb-14 sm:pt-6 sm:pb-24 lg:pb-28 bg-cream overflow-x-clip">
      <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-10">
        {/* ============================================================ */}
        {/*  Animated Heading - subtle letter-spacing expansion + fade    */}
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
        {/*  8 cards: Image→Video alternating for 4 campaigns             */}
        {/* ============================================================ */}
        <div className="hidden lg:block">
          <div
            ref={scrollRef}
            className="leaf-scroll flex items-start gap-6 xl:gap-8 overflow-x-auto pb-8 pt-16"
            style={{
              scrollSnapType: "x proximity",
              WebkitOverflowScrolling: "touch",
              paddingLeft: "clamp(40px, 5vw, 80px)",
              paddingRight: "clamp(40px, 5vw, 80px)",
            }}
          >
            {CAMPAIGN_CARDS.map((card, index) => (
              <LeafCard
                key={card.id}
                card={card}
                index={index}
                onClick={() => onProjectClick(card.slug)}
              />
            ))}
          </div>
        </div>

        {/* ============================================================ */}
        {/*  Tablet (sm-lg): 2-3 column grid, pill shapes                 */}
        {/* ============================================================ */}
        <div className="hidden sm:grid lg:hidden grid-cols-3 md:grid-cols-4 gap-4">
          {CAMPAIGN_CARDS.map((card, index) => (
            <TabletLeafCard
              key={card.id}
              card={card}
              index={index}
              onClick={() => onProjectClick(card.slug)}
            />
          ))}
        </div>

        {/* ============================================================ */}
        {/*  Mobile (<sm): Single column stacked pills                    */}
        {/* ============================================================ */}
        <div className="sm:hidden grid grid-cols-2 gap-3">
          {CAMPAIGN_CARDS.slice(0, 6).map((card, index) => (
            <MobileLeafCard
              key={card.id}
              card={card}
              index={index}
              onClick={() => onProjectClick(card.slug)}
            />
          ))}
        </div>

        {/* ============================================================ */}
        {/*  CTA                                                          */}
        {/* ============================================================ */}
        <div
          className="mt-12 sm:mt-16 lg:mt-20 flex items-center justify-between"
          style={{
            opacity: headingVisible ? 1 : 0,
            transform: headingVisible ? "translateY(0)" : "translateY(20px)",
            transition:
              "opacity 0.6s ease-out 0.5s, transform 0.6s ease-out 0.5s",
          }}
        >
          {/* Left arrow - scroll back */}
          <button
            onClick={handleScrollLeft}
            className="inline-flex items-center gap-2 sm:gap-3 text-dark group transition-all duration-300"
            style={{
              opacity: isScrolledFromStart ? 1 : 0,
              pointerEvents: isScrolledFromStart ? "auto" : "none",
              transform: isScrolledFromStart ? "translateX(0)" : "translateX(20px)",
            }}
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-dark flex items-center justify-center group-hover:bg-dark group-hover:text-white transition-colors">
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <span className="text-sm sm:text-base font-medium tracking-wider">
              BACK
            </span>
          </button>

          {/* Right arrow - scroll forward / see all work */}
          <button
            onClick={handleScrollRight}
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
