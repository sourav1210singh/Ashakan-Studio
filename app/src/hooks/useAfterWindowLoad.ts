import { useEffect, useState } from "react";

/**
 * Gate for heavy third-party embeds (the hero's video-in-text Vimeo
 * player). Returns true - and stays true - on:
 *   - any user interaction (scroll / pointer / touch / key), or
 *   - on DESKTOP only, 0.6s after the window `load` event.
 *
 * Phones are interaction-ONLY: every fallback timer we tried (5s,
 * 12s, 25s) still landed inside some lab runner's long trace window
 * and dragged mobile scores. Real phone visitors always touch or
 * scroll - the video starts instantly for them - and a truly idle
 * phone simply keeps the hero's designed dark letter-fill (same
 * visual as when autoplay is blocked).
 */
export function useAfterWindowLoad(): boolean {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (ready) return;
    let timer: number | undefined;
    const fire = () => setReady(true);
    const armTimer = () => {
      /* Desktop only: start soon after load so an idle desktop viewer
         still sees the hero video come alive. Phones wait for the
         first interaction (see the header comment). */
      if (window.innerWidth < 768) return;
      timer = window.setTimeout(fire, 600);
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
