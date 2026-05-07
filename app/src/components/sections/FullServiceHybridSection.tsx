import { useState } from "react";

/* ════════════════════════════════════════════════════════════════════
   FULL-SERVICE PRODUCTION — Hybrid (editorial + hover-swap).
   Left:  large image preview that crossfades on hover
   Right: numbered discipline list (hover-only, no click)
   Approved on /test/work-split/.
   ════════════════════════════════════════════════════════════════════ */

type Discipline = {
  label: string;
  description: string;
  image: string;
};

const DISCIPLINES: Discipline[] = [
  {
    label: "PHOTOGRAPHERS",
    description: "Editorial, fashion, retail, industrial — frames built to last.",
    image: "/images/categories/fashion/citybook-2024-1000.jpg",
  },
  {
    label: "CINEMATOGRAPHERS",
    description: "Story-driven motion that carries the brand voice forward.",
    image: "/images/portfolio/8-4Q7A9046-2.jpeg",
  },
  {
    label: "DIRECTORS",
    description: "Vision and craft from concept through final delivery.",
    image: "/images/categories/industrial/venus-aerospace-24443-edit.jpg",
  },
  {
    label: "HAIR / MAKEUP",
    description: "Camera-ready beauty for every frame on set.",
    image: "/images/portfolio/beauty-portrait-ofstylish-woman-with-colorful-tur-2023-11-27-05-34-51-utc.jpeg",
  },
  {
    label: "STYLISTS",
    description: "Wardrobe, prop, and set styling tuned to the story.",
    image: "/images/categories/fashion/finn-hackney-62296-edit.jpg",
  },
  {
    label: "SOUND / AUDIO",
    description: "Capture, mix, and music supervision built for the cut.",
    image: "/images/categories/the-arts/lauren-anderson-2490-edit.jpg",
  },
  {
    label: "DESIGNERS",
    description: "Set design, graphics, and creative direction.",
    image: "/images/categories/retail/296gtb-070.jpg",
  },
  {
    label: "PRE & POST PRODUCTION",
    description: "Planning, edit, color, and finish under one roof.",
    image: "/images/portfolio/audaja-skincare.jpg",
  },
  {
    label: "MARKETING SUPPORT",
    description: "Brand strategy and campaign rollout that travel.",
    image: "/images/portfolio/brandon-blackwood.jpg",
  },
];

export function FullServiceHybridSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = DISCIPLINES[activeIndex];

  return (
    <section id="services" className="bg-dark py-20 sm:py-28 lg:py-32 relative overflow-hidden">
      {/* Soft glow accents in background */}
      <div className="absolute inset-0 opacity-[0.07] pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[32rem] h-[32rem] bg-amber-200 rounded-full blur-[140px]" />
        <div className="absolute bottom-0 right-0 w-[28rem] h-[28rem] bg-white rounded-full blur-[140px]" />
      </div>

      <div className="relative z-10 max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-10">
        {/* ── Header ── */}
        <div className="mb-14 sm:mb-20 max-w-3xl">
          <p className="text-xs font-semibold tracking-[0.3em] text-white/50 uppercase mb-4">
            Our Disciplines / 03
          </p>
          <h2 className="font-display text-5xl sm:text-7xl lg:text-8xl text-white tracking-tight leading-[0.9]">
            FULL-SERVICE
            <br />
            PRODUCTION
          </h2>
          <p className="text-base sm:text-lg text-white/60 max-w-xl mt-6 leading-relaxed">
            From concept to delivery, our talented network of directors,
            photographers, cinematographers, stylists, and editors bring your
            vision to life.
          </p>
        </div>

        {/* ── Image (LEFT) + Discipline list (RIGHT) — equal heights ── */}
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-14 items-stretch">
          {/* LEFT — Image preview (cols 1–7, wider) */}
          <div className="lg:col-span-7 order-1">
            <div className="relative overflow-hidden bg-black/30 w-full h-full min-h-[420px] sm:min-h-[520px] lg:min-h-[640px]">
              {/* Crossfading images */}
              {DISCIPLINES.map((d, i) => (
                <img
                  key={d.label}
                  src={d.image}
                  alt={d.label}
                  className="absolute inset-0 w-full h-full object-cover"
                  style={{
                    opacity: activeIndex === i ? 1 : 0,
                    transform: activeIndex === i ? "scale(1)" : "scale(1.04)",
                    transition:
                      "opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1), transform 1.4s cubic-bezier(0.16, 1, 0.3, 1)",
                  }}
                />
              ))}

              {/* Bottom gradient for label legibility */}
              <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/75 via-black/30 to-transparent pointer-events-none" />

              {/* Top-left meta tag */}
              <div className="absolute top-5 left-5 flex items-center gap-2">
                <span className="block w-1.5 h-1.5 rounded-full bg-amber-200 animate-pulse" />
                <span className="text-[10px] font-semibold tracking-[0.3em] text-white/85 uppercase">
                  Now Showing
                </span>
              </div>

              {/* Bottom-left active label */}
              <div className="absolute bottom-5 left-5 right-5 pointer-events-none">
                <p
                  className="font-display text-xl sm:text-2xl text-white tracking-tight leading-tight"
                  style={{ transition: "opacity 0.4s ease-out" }}
                  key={`label-${activeIndex}`}
                >
                  {active.label}
                </p>
                <p className="text-xs sm:text-sm text-white/70 mt-1 leading-snug">
                  {active.description}
                </p>
              </div>

              {/* Subtle inner border */}
              <div className="absolute inset-0 ring-1 ring-inset ring-white/10 pointer-events-none" />
            </div>
          </div>

          {/* RIGHT — Discipline list (cols 8–12, narrower) */}
          <div className="lg:col-span-5 order-2 flex flex-col">
            <ul className="border-t border-white/15 flex-1 flex flex-col">
              {DISCIPLINES.map((d, i) => {
                const isActive = activeIndex === i;
                return (
                  <li
                    key={d.label}
                    className="border-b border-white/15 flex-1 flex"
                    onMouseEnter={() => setActiveIndex(i)}
                  >
                    <div
                      className="flex items-center gap-5 sm:gap-8 py-4 sm:py-5 relative w-full"
                      style={{
                        transition: "padding-left 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
                        paddingLeft: isActive ? "1rem" : "0",
                      }}
                    >
                      {/* Active accent bar */}
                      <span
                        className="absolute left-0 top-1/2 -translate-y-1/2 bg-amber-200/80"
                        style={{
                          width: isActive ? "8px" : "0px",
                          height: isActive ? "60%" : "0%",
                          transition:
                            "width 0.4s cubic-bezier(0.16, 1, 0.3, 1), height 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
                        }}
                      />

                      {/* Label */}
                      <div className="flex-1 min-w-0">
                        <span
                          className="font-display text-2xl sm:text-3xl lg:text-[36px] tracking-tight uppercase block leading-tight"
                          style={{
                            color: isActive ? "#FFFFFF" : "rgba(255,255,255,0.40)",
                            transition: "color 0.4s ease-out",
                          }}
                        >
                          {d.label}
                        </span>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>

            {/* Hint */}
            <p className="text-xs font-medium tracking-[0.3em] text-white/35 uppercase mt-6">
              Hover a discipline to preview
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
