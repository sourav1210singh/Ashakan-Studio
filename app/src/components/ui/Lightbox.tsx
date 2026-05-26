import { useEffect, useState, useCallback, useRef } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

/* ════════════════════════════════════════════════════════════════════
   Lightbox - full-screen image viewer with keyboard nav + thumbnail
   strip. Brandi's 5/7/26 review notes:
     'Every photo in any gallery should be clickable to a lightbox
      that they can explore the whole gallery in large.'

   Used across:
     • Photography category pages (4)
     • Campaign detail pages (4) - image gallery items only
     • About section (single image enlarge)
     • anywhere else photos are displayed in the future

   Controls:
     • Click outside the image  -> close
     • X button (top-right)     -> close
     • Esc key                  -> close
     • Left / Right arrow keys  -> prev / next
     • Click prev / next arrow  -> prev / next
     • Click a thumbnail        -> jump to that image
   ════════════════════════════════════════════════════════════════════ */

export interface LightboxImage {
  src: string;
  alt: string;
}

interface LightboxProps {
  images: LightboxImage[];
  isOpen: boolean;
  initialIndex?: number;
  onClose: () => void;
}

export function Lightbox({
  images,
  isOpen,
  initialIndex = 0,
  onClose,
}: LightboxProps) {
  const [index, setIndex] = useState(initialIndex);
  const activeThumbRef = useRef<HTMLButtonElement>(null);

  /* Reset to whatever image the user clicked whenever the lightbox
     is freshly opened. */
  useEffect(() => {
    if (isOpen) setIndex(initialIndex);
  }, [isOpen, initialIndex]);

  const next = useCallback(() => {
    setIndex((i) => (i + 1) % images.length);
  }, [images.length]);

  const prev = useCallback(() => {
    setIndex((i) => (i - 1 + images.length) % images.length);
  }, [images.length]);

  /* Keyboard navigation - only while open */
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        next();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        prev();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, next, prev, onClose]);

  /* Lock body scroll while the lightbox is open so the background
     page doesn't shift around as the user navigates. */
  useEffect(() => {
    if (!isOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen]);

  /* Keep the active thumbnail visible inside the scrollable strip. */
  useEffect(() => {
    if (!isOpen || !activeThumbRef.current) return;
    activeThumbRef.current.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
  }, [index, isOpen]);

  if (!isOpen || images.length === 0) return null;

  const img = images[index];
  const stop = (e: React.MouseEvent) => e.stopPropagation();

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/95 flex flex-col animate-[fadeIn_0.2s_ease-out]"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Image viewer"
    >
      {/* Top bar - counter + close */}
      <div
        className="flex items-center justify-between p-4 sm:p-6 text-white z-10"
        onClick={stop}
      >
        <span className="text-xs sm:text-sm font-semibold tracking-[0.3em] uppercase text-white/70">
          {index + 1} / {images.length}
        </span>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Image - centered, contains within viewport.
          `min-h-0` is critical: without it the flex-1 middle div
          inherits min-height:auto and lets tall images push the
          container past the viewport - which caused the bottom of
          the studio photo to clip on the home page lightbox.
          With min-h-0 the flex item can shrink below its content
          intrinsic size, so `max-h-full + object-contain` on the
          <img> properly letterboxes the image within the viewport
          regardless of natural aspect. */}
      <div className="flex-1 min-h-0 flex items-center justify-center px-4 sm:px-10 lg:px-20 relative">
        <img
          key={img.src}
          src={img.src}
          alt={img.alt}
          className="max-w-full max-h-full object-contain animate-[zoomIn_0.25s_ease-out]"
          onClick={stop}
        />

        {/* Prev / Next arrows - only when more than one image */}
        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={(e) => {
                stop(e);
                prev();
              }}
              aria-label="Previous image"
              className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              type="button"
              onClick={(e) => {
                stop(e);
                next();
              }}
              aria-label="Next image"
              className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}
      </div>

      {/* Caption + thumbnail strip */}
      <div className="p-4 sm:p-6 z-10" onClick={stop}>
        {img.alt && (
          <p className="text-xs sm:text-sm text-white/60 text-center mb-3 sm:mb-4 max-w-3xl mx-auto">
            {img.alt}
          </p>
        )}

        {images.length > 1 && (
          <div className="flex justify-start sm:justify-center gap-2 overflow-x-auto pb-2 max-w-full leaf-scroll">
            {images.map((thumb, i) => {
              const isActive = i === index;
              return (
                <button
                  key={`${thumb.src}-${i}`}
                  ref={isActive ? activeThumbRef : null}
                  type="button"
                  onClick={() => setIndex(i)}
                  className="flex-shrink-0 w-12 h-12 sm:w-16 sm:h-16 overflow-hidden transition-all"
                  style={{
                    outline: isActive ? "2px solid white" : "none",
                    outlineOffset: "2px",
                    opacity: isActive ? 1 : 0.45,
                  }}
                  aria-label={`Go to image ${i + 1}`}
                  aria-current={isActive ? "true" : undefined}
                >
                  <img
                    src={thumb.src}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Local keyframes - fade in the backdrop, zoom in the image */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes zoomIn {
          from { opacity: 0; transform: scale(0.96); }
          to   { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}
