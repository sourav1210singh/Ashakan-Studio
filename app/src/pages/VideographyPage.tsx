import { ArrowLeft } from "lucide-react";
import { FadeIn } from "@/components/animations/FadeIn";
import { Footer } from "@/components/layout/Footer";
import type { View } from "@/App";

/** All Vimeo videos organized by category */
const categoryVideos: Record<string, { vimeoId: string; title: string }[]> = {
  industrial: [
    { vimeoId: "808109158", title: "Industrial — Theranostics innovation" },
    { vimeoId: "437963536", title: "Industrial — Innovation to intervention" },
  ],
  "the-arts": [
    { vimeoId: "1022971286", title: "The Arts — Dance season promo" },
    { vimeoId: "1002076560", title: "The Arts — Solo album promotional" },
  ],
  retail: [
    { vimeoId: "529432034", title: "Retail — Designer eyewear motion" },
    { vimeoId: "950064546", title: "Retail — Dancewear campaign" },
  ],
  documentary: [
    { vimeoId: "896674527", title: "Documentary — Education impact" },
    { vimeoId: "673378712", title: "Documentary — Community story" },
  ],
  narrative: [
    { vimeoId: "865168546", title: "Narrative — Cinematic short film" },
  ],
};

/** Category-specific titles and descriptions */
const categoryMeta: Record<string, { title: string; description: string }> = {
  "the-arts": {
    title: "THE ARTS",
    description:
      "Cinematic videography for performers, dancers, and artists. Capturing movement, emotion, and the artistry of live performance.",
  },
  retail: {
    title: "RETAIL",
    description:
      "Brand films and product videography that showcase merchandise in motion. From fashion campaigns to product launches.",
  },
  industrial: {
    title: "INDUSTRIAL",
    description:
      "Corporate, medical, and industrial videography. Clean, purposeful storytelling that highlights innovation and craftsmanship.",
  },
  documentary: {
    title: "DOCUMENTARY",
    description:
      "Documentary-style videography capturing real stories, real people, and meaningful impact. Long-form narrative filmmaking.",
  },
  narrative: {
    title: "NARRATIVE",
    description:
      "Cinematic narrative films with story-driven production. Conceptual short films and brand-led storytelling.",
  },
};

/** Get ALL videos deduplicated */
function getAllVideos() {
  const seen = new Set<string>();
  const all: { vimeoId: string; title: string }[] = [];
  for (const videos of Object.values(categoryVideos)) {
    for (const v of videos) {
      if (!seen.has(v.vimeoId)) {
        seen.add(v.vimeoId);
        all.push(v);
      }
    }
  }
  return all;
}

interface VideographyPageProps {
  onNavigate: (view: View, slug?: string) => void;
  activeCategory?: string | null;
}

export function VideographyPage({ onNavigate, activeCategory }: VideographyPageProps) {
  const isCategory = activeCategory && activeCategory in categoryVideos;

  let videos: { vimeoId: string; title: string }[] = [];
  let pageTitle = "VIDEOGRAPHY";
  let pageDescription = "";

  if (isCategory) {
    // Category page — show only that category (max 2 videos per Brandi)
    videos = (categoryVideos[activeCategory!] || []).slice(0, 2);
    const meta = categoryMeta[activeCategory!];
    pageTitle = meta?.title || activeCategory!.toUpperCase();
    pageDescription = meta?.description || "";
  } else {
    // Main videography page — show all
    videos = getAllVideos();
  }

  return (
    <>
      <main className="pt-20 bg-dark min-h-screen">
        {/* Header */}
        <section className="py-12 sm:py-16 border-b border-white/10">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">
            <FadeIn>
              <button
                onClick={() => onNavigate(isCategory ? "videography" : "work")}
                className="group flex items-center gap-3 mb-8"
              >
                <div className="w-10 h-10 rounded-full border border-white/40 flex items-center justify-center group-hover:bg-white group-hover:text-dark transition-colors text-white">
                  <ArrowLeft className="w-4 h-4" />
                </div>
                <span className="text-sm font-medium tracking-wider text-white/70">
                  {isCategory ? "BACK TO VIDEOGRAPHY" : "BACK TO WORK"}
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

        {/* Videos Grid — wide thumbnails */}
        <section className="py-16 sm:py-24">
          <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-10">
            {videos.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-lg text-white/50">No videos found.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-[1400px] mx-auto">
                {videos.map((video, index) => (
                  <FadeIn key={video.vimeoId} delay={index * 0.08}>
                    <div>
                      <div className="relative overflow-hidden aspect-video bg-white/5">
                        <iframe
                          src={`https://player.vimeo.com/video/${video.vimeoId}?dnt=1&quality=1080p&title=0&byline=0&portrait=0`}
                          className="w-full h-full"
                          frameBorder="0"
                          allow="autoplay; fullscreen; picture-in-picture"
                          allowFullScreen
                          title={video.title}
                        />
                      </div>
                      <p className="mt-3 text-sm font-medium tracking-wider text-white/60">
                        {video.title}
                      </p>
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
