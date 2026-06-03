import { ArrowRight } from "lucide-react";

/* ════════════════════════════════════════════════════════════════════
   FULL-SERVICE PRODUCTION - single full-bleed row with a looping
   video background, centered title + description, and a 'WHAT WE DO'
   CTA that navigates to the services page.

   Brandi's 5/7/26 review notes for this section (pages 10-11):
     • 'Revert design to previous request' - drop the editorial
       hover-swap layout, go back to a simple bg + centered text row.
     • Use a specific video as the row background (she pointed to one
       in the design reference; user picked Vimeo 1147057440 for now,
       can be swapped if Brandi confirms a different ID later).
     • Description copy verbatim from her notes.
     • CTA: 'WHAT WE DO' → /what-we-do/
     • Discipline list (PHOTOGRAPHERS / CINEMATOGRAPHERS / ...) is
       completely removed per user direction.

   The filename + export name are kept ('FullServiceHybridSection') to
   avoid touching every import site; the implementation underneath is
   completely new.
   ════════════════════════════════════════════════════════════════════ */

/** Vimeo video used as the looping row background.
 *  Public 'Behind the Scenes at Deutsch Campaign Shoot'. No hash needed.
 *  Swap this ID when Brandi confirms her preferred clip. */
const BG_VIMEO_ID = "1147057440";

export function FullServiceHybridSection() {
  /* Per Brandi's new-PDF page 6: the CTA button label changed from
     'What We Do' to 'Let's Create' and now leads to the contact page
     instead of the services page. */
  const goToContact = () => {
    window.history.pushState(null, "", "/contact/");
    window.dispatchEvent(new PopStateEvent("popstate"));
    /* Defensive scroll-to-top - App's popstate handler also calls
       scrollTo(0,0), this is here for redundancy. */
    window.scrollTo(0, 0);
  };

  return (
    <section
      id="services"
      className="relative overflow-hidden bg-dark min-h-[70vh] sm:min-h-[80vh] lg:min-h-[90vh] flex items-center justify-center"
    >
      {/* ── Background video - Vimeo iframe in 'background' mode ──
          The iframe is over-sized (300% w/h) and centred so it covers
          the section at any viewport aspect ratio without letterboxing. */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <iframe
          src={`https://player.vimeo.com/video/${BG_VIMEO_ID}?background=1&autoplay=1&loop=1&muted=1&autopause=0&title=0&byline=0&portrait=0&controls=0`}
          className="absolute"
          style={{
            top: "50%",
            left: "50%",
            width: "300%",
            height: "300%",
            transform: "translate(-50%, -50%)",
            border: 0,
          }}
          allow="autoplay; fullscreen"
          title="Ashkan Studios - production reel"
        />
      </div>

      {/* ── Dark overlay so white text on the video stays legible ── */}
      <div className="absolute inset-0 bg-black/60 pointer-events-none" />

      {/* ── Subtle vignette for a more cinematic frame ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.55) 100%)",
        }}
      />

      {/* ── Centered content ── */}
      <div className="relative z-10 max-w-[1400px] mx-auto w-full px-4 sm:px-6 lg:px-10 py-20 sm:py-28 text-center">
        <h2 className="font-display text-5xl sm:text-7xl md:text-8xl lg:text-[105px] xl:text-[132px] text-white tracking-tight leading-[0.9] mb-6 sm:mb-8">
          FULL-SERVICE
          <br />
          PRODUCTION
        </h2>

        <p
          className="mx-auto text-base sm:text-lg lg:text-xl text-white/85 leading-relaxed mb-10 sm:mb-12 max-w-2xl"
          style={{ textWrap: "balance" } as React.CSSProperties}
        >
          From concept to delivery, our talented network of directors,
          photographers, cinematographers, stylists, and editors bring your
          vision to life.
        </p>

        {/* LET'S CREATE CTA - outlined white, hover invert, leads to contact */}
        <button
          onClick={goToContact}
          className="group inline-flex items-center gap-3 sm:gap-4 px-7 sm:px-9 lg:px-11 py-3.5 sm:py-4 lg:py-5 border border-white text-white font-semibold tracking-[0.3em] text-xs sm:text-sm uppercase hover:bg-white hover:text-dark transition-colors duration-300 cursor-pointer"
        >
          Let's Create
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </section>
  );
}
