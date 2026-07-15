import { ArrowRight } from "lucide-react";
import { FadeIn } from "@/components/animations/FadeIn";
import { Footer } from "@/components/layout/Footer";
import { AppLink } from "@/components/AppLink";
import type { View } from "@/App";

export interface SeoPageData {
  slug: string;
  title: string;
  subtitle: string;
  heroImage: string;
  intro: string;
  videoEmbed?: string;
  sections: {
    heading: string;
    body: string;
    bullets?: string[];
    image?: string;
    imageAlt?: string;
  }[];
  ctaHeading: string;
  ctaText: string;
  ctaButton: { label: string; view: View; slug?: string };
  metaTitle: string;
  metaDescription: string;
}

interface SeoPageProps {
  data: SeoPageData;
  onNavigate: (view: View, slug?: string) => void;
}

export function SeoPage({ data, onNavigate }: SeoPageProps) {
  return (
    <>
      <main className="pt-20">
        {/* ━━━ Hero - full-bleed image ━━━ */}
        <section className="relative h-[70vh] min-h-[500px] overflow-hidden bg-dark">
          <div className="absolute inset-0">
            <img
              src={data.heroImage}
              alt={data.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-dark/55" />
          </div>

          <div className="relative z-10 h-full flex items-end pb-16 sm:pb-24">
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 w-full">
              <FadeIn>
                <span className="text-sm font-medium tracking-[0.2em] text-white/60 uppercase mb-4 block">
                  ASHKAN STUDIOS · HOUSTON
                </span>
                <h1 className="font-display text-5xl sm:text-7xl lg:text-8xl text-white tracking-tight leading-[0.95]">
                  {data.title}
                </h1>
                <p className="text-lg sm:text-xl text-white/70 max-w-2xl mt-6 leading-relaxed">
                  {data.subtitle}
                </p>
              </FadeIn>
            </div>
          </div>
        </section>

        {/* ━━━ Intro ━━━ */}
        <section className="py-16 sm:py-24 bg-cream">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
              <FadeIn>
                <span className="text-sm font-medium tracking-wider text-dark/40 uppercase mb-4 block">
                  Overview
                </span>
                <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl text-dark tracking-tight leading-[0.95]">
                  {data.subtitle}
                </h2>
              </FadeIn>
              <FadeIn delay={0.1}>
                <p className="text-lg sm:text-xl text-dark/80 leading-relaxed">
                  {data.intro}
                </p>
              </FadeIn>
            </div>
          </div>
        </section>

        {/* ━━━ Video Embed ━━━ */}
        {data.videoEmbed && (
          <section className="py-16 sm:py-24 bg-dark text-white">
            <div className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-10">
              <FadeIn>
                <div className="aspect-video overflow-hidden">
                  <iframe
                    src={data.videoEmbed}
                    className="w-full h-full"
                    allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media"
                    allowFullScreen
                    title="Video"
                  />
                </div>
              </FadeIn>
            </div>
          </section>
        )}

        {/* ━━━ Content Sections ━━━ */}
        {data.sections.map((section, index) => (
          <section
            key={index}
            className={`py-16 sm:py-24 border-t border-dark/10 ${
              index % 2 === 1 ? "bg-cream" : ""
            }`}
          >
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">
              <div
                className={`grid grid-cols-1 ${
                  section.image ? "lg:grid-cols-2" : ""
                } gap-12 lg:gap-20 items-center`}
              >
                <div className={index % 2 === 1 && section.image ? "lg:order-2" : ""}>
                  <FadeIn>
                    <h3 className="font-display text-3xl sm:text-4xl lg:text-5xl text-dark tracking-tight leading-[0.95] mb-6">
                      {section.heading}
                    </h3>
                    <p className="text-lg text-dark/70 leading-relaxed mb-8">
                      {section.body}
                    </p>
                    {section.bullets && section.bullets.length > 0 && (
                      <ul className="space-y-4">
                        {section.bullets.map((bullet, bIdx) => (
                          <li key={bIdx} className="flex items-start gap-4">
                            <div className="w-1 min-h-[20px] bg-dark/20 rounded-full mt-1 shrink-0" />
                            <p className="text-lg text-dark/70 leading-relaxed">
                              {bullet}
                            </p>
                          </li>
                        ))}
                      </ul>
                    )}
                  </FadeIn>
                </div>
                {section.image && (
                  <div className={index % 2 === 1 ? "lg:order-1" : ""}>
                    <FadeIn delay={0.1}>
                      <div className="aspect-[4/3] overflow-hidden">
                        <img
                          src={section.image}
                          alt={section.imageAlt || section.heading}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </FadeIn>
                  </div>
                )}
              </div>
            </div>
          </section>
        ))}

        {/* ━━━ CTA ━━━ */}
        <section className="py-20 sm:py-28 bg-dark text-white">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 text-center">
            <FadeIn>
              <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl tracking-tight leading-[0.95] mb-6">
                {data.ctaHeading}
              </h2>
              <p className="text-lg text-white/60 mb-10 max-w-xl mx-auto leading-relaxed">
                {data.ctaText}
              </p>
              <AppLink
                href={data.ctaButton.view === "contact" ? "/contact/" : "/"}
                onNav={() =>
                  onNavigate(data.ctaButton.view, data.ctaButton.slug)
                }
                className="inline-flex items-center gap-3 px-8 py-4 bg-white text-dark font-medium tracking-wider text-sm group"
              >
                {data.ctaButton.label}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </AppLink>
            </FadeIn>
          </div>
        </section>
      </main>
      <Footer onLogoClick={() => onNavigate("home")} />
    </>
  );
}
