import { ArrowRight } from "lucide-react";
import { FadeIn } from "@/components/animations/FadeIn";
import { Footer } from "@/components/layout/Footer";
import type { View } from "@/App";

interface ServicesPageProps {
  onNavigate: (view: View, slug?: string) => void;
}

export function ServicesPage({ onNavigate }: ServicesPageProps) {
  const capabilities = [
    "CAMPAIGN PRODUCTION",
    "PHOTOGRAPHY",
    "VIDEOGRAPHY",
    "CREATIVE DIRECTION",
    "POST PRODUCTION",
  ];

  const servicesList = [
    "Commercial Photography",
    "Product Photography",
    "Editorial Photography",
    "Brand Films",
    "Commercials",
    "Documentary",
    "Social Media Content",
    "Event Coverage",
    "Retouching & Color Grading",
    "Motion Graphics",
  ];

  const teamRoles = [
    "Photographers",
    "Cinematographers",
    "Directors",
    "Hair / Makeup",
    "Stylists",
    "Sound / Audio",
    "Designers",
    "Pre & Post Production",
    "Marketing Support",
  ];

  const process = [
    { step: "01", title: "CONCEPT" },
    { step: "02", title: "PRE-PRODUCTION" },
    { step: "03", title: "PRODUCTION" },
    { step: "04", title: "POST" },
    { step: "05", title: "DELIVERY" },
  ];

  return (
    <>
      <main className="pt-20">
        {/* Section 1 — Overview */}
        <section className="py-20 sm:py-32 bg-cream">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">
            <FadeIn>
              <h1 className="font-display text-6xl sm:text-8xl md:text-9xl lg:text-[120px] xl:text-[150px] text-dark tracking-tight leading-none mb-8">
                WHAT WE DO
              </h1>
              <div className="max-w-3xl">
                <p className="text-xl sm:text-2xl text-dark/80 leading-relaxed">
                  We design and produce photography and video systems for brands.
                  From concept to delivery, our talented network brings your vision to life.
                </p>
              </div>
            </FadeIn>
          </div>
        </section>

        {/* Section 2 — Capabilities */}
        <section className="py-16 sm:py-24 border-t border-dark/10">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">
            <FadeIn>
              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-dark tracking-tight mb-16">
                CAPABILITIES
              </h2>
            </FadeIn>
            <div className="border-t border-dark/10">
              {capabilities.map((item, index) => (
                <FadeIn key={item} delay={index * 0.08}>
                  <div className="py-6 sm:py-8 border-b border-dark/10 flex items-center justify-between group">
                    <span className="font-display text-2xl sm:text-3xl lg:text-4xl text-dark tracking-tight">
                      {item}
                    </span>
                    <span className="text-sm text-dark/30 font-medium tracking-wider">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        {/* 2-Column Lists — Services + Team Roles */}
        <section className="py-16 sm:py-24 bg-cream border-t border-dark/10">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 sm:gap-20">
              {/* Services */}
              <FadeIn>
                <div>
                  <h3 className="font-display text-2xl sm:text-3xl text-dark tracking-tight mb-10">
                    SERVICES
                  </h3>
                  <ul className="space-y-4">
                    {servicesList.map((service) => (
                      <li
                        key={service}
                        className="text-base sm:text-lg text-dark/70 leading-relaxed border-b border-dark/5 pb-4"
                      >
                        {service}
                      </li>
                    ))}
                  </ul>
                </div>
              </FadeIn>

              {/* Team Roles */}
              <FadeIn delay={0.15}>
                <div>
                  <h3 className="font-display text-2xl sm:text-3xl text-dark tracking-tight mb-10">
                    OUR TEAM
                  </h3>
                  <ul className="space-y-4">
                    {teamRoles.map((role) => (
                      <li
                        key={role}
                        className="text-base sm:text-lg text-dark/70 leading-relaxed border-b border-dark/5 pb-4"
                      >
                        {role}
                      </li>
                    ))}
                  </ul>
                </div>
              </FadeIn>
            </div>
          </div>
        </section>

        {/* Section 3 — Process */}
        <section className="py-16 sm:py-24 border-t border-dark/10">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">
            <FadeIn>
              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-dark tracking-tight mb-16">
                PROCESS
              </h2>
            </FadeIn>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8 sm:gap-4">
              {process.map((item, index) => (
                <FadeIn key={item.step} delay={index * 0.1}>
                  <div className="flex items-center gap-4 sm:gap-0 sm:flex-col sm:items-center">
                    <span className="font-display text-4xl sm:text-5xl text-dark/15 tracking-tight">
                      {item.step}
                    </span>
                    <span className="font-display text-lg sm:text-xl text-dark tracking-tight sm:mt-3">
                      {item.title}
                    </span>
                  </div>
                </FadeIn>
              ))}
            </div>
            {/* Connecting line */}
            <div className="hidden sm:block mt-8">
              <div className="h-px bg-dark/10 w-full" />
            </div>
          </div>
        </section>

        {/* CTA — Campaign */}
        <section className="py-20 sm:py-32 bg-dark text-white">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 text-center">
            <FadeIn>
              <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl tracking-tight mb-6">
                SEE OUR CAMPAIGNS
              </h2>
              <p className="text-lg text-white/60 mb-10 max-w-xl mx-auto">
                Explore how we bring brands to life through strategic visual storytelling.
              </p>
              <button
                onClick={() => onNavigate("campaigns")}
                className="inline-flex items-center gap-3 px-8 py-4 bg-white text-dark font-medium tracking-wider text-sm group"
              >
                VIEW CAMPAIGNS
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </FadeIn>
          </div>
        </section>
      </main>
      <Footer onLogoClick={() => onNavigate("home")} />
    </>
  );
}
