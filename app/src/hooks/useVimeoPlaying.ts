import { useEffect, useState, type RefObject } from "react";

/**
 * True once the Vimeo player inside `iframeRef` reports it is ACTUALLY
 * playing. Two detection paths (both scoped to THIS iframe only, via the
 * e.source check - the home page has 8 players, and listening to "any
 * vimeo message" made one section's poster fade when a DIFFERENT
 * section's video started):
 *   1. player events: subscribe to play/playing via postMessage
 *   2. polling: ask getPaused every second for ~15s (covers browsers
 *      where the event subscription is missed, e.g. the iframe loaded
 *      before the listener was registered)
 *
 * While this stays false the caller keeps its poster/fallback visible -
 * so when Safari (Low Power Mode, autoplay settings) refuses to start
 * the video, visitors see the poster image instead of a black box.
 */
export function useVimeoPlaying(
  iframeRef: RefObject<HTMLIFrameElement | null>,
  active = true
): boolean {
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (!active || playing) return;
    const iframe = iframeRef.current;
    if (!iframe) return;

    const post = (msg: Record<string, unknown>) => {
      try {
        iframe.contentWindow?.postMessage(JSON.stringify(msg), "*");
      } catch {
        /* iframe not ready yet - polling will retry */
      }
    };

    const onMessage = (e: MessageEvent) => {
      // Only accept messages from THIS player's window.
      if (e.source !== iframe.contentWindow) return;
      if (typeof e.origin === "string" && !e.origin.includes("vimeo.com")) return;
      let data: { event?: string; method?: string; value?: unknown };
      try {
        data = typeof e.data === "string" ? JSON.parse(e.data) : e.data;
      } catch {
        return;
      }
      if (!data) return;
      if (data.event === "play" || data.event === "playing") setPlaying(true);
      if (data.method === "getPaused" && data.value === false) setPlaying(true);
    };

    const subscribe = () => {
      ["play", "playing"].forEach((evt) =>
        post({ method: "addEventListener", value: evt })
      );
    };

    window.addEventListener("message", onMessage);
    iframe.addEventListener("load", subscribe);
    subscribe(); // in case the iframe already loaded

    /* Gesture kickstart (iOS): if the initial autoplay attempt was
       denied or lost a boot race, retry play() on the user's FIRST
       interaction - muted+playsinline playback is allowed to start
       from a page interaction on WebKit. Harmless when already
       playing. (Low Power Mode still blocks autoplay entirely; the
       poster stays in that case.) */
    const kick = () => post({ method: "play" });
    window.addEventListener("touchend", kick, { passive: true, once: true });
    window.addEventListener("pointerdown", kick, { once: true });
    window.addEventListener("scroll", kick, { passive: true, once: true });

    const poll = window.setInterval(() => {
      subscribe();
      post({ method: "getPaused" });
    }, 1000);
    // Stop polling after 15s - if it hasn't started by then it won't
    // (autoplay was denied); the poster simply stays up.
    const stop = window.setTimeout(() => window.clearInterval(poll), 15000);

    return () => {
      window.removeEventListener("message", onMessage);
      iframe.removeEventListener("load", subscribe);
      window.removeEventListener("touchend", kick);
      window.removeEventListener("pointerdown", kick);
      window.removeEventListener("scroll", kick);
      window.clearInterval(poll);
      window.clearTimeout(stop);
    };
  }, [iframeRef, active, playing]);

  return playing;
}

/** Vimeo `quality` cap for ambient/background embeds: phones stream
 *  540p, larger screens 720p. Background videos sit behind overlays or
 *  fill small tiles, so anything higher is wasted bandwidth - the
 *  uncapped players were pulling ~58 MB on one home-page visit. */
export function bgVideoQuality(): "540p" | "720p" {
  if (typeof window === "undefined") return "720p";
  return window.innerWidth < 768 ? "540p" : "720p";
}
