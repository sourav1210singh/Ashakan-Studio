import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { FadeIn } from "@/components/animations/FadeIn";
import { Footer } from "@/components/layout/Footer";
import { Lightbox } from "@/components/ui/Lightbox";
import { PortfolioCta } from "@/components/ui/PortfolioCta";
import { portfolioItems } from "@/data/portfolio";
import type { View } from "@/App";

/** Gallery images organized by category - sourced from real photoshoot folders */
const categoryGallery: Record<string, { src: string; alt: string }[]> = {
  fashion: [
    { src: "/images/categories/fashion/6c1a8567.jpg", alt: "Fashion editorial" },
    { src: "/images/categories/fashion/_adelya-jeanee-3189.jpg", alt: "Adelya Jeanee - fashion portrait" },
    { src: "/images/categories/fashion/ag-349.jpg", alt: "Fashion shoot - studio session" },
    { src: "/images/categories/fashion/ansley-jackson-154.jpg", alt: "Ansley Jackson - fashion editorial" },
    { src: "/images/categories/fashion/citybook-2024-1000.jpg", alt: "CityBook 2024 - fashion editorial" },
    { src: "/images/categories/fashion/citybook-2024-1188.jpg", alt: "CityBook 2024 - runway editorial" },
    { src: "/images/categories/fashion/citybook-2024-347.jpg", alt: "CityBook 2024 - color story" },
    { src: "/images/categories/fashion/citybook-2024-633.jpg", alt: "CityBook 2024 - modern fashion" },
    { src: "/images/categories/fashion/finn-hackney-62296-edit.jpg", alt: "Finn Hackney - fashion portrait" },
    { src: "/images/categories/fashion/isabella-decandido-21845.jpg", alt: "Isabella DeCandido - fashion" },
    { src: "/images/categories/fashion/kieran-holmes-134.jpg", alt: "Kieran Holmes - fashion editorial" },
    { src: "/images/categories/fashion/kieran-holmes-311.jpg", alt: "Kieran Holmes - fashion shoot" },
    { src: "/images/categories/fashion/light-tutorial--madison-164.jpg", alt: "Light tutorial - Madison" },
    { src: "/images/categories/fashion/light-tutorial--madison-350.jpg", alt: "Light tutorial - Madison editorial" },
    { src: "/images/categories/fashion/natalie-varnim-fashion-raw-6062.jpg", alt: "Natalie Varnim - fashion raw" },
    { src: "/images/categories/fashion/silken-x-godox-123.jpg", alt: "Silken collaboration" },
    { src: "/images/categories/fashion/tattum-312.jpg", alt: "Tattum - fashion editorial" },
    { src: "/images/categories/fashion/tattum-328.jpg", alt: "Tattum - fashion portrait" },
    { src: "/images/categories/fashion/tattum-457.jpg", alt: "Tattum - modern fashion" },
    { src: "/images/categories/fashion/tattum-498.jpg", alt: "Tattum - bold styling" },
    { src: "/images/categories/fashion/tattum-516.jpg", alt: "Tattum - editorial close-up" },
    { src: "/images/categories/fashion/vitacca-2025-8276.jpg", alt: "Vitacca 2025 - fashion editorial" },
    { src: "/images/categories/fashion/zina-618.jpg", alt: "Zina - fashion portrait" },
    { src: "/images/categories/fashion/zina-659.jpg", alt: "Zina - editorial fashion" },
    { src: "/images/categories/fashion/zina-704.jpg", alt: "Zina - bold fashion" },
  ],
  "the-arts": [
    { src: "/images/categories/the-arts/_abstract-1599.jpg", alt: "Abstract dance composition" },
    { src: "/images/categories/the-arts/_east-side-perfromming-art-584-edit.jpg", alt: "East Side Performing Arts" },
    { src: "/images/categories/the-arts/_flora-2492.jpg", alt: "Flora - performance" },
    { src: "/images/categories/the-arts/abstract-1967.jpg", alt: "Abstract performance art" },
    { src: "/images/categories/the-arts/alyssa-luck-1098.jpg", alt: "Alyssa Luck - dance portrait" },
    { src: "/images/categories/the-arts/alyssa-raw-5028.jpg", alt: "Alyssa - raw performance" },
    { src: "/images/categories/the-arts/amy-dunn-60832.jpg", alt: "Amy Dunn - performer portrait" },
    { src: "/images/categories/the-arts/ansley-jackson-208.jpg", alt: "Ansley Jackson - performance" },
    { src: "/images/categories/the-arts/ashley-kirby-121.jpg", alt: "Ashley Kirby - dancer" },
    { src: "/images/categories/the-arts/ava-dempster-1173-edit.jpg", alt: "Ava Dempster - performer" },
    { src: "/images/categories/the-arts/ava-ramirez-202.jpg", alt: "Ava Ramirez - dance" },
    { src: "/images/categories/the-arts/evah-desantis-056.jpg", alt: "Evah Desantis - performance" },
    { src: "/images/categories/the-arts/harlem-theater-49919-edit.jpg", alt: "Harlem Theater" },
    { src: "/images/categories/the-arts/kayla-raw-23160.jpg", alt: "Kayla - raw performance" },
    { src: "/images/categories/the-arts/kinetic-symphony-3317-edit-2.jpg", alt: "Kinetic Symphony - dance" },
    { src: "/images/categories/the-arts/kinetic-symphony-3406-edit.jpg", alt: "Kinetic Symphony - movement" },
    { src: "/images/categories/the-arts/lauren-anderson-2490-edit.jpg", alt: "Lauren Anderson - dance editorial" },
    { src: "/images/categories/the-arts/leah-white_-1127.jpg", alt: "Leah White - performer" },
    { src: "/images/categories/the-arts/madison-7078-2.jpg", alt: "Madison - dance portrait" },
    { src: "/images/categories/the-arts/miranda-davis-8-7-24-023-edit.jpg", alt: "Miranda Davis - dance" },
    { src: "/images/categories/the-arts/sofia-serna-033-edit.jpg", alt: "Sofia Serna - performance" },
    { src: "/images/categories/the-arts/tahyz-and-z-5322.jpg", alt: "Tahyz and Z - duet performance" },
    { src: "/images/categories/the-arts/tattum-638.jpg", alt: "Tattum - performer portrait" },
    { src: "/images/categories/the-arts/workshop-ava-582.jpg", alt: "Workshop - Ava performance" },
    { src: "/images/categories/the-arts/yuriko-24149.jpg", alt: "Yuriko - dance editorial" },
  ],
  retail: [
    { src: "/images/categories/retail/1.jpg", alt: "Product photography" },
    { src: "/images/categories/retail/15434_vanilla_33802.jpg", alt: "Vanilla product line" },
    { src: "/images/categories/retail/15439_black_21660.jpg", alt: "Black product line" },
    { src: "/images/categories/retail/2.jpg", alt: "Product detail shot" },
    { src: "/images/categories/retail/296gtb-070.jpg", alt: "Ferrari 296 GTB - luxury automotive" },
    { src: "/images/categories/retail/296gtb-121.jpg", alt: "Ferrari 296 GTB - detail" },
    { src: "/images/categories/retail/296gtb-137.jpg", alt: "Ferrari 296 GTB - interior" },
    { src: "/images/categories/retail/3.jpg", alt: "Product hero shot" },
    { src: "/images/categories/retail/4.jpg", alt: "Product styling" },
    { src: "/images/categories/retail/4q7a1052-03.jpg", alt: "Retail product photography" },
    { src: "/images/categories/retail/5.jpg", alt: "Product editorial" },
    { src: "/images/categories/retail/6.jpg", alt: "Product close-up" },
    { src: "/images/categories/retail/_leah-anthoni-070.jpg", alt: "Leah Anthoni - retail editorial" },
    { src: "/images/categories/retail/clenet-500.jpg", alt: "Clenet - luxury automotive" },
    { src: "/images/categories/retail/clenet-505.jpg", alt: "Clenet - classic detail" },
    { src: "/images/categories/retail/clenet-519.jpg", alt: "Clenet - heritage car" },
    { src: "/images/categories/retail/ct4-571.jpg", alt: "Cadillac CT4 - automotive" },
    { src: "/images/categories/retail/ct4-581.jpg", alt: "Cadillac CT4 - interior" },
    { src: "/images/categories/retail/eye-gallery-aug-21-2025-062.jpg", alt: "The Eye Gallery - eyewear" },
    { src: "/images/categories/retail/eye-gallery-aug-21-2025-167.jpg", alt: "The Eye Gallery - designer frames" },
    { src: "/images/categories/retail/mustang-095.jpg", alt: "Ford Mustang - automotive" },
    { src: "/images/categories/retail/mustang-111.jpg", alt: "Ford Mustang - performance shot" },
    { src: "/images/categories/retail/mustang-218.jpg", alt: "Ford Mustang - detail" },
    { src: "/images/categories/retail/sf90-895.jpg", alt: "Ferrari SF90 - luxury sports" },
    { src: "/images/categories/retail/sf90-949.jpg", alt: "Ferrari SF90 - close-up" },
  ],
  /* HEADSHOTS - this is the former "Industrial" category, RENAMED to
     Headshots per Ashkan (6/10). Same gallery (corporate portraits +
     facility work), now titled Headshots. The previous dedicated
     headshots page is archived at /work/photography/old-headshot. */
  headshots: [
    { src: "/images/categories/industrial/aleyna-ozcelik-154.jpg", alt: "Aleyna Ozcelik - corporate portrait" },
    { src: "/images/categories/industrial/daniella-1937.jpg", alt: "Daniella - corporate portrait" },
    { src: "/images/categories/industrial/reagan-thomas-3630.jpg", alt: "Reagan Thomas - corporate portrait" },
    { src: "/images/categories/industrial/michelle-leagans-2025-048.jpg", alt: "Michelle Leagans - corporate portrait" },
    { src: "/images/categories/industrial/cici-3845-edit-2.jpg", alt: "CICI - corporate portrait" },
    { src: "/images/categories/industrial/elevation-on-tour-headshot-061.jpg", alt: "Elevation on Tour - headshot" },
    { src: "/images/categories/industrial/tattum-159.jpg", alt: "Tattum - portrait" },
    { src: "/images/categories/industrial/unbridaled-124.jpg", alt: "Unbridaled - portrait" },
    { src: "/images/categories/industrial/tgc-2864.jpg", alt: "TGC - portrait" },
    { src: "/images/categories/industrial/2venus-aerospace-24470-2.jpg", alt: "Venus Aerospace - facility" },
    { src: "/images/categories/industrial/2venus-aerospace-24545.jpg", alt: "Venus Aerospace - operations" },
    { src: "/images/categories/industrial/venus-aerospace-24424-edit.jpg", alt: "Venus Aerospace - engineering" },
    { src: "/images/categories/industrial/venus-aerospace-24443-edit.jpg", alt: "Venus Aerospace - innovation" },
    { src: "/images/categories/industrial/venus-aerospace-24499.jpg", alt: "Venus Aerospace - facility detail" },
    { src: "/images/categories/industrial/venus-aerospace-24526.jpg", alt: "Venus Aerospace - operations" },
    { src: "/images/categories/industrial/4q7a0824.jpg", alt: "Industrial photography" },
    { src: "/images/categories/industrial/4q7a8716.jpg", alt: "Industrial - engineering" },
    { src: "/images/categories/industrial/4q7a8728.jpg", alt: "Industrial - equipment" },
    { src: "/images/categories/industrial/4q7a8747.jpg", alt: "Industrial - operations" },
    { src: "/images/categories/industrial/4q7a8780.jpg", alt: "Industrial - workshop" },
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
      "Product and brand photography that turns merchandise into visual experiences - blending polished commercial imagery with storytelling that strengthens brand presence and consumer connection.",
  },
  fashion: {
    title: "FASHION",
    description:
      "Editorial fashion photography with bold styling, dramatic lighting, and refined composition. Visual storytelling for designers, publications, and emerging labels.",
  },
  headshots: {
    title: "HEADSHOTS",
    description:
      "Professional headshots and corporate portraits - clean, confident imagery for executives, teams, performers, and brands.",
  },
};

interface PhotographyPageProps {
  onNavigate: (view: View, slug?: string) => void;
  activeCategory?: string | null;
}

export function PhotographyPage({ onNavigate, activeCategory }: PhotographyPageProps) {
  /* Lightbox state - click any gallery photo to enlarge per Brandi's
     'every photo in any gallery should be clickable' direction. */
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  /* Determine images to display: category-specific OR all combined */
  const isCategory = activeCategory && activeCategory in categoryGallery;

  let displayImages: { src: string; alt: string }[] = [];
  let pageTitle = "PHOTOGRAPHY";
  let pageDescription = "";

  if (isCategory) {
    // Category page - show only that category's images (max 20)
    displayImages = (categoryGallery[activeCategory!] || []).slice(0, 20);
    const meta = categoryMeta[activeCategory!];
    pageTitle = meta?.title || activeCategory!.toUpperCase();
    pageDescription = meta?.description || "";
  } else {
    // Main photography page - show all merged
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
                onClick={() => onNavigate(isCategory ? "photography" : "home")}
                className="group flex items-center gap-3 mb-8"
              >
                <div className="w-10 h-10 rounded-full border border-white/40 flex items-center justify-center group-hover:bg-white group-hover:text-dark transition-colors text-white">
                  <ArrowLeft className="w-4 h-4" />
                </div>
                <span className="text-sm font-medium tracking-wider text-white/70">
                  {isCategory ? "BACK TO PHOTOGRAPHY" : "BACK TO HOME"}
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

              {/* EXPLORE pills - shown only on the all-photography view,
                  let visitors jump directly to a sub-category page per
                  Brandi's page-19/20 review note. Hidden on the category
                  pages themselves (where they'd be redundant). */}
              {!isCategory && (
                <div className="mt-8 sm:mt-10 flex flex-wrap items-center gap-3 sm:gap-4">
                  <span className="text-xs font-semibold tracking-[0.3em] text-white/45 uppercase">
                    Explore
                  </span>
                  {[
                    { label: "RETAIL", slug: "retail" },
                    { label: "THE ARTS", slug: "the-arts" },
                    { label: "FASHION", slug: "fashion" },
                    { label: "HEADSHOTS", slug: "headshots" },
                  ].map((cat) => (
                    <button
                      key={cat.slug}
                      onClick={() => onNavigate("photography", cat.slug)}
                      className="text-xs sm:text-sm font-semibold tracking-[0.25em] text-white/85 hover:text-white uppercase border border-white/30 hover:border-white/70 hover:bg-white/5 px-4 sm:px-5 py-2 sm:py-2.5 transition-colors duration-300"
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
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
                  <FadeIn key={`photo-${index}`} delay={Math.min(index * 0.06, 0.6)} className="break-inside-avoid mb-4 sm:mb-6">
                    <button
                      type="button"
                      onClick={() => setLightboxIndex(index)}
                      aria-label={`Open ${img.alt} in lightbox`}
                      className="block relative overflow-hidden cursor-zoom-in w-full group"
                    >
                      <img
                        src={img.src}
                        alt={img.alt}
                        className="w-full h-auto object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      />
                      {/* Subtle dark overlay on hover so cursor:zoom-in feels intentional */}
                      <span className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors duration-300 pointer-events-none" />
                    </button>
                  </FadeIn>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* CTA above the footer (Ashkan 6/10: CTA on portfolio pages) */}
        <PortfolioCta
          text="Ready to create photography that defines your brand? Partner with our Houston team for your next shoot."
          onContactClick={() => onNavigate("contact")}
        />
      </main>
      <Footer onLogoClick={() => onNavigate("home")} />

      {/* Full-screen lightbox - opens when any gallery photo is clicked */}
      <Lightbox
        images={displayImages}
        isOpen={lightboxIndex !== null}
        initialIndex={lightboxIndex ?? 0}
        onClose={() => setLightboxIndex(null)}
      />
    </>
  );
}
