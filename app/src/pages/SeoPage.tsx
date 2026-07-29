import { useEffect, useState } from "react";
import { ArrowRight, Plus } from "lucide-react";
import { FadeIn } from "@/components/animations/FadeIn";
import { Footer } from "@/components/layout/Footer";
import { AppLink } from "@/components/AppLink";
import { seoFaqs } from "@/data/seo-faqs";
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
  const faqs = seoFaqs[data.slug] || [];
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  /* FAQPage JSON-LD, generated from the SAME copy the page renders, so
     the markup Google reads can never drift from what visitors see.
     Injected into <head> on mount; the prerenderer snapshots the live
     DOM, so it ends up in the static HTML of each page too. */
  useEffect(() => {
    if (faqs.length === 0) return;
    const id = "faq-schema";
    document.getElementById(id)?.remove();
    const el = document.createElement("script");
    el.id = id;
    el.type = "application/ld+json";
    el.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqs.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    });
    document.head.appendChild(el);
    return () => {
      document.getElementById(id)?.remove();
    };
  }, [faqs]);

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

        {/* ━━━ FAQ (SEO team copy; same source as the JSON-LD above) ━━━ */}
        {faqs.length > 0 && (
          <section className="py-20 sm:py-28 bg-cream">
            <div className="max-w-[860px] mx-auto px-4 sm:px-6">
              <FadeIn>
                <p className="text-xs font-semibold tracking-[0.3em] text-dark/45 uppercase mb-4">
                  FAQ
                </p>
                <h2 className="font-display text-4xl sm:text-5xl text-dark tracking-tight leading-[0.95] mb-10">
                  FREQUENTLY ASKED QUESTIONS
                </h2>
              </FadeIn>

              <div className="border-t border-dark/15">
                {faqs.map((faq, i) => {
                  const open = openFaq === i;
                  return (
                    <div key={faq.q} className="border-b border-dark/15">
                      <button
                        type="button"
                        onClick={() => setOpenFaq(open ? null : i)}
                        aria-expanded={open}
                        className="w-full flex items-start justify-between gap-6 text-left py-5 sm:py-6 group"
                      >
                        <span className="font-display text-lg sm:text-xl text-dark leading-snug tracking-tight">
                          {faq.q}
                        </span>
                        <Plus
                          className={`w-5 h-5 flex-shrink-0 mt-1 text-dark/50 group-hover:text-dark transition-transform duration-300 ${open ? "rotate-45" : ""}`}
                        />
                      </button>
                      {/* Answers stay in the DOM when collapsed (grid-rows
                          trick) so crawlers read every answer. */}
                      <div
                        className={`grid transition-all duration-300 ease-out ${open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
                      >
                        <div className="min-h-0 overflow-hidden">
                          <p className="text-[15px] sm:text-base text-dark/70 leading-relaxed pb-6 pr-8">
                            {faq.a}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        )}

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
