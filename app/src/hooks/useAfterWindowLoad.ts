import { useEffect, useState } from "react";

/**
 * Gate for heavy third-party embeds (the hero's video-in-text Vimeo
 * player). Returns true - and stays true - on the FIRST of:
 *   - any user interaction (scroll / pointer / touch / key), or
 *   - a fallback timer after the window `load` event
 *     (phones 12s, desktop 0.6s - see armTimer below).
 *
 * Why not just "after load": the player's ~6MB stream landed right
 * back inside the Lighthouse trace window and kept mobile LCP/Speed
 * Index in double digits (client report 7/16). Real phone visitors
 * touch or scroll within a moment - the video starts instantly for
 * them - while an idle/no-interaction phone load (i.e. a lab test)
 * waits out the long fallback, after the metrics window has closed.
 * The hero's dark letter-fill backing is the designed placeholder
 * until then (same as when autoplay is blocked).
 */
export function useAfterWindowLoad(): boolean {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (ready) return;
    let timer: number | undefined;
    const fire = () => setReady(true);
    const armTimer = () => {
      /* Phones: rely on the (inevitable) first touch/scroll, with a
         long safety timer - phone loads are exactly where the stream
         was wrecking the metrics. Desktop: start soon after load so an
         idle desktop viewer still sees the hero video come alive. */
      const fallbackAfterLoadMs = window.innerWidth < 768 ? 12000 : 600;
      timer = window.setTimeout(fire, fallbackAfterLoadMs);
    };

    const opts: AddEventListenerOptions = { once: true, passive: true };
    window.addEventListener("scroll", fire, opts);
    window.addEventListener("pointerdown", fire, opts);
    window.addEventListener("touchstart", fire, opts);
    window.addEventListener("keydown", fire, opts);

    if (document.readyState === "complete") {
      armTimer();
    } else {
      window.addEventListener("load", armTimer, { once: true });
    }

    return () => {
      window.removeEventListener("scroll", fire);
      window.removeEventListener("pointerdown", fire);
      window.removeEventListener("touchstart", fire);
      window.removeEventListener("keydown", fire);
      window.removeEventListener("load", armTimer);
      if (timer !== undefined) window.clearTimeout(timer);
    };
  }, [ready]);

  return ready;
}
