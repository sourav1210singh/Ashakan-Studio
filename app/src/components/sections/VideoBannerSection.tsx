/* ════════════════════════════════════════════════════════════════════
   VIDEO BANNER - full-width looping Vimeo banner placed between the
   hero and the CAMPAIGNS section on the home page.

   Brandi new-PDF page 2:
     "Instead of this big space after the arrow into the campaigns,
      let's have a full width video banner, use this link below for
      video: https://vimeo.com/1040829359"

   Implementation mirrors FullServiceHybridSection's background-video
   pattern: a Vimeo iframe in 'background' mode (autoplay, muted, loop,
   no controls), over-sized and centred so it covers the band at any
   viewport aspect ratio without letterboxing or black bars.

   Responsive: the band height scales down on small screens
   (56vw aspect-ish via fixed responsive heights) so it never
   dominates a phone screen but still reads as a full-width banner.
   ════════════════════════════════════════════════════════════════════ */

const BANNER_VIMEO_ID = "1040829359";

export function VideoBannerSection() {
  return (
    <section className="relative w-full overflow-hidden bg-dark">
      {/* Aspect-controlled band: shorter on mobile, taller on desktop.
          h-[ ] values keep a cinematic wide ratio without depending on
          the iframe's intrinsic size. */}
      <div className="relative w-full h-[42vw] min-h-[220px] max-h-[640px]">
        <iframe
          src={`https://player.vimeo.com/video/${BANNER_VIMEO_ID}?background=1&autoplay=1&loop=1&muted=1&autopause=0&title=0&byline=0&portrait=0&controls=0`}
          className="absolute"
          style={{
            top: "50%",
            left: "50%",
            width: "max(177.78vh, 100vw)",
            height: "max(56.25vw, 100%)",
            transform: "translate(-50%, -50%)",
            border: 0,
          }}
          allow="autoplay; fullscreen"
          title="Ashkan Studios - campaign reel"
        />
        {/* Subtle top + bottom gradient so the banner blends into the
            cream hero above and the section below without a hard seam. */}
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-black/10 via-transparent to-black/10" />
      </div>
    </section>
  );
}
