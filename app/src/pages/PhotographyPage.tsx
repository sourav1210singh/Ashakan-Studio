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
  /* Collect all images: portfolio project images + gallery images */
  const projectImages = portfolioItems
    .filter((item) => item.photoCategories && item.photoCategories.length > 0)
    .map((item) => ({ src: item.image, alt: item.title }));

  const galleryImages = Object.values(categoryGallery).flat();

  /* Merge and deduplicate by src */
  const seen = new Set<string>();
  const allImages: { src: string; alt: string }[] = [];
  for (const img of [...projectImages, ...galleryImages]) {
    if (!seen.has(img.src)) {
      seen.add(img.src);
      allImages.push(img);
    }
  }

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

        {/* Single merged gallery — non-clickable, no text */}
        <section className="py-16 sm:py-24">
          <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-10">
            <div className="columns-2 sm:columns-3 lg:columns-4 gap-4 sm:gap-6">
              {allImages.map((img, index) => (
                <FadeIn key={`photo-${index}`} delay={index * 0.06} className="break-inside-avoid mb-4 sm:mb-6">
                  <div className="relative overflow-hidden">
                    <img
                      src={img.src}
                      alt={img.alt}
                      className="w-full h-auto object-cover transition-transform duration-700 ease-out hover:scale-105"
                    />
                  </div>
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
