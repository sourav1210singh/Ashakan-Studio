import type { ReactElement } from "react";
import { useState, useEffect } from "react";
import { ArrowLeft, ArrowRight, Play } from "lucide-react";
import { getProjectById, getAllProjects, type GalleryItem } from "@/data/projects";
import { portfolioItems } from "@/data/portfolio";
import { FadeIn } from "@/components/animations/FadeIn";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import type { View } from "@/App";

interface PortfolioPageProps {
  slug: string;
  onBack: () => void;
  onNavigate: (slug: string) => void;
}

/* ── Reusable media components ──────────────── */

function VimeoEmbed({ vimeoId, alt }: { vimeoId: string; alt: string }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [hdThumb, setHdThumb] = useState<string | null>(null);
  const fallbackUrl = `https://vumbnail.com/${vimeoId}_large.jpg`;

  // Fetch HD thumbnail from Vimeo oEmbed API
  useEffect(() => {
    fetch(`https://vimeo.com/api/oembed.json?url=https://vimeo.com/${vimeoId}&width=1920`)
      .then((r) => r.json())
      .then((data) => {
        if (data.thumbnail_url) {
          const hd = data.thumbnail_url.replace(/-d_\d+x\d+/, "-d_1920x1080").replace(/_\d+x\d+/, "_1920x1080");
          setHdThumb(hd);
        }
      })
      .catch(() => {});
  }, [vimeoId]);

  const thumbUrl = hdThumb || fallbackUrl;

  if (!isPlaying) {
    return (
      <button
        onClick={() => setIsPlaying(true)}
        className="relative w-full aspect-video overflow-hidden  group cursor-pointer"
      >
        <img src={thumbUrl} alt={alt} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
        <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white/90 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Play className="w-6 h-6 sm:w-8 sm:h-8 text-dark ml-1" fill="currentColor" />
          </div>
        </div>
      </button>
    );
  }

  return (
    <div className="relative w-full aspect-video overflow-hidden ">
      <iframe
        src={`https://player.vimeo.com/video/${vimeoId}?autoplay=1&dnt=1&quality=1080p&title=0&byline=0&portrait=0`}
        className="w-full h-full"
        frameBorder="0"
        allow="autoplay; fullscreen; picture-in-picture"
        allowFullScreen
        title={alt}
      />
    </div>
  );
}

function ImageBlock({ src, alt, aspect }: { src: string; alt: string; aspect?: string }) {
  const cls = aspect === "portrait" ? "aspect-[3/4]" : aspect === "square" ? "aspect-square" : "aspect-[4/3]";
  return (
    <div className={`relative overflow-hidden  ${cls} group`}>
      <img src={src} alt={alt} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
    </div>
  );
}

/** Renders a creative masonry layout from gallery items */
function CreativeGrid({ items, sectionTitle }: { items: GalleryItem[]; sectionTitle?: string }) {
  const rows: ReactElement[] = [];
  let i = 0;

  if (sectionTitle) {
    rows.push(
      <FadeIn key={`title-${sectionTitle}`}>
        <h3 className="font-display text-3xl sm:text-4xl lg:text-5xl tracking-tight mb-12">
          {sectionTitle}
        </h3>
      </FadeIn>
    );
  }

  while (i < items.length) {
    const remaining = items.length - i;
    const rowIndex = rows.length;
    const pattern = rowIndex % 5;

    if (pattern === 0 && remaining >= 1) {
      const item = items[i];
      rows.push(
        <FadeIn key={`row-${i}`} delay={0.1}>
          <div className="w-full">
            {item.type === "video" && item.vimeoId ? (
              <VimeoEmbed vimeoId={item.vimeoId} alt={item.alt} />
            ) : (
              <ImageBlock src={item.src} alt={item.alt} aspect={item.aspectRatio} />
            )}
          </div>
        </FadeIn>
      );
      i += 1;
    } else if (pattern === 1 && remaining >= 2) {
      const a = items[i];
      const b = items[i + 1];
      rows.push(
        <div key={`row-${i}`} className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <FadeIn delay={0.1}>
            {a.type === "video" && a.vimeoId ? <VimeoEmbed vimeoId={a.vimeoId} alt={a.alt} /> : <ImageBlock src={a.src} alt={a.alt} aspect={a.aspectRatio} />}
          </FadeIn>
          <FadeIn delay={0.2}>
            {b.type === "video" && b.vimeoId ? <VimeoEmbed vimeoId={b.vimeoId} alt={b.alt} /> : <ImageBlock src={b.src} alt={b.alt} aspect={b.aspectRatio} />}
          </FadeIn>
        </div>
      );
      i += 2;
    } else if (pattern === 2 && remaining >= 3) {
      const a = items[i], b = items[i + 1], c = items[i + 2];
      rows.push(
        <div key={`row-${i}`} className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          <FadeIn delay={0.1}>{a.type === "video" && a.vimeoId ? <VimeoEmbed vimeoId={a.vimeoId} alt={a.alt} /> : <ImageBlock src={a.src} alt={a.alt} aspect="square" />}</FadeIn>
          <FadeIn delay={0.2}>{b.type === "video" && b.vimeoId ? <VimeoEmbed vimeoId={b.vimeoId} alt={b.alt} /> : <ImageBlock src={b.src} alt={b.alt} aspect="square" />}</FadeIn>
          <FadeIn delay={0.3}>{c.type === "video" && c.vimeoId ? <VimeoEmbed vimeoId={c.vimeoId} alt={c.alt} /> : <ImageBlock src={c.src} alt={c.alt} aspect="square" />}</FadeIn>
        </div>
      );
      i += 3;
    } else if (pattern === 3 && remaining >= 2) {
      const a = items[i], b = items[i + 1];
      rows.push(
        <div key={`row-${i}`} className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-6">
          <FadeIn delay={0.1} className="md:col-span-7">
            {a.type === "video" && a.vimeoId ? <VimeoEmbed vimeoId={a.vimeoId} alt={a.alt} /> : <ImageBlock src={a.src} alt={a.alt} aspect={a.aspectRatio} />}
          </FadeIn>
          <FadeIn delay={0.2} className="md:col-span-5">
            {b.type === "video" && b.vimeoId ? <VimeoEmbed vimeoId={b.vimeoId} alt={b.alt} /> : <ImageBlock src={b.src} alt={b.alt} aspect={b.aspectRatio} />}
          </FadeIn>
        </div>
      );
      i += 2;
    } else {
      const item = items[i];
      rows.push(
        <FadeIn key={`row-${i}`} delay={0.1}>
          <div className="w-full">
            {item.type === "video" && item.vimeoId ? <VimeoEmbed vimeoId={item.vimeoId} alt={item.alt} /> : <ImageBlock src={item.src} alt={item.alt} aspect={item.aspectRatio} />}
          </div>
        </FadeIn>
      );
      i += 1;
    }
  }

  return <div className="space-y-4 sm:space-y-6">{rows}</div>;
}

/* ── Main Component ─────────────────────────── */

export function PortfolioPage({ slug, onBack, onNavigate }: PortfolioPageProps) {
  const project = getProjectById(slug);
  const allProjects = getAllProjects();
  const currentIndex = allProjects.findIndex((p) => p.id === slug);
  const prevProject = currentIndex > 0 ? allProjects[currentIndex - 1] : null;
  const nextProject = currentIndex < allProjects.length - 1 ? allProjects[currentIndex + 1] : null;

  const handleNavigateToView = (view: View, navSlug?: string) => {
    if (view === "portfolio" && navSlug) {
      onNavigate(navSlug);
    } else if (view === "home") {
      onBack();
    } else {
      onBack();
    }
  };

  if (!project) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-display text-4xl text-white mb-4">Project Not Found</h1>
          <button onClick={onBack} className="text-white underline hover:no-underline">Return Home</button>
        </div>
      </div>
    );
  }

  // Get portfolio metadata (mediaType, industry)
  const portfolioMeta = portfolioItems.find((p) => p.id === slug);
  const mediaType = portfolioMeta?.mediaType || "both";
  const industry = portfolioMeta?.category || "";
  const mediaLabel = mediaType === "photo" ? "PHOTOGRAPHY" : mediaType === "video" ? "VIDEOGRAPHY" : "PHOTOGRAPHY / VIDEOGRAPHY";

  // Filter gallery based on portfolio mediaType
  const allMedia = mediaType === "photo"
    ? project.gallery.filter((g) => g.type === "image")
    : mediaType === "video"
      ? project.gallery.filter((g) => g.type === "video")
      : project.gallery;

  const midpoint = Math.ceil(allMedia.length / 2);
  const firstHalf = allMedia.slice(0, midpoint);
  const secondHalf = allMedia.slice(midpoint);

  // Featured item based on media type
  const featuredItem = mediaType === "video"
    ? allMedia.find((g) => g.type === "video" && g.vimeoId) || allMedia[0]
    : mediaType === "photo"
      ? allMedia[0]
      : allMedia.find((g) => g.type === "video" && g.vimeoId) || allMedia[0];

  return (
    <div className="min-h-screen bg-dark">
      <Header onLogoClick={onBack} onNavigate={handleNavigateToView} currentView="portfolio" />

      <main>
        {/* ━━━ SECTION 1: Full-width Hero ━━━ */}
        <section className="relative h-[70vh] sm:h-[80vh] lg:h-[90vh] overflow-hidden">
          <img src={project.heroImage} alt={project.client} className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />
          <div className="absolute inset-0 flex flex-col justify-end">
            <div className="max-w-[1400px] mx-auto w-full px-4 sm:px-6 lg:px-10 pb-16 sm:pb-24">
              <FadeIn>
                <div className="flex items-center gap-4 mb-6">
                  <span className="text-xs font-medium tracking-[0.2em] text-white/70 uppercase">{mediaLabel}</span>
                  <span className="w-8 h-px bg-white/30" />
                  <span className="text-xs font-medium tracking-[0.2em] text-white/70 uppercase">{industry}</span>
                </div>
                <h1 className="font-display text-5xl sm:text-7xl lg:text-8xl xl:text-9xl text-white tracking-tight leading-[0.9] mb-4">
                  {project.client}
                </h1>
                <p className="text-lg sm:text-xl text-white/50 font-light max-w-md">
                  {project.title}
                </p>
              </FadeIn>
            </div>
          </div>
        </section>

        {/* ━━━ SECTION 2: The Story (text right-aligned) ━━━ */}
        <section className="py-20 sm:py-32 bg-dark">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">
            <div className="flex justify-end">
              <FadeIn className="lg:max-w-2xl">
                <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-white tracking-tight mb-8">
                  The Story
                </h2>
                <p className="text-lg sm:text-xl text-white/60 leading-relaxed">
                  {project.description}
                </p>
              </FadeIn>
            </div>
          </div>
        </section>

        {/* ━━━ SECTION 3: Featured Video/Image ━━━ */}
        {featuredItem && (
          <section className="bg-dark py-4 sm:py-8">
            <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-10">
              <FadeIn>
                {featuredItem.type === "video" && featuredItem.vimeoId ? (
                  <VimeoEmbed vimeoId={featuredItem.vimeoId} alt={featuredItem.alt} />
                ) : (
                  <div className="relative w-full aspect-video overflow-hidden ">
                    <img src={featuredItem.src} alt={featuredItem.alt} className="w-full h-full object-cover" />
                  </div>
                )}
              </FadeIn>
            </div>
          </section>
        )}

        {/* ━━━ SECTION 4: Creative Media Grid ━━━ */}
        {firstHalf.length > 0 && (
          <section className="py-16 sm:py-24 bg-dark">
            <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-10 text-white">
              <CreativeGrid items={firstHalf} sectionTitle="The Work" />
            </div>
          </section>
        )}

        {/* ━━━ SECTION 5: Quote ━━━ */}
        <section className="relative py-32 sm:py-44 lg:py-52 overflow-hidden">
          <img src={project.heroImage} alt="" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/75" />
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          <div className="relative max-w-[900px] mx-auto px-4 sm:px-6 lg:px-10 text-center">
            <FadeIn>
              <span className="block font-serif leading-none select-none" style={{ fontSize: "clamp(120px, 15vw, 200px)", color: "rgba(255,255,255,0.06)" }}>
                &ldquo;
              </span>
              <p className="font-serif italic text-white/90 leading-relaxed -mt-16 sm:-mt-24 lg:-mt-28" style={{ fontSize: "clamp(1.5rem, 3vw, 3rem)", letterSpacing: "-0.01em" }}>
                Every frame tells a story. Every detail matters. We craft visuals that resonate and inspire.
              </p>
              <div className="mt-12 sm:mt-16 flex items-center justify-center gap-4">
                <span className="w-8 h-px bg-white/30" />
                <p className="text-white/30 text-xs sm:text-sm tracking-[0.3em] uppercase font-light">Ashkan Studios</p>
                <span className="w-8 h-px bg-white/30" />
              </div>
            </FadeIn>
          </div>
        </section>

        {/* ━━━ SECTION 6: More Media ━━━ */}
        {secondHalf.length > 0 && (
          <section className="py-16 sm:py-24 bg-dark">
            <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-10 text-white">
              <CreativeGrid items={secondHalf} sectionTitle="Behind the Scenes" />
            </div>
          </section>
        )}

        {/* ━━━ SECTION 7: CTA ━━━ */}
        <section className="py-20 sm:py-32 bg-dark">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 text-center">
            <FadeIn>
              <h2 className="font-display text-4xl sm:text-5xl lg:text-7xl text-white tracking-tight mb-6">
                LET&rsquo;S CREATE TOGETHER
              </h2>
              <p className="text-lg text-white/50 mb-10 max-w-xl mx-auto">
                Have a project in mind? We&rsquo;d love to bring your vision to life.
              </p>
              <button
                onClick={() => handleNavigateToView("contact" as View)}
                className="inline-flex items-center gap-3 px-8 py-4 bg-white text-dark font-medium tracking-wider text-sm group hover:bg-white/90 transition-colors"
              >
                START A PROJECT
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </FadeIn>
          </div>
        </section>

        {/* ━━━ SECTION 8: Prev / Next Navigation ━━━ */}
        <section className="border-t border-white/10">
          <div className="grid grid-cols-1 sm:grid-cols-2">
            {/* Previous */}
            {prevProject ? (
              <button
                onClick={() => onNavigate(prevProject.id)}
                className="group relative h-[300px] sm:h-[400px] overflow-hidden text-left"
              >
                <img src={prevProject.heroImage} alt={prevProject.client} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-black/60 group-hover:bg-black/50 transition-colors" />
                <div className="relative z-10 h-full flex flex-col justify-end p-8 sm:p-12">
                  <div className="flex items-center gap-2 mb-3">
                    <ArrowLeft className="w-4 h-4 text-white/60" />
                    <span className="text-xs tracking-widest text-white/60 uppercase">Previous</span>
                  </div>
                  <p className="font-display text-2xl sm:text-3xl text-white">{prevProject.client}</p>
                </div>
              </button>
            ) : (
              <div className="relative h-[300px] sm:h-[400px] bg-dark" />
            )}

            {/* Next */}
            {nextProject ? (
              <button
                onClick={() => onNavigate(nextProject.id)}
                className="group relative h-[300px] sm:h-[400px] overflow-hidden text-right border-l border-white/10"
              >
                <img src={nextProject.heroImage} alt={nextProject.client} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-black/60 group-hover:bg-black/50 transition-colors" />
                <div className="relative z-10 h-full flex flex-col justify-end p-8 sm:p-12">
                  <div className="flex items-center justify-end gap-2 mb-3">
                    <span className="text-xs tracking-widest text-white/60 uppercase">Next</span>
                    <ArrowRight className="w-4 h-4 text-white/60" />
                  </div>
                  <p className="font-display text-2xl sm:text-3xl text-white">{nextProject.client}</p>
                </div>
              </button>
            ) : (
              <div className="relative h-[300px] sm:h-[400px] bg-dark border-l border-white/10" />
            )}
          </div>
        </section>
      </main>

      <Footer onLogoClick={onBack} />
    </div>
  );
}
