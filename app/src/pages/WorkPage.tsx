import { ArrowRight } from "lucide-react";
import { FadeIn } from "@/components/animations/FadeIn";
import { Footer } from "@/components/layout/Footer";
import { photographyCategories, videographyCategories, campaigns } from "@/data/navigation";
import type { View } from "@/App";

interface WorkPageProps {
  onNavigate: (view: View, slug?: string) => void;
}

/* Representative images for each category */
const photographyImages: Record<string, string> = {
  retail: "/images/portfolio/brandon-blackwood.jpg",
  "the-arts": "/images/portfolio/vitacca-ballet.jpg",
  fashion: "/images/portfolio/fashion.jpg",
  industrial: "/images/portfolio/radiomedix.jpg",
};

const videographyImages: Record<string, string> = {
  retail: "/images/portfolio/audaja-skincare.jpg",
  "the-arts": "/images/portfolio/lauren-anderson.jpg",
  industrial: "/images/portfolio/kinetik.jpg",
  documentary: "/images/portfolio/monarch-school.jpg",
  narrative: "/images/portfolio/cecilia-duarte.jpg",
};

const campaignImages: Record<string, string> = {
  deutsch: "/images/portfolio/deutsch-jewelry.jpg",
  weissman: "/images/portfolio/weissman-elite.jpg",
  "eye-gallery": "/images/portfolio/eye-gallery.jpg",
  "monarch-school": "/images/portfolio/monarch-school.jpg",
};

/* Tall thin leaf card — diagonal opposite corners rounded */
function LeafWorkCard({
  name,
  image,
  index,
  onClick,
}: {
  name: string;
  image: string;
  index: number;
  onClick: () => void;
}) {
  /*
   * Diagonal leaf: top-left & bottom-right rounded (even)
   *                top-right & bottom-left rounded (odd)
   * border-radius order: top-left top-right bottom-right bottom-left
   */
  const leafRadius =
    index % 2 === 0
      ? "80px 6px 80px 6px"
      : "6px 80px 6px 80px";

  return (
    <FadeIn delay={index * 0.08}>
      <button
        onClick={onClick}
        className="group relative text-left focus:outline-none overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
        style={{
          borderRadius: leafRadius,
          width: "clamp(100px, 14vw, 180px)",
          height: "clamp(380px, 50vw, 540px)",
        }}
      >
        <img
          src={image}
          alt={name}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        {/* Gradient overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-dark/70 via-dark/20 to-transparent" />
        {/* Title at bottom centre */}
        <div className="absolute bottom-0 left-0 right-0 flex justify-center pb-5 sm:pb-6">
          <span className="font-display text-xs sm:text-sm md:text-base text-white tracking-widest uppercase">
            {name}
          </span>
        </div>
      </button>
    </FadeIn>
  );
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
              <p className="text-lg sm:text-xl text-dark/70 max-w-2xl" style={{ textWrap: "balance" } as React.CSSProperties}>
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

            <div className="flex justify-center gap-4 sm:gap-6">
              {photographyCategories.map((cat, index) => (
                <LeafWorkCard
                  key={cat.id}
                  name={cat.name}
                  image={photographyImages[cat.id] || "/images/portfolio/fashion.jpg"}
                  index={index}
                  onClick={() => onNavigate("photography")}
                />
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

            <div className="flex justify-center gap-4 sm:gap-6">
              {videographyCategories.map((cat, index) => (
                <LeafWorkCard
                  key={cat.id}
                  name={cat.name}
                  image={videographyImages[cat.id] || "/images/portfolio/vitacca-ballet.jpg"}
                  index={index}
                  onClick={() => onNavigate("videography")}
                />
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

            <div className="flex justify-center gap-4 sm:gap-6">
              {campaigns.map((campaign, index) => (
                <LeafWorkCard
                  key={campaign.id}
                  name={campaign.name}
                  image={campaignImages[campaign.id] || "/images/portfolio/deutsch-jewelry.jpg"}
                  index={index}
                  onClick={() => onNavigate("campaigns")}
                />
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer onLogoClick={() => onNavigate("home")} />
    </>
  );
}
