export interface Project {
  id: string;
  client: string;
  title: string;
  categories: string[];
  heroImage: string;
  description: string;
  gallery: {
    src: string;
    alt: string;
    type: "image" | "video";
    aspectRatio?: "landscape" | "portrait" | "square";
  }[];
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
      "A comprehensive portrait and video session capturing the essence of Cecilia Duarte's artistic journey. Through intimate photography and cinematic videography, we documented her creative process and personal story.",
    gallery: [
      {
        src: "/images/portfolio/cecilia-duarte.jpg",
        alt: "Portrait session",
        type: "image",
        aspectRatio: "portrait",
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
    categories: ["ARTS", "DANCE", "PHOTOGRAPHY"],
    heroImage: "/images/portfolio/vitacca-ballet.jpg",
    description:
      "Vitacca Ballet brings world-class dance to Houston. Our photography captures the grace, power, and emotion of their performances, freezing moments of extraordinary artistry in time. From rehearsal studios to grand stages, we documented the dedication and passion that drives these exceptional dancers.",
    gallery: [
      {
        src: "/images/portfolio/vitacca-ballet.jpg",
        alt: "Ballet performance",
        type: "image",
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
      "The Monarch School is a unique institution dedicated to providing comprehensive education and support for children with neurological differences. Our team captured the heartwarming stories of students, teachers, and families, showcasing the transformative power of inclusive education.",
    gallery: [
      {
        src: "/images/portfolio/5-Monarch-47-2.jpeg",
        alt: "Monarch School student portrait",
        type: "image",
        aspectRatio: "landscape",
      },
      {
        src: "/images/portfolio/20-4Q7A9311-2-2.jpeg",
        alt: "Classroom activities",
        type: "image",
        aspectRatio: "portrait",
      },
      {
        src: "/images/portfolio/Monarch_30-copy.jpeg",
        alt: "Outdoor learning",
        type: "image",
        aspectRatio: "landscape",
      },
      {
        src: "/images/portfolio/17-Monarch-199-2.jpeg",
        alt: "Teacher with students",
        type: "image",
        aspectRatio: "square",
      },
      {
        src: "/images/portfolio/10-Monarch-116-2.jpeg",
        alt: "Student artwork",
        type: "image",
        aspectRatio: "portrait",
      },
      {
        src: "/images/portfolio/17-Monarch-86-2.jpeg",
        alt: "School event",
        type: "image",
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
    title: "Luxury Real Estate Marketing",
    categories: ["ARCHITECTURE", "PHOTOGRAPHY", "VIDEOGRAPHY"],
    heroImage: "/images/portfolio/weissman-elite.jpg",
    description:
      "Weissman Elite represents the pinnacle of luxury real estate in Houston. Our architectural photography and videography showcased their stunning properties, capturing the elegance and sophistication that define their brand.",
    gallery: [
      {
        src: "/images/portfolio/weissman-elite.jpg",
        alt: "Luxury property",
        type: "image",
        aspectRatio: "landscape",
      },
    ],
    relatedProjects: ["elastique-athletics", "car-collections"],
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
    title: "Movement and Energy",
    categories: ["FITNESS", "PHOTOGRAPHY", "VIDEOGRAPHY"],
    heroImage: "/images/portfolio/kinetik.jpg",
    description:
      "Kinetik represents the future of fitness. Our dynamic photography and videography captured the energy and intensity of their training programs, inspiring viewers to push their limits.",
    gallery: [
      {
        src: "/images/portfolio/kinetik.jpg",
        alt: "Fitness training",
        type: "image",
        aspectRatio: "landscape",
      },
    ],
    relatedProjects: ["elastique-athletics", "weissman-elite"],
  },
  {
    id: "radiomedix",
    client: "RADIOMEDIX",
    title: "Innovation in Medical Science",
    categories: ["MEDICAL", "CORPORATE", "VIDEOGRAPHY"],
    heroImage: "/images/portfolio/radiomedix.jpg",
    description:
      "RadioMedix is at the forefront of nuclear medicine and molecular imaging. Our corporate videography documented their state-of-the-art facilities and dedicated team of researchers, creating visuals that convey both scientific precision and human compassion.",
    gallery: [
      {
        src: "/images/portfolio/radiomedix.jpg",
        alt: "Laboratory research",
        type: "image",
        aspectRatio: "landscape",
      },
    ],
    relatedProjects: ["monarch-school", "vitacca-ballet"],
  },
  {
    id: "eye-gallery",
    client: "THE EYE GALLERY",
    title: "Eyewear That Makes a Statement",
    categories: ["RETAIL", "PHOTOGRAPHY"],
    heroImage: "/images/portfolio/eye-gallery.jpg",
    description:
      "The Eye Gallery offers curated eyewear from the world's finest designers. Our fashion photography showcased their collection with bold, editorial-style images that capture the essence of each unique frame.",
    gallery: [
      {
        src: "/images/portfolio/eye-gallery.jpg",
        alt: "Eyewear collection",
        type: "image",
        aspectRatio: "landscape",
      },
    ],
    relatedProjects: ["audaja-skincare", "deutsch-fine-jewelry"],
  },
  {
    id: "deutsch-fine-jewelry",
    client: "DEUTSCH FINE JEWELRY",
    title: "Timeless Elegance, Modern Luxury",
    categories: ["PHOTOGRAPHY", "VIDEOGRAPHY", "PRODUCT"],
    heroImage: "/images/portfolio/deutsch-jewelry.jpg",
    description:
      "Deutsch Fine Jewelry represents the pinnacle of luxury craftsmanship. Our photography and videography campaign captured the intricate details and timeless beauty of their collection, creating imagery that speaks to discerning clients seeking exceptional pieces.",
    gallery: [
      {
        src: "/images/portfolio/deutsch-jewelry.jpg",
        alt: "Diamond necklace",
        type: "image",
        aspectRatio: "portrait",
      },
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
