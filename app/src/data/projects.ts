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

export interface Project {
  id: string;
  client: string;
  title: string;
  categories: string[];
  heroImage: string;
  description: string;
  gallery: GalleryItem[];
  relatedProjects: string[];
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
    /* Videos sourced from Brandi's catalog (2026-05-05) — see brandi-videos.ts.
       Photos kept from earlier delivery; intermixed with the 6 official videos. */
    gallery: [
      {
        src: "/images/portfolio/5-Monarch-47-2.jpeg",
        alt: "Monarch School student portrait",
        type: "image",
        aspectRatio: "landscape",
      },
      {
        src: "",
        alt: "Monarch Transforming Lives 25-26",
        type: "video",
        vimeoId: "1151967437",
        vimeoHash: "000a715e4a",
        aspectRatio: "landscape",
      },
      {
        src: "/images/portfolio/20-4Q7A9311-2-2.jpeg",
        alt: "Classroom activities",
        type: "image",
        aspectRatio: "portrait",
      },
      {
        src: "",
        alt: "Monarch Gala Event 24-25",
        type: "video",
        vimeoId: "1189136524",
        vimeoHash: "6456e78744",
        aspectRatio: "landscape",
      },
      {
        src: "/images/portfolio/Monarch_30-copy.jpeg",
        alt: "Outdoor learning",
        type: "image",
        aspectRatio: "landscape",
      },
      {
        src: "",
        alt: "Monarch Transforming Lives 24-25",
        type: "video",
        vimeoId: "1043541721",
        aspectRatio: "landscape",
      },
      {
        src: "/images/portfolio/17-Monarch-199-2.jpeg",
        alt: "Teacher with students",
        type: "image",
        aspectRatio: "square",
      },
      {
        src: "",
        alt: "Monarch's Upgraded Kitchen — MD Anderson Donation",
        type: "video",
        vimeoId: "673378712",
        vimeoHash: "f3572605d9",
        aspectRatio: "landscape",
      },
      {
        src: "/images/portfolio/10-Monarch-116-2.jpeg",
        alt: "Student artwork",
        type: "image",
        aspectRatio: "portrait",
      },
      {
        src: "",
        alt: "Monarch Transforming Lives 23-24",
        type: "video",
        vimeoId: "896674527",
        aspectRatio: "landscape",
      },
      {
        src: "/images/portfolio/17-Monarch-86-2.jpeg",
        alt: "School event",
        type: "image",
        aspectRatio: "landscape",
      },
      {
        src: "",
        alt: "Monarch Transforming Lives Virtual Luncheon 21",
        type: "video",
        vimeoId: "518687682",
        aspectRatio: "landscape",
      },
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
    /* Videos sourced from Brandi's catalog (2026-05-05) — full 20-video set,
       grouped chronologically. See brandi-videos.ts for canonical list. */
    gallery: [
      {
        src: "/images/portfolio/weissman-elite.jpg",
        alt: "Weissman Elite dancewear campaign",
        type: "image",
        aspectRatio: "landscape",
      },
      { src: "", alt: "Weissman Spring 2026 Season Cross Genre", type: "video", vimeoId: "1145783498", vimeoHash: "6e07bd9e26", aspectRatio: "landscape" },
      { src: "", alt: "Weissman Fall 2025 Season Cross Genre", type: "video", vimeoId: "1094764251", vimeoHash: "17dfb40e13", aspectRatio: "landscape" },
      { src: "", alt: "Weissman Spring 2025 Season Cross Genre", type: "video", vimeoId: "1030112459", vimeoHash: "3a116c25a3", aspectRatio: "landscape" },
      { src: "", alt: "Weissman Fall 2024 Season Cross Genre", type: "video", vimeoId: "950064546", aspectRatio: "landscape" },
      { src: "", alt: "Weissman Fall 2024 Bright Suiting", type: "video", vimeoId: "950064503", vimeoHash: "7b6c207cac", aspectRatio: "landscape" },
      { src: "", alt: "Weissman Fall 2024 Red Hip Hop", type: "video", vimeoId: "950064549", vimeoHash: "bdaa506f69", aspectRatio: "landscape" },
      { src: "", alt: "Weissman Fall 2024 Mixify", type: "video", vimeoId: "950064513", vimeoHash: "530165a338", aspectRatio: "landscape" },
      { src: "", alt: "Weissman Winter 2024 Season Cross Genre", type: "video", vimeoId: "1145746235", aspectRatio: "landscape" },
      { src: "", alt: "Weissman Winter 2024 Gothic Glam", type: "video", vimeoId: "1003351680", aspectRatio: "landscape" },
      { src: "", alt: "Weissman Winter 2024 Create Your Own Spotlight", type: "video", vimeoId: "999687742", vimeoHash: "88aae298bd", aspectRatio: "landscape" },
      { src: "", alt: "Weissman Winter 2024 Neon Hip Hop", type: "video", vimeoId: "999687723", vimeoHash: "db85e5ad2b", aspectRatio: "landscape" },
      { src: "", alt: "Weissman Spring 2024 Season Cross Genre", type: "video", vimeoId: "886600264", aspectRatio: "landscape" },
      { src: "", alt: "Weissman Spring 2024 Quirky / Stripes", type: "video", vimeoId: "894189739", aspectRatio: "landscape" },
      { src: "", alt: "Weissman Spring 2024 Neons", type: "video", vimeoId: "894189648", vimeoHash: "dcc8da9197", aspectRatio: "landscape" },
      { src: "", alt: "Weissman Fall 2023 Season Cross Genre", type: "video", vimeoId: "824868764", aspectRatio: "landscape" },
      { src: "", alt: "Weissman Fall 2023 Front Cover Light Wall", type: "video", vimeoId: "824868764", aspectRatio: "landscape" },
      { src: "", alt: "Weissman Fall 2023 Back Cover Light Floor", type: "video", vimeoId: "824219543", aspectRatio: "landscape" },
      { src: "", alt: "Weissman Fall 2023 Acro", type: "video", vimeoId: "824219420", vimeoHash: "9cfb4b79e8", aspectRatio: "landscape" },
      { src: "", alt: "Weissman Winter 2023 Season Cross Genre", type: "video", vimeoId: "867250099", aspectRatio: "landscape" },
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
    /* Videos sourced from Brandi's catalog (2026-05-05). See brandi-videos.ts. */
    gallery: [
      {
        src: "/images/portfolio/eye-gallery.jpg",
        alt: "Eyewear collection",
        type: "image",
        aspectRatio: "landscape",
      },
      { src: "", alt: "The Eye Gallery Mix Reel 001", type: "video", vimeoId: "1002121348", aspectRatio: "landscape" },
      { src: "", alt: "The Eye Gallery — Summer 2025 Campaign Ad H", type: "video", vimeoId: "1145748255", aspectRatio: "landscape" },
      { src: "", alt: "The Eye Gallery Summer Sunglass Sale Ad H", type: "video", vimeoId: "1189130989", vimeoHash: "3148f2df70", aspectRatio: "landscape" },
      { src: "", alt: "The Eye Gallery In-Store Ad 001 H", type: "video", vimeoId: "1189138937", vimeoHash: "9d970d79b7", aspectRatio: "landscape" },
      { src: "", alt: "The Eye Gallery Jacques Marie Mage Trunk Show Store Ad H", type: "video", vimeoId: "1189140629", vimeoHash: "294990893e", aspectRatio: "landscape" },
      { src: "", alt: "The Eye Gallery Dog Month Campaign", type: "video", vimeoId: "1189130986", vimeoHash: "c229954ac0", aspectRatio: "landscape" },
      { src: "", alt: "The Eye Gallery In-store Service & Care Reel", type: "video", vimeoId: "1189131472", vimeoHash: "42147d4bc3", aspectRatio: "landscape" },
      { src: "", alt: "The Eye Gallery Scale SASS 001 Reel", type: "video", vimeoId: "1189131771", vimeoHash: "49584fc6ca", aspectRatio: "landscape" },
      { src: "", alt: "The Eye Gallery Scale Oversized Eyewear SASS 002 Reel", type: "video", vimeoId: "1189131500", vimeoHash: "f87548f64b", aspectRatio: "landscape" },
      { src: "", alt: "The Eye Gallery Scale SASS 003 Reel", type: "video", vimeoId: "1189130987", vimeoHash: "6d5b53a3d1", aspectRatio: "landscape" },
    ],
    relatedProjects: ["audaja-skincare", "deutsch-fine-jewelry"],
  },
  {
    id: "deutsch-fine-jewelry",
    client: "DEUTSCH FINE JEWELRY",
    title: "Timeless Elegance, Modern Luxury",
    categories: ["PHOTOGRAPHY", "VIDEOGRAPHY", "PRODUCT"],
    heroImage: "/images/campaigns/deutsch/deutsch-2025-holiday-485.jpg",
    description:
      "Deutsch Fine Jewelry represents the pinnacle of luxury craftsmanship. Our photography and videography campaign captured the intricate details and timeless beauty of their collection, creating imagery that speaks to discerning clients seeking exceptional pieces.",
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
