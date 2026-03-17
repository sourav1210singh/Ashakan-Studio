import { ArrowLeft } from "lucide-react";
import { FadeIn } from "@/components/animations/FadeIn";
import { Footer } from "@/components/layout/Footer";
import { portfolioItems } from "@/data/portfolio";
import { photographyCategories } from "@/data/navigation";
import type { View } from "@/App";

/** Gallery images from old ashkanimage.com pages, organized by category */
const categoryGallery: Record<string, { src: string; alt: string }[]> = {
  fashion: [
    { src: "/images/gallery/fashion/fashion-1.jpg", alt: "Fashion editorial — red monochromatic styling" },
    { src: "/images/gallery/fashion/fashion-2.jpg", alt: "Fashion editorial — colorful babydoll boots" },
    { src: "/images/gallery/fashion/fashion-3.jpg", alt: "Fashion editorial — flowy fabric pants" },
    { src: "/images/gallery/fashion/fashion-4.jpg", alt: "Fashion portrait — studio editorial" },
    { src: "/images/gallery/fashion/fashion-5.jpg", alt: "Fashion portrait — dramatic lighting" },
    { src: "/images/gallery/fashion/fashion-6.jpg", alt: "Dancewear fashion editorial" },
    { src: "/images/gallery/fashion/fashion-7.jpg", alt: "Fashion editorial — Julianna Perez" },
  ],
  "the-arts": [
    { src: "/images/portfolio/vitacca-ballet.jpg", alt: "Vitacca Ballet — dance performance" },
    { src: "/images/portfolio/cecilia-duarte.jpg", alt: "Cecilia Duarte — portrait" },
    { src: "/images/portfolio/lauren-anderson.jpg", alt: "Lauren Anderson — dance portrait" },
    { src: "/images/gallery/the-arts/arts-1.jpg", alt: "Kaylee Chew — dance photography" },
    { src: "/images/portfolio/elastique-athletics.jpg", alt: "Élastique Athletics — dance fashion" },
  ],
  retail: [
    { src: "/images/portfolio/brandon-blackwood.jpg", alt: "Brandon Blackwood — luxury handbags" },
    { src: "/images/portfolio/audaja-skincare.jpg", alt: "Audaja Skincare — product photography" },
    { src: "/images/portfolio/cacao-cardamom.jpg", alt: "Cacao & Cardamom — artisan chocolates" },
    { src: "/images/portfolio/elastique-athletics.jpg", alt: "Élastique Athletics — activewear" },
    { src: "/images/portfolio/eye-gallery.jpg", alt: "The Eye Gallery — designer eyewear" },
    { src: "/images/portfolio/deutsch-jewelry.jpg", alt: "Deutsch Fine Jewelry — luxury jewelry" },
  ],
  industrial: [
    { src: "/images/portfolio/radiomedix.jpg", alt: "RadioMedix — medical facility" },
    { src: "/images/portfolio/car-collections.jpg", alt: "Automotive photography" },
  ],
};

interface PhotographyPageProps {
  onNavigate: (view: View, slug?: string) => void;
  activeCategory?: string | null;
}

export function PhotographyPage({ onNavigate, activeCategory }: PhotographyPageProps) {
  const photoProjects = portfolioItems.filter((item) => {
    if (!item.photoCategories || item.photoCategories.length === 0) return false;
    if (!activeCategory) return true;
    return item.photoCategories.includes(activeCategory);
  });

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
              <button
                onClick={() => onNavigate("photography")}
                className={`text-sm font-medium tracking-wider px-4 py-2 rounded-full border transition-colors ${
                  !activeCategory
                    ? "bg-dark text-white border-dark"
                    : "text-dark border-dark/30 hover:bg-dark hover:text-white"
                }`}
              >
                ALL
              </button>
              {photographyCategories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => onNavigate("photography", cat.id)}
                  className={`text-sm font-medium tracking-wider px-4 py-2 rounded-full border transition-colors ${
                    activeCategory === cat.id
                      ? "bg-dark text-white border-dark"
                      : "text-dark border-dark/30 hover:bg-dark hover:text-white"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Projects Grid */}
        <section className="py-16 sm:py-24">
          <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-10">
            {photoProjects.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-lg text-dark/50">No projects found in this category.</p>
              </div>
            ) : (
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
            )}
          </div>
        </section>
        {/* Category Gallery Showcase — images from old URLs */}
        {activeCategory && categoryGallery[activeCategory] && categoryGallery[activeCategory].length > 0 && (
          <section className="py-16 sm:py-24 bg-cream border-t border-dark/10">
            <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-10">
              <FadeIn>
                <h2 className="font-display text-3xl sm:text-4xl text-dark tracking-tight mb-12">
                  GALLERY
                </h2>
              </FadeIn>
              <div className="columns-2 sm:columns-3 lg:columns-4 gap-4 sm:gap-6">
                {categoryGallery[activeCategory].map((img, index) => (
                  <FadeIn key={img.src} delay={index * 0.08} className="break-inside-avoid mb-4 sm:mb-6">
                    <div className="relative overflow-hidden rounded-xl sm:rounded-2xl group">
                      <img
                        src={img.src}
                        alt={img.alt}
                        className="w-full h-auto object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-dark/0 group-hover:bg-dark/10 transition-colors duration-300" />
                    </div>
                  </FadeIn>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer onLogoClick={() => onNavigate("home")} />
    </>
  );
}
