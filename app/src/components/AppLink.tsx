import type { CSSProperties, MouseEvent, ReactNode, Ref } from "react";

interface AppLinkProps {
  /** React 19 ref-as-prop (used by tiles for IntersectionObserver). */
  ref?: Ref<HTMLAnchorElement>;
  /** Real destination path, e.g. "/contact/". Rendered into href so
   *  crawlers see an actual link (the SEO audit flagged the site as
   *  having ZERO internal <a href> links - nav was all <button>s). */
  href: string;
  /** Existing SPA navigation handler (setState/pushState route change). */
  onNav: () => void;
  className?: string;
  style?: CSSProperties;
  "aria-label"?: string;
  title?: string;
  children: ReactNode;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

/**
 * Crawlable internal link: a real <a href> for search engines, but a
 * plain left-click still navigates client-side (no full page reload).
 * Modifier clicks (ctrl/cmd/shift/alt) and middle-click fall through to
 * the browser so open-in-new-tab keeps working like a normal link.
 */
export function AppLink({ href, onNav, children, ...rest }: AppLinkProps) {
  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    if (e.defaultPrevented) return;
    if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    onNav();
  };
  return (
    <a href={href} onClick={handleClick} {...rest}>
      {children}
    </a>
  );
}
