import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { scrollToTopInstant } from "@/lib/scroll";
import { useNearViewport } from "@/hooks/useNearViewport";
import { useVimeoPlaying } from "@/hooks/useVimeoPlaying";

/* ════════════════════════════════════════════════════════════════════
   THE WORK - nine static category tiles (mixed Photography +
   Videography), arranged in a single horizontal row.

   Brandi's 5/7/26 review notes for this section (page 8):
     • Tile list (in this exact order):
         P/Retail · V/Retail · P/The Arts · V/The Arts · P/Fashion ·
         V/Documentary · P/Industrial · V/Industrial · V/Narrative
     • Description copy provided.

   Layout (rebuilt 2026-05-08 per user request):
     • Desktop (lg+): scroll-pinned horizontal strip - section is
       sticky to the viewport while the row of 9 tiles translates
       left as the user scrolls vertically. Every tile passes the
       centre of the screen before the page continues.
     • Mobile / tablet: regular swipeable horizontal scroller
       (sticky pinning conflicts with touch scrolling).
   ════════════════════════════════════════════════════════════════════ */

/* No props - the section is self-contained. The previous
   'See All Work' button + onSeeMoreClick prop were removed
   2026-05-08 because the /work/ landing page no longer exists
   (Brandi: 'NO WORK PAGE' across pages 14-18 of her review notes). */
interface WorkCategoriesSectionProps {}

type WorkTile = {
  id: string;
  /** PHOTOGRAPHY or VIDEOGRAPHY - shown as a small caps tag at top */
  type: "PHOTOGRAPHY" | "VIDEOGRAPHY";
  /** Category label shown big at the bottom of the tile */
  category: string;
  /** One-line teaser shown subtly on hover */
  description: string;
  /** Poster image - used as the visual for Photography tiles and as
   *  the fallback / first-paint for Videography tiles before the
   *  Vimeo iframe loads. */
  image: string;
  /** Optional Vimeo background video - when set on a VIDEOGRAPHY
   *  tile, the iframe overlays the image so the tile reads as
   *  live motion content. */
  vimeoId?: string;
  /** Vimeo privacy hash for private/unlisted videos. */
  vimeoHash?: string;
  href: string;
};

const WORK_TILES: WorkTile[] = [
  // P/Retail
  {
    id: "photo-retail",
    type: "PHOTOGRAPHY",
    category: "RETAIL",
    description: "Editorial product and lifestyle imagery for premium retail brands.",
    /* Cover swapped per Ashkan 6/12. */
    image: "/images/categories/retail/6c1a8388.jpg",
    href: "/work/photography/retail/",
  },
  // V/Retail
  {
    id: "video-retail",
    type: "VIDEOGRAPHY",
    category: "RETAIL",
    description: "Brand films and product motion for retail clients.",
    image: "/images/categories/retail/296gtb-070.jpg",
    /* Cacao & Cardamom: Valentines / Beating Heart + Kitchen - per
       Brandi new-PDF page 4 ('change top video for Video Retail to
       the Valentine Cacao & Cardamom video'). */
    vimeoId: "1189131036",
    vimeoHash: "d0322acd54",
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
    /* Vitacca Season Promo 24-25 - flagship dance/arts video */
    vimeoId: "1022971286",
    href: "/work/videography/the-arts/",
  },
  // P/Fashion
  {
    id: "photo-fashion",
    type: "PHOTOGRAPHY",
    category: "FASHION",
    description: "Editorial fashion stories with cinematic light and bold styling.",
    /* Cover swapped per Ashkan 6/12. */
    image: "/images/categories/fashion/zina-659.jpg",
    href: "/work/photography/fashion/",
  },
  // V/Documentary
  {
    id: "video-documentary",
    type: "VIDEOGRAPHY",
    category: "DOCUMENTARY",
    description: "Mission-driven storytelling for nonprofits, organizations, and communities.",
    image: "/images/portfolio/8-4Q7A9046-2.jpeg",
    /* Monarch Transforming Lives 25-26 - flagship documentary */
    vimeoId: "1151967437",
    vimeoHash: "000a715e4a",
    href: "/work/videography/documentary/",
  },
  // P/Headshots - the renamed Industrial category (Ashkan 6/10: rename
  // Industrial -> Headshots, keep its content/imagery). Tile image is
  // from the industrial set, not the old dedicated headshots page.
  {
    id: "photo-headshots",
    type: "PHOTOGRAPHY",
    category: "HEADSHOTS",
    description: "Professional headshots and corporate portraits for executives, teams, and brands.",
    image: "/images/categories/industrial/headshots17.jpg",
    href: "/work/photography/headshots/",
  },
  // V/Industrial
  {
    id: "video-industrial",
    type: "VIDEOGRAPHY",
    category: "INDUSTRIAL",
    description: "Corporate, medical, and industrial videography that highlights process and precision.",
    image: "/images/categories/industrial/2venus-aerospace-24470-2.jpg",
    /* RadioMedix - Changing the Landscape of Nuclear Medicine */
    vimeoId: "1100401603",
    href: "/work/videography/industrial/",
  },
  // V/Narrative
  {
    id: "video-narrative",
    type: "VIDEOGRAPHY",
    category: "NARRATIVE",
    description: "Story-driven short films and brand narratives for organizations.",
    image: "/images/categories/industrial/4q7a0824.jpg",
    /* Safari Vet - The Safari Difference, League City */
    vimeoId: "954997422",
    href: "/work/videography/narrative/",
  },
];

/* ──────────────────────────────────────────────────────────────────── */
/*  Single tile - 4:5 aspect, fixed width inside the strip              */
/* ──────────────────────────────────────────────────────────────────── */
function WorkTileCard({ tile, onClick }: { tile: WorkTile; onClick: () => void }) {
  const [isHovered, setIsHovered] = useState(false);
  const tileRef = useRef<HTMLButtonElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  /* Boot the Vimeo player only when the tile approaches the viewport
     (loading="lazy" alone still boots them too eagerly and isn't
     supported by every Safari) - part of the 7/2 mobile-perf fixes. */
  const near = useNearViewport(tileRef, "500px");
  /* Poster stays visible until the player CONFIRMS it is playing, so
     browsers that block autoplay (Safari Low Power Mode etc.) show the
     tile image instead of a black/frozen player. */
  const playing = useVimeoPlaying(iframeRef, near && !!tile.vimeoId);
  return (
    <button
      ref={tileRef}
      type="button"
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative overflow-hidden text-left flex-shrink-0 aspect-[4/5]"
      style={{
        width: "clamp(240px, 22vw, 340px)",
        scrollSnapAlign: "start",
      }}
    >
      {/* Poster image - used as the visual for PHOTOGRAPHY tiles and
          as the fallback / first-paint for VIDEOGRAPHY tiles before
          the Vimeo iframe boots. Slow Ken-Burns zoom on hover. */}
      <img
        src={tile.image}
        alt={`${tile.type} - ${tile.category}`}
        loading="lazy"
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1100ms] ease-out"
        style={{ transform: isHovered ? "scale(1.06)" : "scale(1)" }}
      />

      {/* Vimeo background video - overlays the poster image on
          VIDEOGRAPHY tiles that have a vimeoId. Sized at 300% w/h
          and centred so the iframe always covers a 4:5 tile at any
          viewport. loading="lazy" defers the network request until
          the tile is near the viewport, keeping the home page fast
          even with five embedded videos. The same Ken-Burns zoom
          is applied so the motion-feel matches Photography tiles. */}
      {tile.type === "VIDEOGRAPHY" && tile.vimeoId && near && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* playsinline=1: required for inline autoplay on iOS (Safari
              AND Chrome-on-iOS - both WebKit). quality=540p: tiles are
              at most ~340px wide, streaming more is wasted bandwidth
              and was a big part of the mobile stutter. Fades in only
              once actually playing - the poster image stays otherwise. */}
          <iframe
            ref={iframeRef}
            src={`https://player.vimeo.com/video/${tile.vimeoId}?background=1&autoplay=1&loop=1&muted=1&playsinline=1&quality=540p&autopause=0&title=0&byline=0&portrait=0&controls=0&dnt=1${tile.vimeoHash ? `&h=${tile.vimeoHash}` : ""}`}
            loading="lazy"
            allow="autoplay; fullscreen"
            title={`${tile.category} - videography reel`}
            className="absolute transition-[transform,opacity] duration-[1100ms] ease-out"
            style={{
              top: "50%",
              left: "50%",
              width: "300%",
              height: "300%",
              transform: `translate(-50%, -50%) scale(${isHovered ? 1.06 : 1})`,
              border: 0,
              opacity: playing ? 1 : 0,
            }}
          />
        </div>
      )}

      {/* Top + bottom dark gradient for white-text legibility */}
      <div
        className="absolute inset-0 transition-opacity duration-500 pointer-events-none"
        style={{
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.10) 35%, rgba(0,0,0,0.20) 65%, rgba(0,0,0,0.85) 100%)",
        }}
      />

      {/* Top-left - type tag (PHOTOGRAPHY / VIDEOGRAPHY) */}
      <div className="absolute top-5 left-5 sm:top-6 sm:left-6 lg:top-7 lg:left-7">
        <p
          className="text-[10px] sm:text-xs font-semibold tracking-[0.3em] uppercase transition-colors duration-500"
          style={{ color: isHovered ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.7)" }}
        >
          {tile.type}
        </p>
      </div>

      {/* Bottom - big category name + description teaser */}
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
        {/* Description - collapses to 0 height when not hovered.
            maxHeight raised from 5rem to 16rem (256px) so the long
            V/Industrial description ('Corporate, medical, and
            industrial videography that highlights process and
            precision.') no longer clips at the bottom. Easing
            switched to the premium cubic-bezier curve used elsewhere
            in the hero/menu for a smoother feel. */}
        <div
          className="overflow-hidden transition-all duration-[700ms]"
          style={{
            maxHeight: isHovered ? "16rem" : "0",
            opacity: isHovered ? 1 : 0,
            transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
          }}
        >
          <p className="text-xs sm:text-sm text-white/75 leading-snug mt-2 sm:mt-3">
            {tile.description}
          </p>
        </div>
      </div>

      {/* Hairline accent at top - brightens on hover */}
      <span
        className="absolute top-0 left-0 right-0 h-px transition-colors duration-500 pointer-events-none"
        style={{ backgroundColor: isHovered ? "rgba(255,255,255,0.55)" : "rgba(255,255,255,0.12)" }}
      />
    </button>
  );
}

/* ──────────────────────────────────────────────────────────────────── */
/*  Section wrapper - normal-flow section with a manual horizontal       */
/*  scroller (arrow buttons + drag/swipe).                               */
/*                                                                       */
/*  Brandi new-PDF page 4: the old scroll-pinned 400vh layout hijacked   */
/*  the page's vertical scroll to drive the horizontal tile movement.    */
/*  She asked to remove that ('let's not have a scroll down required...  */
/*  we want them to be able to go straight down the page') and instead   */
/*  let people move the tiles themselves. So the section is now a normal */
/*  block: the page scrolls straight past it, and the tile row is a      */
/*  native overflow-x scroller with left/right arrow buttons.            */
/* ──────────────────────────────────────────────────────────────────── */
export function WorkCategoriesSection(_props: WorkCategoriesSectionProps) {
  const stripRef = useRef<HTMLDivElement>(null);

  const navigate = (href: string) => {
    window.history.pushState(null, "", href);
    window.dispatchEvent(new PopStateEvent("popstate"));
    scrollToTopInstant();
  };

  /* Scroll the tile strip by roughly one tile-and-a-half per click. */
  const scrollByTiles = (dir: -1 | 1) => {
    const el = stripRef.current;
    if (!el) return;
    const amount = Math.min(el.clientWidth * 0.8, 520);
    el.scrollBy({ left: dir * amount, behavior: "smooth" });
  };

  return (
    <section
      id="work"
      className="relative bg-dark py-20 sm:py-28 lg:py-32"
    >
      {/* Header - Brandi new-PDF page 4:
          • paragraph moved ABOVE the heading
          • WORK made WAY larger with a slide-in entrance
          • kept WHITE (the section sits on a dark background, so the
            'still in black' note from the PDF - a carry-over from the
            cream CAMPAIGNS section - does not apply here). */}
      <div className="max-w-[1800px] mx-auto w-full px-4 sm:px-6 lg:px-10 mb-10 sm:mb-12">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
          <div>
            <p className="text-base sm:text-lg text-white/60 max-w-xl mb-5 sm:mb-6">
              Browse our photography and videography by industry - fashion/editorial,
              performing arts, retail, industrial, documentary and more.
            </p>
            <motion.h2
              initial={{ opacity: 0, x: -120, skewX: 8 }}
              whileInView={{ opacity: 1, x: 0, skewX: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="font-display text-7xl sm:text-8xl lg:text-9xl xl:text-[150px] text-white tracking-tight leading-[0.85]"
            >
              WORK
            </motion.h2>
          </div>

          {/* Arrow controls - let visitors move the tiles themselves
              instead of forcing a long scroll. Hidden on touch where
              native swipe is more natural; shown from sm up. */}
          <div className="hidden sm:flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => scrollByTiles(-1)}
              aria-label="Scroll work tiles left"
              className="w-12 h-12 rounded-full border border-white/30 flex items-center justify-center text-white hover:bg-white hover:text-dark transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={() => scrollByTiles(1)}
              aria-label="Scroll work tiles right"
              className="w-12 h-12 rounded-full border border-white/30 flex items-center justify-center text-white hover:bg-white hover:text-dark transition-colors"
            >
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Horizontal tile strip - native overflow-x scroller. Drag/swipe
          on touch, arrow buttons above on desktop. The page's vertical
          scroll is no longer hijacked - users flow straight down. */}
      <div
        ref={stripRef}
        className="overflow-x-auto leaf-scroll"
        style={{ scrollSnapType: "x mandatory" }}
      >
        <div className="flex gap-3 sm:gap-4 px-4 sm:px-6 lg:px-10 pb-6">
          {WORK_TILES.map((tile) => (
            <WorkTileCard
              key={tile.id}
              tile={tile}
              onClick={() => navigate(tile.href)}
            />
          ))}
        </div>
      </div>

      {/* CTA - Brandi new-PDF page 4: 'Get in Touch' button to contact. */}
      <div className="max-w-[1800px] mx-auto w-full px-4 sm:px-6 lg:px-10 mt-12 sm:mt-16 flex flex-col items-center text-center">
        <p className="text-base sm:text-lg lg:text-xl text-white/70 max-w-2xl mb-6">
          Looking for a Houston photography and video team for your next
          project? Let's talk about how we can tell your story.
        </p>
        <button
          type="button"
          onClick={() => navigate("/contact/")}
          className="group inline-flex items-center gap-3 px-7 sm:px-9 py-3.5 sm:py-4 bg-white text-dark font-medium tracking-[0.2em] text-xs sm:text-sm uppercase hover:bg-white/90 transition-colors duration-300 cursor-pointer"
        >
          Get in Touch
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </section>
  );
}
