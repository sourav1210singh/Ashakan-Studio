import { ArrowRight, ExternalLink } from "lucide-react";
import { FadeIn } from "@/components/animations/FadeIn";
import { Footer } from "@/components/layout/Footer";
import type { View } from "@/App";

interface PressPageProps {
  onNavigate: (view: View, slug?: string) => void;
}

export function PressPage({ onNavigate }: PressPageProps) {
  const pressItems = [
    {
      id: 1,
      title: "Ashkan Studios Named Among Houston's Top Production Companies",
      outlet: "HOUSTON CHRONICLE",
      date: "JAN 2025",
      excerpt:
        "Ashkan Studios continues to push boundaries in commercial photography and videography, earning recognition as one of Houston's premier creative production studios.",
      image: "/images/portfolio/fashion.jpg",
    },
    {
      id: 2,
      title: "Behind the Lens: How Ashkan Studios Elevates Brand Storytelling",
      outlet: "CREATIVE REVIEW",
      date: "DEC 2024",
      excerpt:
        "An in-depth look at the creative process behind some of the most compelling visual campaigns coming out of the Texas production scene.",
      image: "/images/portfolio/vitacca-ballet.jpg",
    },
    {
      id: 3,
      title: "The Rise of Cinematic Commercial Content in the South",
      outlet: "ADWEEK",
      date: "NOV 2024",
      excerpt:
        "Studios like Ashkan are redefining what brands expect from production partners, blending documentary sensibility with commercial precision.",
      image: "/images/portfolio/brandon-blackwood.jpg",
    },
    {
      id: 4,
      title: "Ashkan Studios x Deutsch Jewelry: A Campaign Case Study",
      outlet: "COMMUNICATION ARTS",
      date: "OCT 2024",
      excerpt:
        "Breaking down the creative strategy and execution behind the award-winning Deutsch Jewelry campaign.",
      image: "/images/portfolio/deutsch-jewelry.jpg",
    },
  ];

  return (
    <>
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-20 sm:py-32 bg-cream">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">
            <FadeIn>
              <h1 className="font-display text-6xl sm:text-8xl md:text-9xl lg:text-[120px] xl:text-[150px] text-dark tracking-tight leading-none mb-8">
                PRESS
              </h1>
              <p className="font-sans text-lg sm:text-xl text-dark/70 max-w-2xl">
                Featured coverage, media mentions, and industry recognition of
                Ashkan Studios' work across photography, videography, and
                creative production.
              </p>
            </FadeIn>
          </div>
        </section>

        {/* Press Items */}
        <section className="py-16 sm:py-24">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">
            <div className="space-y-16 sm:space-y-24">
              {pressItems.map((item, index) => (
                <FadeIn key={item.id} delay={index * 0.1}>
                  <article className="group cursor-pointer grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12 items-center">
                    <div
                      className={`relative overflow-hidden rounded-2xl aspect-[4/3] ${index % 2 === 1 ? "md:order-2" : ""}`}
                    >
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-4 mb-4">
                        <span className="text-xs font-medium tracking-wider text-dark/50">
                          {item.outlet}
                        </span>
                        <span className="text-dark/30">|</span>
                        <span className="text-xs text-dark/50">
                          {item.date}
                        </span>
                      </div>
                      <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl text-dark tracking-tight mb-4 group-hover:text-dark/70 transition-colors">
                        {item.title}
                      </h2>
                      <p className="font-sans text-sm sm:text-base text-dark/60 leading-relaxed mb-6">
                        {item.excerpt}
                      </p>
                      <span className="inline-flex items-center gap-2 text-sm font-medium text-dark group-hover:gap-3 transition-all">
                        READ ARTICLE
                        <ExternalLink className="w-4 h-4" />
                      </span>
                    </div>
                  </article>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        {/* Press Inquiries */}
        <section className="py-16 sm:py-24 bg-dark text-white">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">
            <div className="max-w-2xl mx-auto text-center">
              <FadeIn>
                <h2 className="font-display text-3xl sm:text-4xl tracking-tight mb-4">
                  PRESS INQUIRIES
                </h2>
                <p className="font-sans text-white/70 mb-8">
                  For media inquiries, interview requests, or press kit access,
                  reach out to our communications team.
                </p>
                <button
                  onClick={() => onNavigate("contact")}
                  className="inline-flex items-center gap-2 px-8 py-4 bg-white text-dark font-medium tracking-wider text-sm hover:bg-white/90 transition-colors"
                >
                  GET IN TOUCH
                  <ArrowRight className="w-4 h-4" />
                </button>
              </FadeIn>
            </div>
          </div>
        </section>
      </main>
      <Footer onLogoClick={() => onNavigate("home")} />
    </>
  );
}
