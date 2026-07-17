import { useRef, type CSSProperties, type ReactNode } from "react";
import { useNearViewport } from "@/hooks/useNearViewport";

/* ────────────────────────────────────────────────────────────────
   LazySection — mounts its children only when the user approaches
   (900px before the viewport). Perf (7/17): the home page executed
   EVERY section's JS during initial load, and on throttled mobile
   runners that main-thread work (TBT 1-2.1s) was the score ceiling
   after the video/bundle/font fixes. Below-fold sections now cost
   zero JS until they're nearly visible.

   The placeholder keeps an approximate height so the scrollbar is
   sane; the swap happens ~900px off-screen, so nothing visible
   shifts (CLS-safe).

   renderImmediately: the prerenderer (localhost) and JS-executing
   crawlers must see the full page in one pass — no lazy gate for
   them. The prerendered static HTML therefore always contains every
   section's content and links regardless of this wrapper.
   ──────────────────────────────────────────────────────────────── */

const renderImmediately = (() => {
  if (typeof window === "undefined") return true;
  const host = window.location.hostname;
  if (host === "127.0.0.1" || host === "localhost") return true; // prerender server
  return /bot|crawl|spider|slurp|bing/i.test(navigator.userAgent);
})();

interface LazySectionProps {
  /** Approximate height reserved before mount (e.g. "100vh"). */
  minHeight: CSSProperties["minHeight"];
  children: ReactNode;
}

export function LazySection({ minHeight, children }: LazySectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const near = useNearViewport(ref, "900px");
  const show = renderImmediately || near;
  return (
    <div ref={ref} style={show ? undefined : { minHeight }}>
      {show ? children : null}
    </div>
  );
}
