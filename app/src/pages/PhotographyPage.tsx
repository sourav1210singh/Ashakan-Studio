import { ArrowLeft } from "lucide-react";
import { FadeIn } from "@/components/animations/FadeIn";
import { Footer } from "@/components/layout/Footer";
import { portfolioItems } from "@/data/portfolio";
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

export function PhotographyPage({ onNavigate }: PhotographyPageProps) {
  /* Show ALL photography projects — no filtering */
  const photoProjects = portfolioItems.filter(
    (item) => item.photoCategories && item.photoCategories.length > 0
  );

  /* Combine all gallery images */
  const allGalleryImages = Object.values(categoryGallery).flat();

  return (
    <>
      <main className="pt-20 bg-dark min-h-screen">
        {/* Header */}
        <section className="py-12 sm:py-16 border-b border-white/10">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">
            <FadeIn>
              <button
                onClick={() => onNavigate("work")}
                className="group flex items-center gap-3 mb-8"
              >
                <div className="w-10 h-10 rounded-full border border-white/40 flex items-center justify-center group-hover:bg-white group-hover:text-dark transition-colors text-white">
                  <ArrowLeft className="w-4 h-4" />
                </div>
                <span className="text-sm font-medium tracking-wider text-white/70">BACK TO WORK</span>
              </button>
              <h1 className="font-display text-5xl sm:text-7xl lg:text-8xl text-white tracking-tight">
                PHOTOGRAPHY
              </h1>
            </FadeIn>
          </div>
        </section>

        {/* Projects Grid */}
        <section className="py-16 sm:py-24">
          <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-10">
            {photoProjects.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-lg text-white/50">No projects found.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {photoProjects.map((item, index) => (
                  <FadeIn key={item.id} delay={index * 0.1}>
                    <button
                      onClick={() => onNavigate("portfolio", item.id)}
                      className="group block relative overflow-hidden rounded-2xl sm:rounded-3xl bg-white/5 w-full text-left"
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
                        <div className="absolute inset-0 bg-dark/0 group-hover:bg-dark/20 transition-colors duration-300" />
                      </div>
                      <div className="p-4 sm:p-6">
                        <p className="text-xs sm:text-sm font-medium tracking-wider text-white/40 mb-1">
                          {item.category}
                        </p>
                        <h3 className="font-display text-xl sm:text-2xl text-white tracking-tight">
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

        {/* Full Gallery Showcase — all category images */}
        {allGalleryImages.length > 0 && (
          <section className="py-16 sm:py-24 border-t border-white/10">
            <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-10">
              <FadeIn>
                <h2 className="font-display text-3xl sm:text-4xl text-white tracking-tight mb-12">
                  GALLERY
                </h2>
              </FadeIn>
              <div className="columns-2 sm:columns-3 lg:columns-4 gap-4 sm:gap-6">
                {allGalleryImages.map((img, index) => (
                  <FadeIn key={`gallery-${index}`} delay={index * 0.08} className="break-inside-avoid mb-4 sm:mb-6">
                    <div className="relative overflow-hidden rounded-xl sm:rounded-2xl group">
                      <img
                        src={img.src}
                        alt={img.alt}
                        className="w-full h-auto object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-dark/0 group-hover:bg-white/10 transition-colors duration-300" />
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
