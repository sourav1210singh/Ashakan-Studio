import { useEffect, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";
import { FadeIn } from "@/components/animations/FadeIn";

export function AboutSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [imageY, setImageY] = useState(10);

  useEffect(() => {
    const handleScroll = () => {
      if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect();
        const scrollProgress = -rect.top / (rect.height + window.innerHeight);
        setImageY(10 - scrollProgress * 20);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="py-14 sm:py-24 lg:py-28 bg-cream overflow-hidden"
    >
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* ============================================================ */}
          {/*  LEFT — Background heading + paragraph + button              */}
          {/* ============================================================ */}
          <div className="order-2 lg:order-1 relative">

            {/* Main heading */}
            <FadeIn>
              <h2 className="font-display text-dark tracking-tight leading-[0.95] mb-6 sm:mb-8">
                <span className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl">
                  BASED IN
                  <br />
                  HOUSTON, TX
                </span>
                <br />
                <span className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl text-dark/40">
                  ENDLESS POSSIBILITIES
                </span>
              </h2>
            </FadeIn>

            {/* Paragraph 1 */}
            <FadeIn delay={0.1}>
              <p className="text-base sm:text-lg text-dark/70 leading-relaxed mb-5 sm:mb-6 max-w-lg">
                Every project begins with your story. From concept development
                to final delivery, our in-house team manages each phase with
                precision, creativity, and intention.
              </p>
            </FadeIn>

            {/* Paragraph 2 */}
            <FadeIn delay={0.2}>
              <p className="text-base sm:text-lg text-dark/70 leading-relaxed mb-5 sm:mb-6 max-w-lg">
                Bold vision? Ambitious production? Complete creative
                partnership?{" "}
                <span className="font-medium text-dark">We're ready.</span>
              </p>
            </FadeIn>

            {/* Paragraph 3 */}
            <FadeIn delay={0.25}>
              <p className="text-base sm:text-lg text-dark/70 leading-relaxed mb-8 sm:mb-10 max-w-lg">
                Curious? Discover the studio behind the work.
              </p>
            </FadeIn>

            {/* ABOUT US Button */}
            <FadeIn delay={0.35}>
              <a
                href="#"
                className="inline-flex items-center gap-2 sm:gap-3 text-dark group transition-transform duration-200 hover:translate-x-1"
              >
                <span className="text-sm sm:text-base font-medium tracking-wider">
                  ABOUT US
                </span>
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-dark flex items-center justify-center group-hover:bg-dark group-hover:text-white transition-colors">
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
              </a>
            </FadeIn>
          </div>

          {/* ============================================================ */}
          {/*  RIGHT — Horizontal landscape image                          */}
          {/* ============================================================ */}
          <div className="order-1 lg:order-2 relative">
            <FadeIn direction="left" delay={0.2}>
              <div className="relative aspect-[3/2] rounded-2xl sm:rounded-3xl overflow-hidden">
                <div
                  className="absolute inset-0"
                  style={{ transform: `translateY(${imageY}%)` }}
                >
                  <img
                    src="/images/sections/studio.jpg"
                    alt="Ashkan Studios"
                    className="w-full h-[120%] object-cover"
                  />
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </div>
    </section>
  );
}
