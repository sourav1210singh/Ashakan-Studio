import { ArrowLeft } from "lucide-react";
import { FadeIn } from "@/components/animations/FadeIn";
import { Footer } from "@/components/layout/Footer";
import { portfolioItems } from "@/data/portfolio";
import type { View } from "@/App";

interface PhotographyPageProps {
  onNavigate: (view: View, slug?: string) => void;
}

export function PhotographyPage({ onNavigate }: PhotographyPageProps) {
  // Filter photography projects
  const photoProjects = portfolioItems.filter(item => 
    ["fashion", "deutsch-fine-jewelry", "brandon-blackwood", "eye-gallery", 
     "audaja-skincare", "cacao-cardamom", "lauren-anderson", "cecilia-duarte",
     "vitacca-ballet", "monarch-school", "publications", "miscellaneous"].includes(item.id)
  );

  return (
    <>
      <main className="pt-20">
        {/* Header */}
        <section className="py-12 sm:py-16 bg-cream border-b border-dark/10">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">
            <FadeIn>
              <button
                onClick={() => onNavigate("work")}
                className="group flex items-center gap-3 mb-8"
              >
                <div className="w-10 h-10 rounded-full border border-dark flex items-center justify-center group-hover:bg-dark group-hover:text-white transition-colors">
                  <ArrowLeft className="w-4 h-4" />
                </div>
                <span className="text-sm font-medium tracking-wider text-dark">BACK TO WORK</span>
              </button>
              <h1 className="font-display text-5xl sm:text-7xl lg:text-8xl text-dark tracking-tight">
                PHOTOGRAPHY
              </h1>
            </FadeIn>
          </div>
        </section>

        {/* Categories */}
        <section className="py-8 border-b border-dark/10">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">
            <div className="flex flex-wrap gap-4">
              {["ALL", "RETAIL", "THE ARTS", "FASHION", "INDUSTRIAL"].map((cat, index) => (
                <button
                  key={cat}
                  className={`text-sm font-medium tracking-wider px-4 py-2 rounded-full border transition-colors ${
                    index === 0 
                      ? "bg-dark text-white border-dark" 
                      : "text-dark border-dark/30 hover:bg-dark hover:text-white"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Projects Grid */}
        <section className="py-16 sm:py-24">
          <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-10">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {photoProjects.map((item, index) => (
                <FadeIn key={item.id} delay={index * 0.1}>
                  <button
                    onClick={() => onNavigate("portfolio", item.id)}
                    className="group block relative overflow-hidden rounded-2xl sm:rounded-3xl bg-white w-full text-left"
                  >
                    <div
                      className={`relative overflow-hidden ${
                        index % 3 === 1 ? "aspect-[3/4]" : index % 3 === 2 ? "aspect-square" : "aspect-[4/3]"
                      }`}
                    >
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-600 ease-out group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-dark/0 group-hover:bg-dark/10 transition-colors duration-300" />
                    </div>
                    <div className="p-4 sm:p-6">
                      <p className="text-xs sm:text-sm font-medium tracking-wider text-dark/50 mb-1">
                        {item.category}
                      </p>
                      <h3 className="font-display text-xl sm:text-2xl text-dark tracking-tight">
                        {item.title}
                      </h3>
                    </div>
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
