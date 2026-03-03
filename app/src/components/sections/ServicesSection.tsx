import { useEffect, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";
import { services } from "@/data/portfolio";

export function ServicesSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const [scrollY, setScrollY] = useState(0);
  const [headingVisible, setHeadingVisible] = useState(false);
  const [contentVisible, setContentVisible] = useState(false);

  /* Parallax scroll */
  useEffect(() => {
    const handleScroll = () => {
      if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect();
        const scrollProgress = -rect.top / (rect.height + window.innerHeight);
        setScrollY(scrollProgress * 30);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* Heading scroll-trigger (play once) */
  useEffect(() => {
    const el = headingRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHeadingVisible(true);
          /* Stagger: content appears shortly after heading */
          setTimeout(() => setContentVisible(true), 300);
          observer.unobserve(el);
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="services"
      className="relative min-h-[60vh] sm:min-h-[80vh] flex items-center justify-center overflow-hidden"
    >
      {/* ---- Background Image with Parallax ---- */}
      <div
        className="absolute inset-0 z-0"
        style={{ transform: `translateY(${scrollY}%)` }}
      >
        <img
          src="/images/sections/services-bg.jpg"
          alt="Production services"
          className="w-full h-[130%] object-cover"
        />
        {/* Dark overlay — 65% for readability while keeping cinematic feel */}
        <div className="absolute inset-0 bg-dark/65" />
      </div>

      {/* ---- Content ---- */}
      <div
        ref={headingRef}
        className="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 py-14 sm:py-24"
      >
        <div className="flex flex-col items-center text-center">

          {/* ============================================================ */}
          {/*  Heading — inside black container block                       */}
          {/*  Subtle fade-in + 12px upward motion, 700ms, cubic-bezier    */}
          {/* ============================================================ */}
          <div
            className="mb-4 sm:mb-5"
            style={{
              opacity: headingVisible ? 1 : 0,
              transform: headingVisible ? "translateY(0)" : "translateY(12px)",
              transition:
                "opacity 0.7s cubic-bezier(.16,1,.3,1), transform 0.7s cubic-bezier(.16,1,.3,1)",
            }}
          >
            <h2
              className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-[88px] xl:text-[106px] text-white tracking-tight leading-none services-heading-float"
              style={{ willChange: "transform" }}
            >
              FULL-SERVICE
              <br />
              PRODUCTION
            </h2>
          </div>

          {/* ============================================================ */}
          {/*  Subtext — inside separate black container block              */}
          {/*  max-width ~780px for clean 2-line wrap on desktop            */}
          {/* ============================================================ */}
          <div
            className="mb-6 sm:mb-8"
            style={{
              opacity: contentVisible ? 1 : 0,
              transform: contentVisible ? "translateY(0)" : "translateY(12px)",
              transition:
                "opacity 0.7s cubic-bezier(.16,1,.3,1) 0.1s, transform 0.7s cubic-bezier(.16,1,.3,1) 0.1s",
            }}
          >
            <p
              className="mx-auto text-base sm:text-lg lg:text-xl text-white/85 leading-relaxed"
              style={{ maxWidth: "780px", lineHeight: 1.55 }}
            >
              From concept to delivery, our talented network of directors,
              photographers, cinematographers, stylists, and editors bring your
              vision to life.
            </p>
          </div>

          {/* ============================================================ */}
          {/*  Services list                                                */}
          {/* ============================================================ */}
          <div
            className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-10 sm:mb-14 max-w-3xl"
            style={{
              opacity: contentVisible ? 1 : 0,
              transform: contentVisible ? "translateY(0)" : "translateY(12px)",
              transition:
                "opacity 0.7s cubic-bezier(.16,1,.3,1) 0.25s, transform 0.7s cubic-bezier(.16,1,.3,1) 0.25s",
            }}
          >
            {services.map((service, index) => (
              <span
                key={service}
                className="text-xs sm:text-sm font-medium tracking-wider text-white/60 px-2 sm:px-3 py-1"
              >
                {service}
                {index < services.length - 1 && (
                  <span className="ml-2 sm:ml-3 text-white/30">|</span>
                )}
              </span>
            ))}
          </div>

          {/* ============================================================ */}
          {/*  CTA Button — outlined white, hover invert                   */}
          {/* ============================================================ */}
          <div
            style={{
              opacity: contentVisible ? 1 : 0,
              transform: contentVisible ? "translateY(0)" : "translateY(12px)",
              transition:
                "opacity 0.7s cubic-bezier(.16,1,.3,1) 0.4s, transform 0.7s cubic-bezier(.16,1,.3,1) 0.4s",
            }}
          >
            <a
              href="#"
              className="inline-flex items-center gap-2 sm:gap-3 px-6 sm:px-8 py-3 sm:py-4 border border-white text-white font-medium tracking-wider text-sm sm:text-base hover:bg-white hover:text-dark transition-colors duration-300"
            >
              EXPLORE SERVICES
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </a>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes cinematicFloat {
          0%, 100% { transform: translate3d(0, 0, 0); }
          50%      { transform: translate3d(0, -16px, 0); }
        }
        .services-heading-float {
          animation: cinematicFloat 4.5s ease-in-out infinite;
        }
        @media (max-width: 1024px) {
          @keyframes cinematicFloat {
            0%, 100% { transform: translate3d(0, 0, 0); }
            50%      { transform: translate3d(0, -10px, 0); }
          }
        }
        @media (max-width: 640px) {
          .services-heading-float { animation: none; }
        }
        @media (prefers-reduced-motion: reduce) {
          .services-heading-float { animation: none; }
        }
      `}</style>
    </section>
  );
}
