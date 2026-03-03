import { ArrowRight } from "lucide-react";
import { FadeIn } from "@/components/animations/FadeIn";
import { Footer } from "@/components/layout/Footer";
import { photographyCategories, videographyCategories, campaigns } from "@/data/navigation";
import type { View } from "@/App";

interface WorkPageProps {
  onNavigate: (view: View, slug?: string) => void;
}

export function WorkPage({ onNavigate }: WorkPageProps) {
  return (
    <>
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-20 sm:py-32 bg-cream">
          <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-10">
            <FadeIn>
              <h1 className="font-display text-6xl sm:text-8xl md:text-9xl lg:text-[150px] xl:text-[180px] text-dark tracking-tight leading-none mb-8">
                THE WORK
              </h1>
              <p className="text-lg sm:text-xl text-dark/70 max-w-2xl">
                Explore our portfolio of photography, videography, and full-scale campaigns. 
                Each project tells a unique story crafted with precision and creativity.
              </p>
            </FadeIn>
          </div>
        </section>

        {/* Photography Section */}
        <section className="py-16 sm:py-24 border-t border-dark/10">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">
            <FadeIn>
              <div className="flex items-center justify-between mb-12">
                <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl text-dark tracking-tight">
                  PHOTOGRAPHY
                </h2>
                <button
                  onClick={() => onNavigate("photography")}
                  className="group flex items-center gap-3"
                >
                  <span className="text-sm font-medium tracking-wider text-dark">VIEW ALL</span>
                  <div className="w-10 h-10 rounded-full border border-dark flex items-center justify-center group-hover:bg-dark group-hover:text-white transition-colors">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </button>
              </div>
            </FadeIn>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {photographyCategories.map((cat, index) => (
                <FadeIn key={cat.id} delay={index * 0.1}>
                  <button
                    onClick={() => onNavigate("photography")}
                    className="group relative aspect-[4/5] rounded-2xl overflow-hidden bg-dark/5"
                  >
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="font-display text-2xl sm:text-3xl text-dark tracking-tight group-hover:scale-105 transition-transform">
                        {cat.name}
                      </span>
                    </div>
                    <div className="absolute inset-0 bg-dark/0 group-hover:bg-dark/5 transition-colors" />
                  </button>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        {/* Videography Section */}
        <section className="py-16 sm:py-24 border-t border-dark/10">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">
            <FadeIn>
              <div className="flex items-center justify-between mb-12">
                <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl text-dark tracking-tight">
                  VIDEOGRAPHY
                </h2>
                <button
                  onClick={() => onNavigate("videography")}
                  className="group flex items-center gap-3"
                >
                  <span className="text-sm font-medium tracking-wider text-dark">VIEW ALL</span>
                  <div className="w-10 h-10 rounded-full border border-dark flex items-center justify-center group-hover:bg-dark group-hover:text-white transition-colors">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </button>
              </div>
            </FadeIn>

            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6">
              {videographyCategories.map((cat, index) => (
                <FadeIn key={cat.id} delay={index * 0.1}>
                  <button
                    onClick={() => onNavigate("videography")}
                    className="group relative aspect-[4/5] rounded-2xl overflow-hidden bg-dark/5"
                  >
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="font-display text-xl sm:text-2xl text-dark tracking-tight group-hover:scale-105 transition-transform text-center px-2">
                        {cat.name}
                      </span>
                    </div>
                    <div className="absolute inset-0 bg-dark/0 group-hover:bg-dark/5 transition-colors" />
                  </button>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        {/* Campaigns Section */}
        <section className="py-16 sm:py-24 border-t border-dark/10">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">
            <FadeIn>
              <div className="flex items-center justify-between mb-12">
                <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl text-dark tracking-tight">
                  CAMPAIGNS
                </h2>
                <button
                  onClick={() => onNavigate("campaigns")}
                  className="group flex items-center gap-3"
                >
                  <span className="text-sm font-medium tracking-wider text-dark">VIEW ALL</span>
                  <div className="w-10 h-10 rounded-full border border-dark flex items-center justify-center group-hover:bg-dark group-hover:text-white transition-colors">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </button>
              </div>
            </FadeIn>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {campaigns.map((campaign, index) => (
                <FadeIn key={campaign.id} delay={index * 0.1}>
                  <button
                    onClick={() => onNavigate("portfolio", campaign.id)}
                    className="group relative aspect-[4/5] rounded-2xl overflow-hidden bg-dark/5"
                  >
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="font-display text-xl sm:text-2xl text-dark tracking-tight group-hover:scale-105 transition-transform text-center px-2">
                        {campaign.name}
                      </span>
                    </div>
                    <div className="absolute inset-0 bg-dark/0 group-hover:bg-dark/5 transition-colors" />
                  </button>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer onLogoClick={() => onNavigate("home")} />
    </>
  );
}
