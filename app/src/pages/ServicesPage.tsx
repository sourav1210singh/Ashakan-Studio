import { ArrowRight, Check } from "lucide-react";
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
    "Corporate Headshots & Portraits",
    "Editorial & Fashion Photography",
    "Lifestyle & Branding Photography",
    "Architectural & Interior Photography",
    "Brand Films & Commercials",
    "Documentary & Narrative",
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

  const packages = [
    {
      name: "STARTER",
      price: "$1,950",
      popular: false,
      features: [
        "2-hour organic photo & video session",
        "12 final edited images",
        "4 edited promo videos (:15s)",
        '"Brandstorm" campaign strategy session',
      ],
    },
    {
      name: "GROWING",
      price: "$2,990",
      popular: false,
      features: [
        "4-hour organic photo & video session",
        "20 final edited images",
        "8 edited promo videos (:15s)",
        '"Brandstorm" campaign strategy session',
      ],
    },
    {
      name: "PREMIERE",
      price: "$4,850",
      popular: true,
      features: [
        "7-hour organic photo & video session",
        "35 final edited images",
        "12 edited promo videos (:15s)",
        '"Brandstorm" campaign strategy session',
      ],
    },
    {
      name: "EXECUTIVE",
      price: "$7,590",
      popular: false,
      features: [
        "2-day organic photo & video session",
        "60 final edited images",
        "20 edited promo videos (:15s)",
        '"Brandstorm" campaign strategy session',
      ],
    },
  ];

  const process = [
    {
      step: "01",
      title: "BOOKING & CONSULTATION",
      desc: "Book online or contact us directly for larger projects. We review your creative vision, logistics, location needs, hair & makeup requirements, and get you fully prepared.",
    },
    {
      step: "02",
      title: "PRE-PRODUCTION",
      desc: "We develop the creative concept, assemble the right team, scout locations if needed, and handle all the planning so production day runs seamlessly.",
    },
    {
      step: "03",
      title: "PRODUCTION",
      desc: "This is where the magic happens. Whether in our 1,500 sq ft studio or on location, your session is executed with the utmost care, creativity, and professional equipment.",
    },
    {
      step: "04",
      title: "POST-PRODUCTION",
      desc: "Expert editing, retouching, color grading, and video post-production. We refine every image and frame to match your brand's standards.",
    },
    {
      step: "05",
      title: "DELIVERY",
      desc: "Final assets delivered in all formats you need — social media, print, web, and more. Ready to elevate your brand across every platform.",
    },
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
                  We create high-quality photography and video content for brands.
                  From concept to delivery, our talented network of photographers,
                  cinematographers, and creatives brings your vision to life across
                  every platform.
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

        {/* Section — Media Content Packages */}
        <section className="py-16 sm:py-24 border-t border-dark/10">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">
            <FadeIn>
              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-dark tracking-tight mb-4">
                MEDIA CONTENT PACKAGES
              </h2>
              <p className="text-lg text-dark/60 max-w-2xl mb-16">
                Build your brand's inventory of images and videos for social media, print,
                ads, marketing campaigns, and more.
              </p>
            </FadeIn>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {packages.map((pkg, index) => (
                <FadeIn key={pkg.name} delay={index * 0.1}>
                  <div
                    className={`relative p-6 sm:p-8 border ${
                      pkg.popular
                        ? "border-dark bg-dark text-white"
                        : "border-dark/10 bg-white text-dark"
                    }`}
                  >
                    {pkg.popular && (
                      <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-xs font-medium tracking-wider bg-white text-dark px-4 py-1 rounded-full">
                        POPULAR
                      </span>
                    )}
                    <h3 className="font-display text-xl sm:text-2xl tracking-tight mb-2">
                      {pkg.name}
                    </h3>
                    <p className={`font-display text-3xl sm:text-4xl tracking-tight mb-8 ${
                      pkg.popular ? "text-white" : "text-dark"
                    }`}>
                      {pkg.price}
                    </p>
                    <ul className="space-y-3 mb-8">
                      {pkg.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-3">
                          <Check className={`w-4 h-4 mt-1 flex-shrink-0 ${
                            pkg.popular ? "text-white/70" : "text-dark/40"
                          }`} />
                          <span className={`text-sm leading-relaxed ${
                            pkg.popular ? "text-white/80" : "text-dark/60"
                          }`}>
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>
                    <button
                      onClick={() => onNavigate("contact")}
                      className={`w-full py-3 text-sm font-medium tracking-wider border rounded-lg transition-colors ${
                        pkg.popular
                          ? "border-white text-white hover:bg-white hover:text-dark"
                          : "border-dark text-dark hover:bg-dark hover:text-white"
                      }`}
                    >
                      GET STARTED
                    </button>
                  </div>
                </FadeIn>
              ))}
            </div>
            <FadeIn delay={0.5}>
              <p className="text-center text-sm text-dark/40 mt-8">
                Need something custom? We provide tailored solutions for unique projects.{" "}
                <button
                  onClick={() => onNavigate("contact")}
                  className="underline hover:text-dark transition-colors"
                >
                  Contact us
                </button>
              </p>
            </FadeIn>
          </div>
        </section>

        {/* Section — Process (enhanced with descriptions) */}
        <section className="py-16 sm:py-24 bg-cream border-t border-dark/10">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">
            <FadeIn>
              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-dark tracking-tight mb-16">
                OUR PROCESS
              </h2>
            </FadeIn>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 sm:gap-6">
              {process.map((item, index) => (
                <FadeIn key={item.step} delay={index * 0.1}>
                  <div>
                    <span className="font-display text-4xl sm:text-5xl text-dark/10 tracking-tight block mb-3">
                      {item.step}
                    </span>
                    <h3 className="font-display text-lg sm:text-xl text-dark tracking-tight mb-3">
                      {item.title}
                    </h3>
                    <p className="text-sm text-dark/50 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </FadeIn>
              ))}
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
