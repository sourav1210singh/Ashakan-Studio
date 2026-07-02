// ────────────────────────────────────────────────────────────────
// Instant scroll-to-top for ROUTE CHANGES.
//
// index.css sets `html { scroll-behavior: smooth }`, so a plain
// window.scrollTo(0, 0) animates. That's fine for in-page anchors,
// but on route changes Safari cancels the in-flight smooth scroll
// as soon as React swaps the page content — the new page then stays
// stuck at the old scroll position (client bug report, Ashkan 7/1:
// "clicking page links in the footer, the page changes but stays
// scrolled down at the footer"). Because the page never reaches the
// top, the header's hide-on-scroll state also stays hidden ("the top
// menu disappears... after refreshing it loads correctly").
//
// Fix: temporarily force `scroll-behavior: auto` on <html> and jump
// to (0,0) synchronously — an instant jump can't be cancelled. The
// inline override is restored right after so anchor scrolling stays
// smooth everywhere else.
// ────────────────────────────────────────────────────────────────
export function scrollToTopInstant(): void {
  const html = document.documentElement;
  const prev = html.style.scrollBehavior;
  html.style.scrollBehavior = "auto";
  window.scrollTo(0, 0);
  html.style.scrollBehavior = prev;
}
