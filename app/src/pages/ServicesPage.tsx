import { ArrowRight, Camera, Video, Palette, Scissors, Sparkles, Users, Mic, PenTool, FileVideo, TrendingUp } from "lucide-react";
import { FadeIn } from "@/components/animations/FadeIn";
import { Footer } from "@/components/layout/Footer";
import type { View } from "@/App";

interface ServicesPageProps {
  onNavigate: (view: View, slug?: string) => void;
}

export function ServicesPage({ onNavigate }: ServicesPageProps) {
  const services = [
    { icon: Camera, title: "PHOTOGRAPHY", description: "Commercial, editorial, product, and portrait photography that captures your brand's essence." },
    { icon: Video, title: "VIDEOGRAPHY", description: "Cinematic video production from concept to final cut for commercials, documentaries, and brand films." },
    { icon: Palette, title: "CREATIVE DIRECTION", description: "Strategic visual storytelling that aligns with your brand identity and marketing goals." },
    { icon: Scissors, title: "POST PRODUCTION", description: "Expert editing, color grading, and retouching to perfect every frame." },
    { icon: Sparkles, title: "HAIR & MAKEUP", description: "Professional styling teams to ensure talent looks their absolute best on camera." },
    { icon: Users, title: "STYLISTS", description: "Wardrobe and set styling that elevates the visual impact of every production." },
    { icon: Mic, title: "SOUND & AUDIO", description: "Professional audio capture and sound design for crystal-clear production value." },
    { icon: PenTool, title: "DESIGNERS", description: "Graphic design and visual assets that complement your production." },
    { icon: FileVideo, title: "PRE & POST PRODUCTION", description: "End-to-end project management from planning through delivery." },
    { icon: TrendingUp, title: "MARKETING SUPPORT", description: "Strategic guidance to maximize the impact of your visual content." },
  ];

  const process = [
    { step: "01", title: "CONCEPT", description: "We start with your vision and develop creative concepts that align with your goals." },
    { step: "02", title: "PRE-PRODUCTION", description: "Detailed planning including location scouting, talent casting, and shot lists." },
    { step: "03", title: "PRODUCTION", description: "The shoot day(s) where creativity meets execution with our expert team." },
    { step: "04", title: "POST", description: "Editing, color grading, and final touches to deliver polished content." },
    { step: "05", title: "DELIVERY", description: "Final assets delivered in all formats needed for your marketing channels." },
  ];

  return (
    <>
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-20 sm:py-32 bg-cream">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">
            <FadeIn>
              <h1 className="font-display text-6xl sm:text-8xl md:text-9xl lg:text-[120px] xl:text-[150px] text-dark tracking-tight leading-none mb-8">
                WHAT WE DO
              </h1>
              <p className="text-lg sm:text-xl text-dark/70 max-w-2xl">
                We design and produce photography and video systems for brands. 
                From concept to delivery, our talented network brings your vision to life.
              </p>
            </FadeIn>
          </div>
        </section>

        {/* Services Grid */}
        <section className="py-16 sm:py-24 border-t border-dark/10">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">
            <FadeIn>
              <h2 className="font-display text-3xl sm:text-4xl text-dark tracking-tight mb-12">
                CAPABILITIES
              </h2>
            </FadeIn>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {services.map((service, index) => (
                <FadeIn key={service.title} delay={index * 0.1}>
                  <div className="group p-6 sm:p-8 rounded-2xl border border-dark/10 hover:border-dark/30 transition-colors">
                    <service.icon className="w-8 h-8 text-dark mb-4" />
                    <h3 className="font-display text-xl sm:text-2xl text-dark tracking-tight mb-3">
                      {service.title}
                    </h3>
                    <p className="text-sm sm:text-base text-dark/60 leading-relaxed">
                      {service.description}
                    </p>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        {/* Process Section */}
        <section className="py-16 sm:py-24 bg-dark text-white">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">
            <FadeIn>
              <h2 className="font-display text-3xl sm:text-4xl tracking-tight mb-12">
                OUR PROCESS
              </h2>
            </FadeIn>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
              {process.map((step, index) => (
                <FadeIn key={step.step} delay={index * 0.1}>
                  <div className="relative">
                    <span className="font-display text-5xl sm:text-6xl text-white/20 tracking-tight">
                      {step.step}
                    </span>
                    <h3 className="font-display text-xl sm:text-2xl tracking-tight mt-4 mb-3">
                      {step.title}
                    </h3>
                    <p className="text-sm text-white/60 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 sm:py-24">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 text-center">
            <FadeIn>
              <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl text-dark tracking-tight mb-6">
                READY TO START A PROJECT?
              </h2>
              <p className="text-lg text-dark/70 mb-8 max-w-xl mx-auto">
                Let's discuss how we can bring your vision to life.
              </p>
              <button
                onClick={() => onNavigate("contact")}
                className="inline-flex items-center gap-3 px-8 py-4 bg-dark text-white font-medium tracking-wider text-sm group"
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
