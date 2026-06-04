import { ArrowLeft } from "lucide-react";
import { FadeIn } from "@/components/animations/FadeIn";
import { Footer } from "@/components/layout/Footer";
import type { View } from "@/App";
import {
  BRANDI_VIDEOS,
  getVideosByPortfolio,
  buildVimeoEmbedUrl,
  type BrandiVideo,
  type PortfolioCategory,
} from "@/data/brandi-videos";

/* Category-specific titles and descriptions - keys must match
   PortfolioCategory union in brandi-videos.ts.
   Description copy verbatim from Brandi's 5/7/26 review notes
   (pages 27-28). */
const categoryMeta: Record<PortfolioCategory, { title: string; description: string }> = {
  retail: {
    title: "RETAIL",
    description:
      "Product and brand videography that transforms merchandise into living moments - combining polished commercial production with storytelling designed for impact across digital platforms.",
  },
  "the-arts": {
    title: "THE ARTS",
    description:
      "Cinematic videography for performers, dancers, and artists. Capturing movement, emotion, and the artistry of performance, as well as the excellence in their craft.",
  },
  industrial: {
    title: "INDUSTRIAL",
    description:
      "Visual storytelling for corporate, medical, and industrial clients - ranging from cinematic narratives to structured brand and investor content that highlights purpose and process.",
  },
  documentary: {
    title: "DOCUMENTARY",
    description:
      "Documentary filmmaking for organizations, communities, and individuals - crafted to translate mission into purposeful storytelling that drives impact through fundraising, awareness, broadcast, and long-term growth.",
  },
  narrative: {
    title: "NARRATIVE",
    description:
      "Narrative storytelling for brands and organizations - crafted across short film concepts, character-driven pieces, and educational content that brings ideas, services, and culture to life.",
  },
};

const VALID_CATEGORIES = Object.keys(categoryMeta) as PortfolioCategory[];

/** Deduplicate by vimeoId so the main "all videos" view doesn't repeat */
function uniqueByVimeoId(list: BrandiVideo[]): BrandiVideo[] {
  const seen = new Set<string>();
  const out: BrandiVideo[] = [];
  for (const v of list) {
    if (!seen.has(v.vimeoId)) {
      seen.add(v.vimeoId);
      out.push(v);
    }
  }
  return out;
}

interface VideographyPageProps {
  onNavigate: (view: View, slug?: string) => void;
  activeCategory?: string | null;
}

export function VideographyPage({ onNavigate, activeCategory }: VideographyPageProps) {
  const isCategory =
    activeCategory && (VALID_CATEGORIES as string[]).includes(activeCategory);

  let videos: BrandiVideo[] = [];
  let pageTitle = "VIDEOGRAPHY";
  let pageDescription = "";

  if (isCategory) {
    const cat = activeCategory as PortfolioCategory;
    videos = getVideosByPortfolio(cat);
    pageTitle = categoryMeta[cat].title;
    pageDescription = categoryMeta[cat].description;
  } else {
    /* Main videography page - show every video in the catalog,
       deduplicated since some titles span multiple portfolios. */
    videos = uniqueByVimeoId(BRANDI_VIDEOS);
  }

  return (
    <>
      <main className="pt-20 bg-dark min-h-screen">
        {/* Header */}
        <section className="py-12 sm:py-16 border-b border-white/10">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">
            <FadeIn>
              <button
                onClick={() => onNavigate(isCategory ? "videography" : "home")}
                className="group flex items-center gap-3 mb-8"
              >
                <div className="w-10 h-10 rounded-full border border-white/40 flex items-center justify-center group-hover:bg-white group-hover:text-dark transition-colors text-white">
                  <ArrowLeft className="w-4 h-4" />
                </div>
                <span className="text-sm font-medium tracking-wider text-white/70">
                  {isCategory ? "BACK TO VIDEOGRAPHY" : "BACK TO HOME"}
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
              {/* 'N Videos' counter line removed 2026-05-12 per user
                  request - applies to the all-videography page and
                  every category sub-page. */}

              {/* EXPLORE pills - shown only on the all-videography view,
                  let visitors jump directly to a sub-category page per
                  Brandi's page-21/22 review note. Hidden on the category
                  pages themselves (where they'd be redundant). */}
              {!isCategory && (
                <div className="mt-6 sm:mt-8 flex flex-wrap items-center gap-3 sm:gap-4">
                  <span className="text-xs font-semibold tracking-[0.3em] text-white/45 uppercase">
                    Explore
                  </span>
                  {[
                    { label: "RETAIL", slug: "retail" },
                    { label: "THE ARTS", slug: "the-arts" },
                    { label: "INDUSTRIAL", slug: "industrial" },
                    { label: "DOCUMENTARY", slug: "documentary" },
                    { label: "NARRATIVE", slug: "narrative" },
                  ].map((cat) => (
                    <button
                      key={cat.slug}
                      onClick={() => onNavigate("videography", cat.slug)}
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

        {/* Videos Grid - wide thumbnails */}
        <section className="py-16 sm:py-24">
          <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-10">
            {videos.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-lg text-white/50">No videos found.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-[1400px] mx-auto">
                {videos.map((video, index) => (
                  <FadeIn key={video.id} delay={Math.min(index * 0.06, 0.4)}>
                    <div>
                      <div className="relative overflow-hidden aspect-video bg-white/5">
                        <iframe
                          src={buildVimeoEmbedUrl(video.vimeoId, video.vimeoHash, {
                            quality: "1080p",
                          })}
                          className="w-full h-full"
                          frameBorder="0"
                          allow="autoplay; fullscreen; picture-in-picture"
                          allowFullScreen
                          title={video.title}
                        />
                      </div>
                      {/* Title caption removed per Brandi 6/4 Discord:
                          'remove the titles under all images/videos'. The
                          title still feeds the iframe's accessible name. */}
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
