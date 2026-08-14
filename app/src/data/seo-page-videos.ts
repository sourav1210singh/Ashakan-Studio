import {
  BRANDI_VIDEOS,
  TOP_CHOICE_ORDER,
  buildVimeoEmbedUrl,
} from "@/data/brandi-videos";

/**
 * The reel shown on the videography SEO landing pages.
 *
 * Brandi's 8/14 note on ten of these pages reads: "include the first 5
 * videos from the main video portfolio page". Rather than copying ids
 * by hand, the list is taken straight off TOP_CHOICE_ORDER - the same
 * order that drives /work/videography/ - so when she reorders the
 * portfolio these pages follow along and can never drift out of sync.
 */
const REEL_LENGTH = 5;

export interface SeoPageVideo {
  title: string;
  /** Player URL, hash included where the video is unlisted. */
  embedUrl: string;
}

export const seoPageVideos: SeoPageVideo[] = TOP_CHOICE_ORDER.slice(
  0,
  REEL_LENGTH
)
  .map((vimeoId) => BRANDI_VIDEOS.find((v) => v.vimeoId === vimeoId))
  .filter((v): v is (typeof BRANDI_VIDEOS)[number] => Boolean(v))
  .map((v) => ({
    title: v.title,
    embedUrl: buildVimeoEmbedUrl(v.vimeoId, v.vimeoHash),
  }));

/**
 * Slugs that carry the reel - the ten pages Brandi listed. The three
 * vsl-* pages are deliberately absent: they already have their own
 * industry-specific video treatment.
 */
export const SEO_VIDEO_SLUGS = new Set([
  "cinematography-services-in-houston",
  "commercial-videographers-houston",
  "video-editing-services-in-houston",
  "video-production-services-houston",
  "videographer-houston",
  "videography-houston",
  "videography-in-the-woodlands",
  "videography-in-texas",
  "videographer-in-houston",
  "commercial-videography-in-houston",
]);
