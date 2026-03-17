import { ArrowLeft, Play } from "lucide-react";
import { FadeIn } from "@/components/animations/FadeIn";
import { Footer } from "@/components/layout/Footer";
import { portfolioItems } from "@/data/portfolio";
import { videographyCategories } from "@/data/navigation";
import type { View } from "@/App";

/** Featured Vimeo videos from old ashkanmedia.com project pages, by category */
const categoryVideos: Record<string, { vimeoId: string; title: string }[]> = {
  industrial: [
    { vimeoId: "808109158", title: "RadioMedix — Innovating Theranostics" },
    { vimeoId: "437963536", title: "RadioMedix — From Innovation to Intervention" },
    { vimeoId: "437960590", title: "Excel Diagnostics — Committed to Excellence" },
    { vimeoId: "865168546", title: "Kinetik — Once Upon A Time in the Delaware Basin" },
  ],
  "the-arts": [
    { vimeoId: "1022971286", title: "Vitacca Ballet — Season Promo 24-25" },
    { vimeoId: "863773710", title: "Vitacca Ballet — Sown / Woven / One" },
    { vimeoId: "1002076560", title: "Cecilia Duarte — Solo Album Promotional" },
    { vimeoId: "807672933", title: "Cecilia Duarte — Live Performance w/ Misael Barraza" },
  ],
  retail: [
    { vimeoId: "529432034", title: "The Eye Gallery — Edgy, Designer, Eyewear" },
    { vimeoId: "354069394", title: "The Eye Gallery — A Motion Editorial" },
    { vimeoId: "1002121348", title: "The Eye Gallery — Project Reel" },
    { vimeoId: "950064546", title: "Weissman Elite — Fall FY25" },
    { vimeoId: "886600264", title: "Weissman Elite — Spring 2024" },
    { vimeoId: "867250099", title: "Weissman Elite — Winter 2023" },
    { vimeoId: "806042416", title: "Weissman Elite — Spring '23" },
  ],
  documentary: [
    { vimeoId: "896674527", title: "Monarch — Transforming Lives 2023-2024" },
    { vimeoId: "518687682", title: "Monarch — 2021 Virtual Luncheon" },
    { vimeoId: "673378712", title: "Monarch School — Kitchen Donation" },
    { vimeoId: "395268120", title: "Monarch — The Chrysalis Program" },
    { vimeoId: "308492765", title: "The 2019 Monarch School Luncheon" },
  ],
  narrative: [
    { vimeoId: "865168546", title: "Kinetik — Once Upon A Time in the Delaware Basin" },
  ],
};

interface VideographyPageProps {
  onNavigate: (view: View, slug?: string) => void;
  activeCategory?: string | null;
}

export function VideographyPage({ onNavigate, activeCategory }: VideographyPageProps) {
  const videoProjects = portfolioItems.filter((item) => {
    if (!item.videoCategories || item.videoCategories.length === 0) return false;
    if (!activeCategory) return true;
    return item.videoCategories.includes(activeCategory);
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
                VIDEOGRAPHY
              </h1>
            </FadeIn>
          </div>
        </section>

        {/* Categories */}
        <section className="py-8 border-b border-dark/10">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => onNavigate("videography")}
                className={`text-sm font-medium tracking-wider px-4 py-2 rounded-full border transition-colors ${
                  !activeCategory
                    ? "bg-dark text-white border-dark"
                    : "text-dark border-dark/30 hover:bg-dark hover:text-white"
                }`}
              >
                ALL
              </button>
              {videographyCategories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => onNavigate("videography", cat.id)}
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
            {videoProjects.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-lg text-dark/50">No projects found in this category.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {videoProjects.map((item, index) => (
                  <FadeIn key={item.id} delay={index * 0.1}>
                    <button
                      onClick={() => onNavigate("portfolio", item.id)}
                      className="group block relative overflow-hidden rounded-2xl sm:rounded-3xl bg-white w-full text-left"
                    >
                      <div className="relative overflow-hidden aspect-video">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-cover transition-transform duration-600 ease-out group-hover:scale-105"
                        />
                        {/* Play Button Overlay */}
                        <div className="absolute inset-0 bg-dark/30 flex items-center justify-center">
                          <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Play className="w-6 h-6 text-dark ml-1" fill="currentColor" />
                          </div>
                        </div>
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
        {/* Featured Videos — Vimeo embeds from old URLs */}
        {activeCategory && categoryVideos[activeCategory] && categoryVideos[activeCategory].length > 0 && (
          <section className="py-16 sm:py-24 bg-cream border-t border-dark/10">
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">
              <FadeIn>
                <h2 className="font-display text-3xl sm:text-4xl text-dark tracking-tight mb-12">
                  FEATURED VIDEOS
                </h2>
              </FadeIn>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {categoryVideos[activeCategory].map((video, index) => (
                  <FadeIn key={video.vimeoId} delay={index * 0.1}>
                    <div>
                      <div className="relative overflow-hidden rounded-xl sm:rounded-2xl aspect-video bg-dark">
                        <iframe
                          src={`https://player.vimeo.com/video/${video.vimeoId}?dnt=1&title=0&byline=0&portrait=0`}
                          className="w-full h-full"
                          frameBorder="0"
                          allow="autoplay; fullscreen; picture-in-picture"
                          allowFullScreen
                          title={video.title}
                        />
                      </div>
                      <p className="mt-3 text-sm font-medium tracking-wider text-dark/70">
                        {video.title}
                      </p>
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
