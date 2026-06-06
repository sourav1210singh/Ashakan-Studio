import { ArrowRight, Play } from "lucide-react";
import { useState, useEffect } from "react";
import { FadeIn } from "@/components/animations/FadeIn";
import { Footer } from "@/components/layout/Footer";
import { Lightbox } from "@/components/ui/Lightbox";
import type { View } from "@/App";
import { getProjectById, type GalleryItem } from "@/data/projects";

interface CampaignDetailPageProps {
  campaignSlug: string;
  onNavigate: (view: View, slug?: string) => void;
}

/* ── Vimeo embed ─────────────────────────────────── */
function VimeoEmbed({
  vimeoId,
  vimeoHash,
  alt,
}: {
  vimeoId: string;
  vimeoHash?: string;
  alt: string;
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [thumbUrl, setThumbUrl] = useState(`https://vumbnail.com/${vimeoId}_large.jpg`);

  // Fetch HD thumbnail from Vimeo oEmbed API (1920px). For private/unlisted
  // videos the hash must be appended to the source URL or oEmbed 403s - we
  // include it so Brandi's private clips return a real thumbnail.
  useEffect(() => {
    const sourceUrl = vimeoHash
      ? `https://vimeo.com/${vimeoId}/${vimeoHash}`
      : `https://vimeo.com/${vimeoId}`;
    fetch(`https://vimeo.com/api/oembed.json?url=${encodeURIComponent(sourceUrl)}&width=1920`)
      .then((r) => r.json())
      .then((data) => {
        if (data.thumbnail_url) {
          const hdUrl = data.thumbnail_url.replace(/-d_\d+x\d+/, "-d_1920x1080").replace(/_\d+x\d+/, "_1920x1080");
          setThumbUrl(hdUrl);
        }
      })
      .catch(() => { /* keep fallback */ });
  }, [vimeoId, vimeoHash]);

  // Build embed URL. Hash is required for Brandi's private videos -
  // without ?h=<hash> the iframe shows "Private video" error.
  const hashParam = vimeoHash ? `&h=${vimeoHash}` : "";

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
        src={`https://player.vimeo.com/video/${vimeoId}?autoplay=1&quality=1080p&title=0&byline=0&portrait=0${hashParam}`}
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
/* Clickable image - opens the page-level Lightbox at this image's index
   in the images-only gallery list. Brandi's 5/7/26 review notes:
   'Every photo in any gallery should be clickable to a lightbox'.

   The `aspect` prop is ignored for masonry contexts (the default).
   Brandi's 5/7/26 note 'I see a lot of images getting cut off, not
   showing the whole image, this cannot happen on any photography
   images in portfolio/campaign sections' - so when no fixed aspect is
   forced, the <img> renders at its natural aspect ratio and the CSS
   columns masonry packs items by their true heights. No cropping.

   When the caller passes `forceAspect` (used by the Featured spot
   above the masonry, where a fixed landscape band is desired), the
   image fills a fixed-aspect container with object-cover. */
function ImageBlock({
  src,
  alt,
  aspect = "landscape",
  forceAspect = false,
  onClick,
}: {
  src: string;
  alt: string;
  aspect?: string;
  /** When true, the image is clipped to a fixed aspect ratio container
   *  (used for the Featured spot only). Defaults to false so gallery
   *  images render at natural aspect - no cropping. */
  forceAspect?: boolean;
  onClick?: () => void;
}) {
  const Tag = onClick ? "button" : "div";

  if (forceAspect) {
    const aspectClass =
      aspect === "portrait" ? "aspect-[3/4]" :
      aspect === "square" ? "aspect-square" :
      "aspect-video";
    return (
      <Tag
        type={onClick ? "button" : undefined}
        onClick={onClick}
        className={`relative overflow-hidden ${aspectClass} group block w-full text-left ${onClick ? "cursor-zoom-in" : ""}`}
      >
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        {onClick && (
          <span className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors duration-300 pointer-events-none" />
        )}
      </Tag>
    );
  }

  /* Natural-aspect mode (default for gallery masonry).
     The image dictates its own height; no fixed-aspect crop. */
  return (
    <Tag
      type={onClick ? "button" : undefined}
      onClick={onClick}
      className={`relative overflow-hidden group block w-full text-left ${onClick ? "cursor-zoom-in" : ""}`}
    >
      <img
        src={src}
        alt={alt}
        loading="lazy"
        className="w-full h-auto block transition-transform duration-700 group-hover:scale-105"
      />
      {onClick && (
        <span className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors duration-300 pointer-events-none" />
      )}
    </Tag>
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

/** Renders a true CSS-columns masonry - items flow naturally based on
 *  their aspect ratios so adjacent items pack tightly with no whitespace.
 *  Same approach as PhotographyPage.tsx (which Brandi already approved). */
function CreativeGrid({
  items,
  sectionTitle,
  onImageClick,
}: {
  items: GalleryItem[];
  sectionTitle?: string;
  /** Given an image src, return its index in the page-level lightbox list
      (so the lightbox opens on the correct picture). */
  onImageClick?: (src: string) => void;
}) {
  return (
    <div>
      {sectionTitle && (
        <FadeIn>
          <h3 className="font-display text-3xl sm:text-4xl lg:text-5xl tracking-tight mb-12">
            {sectionTitle}
          </h3>
        </FadeIn>
      )}
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 sm:gap-6">
        {items.map((item, idx) => (
          <FadeIn
            key={`${item.src || item.vimeoId}-${idx}`}
            delay={Math.min(idx * 0.05, 0.6)}
            className="break-inside-avoid mb-4 sm:mb-6"
          >
            {item.type === "video" && item.vimeoId ? (
              <VimeoEmbed vimeoId={item.vimeoId} vimeoHash={item.vimeoHash} alt={item.alt} />
            ) : (
              <ImageBlock
                src={item.src}
                alt={item.alt}
                aspect={item.aspectRatio}
                onClick={onImageClick ? () => onImageClick(item.src) : undefined}
              />
            )}
          </FadeIn>
        ))}
      </div>
    </div>
  );
}

/* VideoRowMasonry + pickRowPattern were removed on 2026-05-07. They
   used CSS Grid with fixed columns which forced equal row heights and
   left empty black space below shorter cells when images and videos
   with different aspect ratios were mixed in the same row. The
   "Behind the Scenes" section now uses CreativeGrid (CSS columns
   masonry) instead, matching PhotographyPage. */

/* ── Main Page Component ─────────────────────────── */
export function CampaignDetailPage({ campaignSlug, onNavigate }: CampaignDetailPageProps) {
  /* Lightbox state - opens when any image in the page is clicked. */
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

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

  /* ── Gallery + featured-item splitting ──────────────────────────
     The new layout (Brandi's 5/7/26 review notes) gives each campaign
     three optional knobs:
       • featuredImage   - explicit horizontal photo for the 'Featured'
                            spot right after the Story section. Overrides
                            the legacy 'first video' fallback.
       • btsVideosOnly   - when true, the Behind-the-Scenes section
                            only shows videos; all images live in the
                            main 'The Campaign' gallery.
     If neither knob is set, the page falls back to the original 50/50
     split used by the other (older) campaigns. */
  const allMedia = project.gallery;

  let featuredItem: GalleryItem | undefined;
  if (project.featuredImage) {
    featuredItem = allMedia.find((g) => g.src === project.featuredImage) ?? {
      src: project.featuredImage,
      alt: `${project.client} featured photo`,
      type: "image",
      aspectRatio: "landscape",
    };
  } else {
    featuredItem = allMedia.find((g) => g.type === "video") ?? allMedia[0];
  }
  const remainingMedia = allMedia.filter((g) => g !== featuredItem);

  let mainGalleryItems: GalleryItem[];
  let btsItems: GalleryItem[];
  if (project.hideBts) {
    /* Brandi (Weissman): 'Hide this section for now... All of these
       photos and videos need to be included in the upper campaign
       gallery'. Single mixed gallery, no BTS section rendered. */
    mainGalleryItems = remainingMedia;
    btsItems = [];
  } else if (project.btsVideosOnly) {
    mainGalleryItems = remainingMedia.filter((g) => g.type === "image");
    btsItems = remainingMedia.filter((g) => g.type === "video");
  } else {
    const midPoint = Math.ceil(remainingMedia.length / 2);
    mainGalleryItems = remainingMedia.slice(0, midPoint);
    btsItems = remainingMedia.slice(midPoint);
  }

  /* Images-only flat list used by the lightbox. The hero photo at the
     top of the page is also clickable, so we include it first.
     Featured image is included too. Set used to skip duplicates so the
     lightbox doesn't show the same picture twice. */
  const lightboxSet = new Set<string>();
  const lightboxImages: { src: string; alt: string }[] = [];
  const addLightboxImg = (src: string, alt: string) => {
    if (src && !lightboxSet.has(src)) {
      lightboxSet.add(src);
      lightboxImages.push({ src, alt });
    }
  };
  addLightboxImg(project.heroImage, project.client);
  if (project.featuredImage) {
    addLightboxImg(project.featuredImage, `${project.client} featured photo`);
  }
  for (const g of allMedia) {
    if (g.type === "image" && g.src) addLightboxImg(g.src, g.alt);
  }

  /** Open the lightbox at the position of `src` (or 0 if not found). */
  const openLightboxAt = (src: string) => {
    const i = lightboxImages.findIndex((img) => img.src === src);
    setLightboxIndex(i === -1 ? 0 : i);
  };

  return (
    <>
      <main>
        {/* ━━━ SECTION 1: Full-width Hero (DARK) ━━━
            object-cover so the cover photo FILLS the section with no
            empty letterbox bars (Brandi 6/4 Discord: 'cover photo of
            Weissman does not fill the space ... also Eye Gallery and
            Monarch'). The hero images now match the home-page tiles. */}
        <section className="relative bg-dark h-[70vh] sm:h-[80vh] lg:h-[90vh] overflow-hidden">
          <button
            type="button"
            onClick={() => openLightboxAt(project.heroImage)}
            className="absolute inset-0 w-full h-full cursor-zoom-in group"
            aria-label={`Enlarge ${project.client} hero image`}
          >
            <img
              src={project.heroImage}
              alt={project.client}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-[1.02]"
            />
          </button>
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10 pointer-events-none" />
          <div className="absolute inset-0 flex flex-col justify-end pointer-events-none">
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

        {/* ━━━ SECTION 2: Story & Intent (DARK) ━━━
            Brandi: section title renamed from 'The Story' to 'Story & Intent'.
            Body uses project.storyAndIntent if Brandi supplied new copy,
            otherwise falls back to the original project.description. */}
        <section className="py-20 sm:py-32 bg-dark">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">
            <div className="flex justify-end">
              <FadeIn className="lg:max-w-2xl">
                <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-white tracking-tight mb-8">
                  {project.storyAndIntent ? "Story & Intent" : "The Story"}
                </h2>
                <p className="text-lg sm:text-xl text-white/60 leading-relaxed">
                  {project.storyAndIntent ?? project.description}
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
                  <VimeoEmbed vimeoId={featuredItem.vimeoId} vimeoHash={featuredItem.vimeoHash} alt={featuredItem.alt} />
                ) : (
                  <ImageBlock
                    src={featuredItem.src}
                    alt={featuredItem.alt}
                    aspect="landscape"
                    forceAspect
                    onClick={() => openLightboxAt(featuredItem.src)}
                  />
                )}
                {/* Caption removed per Brandi 6/4 Discord: no image/alt
                    names shown under media. alt stays on the element. */}
              </FadeIn>
            </div>
          </section>
        )}

        {/* ━━━ SECTION 4: Creative & Production Approach (DARK) ━━━
            Brandi renames this section's heading from 'Project Details'
            to 'Creative & Production Approach' when she provides the
            new multi-paragraph body copy. The right column renames
            'Approach' to 'IMPACT' and accepts custom Services /
            Deliverables / Impact strings or paragraphs. */}
        <section className="py-20 sm:py-32 bg-dark border-t border-white/10">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
              <FadeIn>
                <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-white tracking-tight mb-8">
                  {/* Heading is now always 'Creative & Production
                      Approach' per user request 2026-05-12 - applies
                      to every campaign page, regardless of whether
                      Brandi has supplied the multi-paragraph body
                      copy. Fallback body still renders below when
                      no copy is provided. */}
                  Creative & Production Approach
                </h2>
                {project.creativeAndProductionApproach ? (
                  <div className="space-y-5 text-lg text-white/65 leading-relaxed">
                    {project.creativeAndProductionApproach.map((para, i) => (
                      <p key={i}>{para}</p>
                    ))}
                  </div>
                ) : (
                  <p className="text-lg text-white/60 leading-relaxed">
                    This campaign was a collaborative effort between our full creative team and {project.client}.
                    From concept development through final delivery, every element was carefully crafted to
                    align with the brand&rsquo;s vision and objectives. The result is a cohesive body of work
                    that showcases both creative excellence and strategic thinking.
                  </p>
                )}
              </FadeIn>
              <FadeIn delay={0.15}>
                <div className="space-y-8 lg:pt-8">
                  <div>
                    <span className="text-xs font-medium tracking-widest text-white/40 uppercase">Services</span>
                    <p className="font-display text-lg text-white mt-2">
                      {project.servicesLabel ?? project.categories.join(" / ")}
                    </p>
                  </div>
                  <div className="h-px bg-white/10" />
                  <div>
                    <span className="text-xs font-medium tracking-widest text-white/40 uppercase">Deliverables</span>
                    <p className="font-display text-lg text-white mt-2">
                      {project.deliverablesLabel ??
                        `${allMedia.filter((g) => g.type === "image").length} Photos, ${allMedia.filter((g) => g.type === "video").length} Videos`}
                    </p>
                  </div>
                  <div className="h-px bg-white/10" />
                  <div>
                    <span className="text-xs font-medium tracking-widest text-white/40 uppercase">
                      {project.impact ? "Impact" : "Approach"}
                    </span>
                    {project.impact ? (
                      <div className="space-y-3 mt-2 text-base text-white/65 leading-relaxed">
                        {project.impact.map((para, i) => (
                          <p key={i}>{para}</p>
                        ))}
                      </div>
                    ) : (
                      <p className="text-base text-white/60 mt-2 leading-relaxed">
                        Full-service production including creative direction, photography, videography,
                        styling, and post-production. Shot on location and in studio.
                      </p>
                    )}
                  </div>
                </div>
              </FadeIn>
            </div>
          </div>
        </section>

        {/* ━━━ SECTION 5: Main Campaign Gallery (DARK) ━━━
            For campaigns with btsVideosOnly = true (e.g., Deutsch) this
            contains every image. For the older campaigns this is just
            the first half of the gallery, with the second half rendered
            below as 'Behind the Scenes'. */}
        {mainGalleryItems.length > 0 && (
          <section className="py-16 sm:py-24 bg-dark">
            <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-10 text-white">
              {/* Plural "The Campaigns" for clients with multiple completed
                  campaigns (Brandi 6/5: Weissman, Eye Gallery, Monarch);
                  singular "The Campaign" for single-campaign clients (Deutsch). */}
              <CreativeGrid
                items={mainGalleryItems}
                sectionTitle={
                  ["weissman", "eye-gallery", "monarch-school"].includes(campaignSlug)
                    ? "The Campaigns"
                    : "The Campaign"
                }
                onImageClick={openLightboxAt}
              />
            </div>
          </section>
        )}

        {/* ━━━ SECTION 5b: Magazine Spread (DARK) - Deutsch only ━━━
            Brandi's 5/7/26 note for Deutsch: 'find a place to show off
            the 8pg spread (PDF) that they can scroll through'. Rendered
            as an inline iframe so the user can flip through pages
            without leaving the campaign page; a download link is shown
            below for mobile browsers that prompt instead of embed. */}
        {project.magazineSpread && (
          <section className="py-16 sm:py-24 bg-dark border-t border-white/10">
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 text-white">
              <FadeIn>
                <p className="text-xs font-semibold tracking-[0.3em] text-white/50 uppercase mb-3">
                  Editorial Feature · {project.magazineSpread.pages}-Page Spread
                </p>
                <h3 className="font-display text-3xl sm:text-4xl lg:text-5xl tracking-tight mb-6">
                  {project.magazineSpread.title}
                </h3>
                <p className="text-base sm:text-lg text-white/65 leading-relaxed max-w-3xl mb-10">
                  {project.magazineSpread.note}
                </p>
                <div
                  className="relative w-full overflow-hidden bg-black/40 ring-1 ring-inset ring-white/10"
                  style={{ height: "min(85vh, 1100px)" }}
                >
                  <iframe
                    src={`${project.magazineSpread.src}#toolbar=0&navpanes=0&view=FitH`}
                    className="absolute inset-0 w-full h-full"
                    title={project.magazineSpread.title}
                    loading="lazy"
                  />
                </div>
                <p className="text-xs sm:text-sm text-white/45 mt-4 text-center">
                  <a
                    href={project.magazineSpread.src}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white/80 underline underline-offset-4 transition-colors"
                  >
                    Open the full spread in a new window →
                  </a>
                </p>
              </FadeIn>
            </div>
          </section>
        )}

        {/* ━━━ SECTION 5: Quote / Highlight ━━━
            Brandi's 5/7/26 note for Monarch ('Change to different
            photo'): the quote section background should not repeat
            the hero. We use project.featuredImage when set (different
            from hero by design), falling back to heroImage for older
            campaigns that don't have a featured image. */}
        <section className="relative py-32 sm:py-44 lg:py-52 overflow-hidden">
          {/* Background image with dark overlay */}
          <img
            src={project.featuredImage ?? project.heroImage}
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

              {/* Quote text - elegant serif italic.
                  Brandi's 5/7/26 note for Weissman: 'Needs different quote
                  here, feel free to grab a similar feeling quote from new
                  copy provided for this campaign'. Falls back to the
                  generic studio quote when project.quote is absent. */}
              <p
                className="font-serif italic text-white/90 leading-relaxed -mt-16 sm:-mt-24 lg:-mt-28"
                style={{ fontSize: "clamp(1.5rem, 3vw, 3rem)", letterSpacing: "-0.01em" }}
              >
                {project.quote?.text ??
                  "Every frame tells a story. Every detail matters. We craft visuals that resonate and inspire."}
              </p>

              {/* Attribution - minimal with lines */}
              <div className="mt-12 sm:mt-16 flex items-center justify-center gap-4">
                <span className="w-8 h-px bg-white/30" />
                <p className="text-white/30 text-xs sm:text-sm tracking-[0.3em] uppercase font-light">
                  {project.quote?.attribution ?? "Ashkan Studios"}
                </p>
                <span className="w-8 h-px bg-white/30" />
              </div>
            </FadeIn>
          </div>
        </section>

        {/* ━━━ SECTION 6: Behind the Scenes (DARK) ━━━
            For campaigns with btsVideosOnly = true (Deutsch) this only
            renders the BTS video(s). For older campaigns it renders the
            second half of the gallery (mixed photos + videos), packed
            with CSS-columns masonry. */}
        {btsItems.length > 0 && (
          <section className="py-16 sm:py-24 bg-dark">
            <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-10 text-white">
              <CreativeGrid items={btsItems} sectionTitle="Behind the Scenes" onImageClick={openLightboxAt} />
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

      {/* Full-screen lightbox - opens when the hero or any gallery photo
          is clicked. Includes ALL images from the campaign (hero +
          gallery images) in their on-page order so the user can browse
          through the entire campaign in a large view. Videos are not
          included - they already play in place. */}
      <Lightbox
        images={lightboxImages}
        isOpen={lightboxIndex !== null}
        initialIndex={lightboxIndex ?? 0}
        onClose={() => setLightboxIndex(null)}
      />
    </>
  );
}
