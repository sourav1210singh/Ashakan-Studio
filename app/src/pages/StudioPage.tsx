import { ArrowRight, MapPin } from "lucide-react";
import { FadeIn } from "@/components/animations/FadeIn";
import { Footer } from "@/components/layout/Footer";
import type { View } from "@/App";

interface StudioPageProps {
  onNavigate: (view: View, slug?: string) => void;
}

export function StudioPage({ onNavigate }: StudioPageProps) {
  const team = [
    { name: "ASHKAN", role: "FOUNDER & CREATIVE DIRECTOR" },
    { name: "SARAH", role: "PRODUCER" },
    { name: "MICHAEL", role: "DIRECTOR OF PHOTOGRAPHY" },
    { name: "JENNIFER", role: "POST PRODUCTION LEAD" },
  ];

  return (
    <>
      <main className="pt-20">
        {/* Hero Section */}
        <section className="relative h-[70vh] min-h-[500px] overflow-hidden">
          <div className="absolute inset-0">
            <img
              src="/images/sections/studio.jpg"
              alt="Ashkan Studios"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-dark/50" />
          </div>
          <div className="relative z-10 h-full flex items-end pb-16 sm:pb-24">
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 w-full">
              <FadeIn>
                <h1 className="font-display text-5xl sm:text-7xl lg:text-8xl xl:text-9xl text-white tracking-tight leading-[0.95]">
                  THE STUDIO
                </h1>
              </FadeIn>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section className="py-16 sm:py-24 bg-cream">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
              <FadeIn>
                <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl text-dark tracking-tight leading-[0.95]">
                  BASED IN HOUSTON,
                  <br />
                  <span className="text-dark/40">2 DEPARTMENTS,</span>
                  <br />
                  <span className="text-dark/40">1 COMPANY.</span>
                </h2>
              </FadeIn>
              <FadeIn delay={0.1}>
                <div className="space-y-6">
                  <p className="text-lg sm:text-xl text-dark/80 leading-relaxed">
                    Ashkan Studios is the parent company of <span className="font-medium text-dark">Ashkan Image</span> and{" "}
                    <span className="font-medium text-dark">Ashkan Media</span>. We specialize in commercial photography, 
                    videography, and creative production.
                  </p>
                  <p className="text-lg sm:text-xl text-dark/80 leading-relaxed">
                    From dance photography to corporate videos, our passion is storytelling through stunning visuals 
                    that embody your brand's energy and essence.
                  </p>
                  <p className="text-lg sm:text-xl text-dark/80 leading-relaxed">
                    With over a decade of experience, we've partnered with brands ranging from local startups to 
                    Fortune 500 companies, delivering content that drives results.
                  </p>
                </div>
              </FadeIn>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-16 sm:py-24 border-t border-dark/10">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">
            <FadeIn>
              <h2 className="font-display text-3xl sm:text-4xl text-dark tracking-tight mb-12">
                MEET THE TEAM
              </h2>
            </FadeIn>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              {team.map((member, index) => (
                <FadeIn key={member.name} delay={index * 0.1}>
                  <div className="aspect-[3/4] rounded-2xl bg-dark/5 flex items-center justify-center mb-4">
                    <span className="font-display text-4xl sm:text-5xl text-dark/20">
                      {member.name[0]}
                    </span>
                  </div>
                  <h3 className="font-display text-xl sm:text-2xl text-dark tracking-tight">
                    {member.name}
                  </h3>
                  <p className="text-sm text-dark/60 mt-1">
                    {member.role}
                  </p>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        {/* Location Section */}
        <section className="py-16 sm:py-24 bg-dark text-white">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              <FadeIn>
                <div className="flex items-center gap-3 mb-6">
                  <MapPin className="w-6 h-6" />
                  <span className="text-sm font-medium tracking-wider text-white/60">OUR LOCATION</span>
                </div>
                <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl tracking-tight mb-6">
                  HOUSTON, TEXAS
                </h2>
                <p className="text-lg text-white/70 leading-relaxed mb-8">
                  1502 Sawyer St #108<br />
                  Houston, TX 77007
                </p>
                <a
                  href="https://maps.google.com/?q=1502+Sawyer+St+%23108,+Houston,+TX+77007"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 text-white group"
                >
                  <span className="text-sm font-medium tracking-wider">GET DIRECTIONS</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </a>
              </FadeIn>
              <FadeIn delay={0.1}>
                <div className="aspect-video rounded-2xl bg-white/10 flex items-center justify-center">
                  <span className="text-white/40 text-sm">Map Integration</span>
                </div>
              </FadeIn>
            </div>
          </div>
        </section>

        {/* Video Story Section */}
        <section className="py-16 sm:py-24">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">
            <FadeIn>
              <div className="aspect-video rounded-2xl bg-dark/5 flex items-center justify-center">
                <span className="text-dark/40 text-sm">Studio Video Story</span>
              </div>
            </FadeIn>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 sm:py-24 border-t border-dark/10">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 text-center">
            <FadeIn>
              <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl text-dark tracking-tight mb-6">
                LET'S CREATE TOGETHER
              </h2>
              <button
                onClick={() => onNavigate("contact")}
                className="inline-flex items-center gap-3 px-8 py-4 bg-dark text-white font-medium tracking-wider text-sm group"
              >
                START A PROJECT
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
