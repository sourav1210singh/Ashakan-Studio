/**
 * Brandi's official video catalog - delivered 2026-05-05 via Google Doc:
 * "Ashkan Studios | Video Links IN PROGRESS"
 *
 * URL format from Brandi: https://vimeo.com/{vimeoId}/{vimeoHash}?share=copy&fl=sv&fe=ci
 * Embed format used here: https://player.vimeo.com/video/{vimeoId}?h={vimeoHash}&...
 *
 * Many of these are private/unlisted Vimeo videos - the `vimeoHash` is REQUIRED
 * for the iframe to play (otherwise it shows "Private video" error).
 *
 * Some videos appear in BOTH a campaign AND one or more portfolio categories.
 * Helper functions at the bottom of the file return the right slice.
 */

export interface BrandiVideo {
  /** Stable identifier (slug) used as React key */
  id: string;
  /** Display title from Brandi's doc */
  title: string;
  /** Vimeo numeric ID */
  vimeoId: string;
  /** Vimeo privacy hash - required for private/unlisted videos */
  vimeoHash?: string;
  /** Which campaign this video belongs to (if any) */
  campaign?: CampaignSlug;
  /** Which portfolio categories include this video */
  portfolios: PortfolioCategory[];
}

export type CampaignSlug =
  | "deutsch-fine-jewelry"
  | "weissman-elite"
  | "monarch-school"
  | "eye-gallery";

export type PortfolioCategory =
  | "retail"
  | "the-arts"
  | "industrial"
  | "documentary"
  | "narrative";

/* ════════════════════════════════════════════════════════════════════
   THE CATALOG - 78 entries (some videos appear in both a campaign and a
   portfolio category; deduplication happens in the helper functions).
   ════════════════════════════════════════════════════════════════════ */

export const BRANDI_VIDEOS: BrandiVideo[] = [
  {
    id: "cacao-cardamom-valentines-red-heart-box-ingredient",
    title: "Cacao & Cardamom: Valentines / Red Heart Box + Ingredients",
    vimeoId: "1189131033",
    vimeoHash: "ecd41cfbdd",
    portfolios: ["retail"],
  },
  {
    id: "weissman-fall-2023-front-cover-light-wall",
    title: "Weissman Fall 2023 Front Cover Light Wall",
    vimeoId: "824223043",
    campaign: "weissman-elite",
    portfolios: [],
  },
  {
    id: "the-eye-gallery-25-26-brand-reel",
    title: "The Eye Gallery 25–26 Brand Reel",
    vimeoId: "1190188606",
    vimeoHash: "cd8f606a81",
    campaign: "eye-gallery",
    portfolios: ["retail"],
  },
  {
    id: "radiomedix-changing-the-landscape-of-nuclear-medic",
    title: "RadioMedix Changing the Landscape of Nuclear Medicine",
    vimeoId: "1100401603",
    portfolios: ["industrial"],
  },
  {
    id: "weissman-fall-2024-season-cross-genre",
    title: "Weissman Fall 2024 Season Cross Genre",
    vimeoId: "950064546",
    campaign: "weissman-elite",
    portfolios: ["retail"],
  },
  {
    id: "monarch-transforming-lives-25-26",
    title: "Monarch Transforming Lives 25-26",
    vimeoId: "1151967437",
    vimeoHash: "000a715e4a",
    campaign: "monarch-school",
    portfolios: ["documentary"],
  },
  {
    id: "vitacca-season-promo-23-24",
    title: "Vitacca Season Promo 23-24",
    vimeoId: "875774223",
    portfolios: ["the-arts"],
  },
  {
    id: "ceclia-duarte-second-solo-album",
    title: "Ceclia Duarte Second Solo Album",
    vimeoId: "1002076560",
    portfolios: ["the-arts", "documentary"],
  },
  {
    id: "kinetik-once-upon-a-time-in-the-delaware-basin",
    title: "Kinetik Once Upon a Time in the Delaware Basin",
    vimeoId: "865765822",
    vimeoHash: "cfebc05bc1",
    portfolios: ["industrial", "narrative"],
  },
  {
    id: "the-eye-gallery-mix-reel-001",
    title: "The Eye Gallery Mix Reel 001",
    vimeoId: "1002121348",
    campaign: "eye-gallery",
    portfolios: [],
  },
  {
    id: "safari-vet-the-safari-difference-league-city",
    title: "Safari Vet The Safari Difference League City",
    vimeoId: "954997422",
    portfolios: ["narrative"],
  },
  {
    id: "buddy-walk-2025",
    title: "Buddy Walk 2025",
    vimeoId: "1189131655",
    vimeoHash: "4d90a59f80",
    portfolios: ["documentary"],
  },
  {
    id: "weissman-spring-2024-quirky-stripes",
    title: "Weissman Spring 2024 Quirky/Stripes",
    vimeoId: "894189739",
    campaign: "weissman-elite",
    portfolios: ["retail"],
  },
  {
    id: "cacao-cardamom-delicious-impressions",
    title: "Cacao & Cardamom: Delicious Impressions",
    vimeoId: "1125611606",
    portfolios: ["retail"],
  },
  {
    id: "1968-mustang-gt-auto-shop",
    title: "1968 Mustang GT / Auto Shop",
    vimeoId: "1189136660",
    vimeoHash: "00ea4a2e1c",
    portfolios: ["industrial", "documentary"],
  },
  {
    id: "facet-seven-nutrition-for-longevity-chapter-2-2-nu",
    title: "Facet Seven / Nutrition for Longevity / Chapter 2.2 - Nutrient Timing",
    vimeoId: "1189137962",
    vimeoHash: "e1a7b0681c",
    portfolios: ["narrative"],
  },
  {
    id: "behind-the-scenes-at-deutsch-campaign-shoot",
    title: "Behind the Scenes at Deutsch Campaign Shoot",
    vimeoId: "1147057440",
    campaign: "deutsch-fine-jewelry",
    portfolios: [],
  },
  {
    id: "weissman-fall-2025-season-cross-genre",
    title: "Weissman Fall 2025 Season Cross Genre",
    vimeoId: "1094764251",
    vimeoHash: "17dfb40e13",
    campaign: "weissman-elite",
    portfolios: ["retail"],
  },
  {
    id: "weissman-spring-2026-season-cross-genre",
    title: "Weissman Spring 2026 Season Cross Genre",
    vimeoId: "1145783498",
    vimeoHash: "6e07bd9e26",
    campaign: "weissman-elite",
    portfolios: [],
  },
  {
    id: "weissman-spring-2025-season-cross-genre",
    title: "Weissman Spring 2025 Season Cross Genre",
    vimeoId: "1030112459",
    vimeoHash: "3a116c25a3",
    campaign: "weissman-elite",
    portfolios: [],
  },
  {
    id: "weissman-fall-2024-bright-suiting",
    title: "Weissman Fall 2024 Bright Suiting",
    vimeoId: "950064503",
    vimeoHash: "7b6c207cac",
    campaign: "weissman-elite",
    portfolios: [],
  },
  {
    id: "weissman-winter-2024-gothic-glam",
    title: "Weissman Winter 2024 Gothic Glam",
    vimeoId: "1003351680",
    campaign: "weissman-elite",
    portfolios: [],
  },
  {
    id: "weissman-winter-2024-season-cross-genre",
    title: "Weissman Winter 2024 Season Cross Genre",
    vimeoId: "1145746235",
    campaign: "weissman-elite",
    portfolios: [],
  },
  {
    id: "weissman-fall-2023-back-cover-light-floor",
    title: "Weissman Fall 2023 Back Cover Light Floor",
    vimeoId: "824219543",
    campaign: "weissman-elite",
    portfolios: [],
  },
  {
    id: "weissman-winter-2024-create-your-own-spotlight",
    title: "Weissman Winter 2024 Create Your Own Spotlight",
    vimeoId: "999687742",
    vimeoHash: "88aae298bd",
    campaign: "weissman-elite",
    portfolios: [],
  },
  {
    id: "weissman-winter-2024-neon-hip-hop",
    title: "Weissman Winter 2024 Neon Hip Hop",
    vimeoId: "999687723",
    vimeoHash: "db85e5ad2b",
    campaign: "weissman-elite",
    portfolios: [],
  },
  {
    id: "weissman-spring-2024-season-cross-genre",
    title: "Weissman Spring 2024 Season Cross Genre",
    vimeoId: "886600264",
    campaign: "weissman-elite",
    portfolios: [],
  },
  {
    id: "weissman-fall-2024-red-hip-hop",
    title: "Weissman Fall 2024 Red Hip Hop",
    vimeoId: "950064549",
    vimeoHash: "bdaa506f69",
    campaign: "weissman-elite",
    portfolios: [],
  },
  {
    id: "weissman-spring-2024-neons",
    title: "Weissman Spring 2024 Neons",
    vimeoId: "894189648",
    vimeoHash: "dcc8da9197",
    campaign: "weissman-elite",
    portfolios: [],
  },
  {
    id: "weissman-fall-2024-mixify",
    title: "Weissman Fall 2024 Mixify",
    vimeoId: "950064513",
    vimeoHash: "530165a338",
    campaign: "weissman-elite",
    portfolios: [],
  },
  {
    id: "weissman-fall-2023-season-cross-genre",
    title: "Weissman Fall 2023 Season Cross Genre",
    vimeoId: "824868764",
    campaign: "weissman-elite",
    portfolios: ["retail"],
  },
  {
    id: "weissman-fall-2023-acro",
    title: "Weissman Fall 2023 Acro",
    vimeoId: "824219420",
    vimeoHash: "9cfb4b79e8",
    campaign: "weissman-elite",
    portfolios: [],
  },
  {
    id: "weissman-winter-2023-season-cross-genre",
    title: "Weissman Winter 2023 Season Cross Genre",
    vimeoId: "867250099",
    campaign: "weissman-elite",
    portfolios: [],
  },
  {
    id: "weissman-winter-2022-season-cross-genre",
    title: "Weissman Winter 2022 Season Cross Genre",
    vimeoId: "740849869",
    campaign: "weissman-elite",
    portfolios: [],
  },
  {
    id: "monarch-gala-event-24-25",
    title: "Monarch Gala Event 24-25",
    vimeoId: "1189136524",
    vimeoHash: "6456e78744",
    campaign: "monarch-school",
    portfolios: ["documentary"],
  },
  {
    id: "monarch-transforming-lives-24-25",
    title: "Monarch Transforming Lives 24-25",
    vimeoId: "1043541721",
    campaign: "monarch-school",
    portfolios: [],
  },
  {
    id: "monarch-s-upgraded-kitchen-md-anderson-donation",
    title: "Monarch’s Upgraded Kitchen - MD Anderson Donation",
    vimeoId: "673378712",
    vimeoHash: "f3572605d9",
    campaign: "monarch-school",
    portfolios: [],
  },
  {
    id: "monarch-transforming-lives-23-24",
    title: "Monarch Transforming Lives 23-24",
    vimeoId: "896674527",
    campaign: "monarch-school",
    portfolios: [],
  },
  {
    id: "monarch-transforming-lives-virtual-luncheon-21",
    title: "Monarch Transforming Lives Virtual Luncheon 21",
    vimeoId: "518687682",
    campaign: "monarch-school",
    portfolios: [],
  },
  {
    id: "the-eye-gallery-scale-sass-001-reel",
    title: "The Eye Gallery Scale SASS 001 Reel",
    vimeoId: "1189131771",
    vimeoHash: "49584fc6ca",
    campaign: "eye-gallery",
    portfolios: [],
  },
  {
    id: "the-eye-gallery-jacques-marie-mage-trunk-show-stor",
    title: "The Eye Gallery Jacques Marie Mage Trunk Show Store Ad H",
    vimeoId: "1189140629",
    vimeoHash: "294990893e",
    campaign: "eye-gallery",
    portfolios: [],
  },
  {
    id: "the-eye-gallery-in-store-ad-001-h",
    title: "The Eye Gallery In-Store Ad 001 H",
    vimeoId: "1189138937",
    vimeoHash: "9d970d79b7",
    campaign: "eye-gallery",
    portfolios: ["retail"],
  },
  {
    id: "the-eye-gallery-scale-oversized-eyewear-sass-002-r",
    title: "The Eye Gallery Scale Oversized Eyewear SASS 002 Reel",
    vimeoId: "1189131500",
    vimeoHash: "f87548f64b",
    campaign: "eye-gallery",
    portfolios: ["retail"],
  },
  {
    id: "the-eye-gallery-dog-month-campaign",
    title: "The Eye Gallery Dog Month Campaign",
    vimeoId: "1189130986",
    vimeoHash: "c229954ac0",
    campaign: "eye-gallery",
    portfolios: [],
  },
  {
    id: "the-eye-gallery-in-store-service-care-reel",
    title: "The Eye Gallery In-store service & care Reel",
    vimeoId: "1189131472",
    vimeoHash: "42147d4bc3",
    campaign: "eye-gallery",
    portfolios: [],
  },
  {
    id: "the-eye-gallery-summer-sunglass-sale-ad-h",
    title: "The Eye Gallery Summer Sunglass Sale Ad H",
    vimeoId: "1189130989",
    vimeoHash: "3148f2df70",
    campaign: "eye-gallery",
    portfolios: ["retail"],
  },
  {
    id: "the-eye-gallery-summer-2025-campaign-ad-h",
    title: "The Eye Gallery - Summer 2025 Campaign Ad H",
    vimeoId: "1145748255",
    campaign: "eye-gallery",
    portfolios: [],
  },
  {
    id: "the-eye-gallery-scale-sass-003-reel",
    title: "The Eye Gallery Scale SASS 003 Reel",
    vimeoId: "1189130987",
    vimeoHash: "6d5b53a3d1",
    campaign: "eye-gallery",
    portfolios: [],
  },
  {
    id: "athletico-sports-gear-mix-001",
    title: "Athletico Sports Gear Mix 001",
    vimeoId: "999290876",
    vimeoHash: "7ba5e6f1b8",
    portfolios: ["retail"],
  },
  {
    id: "cacao-cardamom-valentines-beating-heart-kitchen",
    title: "Cacao & Cardamom: Valentines / Beating Heart + Kitchen",
    vimeoId: "1189131036",
    vimeoHash: "d0322acd54",
    portfolios: ["retail"],
  },
  {
    id: "audaja-skincare-mix-reel-001",
    title: "Audaja Skincare Mix Reel 001",
    vimeoId: "947075031",
    portfolios: ["retail"],
  },
  {
    id: "tecas-brunch-banner",
    title: "Tecas Brunch Banner",
    vimeoId: "782973181",
    portfolios: ["retail"],
  },
  {
    id: "cacao-cardamom-jaw-dropping-chocolates",
    title: "Cacao & Cardamom: Jaw Dropping Chocolates",
    vimeoId: "1125611474",
    portfolios: ["retail"],
  },
  {
    id: "vitacca-season-promo-24-25",
    title: "Vitacca Season Promo 24-25",
    vimeoId: "1022971286",
    portfolios: ["the-arts"],
  },
  {
    id: "behind-the-scenes-with-lauren-anderson",
    title: "Behind the Scenes with Lauren Anderson",
    vimeoId: "1043474069",
    portfolios: ["the-arts"],
  },
  {
    id: "cecilia-duarte-live-performance-w-misael-barraza",
    title: "Cecilia Duarte Live Performance w/ Misael Barraza",
    vimeoId: "1002076393",
    portfolios: ["the-arts"],
  },
  {
    id: "pipe-distributors-inc-banner",
    title: "Pipe Distributors Inc Banner",
    vimeoId: "778678445",
    portfolios: ["industrial"],
  },
  {
    id: "radiomedix-from-innovation-to-intervention",
    title: "RadioMedix - From Innovation to Intervention",
    vimeoId: "437963536",
    portfolios: ["industrial"],
  },
  {
    id: "euphree-city-robin-22-technical-specs",
    title: "Euphree City Robin 22 Technical Specs",
    vimeoId: "660525644",
    vimeoHash: "58097138c5",
    portfolios: ["industrial"],
  },
  {
    id: "radiomedix-2025-where-it-all-began",
    title: "RadioMedix 2025 | Where it all began",
    vimeoId: "1100405072",
    portfolios: ["industrial"],
  },
  {
    id: "facet-seven-coach-jd",
    title: "Facet Seven Coach JD",
    vimeoId: "1125664311",
    vimeoHash: "25063210f9",
    portfolios: ["documentary"],
  },
  {
    id: "gwen-berry-tv-globo-brazil",
    title: "Gwen Berry | TV Globo (Brazil)",
    vimeoId: "1003383102",
    portfolios: ["documentary"],
  },
  {
    id: "the-eye-gallery-in-ny-ewd",
    title: "The Eye Gallery in NY EWD",
    vimeoId: "1190189406",
    vimeoHash: "155120be84",
    portfolios: ["documentary"],
  },
  {
    id: "safari-vet-the-safari-difference-pearland",
    title: "Safari Vet The Safari Difference Pearland",
    vimeoId: "954988957",
    vimeoHash: "071ae54364",
    portfolios: ["narrative"],
  },
];

/** Ordered Vimeo IDs shown on the main /work/videography page
 *  ("TOP CHOICES FOR VIDEOGRAPHY FULL PAGE" from Brandi's doc). */
export const TOP_CHOICE_ORDER: string[] = [
  "1189131033", // Cacao & Cardamom Valentines / Red Heart Box
  "824223043",  // Weissman Fall 2023 Front Cover Light Wall
  "1190188606", // The Eye Gallery 25-26 Brand Reel
  "1100401603", // RadioMedix Changing the Landscape
  "1189131655", // Buddy Walk 2025 (Brandi 6/16: moved up to #5)
  "950064546",  // Weissman Fall 2024 Season Cross Genre
  "1151967437", // Monarch Transforming Lives 25-26
  "1022971286", // Vitacca Season Promo 24-25 (Brandi 6/16: replaced 23-24 875774223)
  "1002076560", // Cecilia Duarte Second Solo Album
  "865765822",  // Kinetik Once Upon a Time
  "1002121348", // The Eye Gallery Mix Reel 001
  "954997422",  // Safari Vet League City
  "894189739",  // Weissman Spring 2024 Quirky/Stripes
  "1125611606", // Cacao & Cardamom Delicious Impressions
  "1189136660", // 1968 Mustang GT / Auto Shop
  "1189137962", // Facet Seven Nutrition Chapter 2.2
];

/* ════════════════════════════════════════════════════════════════════
   HELPER FUNCTIONS - slice the catalog by campaign or portfolio
   ════════════════════════════════════════════════════════════════════ */

/** All videos belonging to a given campaign, in catalog order */
export function getVideosByCampaign(slug: CampaignSlug): BrandiVideo[] {
  return BRANDI_VIDEOS.filter((v) => v.campaign === slug);
}

/* Per-category display order (Brandi 6/16 review notes - vimeoId order
   taken verbatim from the "WORK PORTFOLIOS" section of her doc). Kept
   here as explicit lists so each category page can be ordered
   independently of the global catalog order. industrial + narrative
   were "all ok" in her notes but are listed for completeness. */
const PORTFOLIO_ORDER: Record<PortfolioCategory, string[]> = {
  retail: [
    "1189131033", "1190188606", "1094764251", "1189138937", "999290876",
    "950064546", "1189131500", "824868764", "1125611606", "1189130989",
    "894189739", "1189131036", "947075031", "782973181", "1125611474",
  ],
  "the-arts": [
    "1002076560", "1022971286", "1043474069", "1002076393", "875774223",
  ],
  industrial: [
    "1100401603", "865765822", "1189136660", "778678445", "437963536",
    "660525644", "1100405072",
  ],
  documentary: [
    "1189131655", "1002076560", "1151967437", "1125664311", "1189136660",
    "1189136524", "1003383102", "1190189406",
  ],
  narrative: [
    "865765822", "954997422", "1189137962", "954988957",
  ],
};

/** All videos tagged in a given portfolio category, sorted into Brandi's
 *  doc order (PORTFOLIO_ORDER). Any tagged video not listed in the order
 *  map falls to the end, preserving catalog order, so nothing disappears. */
export function getVideosByPortfolio(category: PortfolioCategory): BrandiVideo[] {
  const order = PORTFOLIO_ORDER[category] ?? [];
  const rank = (v: BrandiVideo) => {
    const i = order.indexOf(v.vimeoId);
    return i === -1 ? Number.MAX_SAFE_INTEGER : i;
  };
  return BRANDI_VIDEOS
    .filter((v) => v.portfolios.includes(category))
    .sort((a, b) => rank(a) - rank(b));
}

/** Build a Vimeo embed URL with optional hash + query params */
export function buildVimeoEmbedUrl(
  vimeoId: string,
  vimeoHash: string | undefined,
  options: {
    autoplay?: boolean;
    muted?: boolean;
    loop?: boolean;
    background?: boolean;
    quality?: string;
  } = {}
): string {
  const params = new URLSearchParams();
  if (vimeoHash) params.set("h", vimeoHash);
  if (options.autoplay) params.set("autoplay", "1");
  if (options.muted) params.set("muted", "1");
  if (options.loop) params.set("loop", "1");
  if (options.background) params.set("background", "1");
  if (options.quality) params.set("quality", options.quality);
  params.set("title", "0");
  params.set("byline", "0");
  params.set("portrait", "0");
  return `https://player.vimeo.com/video/${vimeoId}?${params.toString()}`;
}

/** Vumbnail.com fallback thumbnail URL */
export function getVumbnailUrl(vimeoId: string): string {
  return `https://vumbnail.com/${vimeoId}_large.jpg`;
}
