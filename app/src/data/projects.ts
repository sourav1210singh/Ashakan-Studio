export interface GalleryItem {
  src: string;
  alt: string;
  type: "image" | "video";
  aspectRatio?: "landscape" | "portrait" | "square";
  /** Vimeo video ID for type="video" items */
  vimeoId?: string;
  /** Vimeo privacy hash — required for Brandi's private/unlisted videos */
  vimeoHash?: string;
}

/**
 * Optional reference to a magazine spread PDF (e.g., Deutsch's
 * 8-page PaperCity Houston spread). Rendered as an inline scrollable
 * iframe near the bottom of the campaign detail page.
 */
export interface MagazineSpread {
  /** Public path to the PDF (under app/public/). */
  src: string;
  /** Heading shown above the embed. */
  title: string;
  /** Page count, used in the heading subtitle ('8-page spread'). */
  pages: number;
  /** Disclosure shown under the heading — typically credits client
   *  vs. studio contributions (per Brandi's 5/7/26 notes for Deutsch). */
  note: string;
}

export interface Project {
  id: string;
  client: string;
  title: string;
  categories: string[];
  heroImage: string;
  description: string;
  gallery: GalleryItem[];
  relatedProjects: string[];

  /* ── Brandi's 5/7/26 review-notes additions ──────────────────────
     These are optional so older campaigns without the new copy keep
     rendering against the original CampaignDetailPage layout. */

  /** Override the 'The Story' / 'Story & Intent' paragraph (renamed
   *  per Brandi for the new campaign page layout). */
  storyAndIntent?: string;

  /** Multi-paragraph copy for the new 'Creative & Production Approach'
   *  section (replaces the old 'Project Details' description). */
  creativeAndProductionApproach?: string[];

  /** Multi-paragraph copy for the new 'IMPACT' section
   *  (renamed from 'Approach' in the right column). */
  impact?: string[];

  /** Right-column 'Services' value (e.g., 'PHOTOGRAPHY / DESIGN'). */
  servicesLabel?: string;

  /** Right-column 'Deliverables' value
   *  (e.g., 'PHOTOS, 8 PG MAGAZINE SPREAD, 1 MAGAZINE AD, 3 BILLBOARDS, 6 EMAILS'). */
  deliverablesLabel?: string;

  /** Horizontal photo shown in the 'Featured' spot right after the
   *  Story section. Brandi wants a photo here (not a video) for the
   *  Deutsch campaign. If absent, the page falls back to the first
   *  gallery video like before. */
  featuredImage?: string;

  /** If true, the 'Behind the Scenes' section will only render video
   *  items from the gallery; all images move up into the main
   *  campaign gallery. Used for Deutsch. */
  btsVideosOnly?: boolean;

  /** Optional inline magazine spread (PDF). */
  magazineSpread?: MagazineSpread;
}

export const projects: Project[] = [
  {
    id: "brandon-blackwood",
    client: "BRANDON BLACKWOOD",
    title: "Luxury Handbags, Bold Style",
    categories: ["PRODUCT", "PHOTOGRAPHY"],
    heroImage: "/images/portfolio/brandon-blackwood.jpg",
    description:
      "Brandon Blackwood's luxury handbags have become icons of contemporary fashion. Our product photography showcased the vibrant colors, premium materials, and exquisite craftsmanship that define the brand. Each image was designed to capture the essence of modern luxury while appealing to a diverse, fashion-forward audience.",
    gallery: [
      {
        src: "/images/portfolio/brandon-blackwood.jpg",
        alt: "Handbag collection",
        type: "image",
        aspectRatio: "square",
      },
    ],
    relatedProjects: ["fashion", "deutsch-fine-jewelry"],
  },
  {
    id: "cecilia-duarte",
    client: "CECILIA DUARTE",
    title: "Capturing Artistic Expression",
    categories: ["PORTRAIT", "PHOTOGRAPHY", "VIDEOGRAPHY"],
    heroImage: "/images/portfolio/cecilia-duarte.jpg",
    description:
      "A comprehensive portrait and video session capturing the essence of Cecilia Duarte's artistic journey. Through intimate photography and cinematic videography, we documented her creative process and personal story — from her second solo album promotional to live performances with Misael Barraza.",
    gallery: [
      {
        src: "/images/portfolio/cecilia-duarte.jpg",
        alt: "Portrait session",
        type: "image",
        aspectRatio: "portrait",
      },
      {
        src: "",
        alt: "Cecilia Duarte — Second Solo Album Promotional",
        type: "video",
        vimeoId: "1002076560",
        aspectRatio: "landscape",
      },
      {
        src: "",
        alt: "Cecilia Duarte — Live Performance w/ Misael Barraza",
        type: "video",
        vimeoId: "1002076393",
        aspectRatio: "landscape",
      },
      {
        src: "",
        alt: "Cecilia Duarte — Nana de Sevilla w/ Misael Barraza",
        type: "video",
        vimeoId: "807672933",
        aspectRatio: "landscape",
      },
    ],
    relatedProjects: ["fashion", "lauren-anderson"],
  },
  {
    id: "audaja-skincare",
    client: "AUDAJA SKINCARE",
    title: "Natural Beauty, Radiant Results",
    categories: ["PRODUCT", "PHOTOGRAPHY"],
    heroImage: "/images/portfolio/audaja-skincare.jpg",
    description:
      "Audaja Skincare represents the fusion of natural ingredients and scientific innovation. Our product photography highlighted the elegant packaging and premium formulations, creating visuals that convey luxury and efficacy.",
    gallery: [
      {
        src: "/images/portfolio/audaja-skincare.jpg",
        alt: "Skincare products",
        type: "image",
        aspectRatio: "landscape",
      },
    ],
    relatedProjects: ["deutsch-fine-jewelry", "eye-gallery"],
  },
  {
    id: "lauren-anderson",
    client: "LAUREN ANDERSON",
    title: "Personal Brand Photography",
    categories: ["PORTRAIT", "PHOTOGRAPHY"],
    heroImage: "/images/portfolio/lauren-anderson.jpg",
    description:
      "A personal branding photography session for Lauren Anderson, capturing her professional image and personality. The images showcase her confidence and style, perfect for her professional portfolio and social media presence.",
    gallery: [
      {
        src: "/images/portfolio/lauren-anderson.jpg",
        alt: "Lauren Anderson portrait",
        type: "image",
        aspectRatio: "portrait",
      },
    ],
    relatedProjects: ["cecilia-duarte", "fashion"],
  },
  {
    id: "vitacca-ballet",
    client: "VITACCA BALLET",
    title: "Movement in Perfect Harmony",
    categories: ["ARTS", "DANCE", "PHOTOGRAPHY", "VIDEOGRAPHY"],
    heroImage: "/images/portfolio/vitacca-ballet.jpg",
    description:
      "Vitacca Ballet brings world-class dance to Houston. Our photography and videography captures the grace, power, and emotion of their performances — from season promos to intimate dancer profiles. We documented the dedication and passion that drives these exceptional dancers across multiple seasons.",
    gallery: [
      {
        src: "/images/portfolio/vitacca-ballet.jpg",
        alt: "Ballet performance",
        type: "image",
        aspectRatio: "landscape",
      },
      {
        src: "",
        alt: "Vitacca Season Promo 24-25",
        type: "video",
        vimeoId: "1022971286",
        aspectRatio: "landscape",
      },
      {
        src: "",
        alt: "Vitacca Ballet 23-24 — Sown / Woven / One",
        type: "video",
        vimeoId: "863773710",
        aspectRatio: "landscape",
      },
      {
        src: "",
        alt: "Welcome to Vitacca Ballet",
        type: "video",
        vimeoId: "814758377",
        aspectRatio: "landscape",
      },
      {
        src: "",
        alt: "Vitacca Ballet 22-23 — Fiona",
        type: "video",
        vimeoId: "814767888",
        aspectRatio: "landscape",
      },
      {
        src: "",
        alt: "Vitacca Ballet 22-23 — Josh",
        type: "video",
        vimeoId: "814760968",
        aspectRatio: "landscape",
      },
      {
        src: "",
        alt: "Vitacca Ballet 22-23 — Khen",
        type: "video",
        vimeoId: "814770207",
        aspectRatio: "landscape",
      },
      {
        src: "",
        alt: "Vitacca Ballet 22-23 — Maddie",
        type: "video",
        vimeoId: "814761160",
        aspectRatio: "landscape",
      },
      {
        src: "",
        alt: "Vitacca Ballet 22-23 — Jordan",
        type: "video",
        vimeoId: "814767782",
        aspectRatio: "landscape",
      },
      {
        src: "",
        alt: "Vitacca Ballet 22-23 — Elissa",
        type: "video",
        vimeoId: "814760772",
        aspectRatio: "landscape",
      },
      {
        src: "",
        alt: "Vitacca Ballet 22-23 — Coltin",
        type: "video",
        vimeoId: "814760608",
        aspectRatio: "landscape",
      },
      {
        src: "",
        alt: "Vitacca Ballet 22-23 — Annika",
        type: "video",
        vimeoId: "814770040",
        aspectRatio: "landscape",
      },
    ],
    relatedProjects: ["fashion", "monarch-school"],
  },
  {
    id: "elastique-athletics",
    client: "ÉLASTIQUE ATHLETICS",
    title: "Activewear That Moves With You",
    categories: ["FASHION", "PRODUCT", "PHOTOGRAPHY"],
    heroImage: "/images/portfolio/elastique-athletics.jpg",
    description:
      "Élastique Athletics creates premium activewear designed for performance and style. Our fashion and product photography showcased their collection in dynamic settings, highlighting the quality materials and flattering designs that make their pieces stand out.",
    gallery: [
      {
        src: "/images/portfolio/elastique-athletics.jpg",
        alt: "Activewear collection",
        type: "image",
        aspectRatio: "landscape",
      },
    ],
    relatedProjects: ["fashion", "weissman-elite"],
  },
  {
    id: "publications",
    client: "PUBLICATIONS",
    title: "Editorial Excellence",
    categories: ["EDITORIAL", "PHOTOGRAPHY"],
    heroImage: "/images/portfolio/publications.jpg",
    description:
      "A curated collection of our editorial work featured in various publications. From magazine covers to feature spreads, our photography has graced the pages of leading publications, showcasing our versatility and artistic vision.",
    gallery: [
      {
        src: "/images/portfolio/publications.jpg",
        alt: "Editorial spread",
        type: "image",
        aspectRatio: "landscape",
      },
    ],
    relatedProjects: ["fashion", "miscellaneous"],
  },
  {
    id: "miscellaneous",
    client: "MISCELLANEOUS",
    title: "A Collection of Creative Work",
    categories: ["PHOTOGRAPHY", "VIDEOGRAPHY"],
    heroImage: "/images/portfolio/miscellaneous.jpg",
    description:
      "A diverse collection of projects that showcase our range and creativity. From experimental shoots to one-of-a-kind collaborations, this portfolio represents the breadth of our capabilities and our passion for visual storytelling.",
    gallery: [
      {
        src: "/images/portfolio/miscellaneous.jpg",
        alt: "Creative work",
        type: "image",
        aspectRatio: "square",
      },
    ],
    relatedProjects: ["publications", "car-collections"],
  },
  {
    id: "monarch-school",
    client: "THE MONARCH SCHOOL",
    title: "Empowering Children Through Education",
    categories: ["DOCUMENTARY", "PHOTOGRAPHY", "VIDEOGRAPHY"],
    heroImage: "/images/portfolio/8-4Q7A9046-2.jpeg",
    description:
      "The Monarch School is a unique institution dedicated to providing comprehensive education and support for children with neurological differences. Our team captured the heartwarming stories of students, teachers, and families across multiple years — from the Transforming Lives series to the Gala Event and the MD Anderson kitchen donation — showcasing the transformative power of inclusive education.",
    /* Videos from Brandi's catalog (2026-05-05).
       Imagery delivered by Brandi 2026-05-07 (28 photos in /images/campaigns/monarch/).
       Distributed in clusters between the 6 videos for masonry rhythm. */
    gallery: [
      { src: "/images/campaigns/monarch/monarch-01.jpg", alt: "Monarch — luncheon hero edit", type: "image", aspectRatio: "landscape" },
      { src: "/images/campaigns/monarch/monarch-02.jpg", alt: "Monarch — luncheon detail", type: "image", aspectRatio: "landscape" },
      { src: "/images/campaigns/monarch/monarch-03.jpg", alt: "Monarch — student candid 166", type: "image", aspectRatio: "portrait" },
      { src: "/images/campaigns/monarch/monarch-04.jpg", alt: "Monarch — student candid 169", type: "image", aspectRatio: "portrait" },
      { src: "/images/campaigns/monarch/monarch-05.jpg", alt: "Monarch — student candid 199", type: "image", aspectRatio: "landscape" },
      { src: "", alt: "Monarch Transforming Lives 25-26", type: "video", vimeoId: "1151967437", vimeoHash: "000a715e4a", aspectRatio: "landscape" },
      { src: "/images/campaigns/monarch/monarch-06.jpg", alt: "Monarch — classroom moment 32", type: "image", aspectRatio: "portrait" },
      { src: "/images/campaigns/monarch/monarch-07.jpg", alt: "Monarch — group play 57", type: "image", aspectRatio: "landscape" },
      { src: "/images/campaigns/monarch/monarch-08.jpg", alt: "Monarch — student smile 86", type: "image", aspectRatio: "square" },
      { src: "/images/campaigns/monarch/monarch-09.jpg", alt: "Monarch Gala 25 — venue wide 3514", type: "image", aspectRatio: "landscape" },
      { src: "/images/campaigns/monarch/monarch-10.jpg", alt: "Monarch Gala 25 — guests interaction 3579", type: "image", aspectRatio: "landscape" },
      { src: "", alt: "Monarch Gala Event 24-25", type: "video", vimeoId: "1189136524", vimeoHash: "6456e78744", aspectRatio: "landscape" },
      { src: "/images/campaigns/monarch/monarch-11.jpg", alt: "Monarch — portrait 01", type: "image", aspectRatio: "portrait" },
      { src: "/images/campaigns/monarch/monarch-12.jpg", alt: "Monarch — portrait 02", type: "image", aspectRatio: "portrait" },
      { src: "/images/campaigns/monarch/monarch-13.jpg", alt: "Monarch — portrait 06", type: "image", aspectRatio: "landscape" },
      { src: "/images/campaigns/monarch/monarch-14.jpg", alt: "Monarch — portrait 07", type: "image", aspectRatio: "portrait" },
      { src: "/images/campaigns/monarch/monarch-15.jpg", alt: "Monarch — portrait 08", type: "image", aspectRatio: "landscape" },
      { src: "", alt: "Monarch Transforming Lives 24-25", type: "video", vimeoId: "1043541721", aspectRatio: "landscape" },
      { src: "/images/campaigns/monarch/monarch-16.jpg", alt: "Monarch — portrait 11", type: "image", aspectRatio: "portrait" },
      { src: "/images/campaigns/monarch/monarch-17.jpg", alt: "Monarch — portrait 20", type: "image", aspectRatio: "landscape" },
      { src: "/images/campaigns/monarch/monarch-18.jpg", alt: "Monarch — portrait 32", type: "image", aspectRatio: "portrait" },
      { src: "/images/campaigns/monarch/monarch-19.jpg", alt: "Monarch — portrait 33", type: "image", aspectRatio: "portrait" },
      { src: "/images/campaigns/monarch/monarch-20.jpg", alt: "Monarch — portrait 34", type: "image", aspectRatio: "landscape" },
      { src: "", alt: "Monarch's Upgraded Kitchen — MD Anderson Donation", type: "video", vimeoId: "673378712", vimeoHash: "f3572605d9", aspectRatio: "landscape" },
      { src: "/images/campaigns/monarch/monarch-21.jpg", alt: "Monarch — portrait 39", type: "image", aspectRatio: "portrait" },
      { src: "/images/campaigns/monarch/monarch-22.jpg", alt: "Monarch — portrait 41", type: "image", aspectRatio: "landscape" },
      { src: "/images/campaigns/monarch/monarch-23.jpg", alt: "Monarch — portrait 42", type: "image", aspectRatio: "portrait" },
      { src: "/images/campaigns/monarch/monarch-24.jpg", alt: "Monarch — portrait 43", type: "image", aspectRatio: "portrait" },
      { src: "/images/campaigns/monarch/monarch-25.jpg", alt: "Monarch — portrait 45", type: "image", aspectRatio: "landscape" },
      { src: "", alt: "Monarch Transforming Lives 23-24", type: "video", vimeoId: "896674527", aspectRatio: "landscape" },
      { src: "/images/campaigns/monarch/monarch-26.jpg", alt: "Monarch — portrait 47", type: "image", aspectRatio: "portrait" },
      { src: "/images/campaigns/monarch/monarch-27.jpg", alt: "Monarch — portrait 56", type: "image", aspectRatio: "landscape" },
      { src: "/images/campaigns/monarch/monarch-28.jpg", alt: "Monarch — portrait 58", type: "image", aspectRatio: "portrait" },
      { src: "", alt: "Monarch Transforming Lives Virtual Luncheon 21", type: "video", vimeoId: "518687682", aspectRatio: "landscape" },
    ],
    relatedProjects: ["deutsch-fine-jewelry", "vitacca-ballet"],
  },
  {
    id: "cacao-cardamom",
    client: "CACAO & CARDAMOM",
    title: "Artisan Chocolates, Crafted with Love",
    categories: ["PRODUCT", "PHOTOGRAPHY"],
    heroImage: "/images/portfolio/cacao-cardamom.jpg",
    description:
      "Cacao & Cardamom creates exquisite artisan chocolates that blend traditional techniques with innovative flavors. Our product photography captured the beauty and craftsmanship of their confections, from hand-painted bonbons to elegantly packaged gift boxes.",
    gallery: [
      {
        src: "/images/portfolio/cacao-cardamom.jpg",
        alt: "Chocolate collection",
        type: "image",
        aspectRatio: "square",
      },
    ],
    relatedProjects: ["audaja-skincare", "brandon-blackwood"],
  },
  {
    id: "fashion",
    client: "FASHION",
    title: "Style Without Boundaries",
    categories: ["FASHION", "PHOTOGRAPHY"],
    heroImage: "/images/portfolio/fashion.jpg",
    description:
      "Our fashion editorial work pushes creative boundaries while maintaining commercial appeal. This campaign featured bold styling, dramatic lighting, and confident poses that captured the essence of modern luxury fashion.",
    gallery: [
      {
        src: "/images/portfolio/fashion.jpg",
        alt: "Fashion model",
        type: "image",
        aspectRatio: "portrait",
      },
    ],
    relatedProjects: ["deutsch-fine-jewelry", "brandon-blackwood"],
  },
  {
    id: "weissman-elite",
    client: "WEISSMAN ELITE",
    title: "Dancewear That Inspires",
    categories: ["RETAIL", "PHOTOGRAPHY", "VIDEOGRAPHY"],
    heroImage: "/images/portfolio/weissman-elite.jpg",
    description:
      "Weissman Elite is a leading name in performance dancewear. Across multiple seasons — Winter 2022 through Spring 2026 — we produced photography and video campaigns showcasing their collections. Each shoot captures the energy, movement, and artistry of dance while highlighting Weissman's bold designs and innovative fabrics.",
    /* Videos sourced from Brandi's catalog (2026-05-05).
       Campaign imagery delivered by Brandi 2026-05-07 — see /images/campaigns/weissman/. */
    gallery: [
      { src: "/images/campaigns/weissman/weissman-01.jpg", alt: "Weissman cover styling — apparel detail", type: "image", aspectRatio: "portrait" },
      { src: "/images/campaigns/weissman/weissman-02.jpg", alt: "Weissman editorial group shot — color blocking", type: "image", aspectRatio: "landscape" },
      { src: "/images/campaigns/weissman/weissman-03.jpg", alt: "Weissman dancewear spread — black + white", type: "image", aspectRatio: "landscape" },
      { src: "/images/campaigns/weissman/weissman-04.jpg", alt: "Weissman gold metallic — solo pose", type: "image", aspectRatio: "portrait" },
      { src: "/images/campaigns/weissman/weissman-05.jpg", alt: "Weissman cheetah print collection", type: "image", aspectRatio: "landscape" },
      { src: "", alt: "Weissman Spring 2026 Season Cross Genre", type: "video", vimeoId: "1145783498", vimeoHash: "6e07bd9e26", aspectRatio: "landscape" },
      { src: "/images/campaigns/weissman/weissman-06.jpg", alt: "Weissman cover release — featured tile", type: "image", aspectRatio: "portrait" },
      { src: "/images/campaigns/weissman/weissman-07.jpg", alt: "Weissman gray cover — minimal palette", type: "image", aspectRatio: "portrait" },
      { src: "/images/campaigns/weissman/weissman-08.jpg", alt: "Weissman amethyst — soft jewel tones", type: "image", aspectRatio: "portrait" },
      { src: "/images/campaigns/weissman/weissman-09.jpg", alt: "Weissman vanilla — neutral motion", type: "image", aspectRatio: "landscape" },
      { src: "/images/campaigns/weissman/weissman-10.jpg", alt: "Weissman black — bold silhouette", type: "image", aspectRatio: "portrait" },
      { src: "", alt: "Weissman Fall 2025 Season Cross Genre", type: "video", vimeoId: "1094764251", vimeoHash: "17dfb40e13", aspectRatio: "landscape" },
      { src: "/images/campaigns/weissman/weissman-11.jpg", alt: "Weissman copper + black layered look", type: "image", aspectRatio: "landscape" },
      { src: "/images/campaigns/weissman/weissman-12.jpg", alt: "Weissman group lineup — copper studio set", type: "image", aspectRatio: "landscape" },
      { src: "/images/campaigns/weissman/weissman-13.jpg", alt: "Weissman navy duo — layered styling", type: "image", aspectRatio: "portrait" },
      { src: "", alt: "Weissman Spring 2025 Season Cross Genre", type: "video", vimeoId: "1030112459", vimeoHash: "3a116c25a3", aspectRatio: "landscape" },
      { src: "/images/campaigns/weissman/weissman-14.jpg", alt: "Weissman mulberry tone — solo editorial", type: "image", aspectRatio: "portrait" },
      { src: "/images/campaigns/weissman/weissman-15.jpg", alt: "Weissman outdoor group — Ashkan studio set", type: "image", aspectRatio: "landscape" },
      { src: "/images/campaigns/weissman/weissman-16.jpg", alt: "Weissman black + black cherry — duo motion", type: "image", aspectRatio: "landscape" },
      { src: "", alt: "Weissman Fall 2024 Season Cross Genre", type: "video", vimeoId: "950064546", aspectRatio: "landscape" },
      { src: "", alt: "Weissman Fall 2024 Bright Suiting", type: "video", vimeoId: "950064503", vimeoHash: "7b6c207cac", aspectRatio: "landscape" },
      { src: "", alt: "Weissman Fall 2024 Red Hip Hop", type: "video", vimeoId: "950064549", vimeoHash: "bdaa506f69", aspectRatio: "landscape" },
      { src: "", alt: "Weissman Fall 2024 Mixify", type: "video", vimeoId: "950064513", vimeoHash: "530165a338", aspectRatio: "landscape" },
      { src: "", alt: "Weissman Winter 2024 Season Cross Genre", type: "video", vimeoId: "1145746235", aspectRatio: "landscape" },
      { src: "", alt: "Weissman Winter 2024 Gothic Glam", type: "video", vimeoId: "1003351680", aspectRatio: "landscape" },
      { src: "", alt: "Weissman Winter 2024 Create Your Own Spotlight", type: "video", vimeoId: "999687742", vimeoHash: "88aae298bd", aspectRatio: "landscape" },
      { src: "", alt: "Weissman Winter 2024 Neon Hip Hop", type: "video", vimeoId: "999687723", vimeoHash: "db85e5ad2b", aspectRatio: "landscape" },
      { src: "/images/campaigns/weissman/weissman-17.jpg", alt: "Weissman lime accent — high-energy motion", type: "image", aspectRatio: "portrait" },
      { src: "/images/campaigns/weissman/weissman-18.jpg", alt: "Weissman mixed pastels — group shot", type: "image", aspectRatio: "landscape" },
      { src: "/images/campaigns/weissman/weissman-19.jpg", alt: "Weissman pear — solo pose study", type: "image", aspectRatio: "portrait" },
      { src: "", alt: "Weissman Spring 2024 Season Cross Genre", type: "video", vimeoId: "886600264", aspectRatio: "landscape" },
      { src: "", alt: "Weissman Spring 2024 Quirky / Stripes", type: "video", vimeoId: "894189739", aspectRatio: "landscape" },
      { src: "", alt: "Weissman Spring 2024 Neons", type: "video", vimeoId: "894189648", vimeoHash: "dcc8da9197", aspectRatio: "landscape" },
      { src: "", alt: "Weissman Fall 2023 Season Cross Genre", type: "video", vimeoId: "824868764", aspectRatio: "landscape" },
      { src: "", alt: "Weissman Fall 2023 Front Cover Light Wall", type: "video", vimeoId: "824868764", aspectRatio: "landscape" },
      { src: "", alt: "Weissman Fall 2023 Back Cover Light Floor", type: "video", vimeoId: "824219543", aspectRatio: "landscape" },
      { src: "", alt: "Weissman Fall 2023 Acro", type: "video", vimeoId: "824219420", vimeoHash: "9cfb4b79e8", aspectRatio: "landscape" },
      { src: "/images/campaigns/weissman/weissman-20.jpg", alt: "Weissman HAVE collection — final cover", type: "image", aspectRatio: "portrait" },
      { src: "", alt: "Weissman Winter 2023 Season Cross Genre", type: "video", vimeoId: "867250099", aspectRatio: "landscape" },
      { src: "/images/campaigns/weissman/weissman-21.jpg", alt: "Weissman HAVE collection — full set styling", type: "image", aspectRatio: "landscape" },
      { src: "", alt: "Weissman Winter 2022 Season Cross Genre", type: "video", vimeoId: "740849869", aspectRatio: "landscape" },
    ],
    relatedProjects: ["elastique-athletics", "eye-gallery"],
  },
  {
    id: "car-collections",
    client: "CAR COLLECTIONS",
    title: "Automotive Excellence",
    categories: ["AUTOMOTIVE", "PHOTOGRAPHY"],
    heroImage: "/images/portfolio/car-collections.jpg",
    description:
      "A showcase of exceptional automobiles captured with precision and artistry. Our automotive photography highlights the beauty, power, and craftsmanship of these remarkable vehicles.",
    gallery: [
      {
        src: "/images/portfolio/car-collections.jpg",
        alt: "Luxury car",
        type: "image",
        aspectRatio: "landscape",
      },
    ],
    relatedProjects: ["weissman-elite", "miscellaneous"],
  },
  {
    id: "kinetik",
    client: "KINETIK",
    title: "Once Upon A Time in the Delaware Basin",
    categories: ["NARRATIVE", "VIDEOGRAPHY"],
    heroImage: "/images/portfolio/kinetik.jpg",
    description:
      "A narrative video production for Kinetik, telling the story of energy, industry, and the people of the Delaware Basin. This cinematic piece blends documentary storytelling with polished production value to communicate Kinetik's vision and impact.",
    gallery: [
      {
        src: "/images/portfolio/kinetik.jpg",
        alt: "Kinetik production still",
        type: "image",
        aspectRatio: "landscape",
      },
      {
        src: "",
        alt: "Once Upon A Time in the Delaware Basin",
        type: "video",
        vimeoId: "865168546",
        aspectRatio: "landscape",
      },
    ],
    relatedProjects: ["radiomedix", "car-collections"],
  },
  {
    id: "radiomedix",
    client: "RADIOMEDIX",
    title: "Innovating Theranostics",
    categories: ["MEDICAL", "CORPORATE", "VIDEOGRAPHY"],
    heroImage: "/images/portfolio/radiomedix.jpg",
    description:
      "RadioMedix (now Excel Diagnostics) is at the forefront of nuclear medicine and molecular imaging — pioneering theranostic treatments. Our corporate videography documented their state-of-the-art facilities and dedicated team of researchers, creating visuals that convey both scientific precision and human compassion.",
    gallery: [
      {
        src: "/images/portfolio/radiomedix.jpg",
        alt: "Laboratory research",
        type: "image",
        aspectRatio: "landscape",
      },
      {
        src: "",
        alt: "Radio Medix — Innovating Theranostics",
        type: "video",
        vimeoId: "808109158",
        aspectRatio: "landscape",
      },
      {
        src: "",
        alt: "Radio Medix — From Innovation to Intervention",
        type: "video",
        vimeoId: "437963536",
        aspectRatio: "landscape",
      },
      {
        src: "",
        alt: "Excel Diagnostics — Committed to Excellence",
        type: "video",
        vimeoId: "437960590",
        aspectRatio: "landscape",
      },
    ],
    relatedProjects: ["monarch-school", "kinetik"],
  },
  {
    id: "eye-gallery",
    client: "THE EYE GALLERY",
    title: "Eyewear That Makes a Statement",
    categories: ["RETAIL", "PHOTOGRAPHY", "VIDEOGRAPHY"],
    heroImage: "/images/portfolio/eye-gallery.jpg",
    description:
      "The Eye Gallery offers curated eyewear from the world's finest designers. Our photography and video campaigns — from in-store ads and seasonal Sunglass Sale spots to scale-driven SASS reels and the Jacques Marie Mage trunk show — captured each unique frame with bold, editorial visuals. 1-2 more videos coming from Brandi.",
    /* Videos from Brandi's catalog (2026-05-05).
       Imagery delivered by Brandi 2026-05-07 (19 photos in /images/campaigns/eye-gallery/).
       Distributed in clusters between the 10 videos for masonry rhythm. */
    gallery: [
      { src: "/images/campaigns/eye-gallery/eye-gallery-01.jpg", alt: "Eye Gallery — Aug 2025 cover styling", type: "image", aspectRatio: "landscape" },
      { src: "/images/campaigns/eye-gallery/eye-gallery-02.jpg", alt: "Eye Gallery — April '26 JMM acetate", type: "image", aspectRatio: "portrait" },
      { src: "", alt: "The Eye Gallery Mix Reel 001", type: "video", vimeoId: "1002121348", aspectRatio: "landscape" },
      { src: "/images/campaigns/eye-gallery/eye-gallery-03.jpg", alt: "Eye Gallery — Tina + Fikri design feature", type: "image", aspectRatio: "portrait" },
      { src: "/images/campaigns/eye-gallery/eye-gallery-04.jpg", alt: "Eye Gallery — Q3 Scale best frame", type: "image", aspectRatio: "landscape" },
      { src: "", alt: "The Eye Gallery — Summer 2025 Campaign Ad H", type: "video", vimeoId: "1145748255", aspectRatio: "landscape" },
      { src: "/images/campaigns/eye-gallery/eye-gallery-05.jpg", alt: "Eye Gallery — Q3 Doggy month best", type: "image", aspectRatio: "portrait" },
      { src: "/images/campaigns/eye-gallery/eye-gallery-06.jpg", alt: "Eye Gallery — Q1 Valentines featured", type: "image", aspectRatio: "landscape" },
      { src: "", alt: "The Eye Gallery Summer Sunglass Sale Ad H", type: "video", vimeoId: "1189130989", vimeoHash: "3148f2df70", aspectRatio: "landscape" },
      { src: "/images/campaigns/eye-gallery/eye-gallery-07.jpg", alt: "Eye Gallery — Q1 April topless edit", type: "image", aspectRatio: "portrait" },
      { src: "/images/campaigns/eye-gallery/eye-gallery-08.jpg", alt: "Eye Gallery — editorial detail", type: "image", aspectRatio: "landscape" },
      { src: "", alt: "The Eye Gallery In-Store Ad 001 H", type: "video", vimeoId: "1189138937", vimeoHash: "9d970d79b7", aspectRatio: "landscape" },
      { src: "/images/campaigns/eye-gallery/eye-gallery-09.jpg", alt: "Eye Gallery — Tina + Fikri trunk piece", type: "image", aspectRatio: "portrait" },
      { src: "/images/campaigns/eye-gallery/eye-gallery-10.jpg", alt: "Eye Gallery — Q1 Valentines pair", type: "image", aspectRatio: "landscape" },
      { src: "", alt: "The Eye Gallery Jacques Marie Mage Trunk Show Store Ad H", type: "video", vimeoId: "1189140629", vimeoHash: "294990893e", aspectRatio: "landscape" },
      { src: "/images/campaigns/eye-gallery/eye-gallery-11.jpg", alt: "Eye Gallery — moody close-up", type: "image", aspectRatio: "portrait" },
      { src: "/images/campaigns/eye-gallery/eye-gallery-12.jpg", alt: "Eye Gallery — Q1 April topless edit alt", type: "image", aspectRatio: "landscape" },
      { src: "", alt: "The Eye Gallery Dog Month Campaign", type: "video", vimeoId: "1189130986", vimeoHash: "c229954ac0", aspectRatio: "landscape" },
      { src: "/images/campaigns/eye-gallery/eye-gallery-13.jpg", alt: "Eye Gallery — Q3 Juicy collection", type: "image", aspectRatio: "portrait" },
      { src: "/images/campaigns/eye-gallery/eye-gallery-14.jpg", alt: "Eye Gallery — Q3 Scale square", type: "image", aspectRatio: "square" },
      { src: "", alt: "The Eye Gallery In-store Service & Care Reel", type: "video", vimeoId: "1189131472", vimeoHash: "42147d4bc3", aspectRatio: "landscape" },
      { src: "/images/campaigns/eye-gallery/eye-gallery-15.jpg", alt: "Eye Gallery — April '26 JMM acetate alt", type: "image", aspectRatio: "landscape" },
      { src: "/images/campaigns/eye-gallery/eye-gallery-16.jpg", alt: "Eye Gallery — Tina + Fikri lineup", type: "image", aspectRatio: "portrait" },
      { src: "", alt: "The Eye Gallery Scale SASS 001 Reel", type: "video", vimeoId: "1189131771", vimeoHash: "49584fc6ca", aspectRatio: "landscape" },
      { src: "/images/campaigns/eye-gallery/eye-gallery-17.jpg", alt: "Eye Gallery — Aug 2025 alternate", type: "image", aspectRatio: "portrait" },
      { src: "/images/campaigns/eye-gallery/eye-gallery-18.jpg", alt: "Eye Gallery — Q3 Juicy square", type: "image", aspectRatio: "square" },
      { src: "", alt: "The Eye Gallery Scale Oversized Eyewear SASS 002 Reel", type: "video", vimeoId: "1189131500", vimeoHash: "f87548f64b", aspectRatio: "landscape" },
      { src: "/images/campaigns/eye-gallery/eye-gallery-19.jpg", alt: "Eye Gallery — Q3 Scale best alt frame", type: "image", aspectRatio: "landscape" },
      { src: "", alt: "The Eye Gallery Scale SASS 003 Reel", type: "video", vimeoId: "1189130987", vimeoHash: "6d5b53a3d1", aspectRatio: "landscape" },
    ],
    relatedProjects: ["audaja-skincare", "deutsch-fine-jewelry"],
  },
  {
    id: "deutsch-fine-jewelry",
    client: "DEUTSCH FINE JEWELRY",
    title: "Timeless Elegance, Modern Luxury",
    categories: ["PHOTOGRAPHY", "DESIGN"],
    /* Hero swapped to a wide horizontal shot from the gallery per
       Brandi's 5/7/26 note ('Obviously this needs to change to photo
       from gallery, horizontal'). 595 is the bracelet-styling
       landscape — more atmospheric than the previous signature piece. */
    heroImage: "/images/campaigns/deutsch/deutsch-2025-holiday-595.jpg",
    description:
      "Deutsch Fine Jewelry represents the pinnacle of luxury craftsmanship. Our photography and videography campaign captured the intricate details and timeless beauty of their collection, creating imagery that speaks to discerning clients seeking exceptional pieces.",

    /* ── Brandi's 5/7/26 review-notes copy for Deutsch ───────────── */
    storyAndIntent:
      "Deutsch Fine Jewelry is a luxury jewelry brand that represents the pinnacle of luxury craftsmanship. Our campaign brought together photography and videography to highlight the detail and character of their collection, creating imagery used across brand and client-facing platforms.",
    creativeAndProductionApproach: [
      "Shot on location at the Lancaster Hotel in downtown Houston, this campaign was built as a lifestyle-editorial interpretation of holiday indulgence — blending romance, celebration, and product storytelling within a refined party atmosphere. Designed around a series of curated set pieces, including oyster spreads and seasonal entertaining moments, the creative direction emphasized warmth, intimacy, and elevated lifestyle context for the jewelry.",
      "Talent-driven scenes were paired with on-set hair and makeup to support a cohesive visual narrative, allowing the collection to exist naturally within moments of connection and celebration. High-end professional flash photography was used throughout to maintain precise control over light, texture, and reflection — critical when working with exceptionally high-value pieces.",
      "Every detail of the production was carefully managed to balance editorial storytelling with product integrity, ensuring the final body of work could perform seamlessly across campaign platforms while maintaining the precision and trust required for luxury jewelry presentation.",
    ],
    impact: [
      "The campaign was deployed across a wide-reaching mix of platforms — including social media, email marketing, magazine placements in Modern Luxury and PaperCity Houston, three high-visibility billboard locations in the Houston market, and a suite of print and digital assets such as an 8-page magazine spread, full-page advertisement, and multi-touch email campaign. Together, these placements created a consistent brand presence across both lifestyle media and direct consumer channels.",
      "The result was a cohesive, multi-platform campaign that expanded visibility, strengthened brand perception, and supported seasonal performance goals. The client response reflected strong satisfaction with the final body of work and its ability to translate luxury product into a unified, high-impact brand narrative across every touchpoint.",
    ],
    servicesLabel: "PHOTOGRAPHY / DESIGN",
    deliverablesLabel:
      "PHOTOS, 8 PG MAGAZINE SPREAD, 1 MAGAZINE AD, 3 BILLBOARDS, 6 EMAILS",
    /* Featured spot (after Story section) — a different horizontal
       photo from the gallery so it doesn't duplicate the hero. */
    featuredImage: "/images/campaigns/deutsch/deutsch-2025-holiday-636.jpg",
    /* Brandi: 'should only be the video here for Behind the Scenes'.
       All photos move up into the main campaign gallery. */
    btsVideosOnly: true,
    /* 8-page PaperCity Houston magazine spread — Brandi delivered
       a 1.5 MB compressed PDF on 2026-05-11. */
    magazineSpread: {
      src: "/assets/deutsch-papercity-spread.pdf",
      title: "PaperCity Magazine Spread",
      pages: 8,
      note: "An 8-page editorial feature published in PaperCity Houston. The spread includes some product photography provided by Deutsch; all lifestyle imagery, layout, and design direction were developed in-house at Ashkan Studios.",
    },
    gallery: [
      { src: "/images/campaigns/deutsch/deutsch-2025-holiday-029.jpg", alt: "Deutsch Holiday 2025 — campaign opener", type: "image", aspectRatio: "portrait" },
      { src: "/images/campaigns/deutsch/deutsch-2025-holiday-096.jpg", alt: "Deutsch Holiday 2025 — luxury detail", type: "image", aspectRatio: "landscape" },
      { src: "/images/campaigns/deutsch/deutsch-2025-holiday-253.jpg", alt: "Deutsch Holiday 2025 — diamond elegance", type: "image", aspectRatio: "portrait" },
      { src: "/images/campaigns/deutsch/deutsch-2025-holiday-325.jpg", alt: "Deutsch Holiday 2025 — refined craftsmanship", type: "image", aspectRatio: "square" },
      { src: "/images/campaigns/deutsch/deutsch-2025-holiday-485.jpg", alt: "Deutsch Holiday 2025 — signature piece", type: "image", aspectRatio: "landscape" },
      { src: "/images/campaigns/deutsch/deutsch-2025-holiday-509.jpg", alt: "Deutsch Holiday 2025 — gemstone study", type: "image", aspectRatio: "portrait" },
      { src: "/images/campaigns/deutsch/deutsch-2025-holiday-595.jpg", alt: "Deutsch Holiday 2025 — bracelet styling", type: "image", aspectRatio: "landscape" },
      { src: "/images/campaigns/deutsch/deutsch-2025-holiday-597.jpg", alt: "Deutsch Holiday 2025 — necklace shot", type: "image", aspectRatio: "portrait" },
      { src: "/images/campaigns/deutsch/deutsch-2025-holiday-604.jpg", alt: "Deutsch Holiday 2025 — earring close-up", type: "image", aspectRatio: "square" },
      { src: "/images/campaigns/deutsch/deutsch-2025-holiday-636.jpg", alt: "Deutsch Holiday 2025 — composition", type: "image", aspectRatio: "landscape" },
      { src: "/images/campaigns/deutsch/deutsch-2025-holiday-656.jpg", alt: "Deutsch Holiday 2025 — moody lighting", type: "image", aspectRatio: "portrait" },
      { src: "/images/campaigns/deutsch/deutsch-2025-holiday-696.jpg", alt: "Deutsch Holiday 2025 — finale", type: "image", aspectRatio: "landscape" },
      { src: "/images/campaigns/deutsch/deutsch-brandi-701.jpg", alt: "Brandi for Deutsch — portrait session", type: "image", aspectRatio: "portrait" },
      { src: "/images/campaigns/deutsch/deutsch-brandi-776.jpg", alt: "Brandi for Deutsch — editorial", type: "image", aspectRatio: "landscape" },
      { src: "/images/campaigns/deutsch/deutsch-brandi-791.jpg", alt: "Brandi for Deutsch — styling", type: "image", aspectRatio: "portrait" },
      { src: "/images/campaigns/deutsch/deutsch-brandi-871.jpg", alt: "Brandi for Deutsch — close detail", type: "image", aspectRatio: "square" },
      { src: "/images/campaigns/deutsch/deutsch-brandi-872.jpg", alt: "Brandi for Deutsch — final frame", type: "image", aspectRatio: "portrait" },
      /* Video from Brandi's catalog (2026-05-05) */
      { src: "", alt: "Behind the Scenes at Deutsch Campaign Shoot", type: "video", vimeoId: "1147057440", aspectRatio: "landscape" },
    ],
    relatedProjects: ["monarch-school", "fashion"],
  },
];

export function getProjectById(id: string): Project | undefined {
  return projects.find((p) => p.id === id);
}

export function getAllProjects(): Project[] {
  return projects;
}

export function getRelatedProjects(ids: string[]): Project[] {
  return projects.filter((p) => ids.includes(p.id));
}
