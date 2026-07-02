import { useEffect, useState, type RefObject } from "react";

/**
 * True once the element is within `rootMargin` of the viewport, then
 * stays true (one-shot). Used to defer mounting heavy embeds (Vimeo
 * player iframes) until the user actually approaches them - the home
 * page has 8 background videos and booting all players on load was
 * saturating mobile network + video decoders (client report 7/2:
 * videos "slow and stuttering" on Android/iOS).
 *
 * Falls back to `true` immediately when IntersectionObserver is not
 * available, so content never silently fails to appear.
 */
export function useNearViewport(
  ref: RefObject<Element | null>,
  rootMargin = "600px"
): boolean {
  const [near, setNear] = useState(false);

  useEffect(() => {
    if (near) return;
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setNear(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setNear(true);
          io.disconnect();
        }
      },
      { rootMargin }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref, near, rootMargin]);

  return near;
}
