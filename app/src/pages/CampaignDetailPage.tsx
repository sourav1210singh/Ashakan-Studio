import type { ReactElement } from "react";
import { ArrowRight, Play } from "lucide-react";
import { useState, useEffect } from "react";
import { FadeIn } from "@/components/animations/FadeIn";
import { Footer } from "@/components/layout/Footer";
import type { View } from "@/App";
import { getProjectById, type GalleryItem } from "@/data/projects";

interface CampaignDetailPageProps {
  campaignSlug: string;
  onNavigate: (view: View, slug?: string) => void;
}

/* ── Vimeo embed ─────────────────────────────────── */
function VimeoEmbed({ vimeoId, alt }: { vimeoId: string; alt: string }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [thumbUrl, setThumbUrl] = useState(`https://vumbnail.com/${vimeoId}_large.jpg`);

  // Fetch HD thumbnail from Vimeo oEmbed API (1920px)
  useEffect(() => {
    fetch(`https://vimeo.com/api/oembed.json?url=https://vimeo.com/${vimeoId}&width=1920`)
      .then((r) => r.json())
      .then((data) => {
        if (data.thumbnail_url) {
          // Replace size suffix to get max resolution
          const hdUrl = data.thumbnail_url.replace(/-d_\d+x\d+/, "-d_1920x1080").replace(/_\d+x\d+/, "_1920x1080");
          setThumbUrl(hdUrl);
        }
      })
      .catch(() => { /* keep fallback */ });
  }, [vimeoId]);

  if (!isPlaying) {
    return (
      <button
        onClick={() => setIsPlaying(true)}
        className="relative w-full aspect-video overflow-hidden group cursor-pointer"
      >
        <img
          src={thumbUrl}
          alt={alt}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <Play className="w-6 h-6 text-dark fill-dark ml-1" />
          </div>
        </div>
      </button>
    );
  }

  return (
    <div className="relative w-full aspect-video">
      <iframe
        src={`https://player.vimeo.com/video/${vimeoId}?autoplay=1&quality=1080p&title=0&byline=0&portrait=0`}
        className="absolute inset-0 w-full h-full"
        frameBorder="0"
        allow="autoplay; fullscreen; picture-in-picture"
        allowFullScreen
        title={alt}
      />
    </div>
  );
}

/* ── Image block ─────────────────────────────────── */
function ImageBlock({ src, alt, aspect = "landscape" }: { src: string; alt: string; aspect?: string }) {
  const aspectClass =
    aspect === "portrait" ? "aspect-[3/4]" :
    aspect === "square" ? "aspect-square" :
    "aspect-video";

  return (
    <div className={`relative overflow-hidden ${aspectClass} group`}>
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
      />
    </div>
  );
}

/* ── Adjacent campaigns for next/prev nav ────────── */
const campaignOrder = ["deutsch", "weissman", "eye-gallery", "monarch-school"];
const campaignProjectMap: Record<string, string> = {
  deutsch: "deutsch-fine-jewelry",
  weissman: "weissman-elite",
  "eye-gallery": "eye-gallery",
  "monarch-school": "monarch-school",
};

function getAdjacentCampaigns(slug: string) {
  const idx = campaignOrder.indexOf(slug);
  const prev = idx > 0 ? campaignOrder[idx - 1] : campaignOrder[campaignOrder.length - 1];
  const next = idx < campaignOrder.length - 1 ? campaignOrder[idx + 1] : campaignOrder[0];
  return {
    prev: { slug: prev, project: getProjectById(campaignProjectMap[prev]) },
    next: { slug: next, project: getProjectById(campaignProjectMap[next]) },
  };
}

/* ── Layout helpers ──────────────────────────────── */

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
    const current = items[i];
    const nextItem = i + 1 < items.length ? items[i + 1] : null;
    const next2 = i + 2 < items.length ? items[i + 2] : null;

    // Smart layout based on what's coming up
    const tripleVideos =
      current.type === "video" &&
      nextItem?.type === "video" &&
      next2?.type === "video" &&
      remaining >= 3;
    const bothVideos = current.type === "video" && nextItem?.type === "video" && remaining >= 2;
    const isLoneVideo = current.type === "video" && (!nextItem || nextItem.type !== "video");

    // Pattern: alternate between different layouts
    const pattern = rowIndex % 5;

    if (tripleVideos) {
      // 3 videos in a row — compact, dynamic, perfect for video-heavy galleries
      rows.push(
        <div key={`row-${i}`} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <FadeIn delay={0.1}>
            <VimeoEmbed vimeoId={current.vimeoId!} alt={current.alt} />
          </FadeIn>
          <FadeIn delay={0.2}>
            <VimeoEmbed vimeoId={nextItem!.vimeoId!} alt={nextItem!.alt} />
          </FadeIn>
          <FadeIn delay={0.3}>
            <VimeoEmbed vimeoId={next2!.vimeoId!} alt={next2!.alt} />
          </FadeIn>
        </div>
      );
      i += 3;
    } else if (bothVideos) {
      // Two videos side by side — always looks good
      rows.push(
        <div key={`row-${i}`} className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <FadeIn delay={0.1}>
            <VimeoEmbed vimeoId={current.vimeoId!} alt={current.alt} />
          </FadeIn>
          <FadeIn delay={0.2}>
            <VimeoEmbed vimeoId={nextItem!.vimeoId!} alt={nextItem!.alt} />
          </FadeIn>
        </div>
      );
      i += 2;
    } else if (isLoneVideo && nextItem && remaining >= 2) {
      // Lone video next to an image → asymmetric 2-col grid so
      // the video gets a wide thumbnail and the image fills the rest.
      // Eliminates the "whitespace beside centered video" problem.
      rows.push(
        <div key={`row-${i}`} className="grid grid-cols-1 md:grid-cols-5 gap-4 sm:gap-6">
          <FadeIn delay={0.1} className="md:col-span-3">
            <VimeoEmbed vimeoId={current.vimeoId!} alt={current.alt} />
          </FadeIn>
          <FadeIn delay={0.2} className="md:col-span-2">
            <ImageBlock src={nextItem.src} alt={nextItem.alt} aspect={nextItem.aspectRatio} />
          </FadeIn>
        </div>
      );
      i += 2;
    } else if (isLoneVideo) {
      // Single video at the end (no next image) → fill full width
      // rather than centering with empty space around it.
      rows.push(
        <FadeIn key={`row-${i}`} delay={0.1}>
          <div className="w-full">
            <VimeoEmbed vimeoId={current.vimeoId!} alt={current.alt} />
          </div>
        </FadeIn>
      );
      i += 1;
    } else if (pattern === 0 && remaining >= 1) {
      // Full-width single item
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
      // 2-column layout
      const a = items[i];
      const b = items[i + 1];
      rows.push(
        <div key={`row-${i}`} className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <FadeIn delay={0.1}>
            {a.type === "video" && a.vimeoId ? (
              <VimeoEmbed vimeoId={a.vimeoId} alt={a.alt} />
            ) : (
              <ImageBlock src={a.src} alt={a.alt} aspect={a.aspectRatio} />
            )}
          </FadeIn>
          <FadeIn delay={0.2}>
            {b.type === "video" && b.vimeoId ? (
              <VimeoEmbed vimeoId={b.vimeoId} alt={b.alt} />
            ) : (
              <ImageBlock src={b.src} alt={b.alt} aspect={b.aspectRatio} />
            )}
          </FadeIn>
        </div>
      );
      i += 2;
    } else if (pattern === 2 && remaining >= 3) {
      // 3-column layout
      const a = items[i];
      const b = items[i + 1];
      const c = items[i + 2];
      rows.push(
        <div key={`row-${i}`} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <FadeIn delay={0.1}>
            {a.type === "video" && a.vimeoId ? (
              <VimeoEmbed vimeoId={a.vimeoId} alt={a.alt} />
            ) : (
              <ImageBlock src={a.src} alt={a.alt} aspect={a.aspectRatio} />
            )}
          </FadeIn>
          <FadeIn delay={0.2}>
            {b.type === "video" && b.vimeoId ? (
              <VimeoEmbed vimeoId={b.vimeoId} alt={b.alt} />
            ) : (
              <ImageBlock src={b.src} alt={b.alt} aspect={b.aspectRatio} />
            )}
          </FadeIn>
          <FadeIn delay={0.3}>
            {c.type === "video" && c.vimeoId ? (
              <VimeoEmbed vimeoId={c.vimeoId} alt={c.alt} />
            ) : (
              <ImageBlock src={c.src} alt={c.alt} aspect={c.aspectRatio} />
            )}
          </FadeIn>
        </div>
      );
      i += 3;
    } else if (pattern === 3 && remaining >= 2) {
      // Asymmetric: large left + small right (or portrait + landscape)
      const a = items[i];
      const b = items[i + 1];
      rows.push(
        <div key={`row-${i}`} className="grid grid-cols-1 md:grid-cols-5 gap-4 sm:gap-6">
          <FadeIn delay={0.1} className="md:col-span-3">
            {a.type === "video" && a.vimeoId ? (
              <VimeoEmbed vimeoId={a.vimeoId} alt={a.alt} />
            ) : (
              <ImageBlock src={a.src} alt={a.alt} aspect={a.aspectRatio} />
            )}
          </FadeIn>
          <FadeIn delay={0.2} className="md:col-span-2">
            {b.type === "video" && b.vimeoId ? (
              <VimeoEmbed vimeoId={b.vimeoId} alt={b.alt} />
            ) : (
              <ImageBlock src={b.src} alt={b.alt} aspect={b.aspectRatio} />
            )}
          </FadeIn>
        </div>
      );
      i += 2;
    } else {
      // Fallback: single item
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
    }
  }

  return <div className="space-y-4 sm:space-y-6">{rows}</div>;
}

/* ── Main Page Component ─────────────────────────── */
export function CampaignDetailPage({ campaignSlug, onNavigate }: CampaignDetailPageProps) {
  const projectId = campaignProjectMap[campaignSlug];
  const project = projectId ? getProjectById(projectId) : undefined;

  if (!project) {
    return (
      <main className="pt-20 bg-dark min-h-screen flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="font-display text-4xl mb-4">Campaign Not Found</h1>
          <button
            onClick={() => onNavigate("campaigns")}
            className="text-white/60 hover:text-white transition-colors"
          >
            Back to Campaigns
          </button>
        </div>
      </main>
    );
  }

  const { prev, next } = getAdjacentCampaigns(campaignSlug);

  // Split gallery into sections for creative layout
  const allMedia = project.gallery;
  const featuredItem = allMedia.find((g) => g.type === "video") || allMedia[0];
  const remainingMedia = allMedia.filter((g) => g !== featuredItem);

  // Split remaining into two halves for alternating dark/light sections
  const midPoint = Math.ceil(remainingMedia.length / 2);
  const firstHalf = remainingMedia.slice(0, midPoint);
  const secondHalf = remainingMedia.slice(midPoint);

  return (
    <>
      <main>
        {/* ━━━ SECTION 1: Full-width Hero (DARK) ━━━ */}
        <section className="relative h-[70vh] sm:h-[80vh] lg:h-[90vh] overflow-hidden">
          <img
            src={project.heroImage}
            alt={project.client}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />
          <div className="absolute inset-0 flex flex-col justify-end">
            <div className="max-w-[1400px] mx-auto w-full px-4 sm:px-6 lg:px-10 pb-16 sm:pb-24">
              <FadeIn>
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

        {/* ━━━ SECTION 2: Backstory (DARK) ━━━ */}
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

        {/* ━━━ SECTION 3: Featured Video/Image (DARK) ━━━ */}
        {featuredItem && (
          <section className="bg-dark py-4 sm:py-8">
            <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-10">
              <FadeIn>
                {featuredItem.type === "video" && featuredItem.vimeoId ? (
                  <VimeoEmbed vimeoId={featuredItem.vimeoId} alt={featuredItem.alt} />
                ) : (
                  <ImageBlock src={featuredItem.src} alt={featuredItem.alt} aspect="landscape" />
                )}
                <p className="text-white/40 text-sm mt-4 tracking-wider">{featuredItem.alt}</p>
              </FadeIn>
            </div>
          </section>
        )}

        {/* ━━━ SECTION 4: Project Details — Case Study Info (DARK) ━━━ */}
        <section className="py-20 sm:py-32 bg-dark border-t border-white/10">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
              <FadeIn>
                <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-white tracking-tight mb-8">
                  Project Details
                </h2>
                <p className="text-lg text-white/60 leading-relaxed">
                  This campaign was a collaborative effort between our full creative team and {project.client}.
                  From concept development through final delivery, every element was carefully crafted to
                  align with the brand&rsquo;s vision and objectives. The result is a cohesive body of work
                  that showcases both creative excellence and strategic thinking.
                </p>
              </FadeIn>
              <FadeIn delay={0.15}>
                <div className="space-y-8 lg:pt-8">
                  <div>
                    <span className="text-xs font-medium tracking-widest text-white/40 uppercase">Services</span>
                    <p className="font-display text-lg text-white mt-2">{project.categories.join(" / ")}</p>
                  </div>
                  <div className="h-px bg-white/10" />
                  <div>
                    <span className="text-xs font-medium tracking-widest text-white/40 uppercase">Deliverables</span>
                    <p className="font-display text-lg text-white mt-2">
                      {allMedia.filter((g) => g.type === "image").length} Photos, {allMedia.filter((g) => g.type === "video").length} Videos
                    </p>
                  </div>
                  <div className="h-px bg-white/10" />
                  <div>
                    <span className="text-xs font-medium tracking-widest text-white/40 uppercase">Approach</span>
                    <p className="text-base text-white/60 mt-2 leading-relaxed">
                      Full-service production including creative direction, photography, videography,
                      styling, and post-production. Shot on location and in studio.
                    </p>
                  </div>
                </div>
              </FadeIn>
            </div>
          </div>
        </section>

        {/* ━━━ SECTION 5: First Media Grid (DARK) ━━━ */}
        {firstHalf.length > 0 && (
          <section className="py-16 sm:py-24 bg-dark">
            <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-10 text-white">
              <CreativeGrid items={firstHalf} sectionTitle="The Campaign" />
            </div>
          </section>
        )}

        {/* ━━━ SECTION 5: Quote / Highlight ━━━ */}
        <section className="relative py-32 sm:py-44 lg:py-52 overflow-hidden">
          {/* Background image with dark overlay */}
          <img
            src={project.heroImage}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/75" />

          {/* Subtle gradient divider lines */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

          <div className="max-w-[900px] mx-auto px-4 sm:px-6 lg:px-10 text-center">
            <FadeIn>
              {/* Elegant oversized quote mark */}
              <span
                className="block font-serif leading-none select-none"
                style={{ fontSize: "clamp(120px, 15vw, 200px)", color: "rgba(255,255,255,0.06)" }}
              >
                &ldquo;
              </span>

              {/* Quote text — elegant serif italic */}
              <p
                className="font-serif italic text-white/90 leading-relaxed -mt-16 sm:-mt-24 lg:-mt-28"
                style={{ fontSize: "clamp(1.5rem, 3vw, 3rem)", letterSpacing: "-0.01em" }}
              >
                Every frame tells a story. Every detail matters. We craft visuals that resonate and inspire.
              </p>

              {/* Attribution — minimal with lines */}
              <div className="mt-12 sm:mt-16 flex items-center justify-center gap-4">
                <span className="w-8 h-px bg-white/30" />
                <p className="text-white/30 text-xs sm:text-sm tracking-[0.3em] uppercase font-light">
                  Ashkan Studios
                </p>
                <span className="w-8 h-px bg-white/30" />
              </div>
            </FadeIn>
          </div>
        </section>

        {/* ━━━ SECTION 6: Second Media Grid (DARK) ━━━ */}
        {secondHalf.length > 0 && (
          <section className="py-16 sm:py-24 bg-dark">
            <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-10 text-white">
              <CreativeGrid items={secondHalf} sectionTitle="Behind the Scenes" />
            </div>
          </section>
        )}

        {/* ━━━ SECTION 7: CTA (DARK) ━━━ */}
        <section className="py-20 sm:py-32 bg-dark">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 text-center">
            <FadeIn>
              <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl text-white tracking-tight mb-6">
                LET'S CREATE TOGETHER
              </h2>
              <p className="text-lg text-white/50 mb-10 max-w-xl mx-auto">
                Have a project in mind? We'd love to bring your vision to life.
              </p>
              <button
                onClick={() => onNavigate("contact")}
                className="inline-flex items-center gap-3 px-8 py-4 bg-white text-dark font-medium tracking-wider text-sm group hover:bg-white/90 transition-colors"
              >
                GET IN TOUCH
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </FadeIn>
          </div>
        </section>

        {/* ━━━ SECTION 8: Next / Prev Navigation (DARK) ━━━ */}
        <section className="border-t border-white/10 bg-dark">
          <div className="grid grid-cols-2">
            {prev.project && (
              <button
                onClick={() => onNavigate("campaigns", prev.slug)}
                className="group relative h-64 sm:h-80 overflow-hidden border-r border-white/10"
              >
                <img
                  src={prev.project.heroImage}
                  alt={prev.project.client}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/50 group-hover:bg-black/40 transition-colors" />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                  <span className="text-xs tracking-widest text-white/50 mb-2">PREVIOUS</span>
                  <span className="font-display text-xl sm:text-2xl lg:text-3xl tracking-tight">
                    {prev.project.client}
                  </span>
                </div>
              </button>
            )}
            {next.project && (
              <button
                onClick={() => onNavigate("campaigns", next.slug)}
                className="group relative h-64 sm:h-80 overflow-hidden"
              >
                <img
                  src={next.project.heroImage}
                  alt={next.project.client}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/50 group-hover:bg-black/40 transition-colors" />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                  <span className="text-xs tracking-widest text-white/50 mb-2">NEXT</span>
                  <span className="font-display text-xl sm:text-2xl lg:text-3xl tracking-tight">
                    {next.project.client}
                  </span>
                </div>
              </button>
            )}
          </div>
        </section>
      </main>
      <Footer onLogoClick={() => onNavigate("home")} />
    </>
  );
}
