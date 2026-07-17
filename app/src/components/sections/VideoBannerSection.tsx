import { useRef } from "react";
import { useVimeoPlaying, bgVideoQuality } from "@/hooks/useVimeoPlaying";
import { useNearViewport } from "@/hooks/useNearViewport";
import { useAfterWindowLoad } from "@/hooks/useAfterWindowLoad";

/* ════════════════════════════════════════════════════════════════════
   VIDEO BANNER - full-width looping Vimeo banner placed between the
   hero and the CAMPAIGNS section on the home page.

   Brandi new-PDF page 2:
     "Instead of this big space after the arrow into the campaigns,
      let's have a full width video banner, use this link below for
      video: https://vimeo.com/1040829359"

   The Vimeo iframe is in 'background' mode (autoplay, muted, loop, no
   controls), sized to COVER the band without letterboxing.

   Black-flash fix: the iframe paints its OWN black background until the
   first video frame renders, so the band used to show a black box for a
   few seconds on load. A poster still (the video's own Vimeo thumbnail)
   now sits ON TOP of the iframe and fades out only once Vimeo reports it
   is actually playing (via the player's postMessage API), with a safety
   timeout so it never gets stuck.
   ════════════════════════════════════════════════════════════════════ */

const BANNER_VIMEO_ID = "1040829359";

export function VideoBannerSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  /* Perf (7/16): this player used to boot at t=0 alongside the hero's
     and their combined streams (~12MB in the Lighthouse window) sank
     mobile scores into the 20s. The band sits just below the fold, so
     proximity alone still fired at load - it must ALSO wait for the
     first interaction (or the post-load fallback). Scrolling to see
     the band IS an interaction, and the poster below covers the iframe
     until the video actually plays, so nothing visibly changes. */
  const near = useNearViewport(sectionRef, "300px");
  const afterLoad = useAfterWindowLoad();
  const mountVideo = near && afterLoad;
  /* Shared hook (7/2): scopes play-detection to THIS iframe via
     e.source (the old inline listener accepted any Vimeo message, so
     ANOTHER section's video starting used to fade this poster), and
     drops the old 4s force-hide - if autoplay is denied (Safari Low
     Power Mode etc.) the poster now simply stays, never a black box. */
  const videoReady = useVimeoPlaying(iframeRef, mountVideo);

  return (
    <section ref={sectionRef} className="relative w-full overflow-hidden bg-dark">
      {/* Aspect-controlled band: shorter on mobile, taller on desktop. */}
      <div className="relative w-full h-[42vw] min-h-[220px] max-h-[640px]">
        {mountVideo && (
          <iframe
            ref={iframeRef}
            src={`https://player.vimeo.com/video/${BANNER_VIMEO_ID}?background=1&autoplay=1&loop=1&muted=1&playsinline=1&quality=${bgVideoQuality()}&autopause=0&title=0&byline=0&portrait=0&controls=0`}
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
        )}

        {/* Poster still (the video's own thumbnail) - covers Vimeo's black
            background instantly, fades out once the video starts playing. */}
        <img
          src="/images/sections/video-banner-poster.webp"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700"
          style={{ opacity: videoReady ? 0 : 1 }}
        />

        {/* Subtle top + bottom gradient so the banner blends into the
            cream hero above and the section below without a hard seam. */}
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-black/10 via-transparent to-black/10" />
      </div>
    </section>
  );
}
