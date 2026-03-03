import { useState, useEffect } from "react";
import { ArrowLeft, ArrowRight, ChevronDown, ChevronUp } from "lucide-react";
import { getProjectById, getAllProjects, type Project } from "@/data/projects";
import { FadeIn } from "@/components/animations/FadeIn";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import type { View } from "@/App";

interface PortfolioPageProps {
  slug: string;
  onBack: () => void;
  onNavigate: (slug: string) => void;
}

export function PortfolioPage({ slug, onBack, onNavigate }: PortfolioPageProps) {
  const [project, setProject] = useState<Project | undefined>();
  const [showDescription, setShowDescription] = useState(false);
  const [allProjects, setAllProjects] = useState<Project[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const projects = getAllProjects();
    setAllProjects(projects);

    const foundProject = getProjectById(slug);
    setProject(foundProject);
    const index = projects.findIndex((p) => p.id === slug);
    setCurrentIndex(index >= 0 ? index : 0);
  }, [slug]);

  const prevProject =
    currentIndex > 0 ? allProjects[currentIndex - 1] : null;
  const nextProject =
    currentIndex < allProjects.length - 1
      ? allProjects[currentIndex + 1]
      : null;

  const handleNavigateToView = (view: View, slug?: string) => {
    if (view === "portfolio" && slug) {
      onNavigate(slug);
    } else if (view === "home") {
      onBack();
    } else {
      // For other views, go back to work page
      onBack();
    }
  };

  if (!project) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-display text-4xl text-dark mb-4">
            Project Not Found
          </h1>
          <button
            onClick={onBack}
            className="text-dark underline hover:no-underline"
          >
            Return Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream">
      <Header onLogoClick={onBack} onNavigate={handleNavigateToView} currentView="portfolio" />

      <main>
        {/* Hero Section */}
        <section className="relative h-screen w-full overflow-hidden">
          {/* Hero Image */}
          <div className="absolute inset-0">
            <img
              src={project.heroImage}
              alt={project.title}
              className="w-full h-full object-cover"
            />
            {/* Subtle overlay for text readability */}
            <div className="absolute inset-0 bg-gradient-to-b from-dark/30 via-transparent to-dark/60" />
          </div>

          {/* Hero Content */}
          <div className="relative z-10 h-full flex flex-col justify-end pb-16 sm:pb-24">
            <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-10 w-full">
              <FadeIn>
                {/* Client Name */}
                <p className="text-xs sm:text-sm font-medium tracking-[0.2em] text-white/80 mb-3 sm:mb-4">
                  {project.client}
                </p>

                {/* Title */}
                <h1 className="font-display text-4xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl text-white tracking-tight leading-[0.95] max-w-5xl">
                  {project.title}
                </h1>

                {/* Categories */}
                <div className="flex flex-wrap gap-2 sm:gap-3 mt-6 sm:mt-8">
                  {project.categories.map((category, index) => (
                    <span
                      key={category}
                      className="text-xs sm:text-sm font-medium tracking-wider text-white/70"
                    >
                      {category}
                      {index < project.categories.length - 1 && (
                        <span className="ml-2 sm:ml-3 text-white/40">/</span>
                      )}
                    </span>
                  ))}
                </div>
              </FadeIn>
            </div>
          </div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10">
            <div className="animate-bounce">
              <ChevronDown className="w-6 h-6 text-white/70" />
            </div>
          </div>
        </section>

        {/* About Section */}
        <section className="py-12 sm:py-16 border-b border-dark/10">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">
            <button
              onClick={() => setShowDescription(!showDescription)}
              className="w-full flex items-center justify-between py-4 group"
            >
              <span className="text-sm sm:text-base font-medium tracking-wider text-dark">
                ABOUT THIS PROJECT
              </span>
              <div className="w-10 h-10 rounded-full border border-dark/30 flex items-center justify-center group-hover:bg-dark group-hover:text-white transition-colors">
                {showDescription ? (
                  <ChevronUp className="w-5 h-5" />
                ) : (
                  <ChevronDown className="w-5 h-5" />
                )}
              </div>
            </button>

            {showDescription && (
              <div
                className="py-6 sm:py-8"
                style={{
                  animation: "fadeIn 0.3s ease-out",
                }}
              >
                <p className="text-base sm:text-lg lg:text-xl text-dark/80 leading-relaxed max-w-3xl">
                  {project.description}
                </p>
              </div>
            )}
          </div>

          <style>{`
            @keyframes fadeIn {
              from { opacity: 0; transform: translateY(-10px); }
              to { opacity: 1; transform: translateY(0); }
            }
          `}</style>
        </section>

        {/* Gallery Section */}
        <section className="py-12 sm:py-16 lg:py-24">
          <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-10">
            {/* Masonry Grid */}
            <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 sm:gap-6">
              {project.gallery.map((item, index) => (
                <FadeIn
                  key={index}
                  delay={index * 0.1}
                  className="break-inside-avoid mb-4 sm:mb-6"
                >
                  <div
                    className={`relative overflow-hidden rounded-xl sm:rounded-2xl bg-dark/5 ${
                      item.aspectRatio === "portrait"
                        ? "aspect-[3/4]"
                        : item.aspectRatio === "square"
                        ? "aspect-square"
                        : "aspect-[4/3]"
                    }`}
                  >
                    {item.type === "video" ? (
                      <div className="w-full h-full flex items-center justify-center bg-dark">
                        <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
                          <div className="w-0 h-0 border-t-8 border-t-transparent border-l-12 border-l-white border-b-8 border-b-transparent ml-1" />
                        </div>
                      </div>
                    ) : (
                      <img
                        src={item.src}
                        alt={item.alt}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                        style={{
                          transitionTimingFunction:
                            "cubic-bezier(0.16, 1, 0.3, 1)",
                        }}
                      />
                    )}
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        {/* Navigation Section */}
        <section className="py-12 sm:py-16 border-t border-dark/10">
          <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-10">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 sm:gap-8">
              {/* Previous Project */}
              {prevProject ? (
                <button
                  onClick={() => onNavigate(prevProject.id)}
                  className="group flex items-center gap-4"
                >
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border-2 border-dark flex items-center justify-center group-hover:bg-dark group-hover:text-white transition-colors flex-shrink-0">
                    <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <div className="text-left">
                    <p className="text-xs sm:text-sm font-medium tracking-wider text-dark/50 mb-1">
                      PREVIOUS PROJECT
                    </p>
                    <p className="font-display text-lg sm:text-xl text-dark">
                      {prevProject.client}
                    </p>
                  </div>
                </button>
              ) : (
                <div />
              )}

              {/* Back to Work */}
              <button
                onClick={onBack}
                className="text-sm sm:text-base font-medium tracking-wider text-dark hover:text-dark/70 transition-colors"
              >
                BACK TO ALL WORK
              </button>

              {/* Next Project */}
              {nextProject ? (
                <button
                  onClick={() => onNavigate(nextProject.id)}
                  className="group flex items-center gap-4 text-right"
                >
                  <div className="text-right">
                    <p className="text-xs sm:text-sm font-medium tracking-wider text-dark/50 mb-1">
                      NEXT PROJECT
                    </p>
                    <p className="font-display text-lg sm:text-xl text-dark">
                      {nextProject.client}
                    </p>
                  </div>
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border-2 border-dark flex items-center justify-center group-hover:bg-dark group-hover:text-white transition-colors flex-shrink-0">
                    <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                </button>
              ) : (
                <div />
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer onLogoClick={onBack} />
    </div>
  );
}
