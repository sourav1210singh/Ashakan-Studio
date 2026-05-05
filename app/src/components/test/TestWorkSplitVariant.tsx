import { useState, useEffect, useRef, type ReactNode } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { clients } from "@/data/portfolio";
import { LensIntroSection } from "@/components/sections/LensIntroSection";
import { HeroSection } from "@/components/sections/HeroSection";
import { AboutSection } from "@/components/sections/AboutSection";

/* ════════════════════════════════════════════════════════════════════
   TEST VARIANT: split the home page leaf-card section into TWO blocks
   per Brandi's transcript: "maybe there's two of them, and one says
   campaign, one says work."

     • SECTION 1 — CAMPAIGN: the four featured campaigns (image+video
       leaf pair for each: Deutsch, Weissman, Eye Gallery, Monarch)
     • SECTION 2 — WORK:    a smaller grouping of category-style cards
       representing photography portfolio work (Fashion, The Arts,
       Retail, Industrial)

   This is a DRAFT layout — Brandi can review and approve before we
   replace the live home page section.
   ════════════════════════════════════════════════════════════════════ */

interface VariantProps {
  onProjectClick: (slug: string) => void;
  onSeeMoreClick?: () => void;
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

type WorkCard = {
  id: string;
  label: string;
  image: string;
  href: string;
};

const WORK_CARDS: WorkCard[] = [
  { id: "fashion",    label: "FASHION",     image: "/images/categories/fashion/citybook-2024-1000.jpg",        href: "/work/photography/fashion/" },
  { id: "the-arts",   label: "THE ARTS",    image: "/images/categories/the-arts/lauren-anderson-2490-edit.jpg", href: "/work/photography/the-arts/" },
  { id: "retail",     label: "RETAIL",      image: "/images/categories/retail/mustang-095.jpg",                href: "/work/photography/retail/" },
  { id: "industrial", label: "INDUSTRIAL",  image: "/images/categories/industrial/venus-aerospace-24443-edit.jpg", href: "/work/photography/industrial/" },
];

/* ──────────────────────────────────────────────────────────────────── */
/*  Leaf card — same shape as production, with hover video for video    */
/*  cards and vertical brand label                                      */
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
/*  Work category card — wider rectangular tile (different from leaf)   */
/* ──────────────────────────────────────────────────────────────────── */
function WorkTile({ card, index, onClick }: { card: WorkCard; index: number; onClick: () => void }) {
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
/*  MagneticItem — pulls the wrapped child toward the cursor on hover   */
/* ──────────────────────────────────────────────────────────────────── */
function MagneticItem({
  children,
  strength = 0.4,
}: {
  children: ReactNode;
  strength?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const mvX = useMotionValue(0);
  const mvY = useMotionValue(0);
  const x = useSpring(mvX, { stiffness: 280, damping: 18, mass: 0.6 });
  const y = useSpring(mvY, { stiffness: 280, damping: 18, mass: 0.6 });
  const [hover, setHover] = useState(false);

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    mvX.set((e.clientX - cx) * strength);
    mvY.set((e.clientY - cy) * strength);
  };
  const onLeave = () => {
    mvX.set(0);
    mvY.set(0);
    setHover(false);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={onLeave}
      style={{ x, y, display: "inline-block", willChange: "transform" }}
      animate={{ scale: hover ? 1.12 : 1 }}
      transition={{ type: "spring", stiffness: 240, damping: 20 }}
    >
      {children}
    </motion.div>
  );
}

/* ──────────────────────────────────────────────────────────────────── */
/*  MarqueeRow — infinite horizontal scroll with magnetic items inside  */
/* ──────────────────────────────────────────────────────────────────── */
function MarqueeRow({
  items,
  direction = "left",
  speedSec = 40,
}: {
  items: string[];
  direction?: "left" | "right";
  speedSec?: number;
}) {
  // Duplicate the list so the loop is seamless
  const repeated = [...items, ...items, ...items, ...items];
  const fromX = direction === "left" ? "0%" : "-50%";
  const toX = direction === "left" ? "-50%" : "0%";

  return (
    <div className="overflow-hidden py-3">
      <motion.div
        className="flex items-center gap-12 sm:gap-16 lg:gap-20 whitespace-nowrap"
        animate={{ x: [fromX, toX] }}
        transition={{ duration: speedSec, repeat: Infinity, ease: "linear" }}
        style={{ width: "max-content", willChange: "transform" }}
      >
        {repeated.map((name, idx) => (
          <MagneticItem key={`${name}-${idx}`} strength={0.35}>
            <span
              className="font-display text-3xl sm:text-4xl lg:text-5xl xl:text-6xl tracking-tight uppercase select-none transition-colors duration-300"
              style={{
                color: "rgba(255,255,255,0.55)",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.color = "#FFFFFF";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.55)";
              }}
            >
              {name}
            </span>
          </MagneticItem>
        ))}
      </motion.div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────── */
/*  OUR FRIENDS — Marquee + Magnetic combo (test variant)               */
/* ──────────────────────────────────────────────────────────────────── */
function FriendsMarqueeSection() {
  // Split the client list into two halves so each row has different names
  const half = Math.ceil(clients.length / 2);
  const rowA = clients.slice(0, half);
  const rowB = clients.slice(half).concat(clients.slice(0, half).reverse());

  return (
    <section className="py-20 sm:py-28 bg-dark relative overflow-hidden">
      {/* Soft glow blobs in background */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[28rem] h-[28rem] bg-amber-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-[28rem] h-[28rem] bg-white/30 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10">
        {/* Section header — center */}
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 text-center mb-10 sm:mb-14">
          <p className="text-xs font-semibold tracking-[0.3em] text-white/50 uppercase mb-4">
            Brands We've Worked With
          </p>
          <h2 className="font-display text-6xl sm:text-7xl md:text-8xl lg:text-[105px] xl:text-[132px] text-white tracking-tight leading-none">
            OUR FRIENDS
          </h2>
        </div>

        {/* Two marquee rows — opposite directions */}
        <div className="space-y-4 sm:space-y-6">
          <MarqueeRow items={rowA} direction="left" speedSec={45} />
          {/* Thin divider line */}
          <div className="h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
          <MarqueeRow items={rowB} direction="right" speedSec={55} />
        </div>

        {/* Hint text */}
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 text-center mt-12 sm:mt-16">
          <p className="text-xs font-medium tracking-[0.3em] text-white/40 uppercase">
            Hover to engage · Names will become logos when delivered
          </p>
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────────────────────────── */
/*  FULL-SERVICE PRODUCTION — Hybrid (numbered editorial + bg swap)     */
/*  Left:  numbered discipline list with hairline dividers              */
/*  Right: sticky image that crossfades on hover/click of each item     */
/* ──────────────────────────────────────────────────────────────────── */
type Discipline = {
  label: string;
  description: string;
  image: string;
};

const DISCIPLINES: Discipline[] = [
  {
    label: "PHOTOGRAPHERS",
    description: "Editorial, fashion, retail, industrial — frames built to last.",
    image: "/images/categories/fashion/citybook-2024-1000.jpg",
  },
  {
    label: "CINEMATOGRAPHERS",
    description: "Story-driven motion that carries the brand voice forward.",
    image: "/images/portfolio/8-4Q7A9046-2.jpeg",
  },
  {
    label: "DIRECTORS",
    description: "Vision and craft from concept through final delivery.",
    image: "/images/categories/industrial/venus-aerospace-24443-edit.jpg",
  },
  {
    label: "HAIR / MAKEUP",
    description: "Camera-ready beauty for every frame on set.",
    image: "/images/portfolio/beauty-portrait-ofstylish-woman-with-colorful-tur-2023-11-27-05-34-51-utc.jpeg",
  },
  {
    label: "STYLISTS",
    description: "Wardrobe, prop, and set styling tuned to the story.",
    image: "/images/categories/fashion/finn-hackney-62296-edit.jpg",
  },
  {
    label: "SOUND / AUDIO",
    description: "Capture, mix, and music supervision built for the cut.",
    image: "/images/categories/the-arts/lauren-anderson-2490-edit.jpg",
  },
  {
    label: "DESIGNERS",
    description: "Set design, graphics, and creative direction.",
    image: "/images/categories/retail/296gtb-070.jpg",
  },
  {
    label: "PRE & POST PRODUCTION",
    description: "Planning, edit, color, and finish under one roof.",
    image: "/images/portfolio/audaja-skincare.jpg",
  },
  {
    label: "MARKETING SUPPORT",
    description: "Brand strategy and campaign rollout that travel.",
    image: "/images/portfolio/brandon-blackwood.jpg",
  },
];

function FullServiceHybridSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = DISCIPLINES[activeIndex];

  return (
    <section className="bg-dark py-20 sm:py-28 lg:py-32 relative overflow-hidden">
      {/* Soft glow accents in background */}
      <div className="absolute inset-0 opacity-[0.07] pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[32rem] h-[32rem] bg-amber-200 rounded-full blur-[140px]" />
        <div className="absolute bottom-0 right-0 w-[28rem] h-[28rem] bg-white rounded-full blur-[140px]" />
      </div>

      <div className="relative z-10 max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-10">
        {/* ── Header ── */}
        <div className="mb-14 sm:mb-20 max-w-3xl">
          <p className="text-xs font-semibold tracking-[0.3em] text-white/50 uppercase mb-4">
            Our Disciplines / 03
          </p>
          <h2 className="font-display text-5xl sm:text-7xl lg:text-8xl text-white tracking-tight leading-[0.9]">
            FULL-SERVICE
            <br />
            PRODUCTION
          </h2>
          <p className="text-base sm:text-lg text-white/60 max-w-xl mt-6 leading-relaxed">
            From concept to delivery, our talented network of directors,
            photographers, cinematographers, stylists, and editors bring your
            vision to life.
          </p>
        </div>

        {/* ── Image (LEFT) + Discipline list (RIGHT) — equal heights ── */}
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-14 items-stretch">
          {/* LEFT — Image preview (cols 1–7, wider) */}
          <div className="lg:col-span-7 order-1">
            <div
              className="relative overflow-hidden bg-black/30 w-full h-full min-h-[420px] sm:min-h-[520px] lg:min-h-[640px]"
            >
              {/* Crossfading images */}
              {DISCIPLINES.map((d, i) => (
                <img
                  key={d.label}
                  src={d.image}
                  alt={d.label}
                  className="absolute inset-0 w-full h-full object-cover"
                  style={{
                    opacity: activeIndex === i ? 1 : 0,
                    transform: activeIndex === i ? "scale(1)" : "scale(1.04)",
                    transition:
                      "opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1), transform 1.4s cubic-bezier(0.16, 1, 0.3, 1)",
                  }}
                />
              ))}

              {/* Bottom gradient for label legibility */}
              <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/75 via-black/30 to-transparent pointer-events-none" />

              {/* Top-left meta tag */}
              <div className="absolute top-5 left-5 flex items-center gap-2">
                <span className="block w-1.5 h-1.5 rounded-full bg-amber-200 animate-pulse" />
                <span className="text-[10px] font-semibold tracking-[0.3em] text-white/85 uppercase">
                  Now Showing
                </span>
              </div>

              {/* Bottom-left active label */}
              <div className="absolute bottom-5 left-5 right-5 pointer-events-none">
                <p
                  className="font-display text-xl sm:text-2xl text-white tracking-tight leading-tight"
                  style={{ transition: "opacity 0.4s ease-out" }}
                  key={`label-${activeIndex}`}
                >
                  {active.label}
                </p>
                <p className="text-xs sm:text-sm text-white/70 mt-1 leading-snug">
                  {active.description}
                </p>
              </div>

              {/* Subtle inner border */}
              <div className="absolute inset-0 ring-1 ring-inset ring-white/10 pointer-events-none" />
            </div>
          </div>

          {/* RIGHT — Discipline list (cols 8–12, narrower) */}
          <div className="lg:col-span-5 order-2 flex flex-col">
            <ul className="border-t border-white/15 flex-1 flex flex-col">
              {DISCIPLINES.map((d, i) => {
                const isActive = activeIndex === i;
                return (
                  <li
                    key={d.label}
                    className="border-b border-white/15 flex-1 flex"
                    onMouseEnter={() => setActiveIndex(i)}
                  >
                    <div
                      className="flex items-center gap-5 sm:gap-8 py-4 sm:py-5 relative w-full"
                      style={{
                        transition: "padding-left 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
                        paddingLeft: isActive ? "1rem" : "0",
                      }}
                    >
                      {/* Active accent bar */}
                      <span
                        className="absolute left-0 top-1/2 -translate-y-1/2 bg-amber-200/80"
                        style={{
                          width: isActive ? "8px" : "0px",
                          height: isActive ? "60%" : "0%",
                          transition:
                            "width 0.4s cubic-bezier(0.16, 1, 0.3, 1), height 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
                        }}
                      />

                      {/* Label */}
                      <div className="flex-1 min-w-0">
                        <span
                          className="font-display text-2xl sm:text-3xl lg:text-[36px] tracking-tight uppercase block leading-tight"
                          style={{
                            color: isActive ? "#FFFFFF" : "rgba(255,255,255,0.40)",
                            transition: "color 0.4s ease-out",
                          }}
                        >
                          {d.label}
                        </span>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>

            {/* Hint */}
            <p className="text-xs font-medium tracking-[0.3em] text-white/35 uppercase mt-6">
              Hover a discipline to preview
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────────────────────────── */
/*  MAIN VARIANT — two separate sections rendered back-to-back          */
/* ──────────────────────────────────────────────────────────────────── */
export function TestWorkSplitVariant({ onProjectClick, onSeeMoreClick }: VariantProps) {
  return (
    <>
      {/* ═══════════════════════════════════════════════════════════════
          HOME-PAGE PREVIEW MODE
          The test page renders a full new-home-page mock so the client
          sees changes in context. Sections from the live home page
          (LensIntro, Hero, About) are pulled in unchanged; the three
          test variants (CAMPAIGN+WORK split, OUR FRIENDS marquee,
          FULL-SERVICE editorial) replace their old equivalents.
          ═══════════════════════════════════════════════════════════════ */}

      {/* Cinematic intro — same as live home page */}
      <LensIntroSection />

      {/* Hero — same as live home page */}
      <HeroSection />

      {/* ═══════════════════════════════════════════════════════════════
          SECTION 1 — CAMPAIGN
          ═══════════════════════════════════════════════════════════════ */}
      <section className="py-20 sm:py-28 bg-cream">
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

      {/* ═══════════════════════════════════════════════════════════════
          SECTION 2 — WORK (separate section, distinct visual treatment)
          ═══════════════════════════════════════════════════════════════ */}
      <section className="py-20 sm:py-28 bg-dark relative">
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

          {/* Horizontal scroll strip — different card style than leaf */}
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

          {/* Helper hint for mobile users */}
          <div className="hidden sm:flex items-center gap-3 text-xs font-medium tracking-widest text-white/40 uppercase mt-8">
            <ArrowLeft className="w-4 h-4" />
            Scroll horizontally to explore
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          SECTION 3 — OUR FRIENDS (Marquee + Magnetic — option F)
          ═══════════════════════════════════════════════════════════════ */}
      <FriendsMarqueeSection />

      {/* ═══════════════════════════════════════════════════════════════
          SECTION 4 — FULL-SERVICE PRODUCTION (Editorial + Hover Swap)
          ═══════════════════════════════════════════════════════════════ */}
      <FullServiceHybridSection />

      {/* About — same as live home page */}
      <AboutSection />
    </>
  );
}
