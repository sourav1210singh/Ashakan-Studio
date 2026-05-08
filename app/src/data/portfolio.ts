export interface PortfolioItem {
  id: string;
  title: string;
  category: string;
  /** Primary media type for this portfolio: photo, video, or both */
  mediaType: "photo" | "video" | "both";
  image: string;
  href: string;
  photoCategories?: string[];
  videoCategories?: string[];
  campaign?: string;
}

export const portfolioItems: PortfolioItem[] = [
  {
    id: "brandon-blackwood",
    title: "Brandon Blackwood",
    category: "PRODUCT",
    mediaType: "photo",
    image: "/images/portfolio/brandon-blackwood.jpg",
    href: "#",
    photoCategories: ["retail", "fashion"],
    videoCategories: ["retail"],
  },
  {
    id: "cecilia-duarte",
    title: "Cecilia Duarte",
    category: "PORTRAIT",
    mediaType: "photo",
    image: "/images/portfolio/cecilia-duarte.jpg",
    href: "#",
    photoCategories: ["the-arts"],
    videoCategories: ["the-arts"],
  },
  {
    id: "audaja-skincare",
    title: "Audaja Skincare",
    category: "PRODUCT",
    mediaType: "photo",
    image: "/images/portfolio/audaja-skincare.jpg",
    href: "#",
    photoCategories: ["retail"],
    videoCategories: ["retail"],
  },
  {
    id: "lauren-anderson",
    title: "Lauren Anderson",
    category: "PORTRAIT",
    mediaType: "photo",
    image: "/images/portfolio/lauren-anderson.jpg",
    href: "#",
    photoCategories: ["the-arts"],
    videoCategories: ["the-arts"],
  },
  {
    id: "vitacca-ballet",
    title: "Vitacca Ballet",
    category: "ARTS / DANCE",
    mediaType: "photo",
    image: "/images/portfolio/vitacca-ballet.jpg",
    href: "#",
    photoCategories: ["the-arts"],
    videoCategories: ["the-arts"],
  },
  {
    id: "elastique-athletics",
    title: "Élastique Athletics",
    category: "FASHION",
    mediaType: "photo",
    image: "/images/portfolio/elastique-athletics.jpg",
    href: "#",
    photoCategories: ["retail", "fashion"],
    videoCategories: ["retail"],
  },
  {
    id: "publications",
    title: "Publications",
    category: "EDITORIAL",
    mediaType: "photo",
    image: "/images/portfolio/publications.jpg",
    href: "#",
    photoCategories: ["fashion"],
    videoCategories: [],
  },
  {
    id: "miscellaneous",
    title: "Miscellaneous",
    category: "PHOTOGRAPHY",
    mediaType: "photo",
    image: "/images/portfolio/miscellaneous.jpg",
    href: "#",
    photoCategories: ["retail"],
    videoCategories: [],
  },
  {
    id: "monarch-school",
    title: "The Monarch School",
    category: "DOCUMENTARY",
    mediaType: "video",
    image: "/images/portfolio/8-4Q7A9046-2.jpeg",
    href: "#",
    photoCategories: ["the-arts"],
    videoCategories: ["documentary"],
    campaign: "monarch-school",
  },
  {
    id: "cacao-cardamom",
    title: "Cacao & Cardamom",
    category: "PRODUCT",
    mediaType: "photo",
    image: "/images/portfolio/cacao-cardamom.jpg",
    href: "#",
    photoCategories: ["retail"],
    videoCategories: ["retail"],
  },
  {
    id: "fashion",
    title: "Fashion",
    category: "FASHION",
    mediaType: "photo",
    image: "/images/portfolio/fashion.jpg",
    href: "#",
    photoCategories: ["fashion", "retail"],
    videoCategories: ["retail"],
  },
  {
    id: "weissman-elite",
    title: "Weissman Elite",
    category: "RETAIL",
    mediaType: "both",
    image: "/images/portfolio/weissman-elite.jpg",
    href: "#",
    photoCategories: ["retail"],
    videoCategories: ["retail"],
    campaign: "weissman",
  },
  {
    id: "car-collections",
    title: "Car Collections",
    category: "AUTOMOTIVE",
    mediaType: "photo",
    image: "/images/portfolio/car-collections.jpg",
    href: "#",
    photoCategories: ["industrial"],
    videoCategories: ["industrial"],
  },
  {
    id: "kinetik",
    title: "Kinetik",
    category: "NARRATIVE",
    mediaType: "video",
    image: "/images/portfolio/kinetik.jpg",
    href: "#",
    photoCategories: [],
    videoCategories: ["narrative"],
  },
  {
    id: "radiomedix",
    title: "RadioMedix",
    category: "MEDICAL / CORPORATE",
    mediaType: "video",
    image: "/images/portfolio/radiomedix.jpg",
    href: "#",
    photoCategories: ["industrial"],
    videoCategories: ["industrial"],
  },
  {
    id: "eye-gallery",
    title: "The Eye Gallery",
    category: "RETAIL",
    mediaType: "both",
    image: "/images/portfolio/eye-gallery.jpg",
    href: "#",
    photoCategories: ["retail"],
    videoCategories: ["retail"],
    campaign: "eye-gallery",
  },
  {
    id: "deutsch-fine-jewelry",
    title: "Deutsch Fine Jewelry",
    category: "PHOTOGRAPHY / VIDEOGRAPHY",
    mediaType: "both",
    image: "/images/portfolio/deutsch-jewelry.jpg",
    href: "#",
    photoCategories: ["retail"],
    videoCategories: ["retail"],
    campaign: "deutsch",
  },
];

/* Legacy text-only client list — kept for compatibility with any
   older component that hasn't been migrated to use clientLogos. */
export const clients = [
  "THE EYE GALLERY",
  "EXCEL DIAGNOSTICS",
  "ÉLASTIQUE ATHLETICS",
  "iCRYO",
  "GLOBO",
  "FROST",
  "INSTACART",
  "YETI",
];

/* ════════════════════════════════════════════════════════════════════
   Client logo catalog — delivered by Brandi 2026-05-07.
   `priority: true` marks the top 20 (most important) per Brandi's note.
   `name` is the display name used as alt text and accessible label.
   `src` points to the PNG inside app/public/images/logos/.
   ════════════════════════════════════════════════════════════════════ */

export interface ClientLogo {
  name: string;
  src: string;
  priority: boolean;
}

export const clientLogos: ClientLogo[] = [
  // ── Top 20 (priority, in Brandi's listed order) ──
  { name: "Weissman",          src: "/images/logos/weissman.png",          priority: true },
  { name: "The Eye Gallery",   src: "/images/logos/eye-gallery.png",       priority: true },
  { name: "Deutsch",           src: "/images/logos/deutsch.png",           priority: true },
  { name: "Cacao & Cardamom",  src: "/images/logos/cacao.png",             priority: true },
  { name: "Facet Seven",       src: "/images/logos/f7.png",                priority: true },
  { name: "Kinetik",           src: "/images/logos/kinetik.png",           priority: true },
  { name: "The Monarch School", src: "/images/logos/monarch.png",          priority: true },
  { name: "RadioMedix",        src: "/images/logos/radiomedix.png",        priority: true },
  { name: "Venus Aerospace",   src: "/images/logos/venus.png",             priority: true },
  { name: "Vitacca Ballet",    src: "/images/logos/vitacca.png",           priority: true },
  { name: "Safari Vet",        src: "/images/logos/safari.png",            priority: true },
  { name: "Citybook",          src: "/images/logos/citybook.png",          priority: true },
  { name: "Bvlgari",           src: "/images/logos/bvlgari.png",           priority: true },
  { name: "Brandon Blackwood", src: "/images/logos/brandon-blackwood.png", priority: true },
  { name: "DSAH",              src: "/images/logos/dsah.png",              priority: true },
  { name: "DWS",               src: "/images/logos/dws.png",               priority: true },
  { name: "Goodman",           src: "/images/logos/goodman.png",           priority: true },
  { name: "iCRYO",             src: "/images/logos/icryo.png",             priority: true },
  { name: "Kinetic",           src: "/images/logos/kinetic.png",           priority: true },
  { name: "Globo",             src: "/images/logos/globo.png",             priority: true },
  { name: "Excel Diagnostics", src: "/images/logos/excel.png",             priority: true },

  // ── Tier 2 (still on display, lower visual priority) ──
  { name: "Cecilia Duarte",    src: "/images/logos/cecilia.png",           priority: false },
  { name: "Caspian",           src: "/images/logos/caspian.png",           priority: false },
  { name: "Athletico",         src: "/images/logos/athletico.png",         priority: false },
  { name: "AG",                src: "/images/logos/ag.png",                priority: false },
  { name: "ADC",               src: "/images/logos/adc.png",               priority: false },
  { name: "Contour",           src: "/images/logos/contour.png",           priority: false },
  { name: "Élastique Athletics", src: "/images/logos/elastique.png",       priority: false },
  { name: "Audaja Skincare",   src: "/images/logos/audaja.png",            priority: false },
  { name: "Outsmart",          src: "/images/logos/outsmart.png",          priority: false },
  { name: "Student RDH",       src: "/images/logos/student-rdh.png",       priority: false },
  { name: "BAHBT",             src: "/images/logos/bahbt.png",             priority: false },
  { name: "Rubia",             src: "/images/logos/rubia.png",             priority: false },
  { name: "Schaeffer",         src: "/images/logos/schaeffer.png",         priority: false },
  { name: "Jamil",             src: "/images/logos/jamil.png",             priority: false },
  { name: "HUN",               src: "/images/logos/hun.png",               priority: false },
  { name: "Makartt",           src: "/images/logos/makartt.png",           priority: false },
  { name: "Euphree",           src: "/images/logos/euphree.png",           priority: false },
  { name: "Kahllin",           src: "/images/logos/kahllin.png",           priority: false },
  { name: "Pink Palette",      src: "/images/logos/pink-palette.png",      priority: false },
  { name: "Tecas",             src: "/images/logos/tecas.png",             priority: false },
];

/** All priority logos (top 20 per Brandi) */
export const priorityClientLogos = clientLogos.filter((l) => l.priority);

export const navItems = [
  { label: "THE WORK", href: "#work" },
  { label: "SERVICES", href: "#services" },
  { label: "ABOUT", href: "#about" },
  { label: "CONTACT", href: "#contact" },
];

export const services = [
  "PHOTOGRAPHERS",
  "CINEMATOGRAPHERS",
  "DIRECTORS",
  "HAIR/MAKEUP",
  "STYLISTS",
  "SOUND/AUDIO",
  "DESIGNERS",
  "PRE & POST PRODUCTION",
  "MARKETING SUPPORT",
];
