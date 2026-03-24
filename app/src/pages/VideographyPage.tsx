import { ArrowLeft } from "lucide-react";
import { FadeIn } from "@/components/animations/FadeIn";
import { Footer } from "@/components/layout/Footer";
import type { View } from "@/App";

/** All Vimeo videos organized by category */
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

export function VideographyPage({ onNavigate }: VideographyPageProps) {
  const videos = getAllVideos();

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
                VIDEOGRAPHY
              </h1>
            </FadeIn>
          </div>
        </section>

        {/* Videos Grid — all Vimeo embeds */}
        <section className="py-16 sm:py-24">
          <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-10">
            {videos.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-lg text-white/50">No videos found.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                {videos.map((video, index) => (
                  <FadeIn key={video.vimeoId} delay={index * 0.08}>
                    <div>
                      <div className="relative overflow-hidden rounded-xl sm:rounded-2xl aspect-video bg-white/5">
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
