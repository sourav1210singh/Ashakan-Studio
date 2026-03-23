import { ArrowLeft, ArrowRight } from "lucide-react";
import { FadeIn } from "@/components/animations/FadeIn";
import { Footer } from "@/components/layout/Footer";
import type { View } from "@/App";

interface HeadshotsPageProps {
  onNavigate: (view: View, slug?: string) => void;
}

export function HeadshotsPage({ onNavigate }: HeadshotsPageProps) {
  return (
    <>
      <main className="pt-20 bg-dark min-h-screen">
        {/* Hero */}
        <section className="relative py-20 sm:py-32 overflow-hidden">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">
            <FadeIn>
              <button
                onClick={() => onNavigate("photography")}
                className="group flex items-center gap-3 mb-8"
              >
                <div className="w-10 h-10 rounded-full border border-white/40 flex items-center justify-center group-hover:bg-white group-hover:text-dark transition-colors text-white">
                  <ArrowLeft className="w-4 h-4" />
                </div>
                <span className="text-sm font-medium tracking-wider text-white">BACK TO PHOTOGRAPHY</span>
              </button>
              <h1 className="font-display text-5xl sm:text-7xl lg:text-8xl xl:text-9xl text-white tracking-tight leading-none mb-6">
                HEADSHOTS
              </h1>
              <p className="text-lg sm:text-xl text-white/60 max-w-2xl">
                Professional headshot photography for executives, actors, dancers, and creatives.
                Crafted in our Houston studio with expert lighting and direction.
              </p>
            </FadeIn>
          </div>
        </section>

        {/* Gallery Grid — Headshot samples from portfolio */}
        <section className="py-16 sm:py-24">
          <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-10">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {[
                { src: "/images/headshots/headshot-1.jpg", alt: "Professional portrait — studio lighting", aspect: "aspect-[3/4]" },
                { src: "/images/headshots/headshot-2.jpg", alt: "Dance headshot — natural expression", aspect: "aspect-[3/4]" },
                { src: "/images/headshots/headshot-3.jpg", alt: "Creative portrait session", aspect: "aspect-[3/4]" },
                { src: "/images/headshots/headshot-4.jpg", alt: "Performer headshot — editorial style", aspect: "aspect-[3/4]" },
                { src: "/images/headshots/headshot-5.jpg", alt: "Professional headshot — clean backdrop", aspect: "aspect-[3/4]" },
                { src: "/images/headshots/headshot-6.jpg", alt: "Personal branding portrait", aspect: "aspect-[3/4]" },
                { src: "/images/headshots/headshot-7.jpg", alt: "Dilyn Bray — dance headshot", aspect: "aspect-[3/4]" },
                { src: "/images/headshots/headshot-8.jpg", alt: "Isabel Wallace-Green — creative portrait", aspect: "aspect-[3/4]" },
                { src: "/images/headshots/headshot-9.jpg", alt: "Grace — studio portrait", aspect: "aspect-[3/4]" },
                { src: "/images/headshots/headshot-10.jpg", alt: "Grace — editorial headshot", aspect: "aspect-[3/4]" },
                { src: "/images/headshots/headshot-11.jpg", alt: "Professional studio portrait", aspect: "aspect-[3/4]" },
                { src: "/images/headshots/headshot-12.jpg", alt: "Studio headshot — natural light", aspect: "aspect-[3/4]" },
                { src: "/images/headshots/headshot-13.jpg", alt: "Sydney Lovett — performer headshot", aspect: "aspect-[3/4]" },
                { src: "/images/headshots/headshot-14.jpg", alt: "Traci Greene — professional portrait", aspect: "aspect-[3/4]" },
                { src: "/images/headshots/headshot-15.jpg", alt: "Professional headshot — studio session", aspect: "aspect-[3/4]" },
                { src: "/images/headshots/headshot-16.jpg", alt: "Creative headshot — editorial lighting", aspect: "aspect-[3/4]" },
                { src: "/images/headshots/headshot-17.jpg", alt: "Dance portrait — Memorial Dance", aspect: "aspect-[3/4]" },
                { src: "/images/headshots/headshot-18.jpg", alt: "Personal branding — professional headshot", aspect: "aspect-[3/4]" },
                { src: "/images/headshots/headshot-19.jpg", alt: "Studio headshot — elegant styling", aspect: "aspect-[3/4]" },
                { src: "/images/headshots/headshot-20.jpg", alt: "Lifestyle portrait — personal branding", aspect: "aspect-[3/4]" },
                { src: "/images/headshots/headshot-21.jpg", alt: "Madison McClain — dancer headshot", aspect: "aspect-[3/4]" },
                { src: "/images/portfolio/cecilia-duarte.jpg", alt: "Cecilia Duarte — portrait", aspect: "aspect-[3/4]" },
                { src: "/images/portfolio/lauren-anderson.jpg", alt: "Lauren Anderson — headshot", aspect: "aspect-[3/4]" },
              ].map((img, index) => (
                <FadeIn key={img.alt} delay={index * 0.08}>
                  <div className={`relative overflow-hidden rounded-2xl ${img.aspect} group`}>
                    <img
                      src={img.src}
                      alt={img.alt}
                      className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors duration-300" />
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        {/* What We Offer */}
        <section className="py-16 sm:py-24 border-t border-white/10">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 sm:gap-20">
              <FadeIn>
                <div>
                  <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-white tracking-tight mb-8">
                    HEADSHOT SESSIONS
                  </h2>
                  <p className="text-lg text-white/60 leading-relaxed mb-8">
                    Whether you need corporate headshots for your team, acting headshots for auditions,
                    or personal branding portraits that capture your unique identity — our studio
                    delivers polished, professional results that make a lasting impression.
                  </p>
                  <p className="text-lg text-white/60 leading-relaxed">
                    Every session includes professional lighting, expert direction, and a curated
                    selection of retouched final images. We work with individuals, small teams,
                    and large corporate groups at our Sawyer Yards studio in Houston.
                  </p>
                </div>
              </FadeIn>

              <FadeIn delay={0.15}>
                <div>
                  <h3 className="font-display text-2xl sm:text-3xl text-white tracking-tight mb-10">
                    SESSION TYPES
                  </h3>
                  <ul className="space-y-4">
                    {[
                      "Executive & Corporate Headshots",
                      "Actor & Performer Headshots",
                      "Dance Audition Photos",
                      "Personal Branding Portraits",
                      "Team & Group Headshots",
                      "LinkedIn & Professional Profiles",
                      "Creative & Editorial Portraits",
                      "Graduation Portraits",
                    ].map((item) => (
                      <li
                        key={item}
                        className="text-base sm:text-lg text-white/60 leading-relaxed border-b border-white/10 pb-4"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </FadeIn>
            </div>
          </div>
        </section>

        {/* Process */}
        <section className="py-16 sm:py-24 bg-dark border-t border-white/10">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">
            <FadeIn>
              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-white tracking-tight mb-16">
                HOW IT WORKS
              </h2>
            </FadeIn>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-12 sm:gap-8">
              {[
                {
                  step: "01",
                  title: "CONSULTATION",
                  desc: "We discuss your goals, preferred style, wardrobe options, and how you'll use your headshots. We'll help you prepare so you feel confident on session day.",
                },
                {
                  step: "02",
                  title: "SESSION",
                  desc: "In our 1,500 sq ft studio with professional Profoto lighting, we capture a variety of looks and expressions. Hair and makeup services available.",
                },
                {
                  step: "03",
                  title: "DELIVERY",
                  desc: "Within 5-7 business days, you receive your curated, professionally retouched images — ready for print, web, and social media.",
                },
              ].map((item, index) => (
                <FadeIn key={item.step} delay={index * 0.12}>
                  <div>
                    <span className="font-display text-5xl sm:text-6xl text-white/10 tracking-tight block mb-4">
                      {item.step}
                    </span>
                    <h3 className="font-display text-xl sm:text-2xl text-white tracking-tight mb-4">
                      {item.title}
                    </h3>
                    <p className="text-base text-white/50 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 sm:py-32 border-t border-white/10">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 text-center">
            <FadeIn>
              <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl text-white tracking-tight mb-6">
                BOOK YOUR SESSION
              </h2>
              <p className="text-lg text-white/50 mb-10 max-w-xl mx-auto">
                Ready for headshots that make an impact? Let's talk about your vision.
              </p>
              <button
                onClick={() => onNavigate("contact")}
                className="inline-flex items-center gap-3 px-8 py-4 bg-white text-dark font-medium tracking-wider text-sm group"
              >
                GET IN TOUCH
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
