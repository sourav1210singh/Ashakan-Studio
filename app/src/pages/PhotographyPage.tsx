import { ArrowLeft } from "lucide-react";
import { FadeIn } from "@/components/animations/FadeIn";
import { Footer } from "@/components/layout/Footer";
import { portfolioItems } from "@/data/portfolio";
import type { View } from "@/App";

/** Gallery images organized by category — max 20 per Brandi's feedback */
const categoryGallery: Record<string, { src: string; alt: string }[]> = {
  fashion: [
    { src: "/images/gallery/fashion/fashion-1.jpg", alt: "Fashion editorial — red monochromatic styling" },
    { src: "/images/gallery/fashion/fashion-2.jpg", alt: "Fashion editorial — colorful babydoll boots" },
    { src: "/images/gallery/fashion/fashion-3.jpg", alt: "Fashion editorial — flowy fabric pants" },
    { src: "/images/gallery/fashion/fashion-4.jpg", alt: "Fashion portrait — studio editorial" },
    { src: "/images/gallery/fashion/fashion-5.jpg", alt: "Fashion portrait — dramatic lighting" },
    { src: "/images/gallery/fashion/fashion-6.jpg", alt: "Dancewear fashion editorial" },
    { src: "/images/gallery/fashion/fashion-7.jpg", alt: "Fashion editorial — Julianna Perez" },
    { src: "/images/portfolio/brandon-blackwood.jpg", alt: "Luxury fashion editorial" },
    { src: "/images/portfolio/elastique-athletics.jpg", alt: "Activewear fashion" },
    { src: "/images/portfolio/publications.jpg", alt: "Editorial publication" },
    { src: "/images/portfolio/fashion.jpg", alt: "Fashion campaign" },
  ],
  "the-arts": [
    { src: "/images/portfolio/vitacca-ballet.jpg", alt: "Dance performance" },
    { src: "/images/portfolio/cecilia-duarte.jpg", alt: "Artist portrait" },
    { src: "/images/portfolio/lauren-anderson.jpg", alt: "Dance portrait" },
    { src: "/images/gallery/the-arts/arts-1.jpg", alt: "Dance photography — studio session" },
    { src: "/images/portfolio/8-4Q7A9046-2.jpeg", alt: "Documentary portrait" },
    { src: "/images/portfolio/5-Monarch-47-2.jpeg", alt: "Student portrait — documentary" },
    { src: "/images/portfolio/20-4Q7A9311-2-2.jpeg", alt: "Classroom activities" },
    { src: "/images/portfolio/Monarch_30-copy.jpeg", alt: "Outdoor learning" },
    { src: "/images/portfolio/17-Monarch-199-2.jpeg", alt: "Teacher with students" },
    { src: "/images/portfolio/10-Monarch-116-2.jpeg", alt: "Student artwork" },
    { src: "/images/portfolio/17-Monarch-86-2.jpeg", alt: "School event" },
  ],
  retail: [
    { src: "/images/portfolio/brandon-blackwood.jpg", alt: "Luxury handbag photography" },
    { src: "/images/portfolio/audaja-skincare.jpg", alt: "Skincare product photography" },
    { src: "/images/portfolio/cacao-cardamom.jpg", alt: "Artisan product photography" },
    { src: "/images/portfolio/elastique-athletics.jpg", alt: "Activewear product" },
    { src: "/images/portfolio/eye-gallery.jpg", alt: "Designer eyewear" },
    { src: "/images/portfolio/deutsch-jewelry.jpg", alt: "Luxury jewelry photography" },
    { src: "/images/portfolio/weissman-elite.jpg", alt: "Dancewear retail" },
  ],
  industrial: [
    { src: "/images/portfolio/radiomedix.jpg", alt: "Medical facility photography" },
    { src: "/images/portfolio/car-collections.jpg", alt: "Automotive photography" },
  ],
};

/** Category-specific titles and descriptions */
const categoryMeta: Record<string, { title: string; description: string }> = {
  "the-arts": {
    title: "THE ARTS",
    description:
      "Capturing the soul of artists, dancers, and performers through expressive photography. Each frame celebrates the beauty of movement, emotion, and creative expression.",
  },
  retail: {
    title: "RETAIL",
    description:
      "Product and brand photography that elevates retail merchandise. From luxury goods to everyday essentials — visuals that drive desire and build brand identity.",
  },
  fashion: {
    title: "FASHION",
    description:
      "Editorial fashion photography with bold styling, dramatic lighting, and refined composition. Visual storytelling for designers, publications, and emerging labels.",
  },
  industrial: {
    title: "INDUSTRIAL",
    description:
      "Industrial, automotive, and corporate photography. Clean, technical, and purposeful imagery that highlights craftsmanship, scale, and innovation.",
  },
};

interface PhotographyPageProps {
  onNavigate: (view: View, slug?: string) => void;
  activeCategory?: string | null;
}

export function PhotographyPage({ onNavigate, activeCategory }: PhotographyPageProps) {
  /* Determine images to display: category-specific OR all combined */
  const isCategory = activeCategory && activeCategory in categoryGallery;

  let displayImages: { src: string; alt: string }[] = [];
  let pageTitle = "PHOTOGRAPHY";
  let pageDescription = "";

  if (isCategory) {
    // Category page — show only that category's images (max 20)
    displayImages = (categoryGallery[activeCategory!] || []).slice(0, 20);
    const meta = categoryMeta[activeCategory!];
    pageTitle = meta?.title || activeCategory!.toUpperCase();
    pageDescription = meta?.description || "";
  } else {
    // Main photography page — show all merged
    const projectImages = portfolioItems
      .filter((item) => item.photoCategories && item.photoCategories.length > 0)
      .map((item) => ({ src: item.image, alt: item.title }));
    const galleryImages = Object.values(categoryGallery).flat();

    const seen = new Set<string>();
    for (const img of [...projectImages, ...galleryImages]) {
      if (!seen.has(img.src)) {
        seen.add(img.src);
        displayImages.push(img);
      }
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
                onClick={() => onNavigate(isCategory ? "photography" : "work")}
                className="group flex items-center gap-3 mb-8"
              >
                <div className="w-10 h-10 rounded-full border border-white/40 flex items-center justify-center group-hover:bg-white group-hover:text-dark transition-colors text-white">
                  <ArrowLeft className="w-4 h-4" />
                </div>
                <span className="text-sm font-medium tracking-wider text-white/70">
                  {isCategory ? "BACK TO PHOTOGRAPHY" : "BACK TO WORK"}
                </span>
              </button>
              <h1 className="font-display text-5xl sm:text-7xl lg:text-8xl text-white tracking-tight">
                {pageTitle}
              </h1>
              {pageDescription && (
                <p className="text-lg sm:text-xl text-white/60 max-w-2xl mt-6 leading-relaxed">
                  {pageDescription}
                </p>
              )}
            </FadeIn>
          </div>
        </section>

        {/* Masonry gallery */}
        <section className="py-16 sm:py-24">
          <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-10">
            {displayImages.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-lg text-white/50">No images found.</p>
              </div>
            ) : (
              <div className="columns-2 sm:columns-3 lg:columns-4 gap-4 sm:gap-6">
                {displayImages.map((img, index) => (
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
            )}
          </div>
        </section>
      </main>
      <Footer onLogoClick={() => onNavigate("home")} />
    </>
  );
}
