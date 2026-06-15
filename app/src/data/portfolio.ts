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
    /* AI placeholder thumb removed (Ashkan 6/11) - campaign tile now
       uses the approved 16:9 cover. */
    image: "/images/campaigns/covers/weissman-cover.webp",
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
    image: "/images/campaigns/covers/eye-gallery-cover.webp",
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
    image: "/images/campaigns/covers/deutsch-cover.webp",
    href: "#",
    photoCategories: ["retail"],
    videoCategories: ["retail"],
    campaign: "deutsch",
  },
];

/* Legacy text-only client list - kept for compatibility with any
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
   Client logo catalog - delivered by Brandi 2026-05-07.
   `priority: true` marks the top 20 (most important) per Brandi's note.
   `name` is the display name used as alt text and accessible label.
   `src` points to the PNG inside app/public/images/logos/.
   ════════════════════════════════════════════════════════════════════ */

export interface ClientLogo {
  name: string;
  src: string;
  priority: boolean;
  /** Brand's company website. When set, the logo becomes a clickable
   *  link (opens in a new tab) per Brandi's new-PDF page 5 request.
   *  Only confident, verified URLs are filled in for now; Brandi will
   *  send the authoritative list to complete the rest. */
  website?: string;
}

export const clientLogos: ClientLogo[] = [
  // ── Top 20 (priority, in Brandi's listed order) ──
  { name: "Weissman",          src: "/images/logos/weissman.png",          priority: true, website: "https://www.weissmans.com" },
  { name: "The Eye Gallery",   src: "/images/logos/eye-gallery.png",       priority: true, website: "https://eyegalleryhouston.com" },
  { name: "Deutsch",           src: "/images/logos/deutsch.png",           priority: true, website: "https://www.deutschhouston.com" },
  { name: "Cacao & Cardamom",  src: "/images/logos/cacao.png",             priority: true, website: "https://www.cacaoandcardamom.com" },
  { name: "Facet Seven",       src: "/images/logos/f7.png",                priority: true },
  { name: "Kinetik",           src: "/images/logos/kinetik.png",           priority: true, website: "https://www.kinetik.com" },
  { name: "The Monarch School", src: "/images/logos/monarch.png",          priority: true, website: "https://www.monarchschool.org" },
  { name: "RadioMedix",        src: "/images/logos/radiomedix.png",        priority: true, website: "https://radiomedix.com" },
  { name: "Venus Aerospace",   src: "/images/logos/venus.png",             priority: true, website: "https://www.venusaero.com" },
  { name: "Vitacca Ballet",    src: "/images/logos/vitacca.png",           priority: true, website: "https://vitaccaballet.org" },
  { name: "Safari Vet",        src: "/images/logos/safari.png",            priority: true, website: "https://www.safarivet.com" },
  { name: "Citybook",          src: "/images/logos/citybook.png",          priority: true }, // client: do not link
  { name: "Bvlgari",           src: "/images/logos/bvlgari.png",           priority: true, website: "https://www.bulgari.com" },
  { name: "Brandon Blackwood", src: "/images/logos/brandon-blackwood.png", priority: true, website: "https://brandonblackwood.com" },
  { name: "DSAH",              src: "/images/logos/dsah.png",              priority: true },
  { name: "DWS",               src: "/images/logos/dws.png",               priority: true },
  { name: "Goodman",           src: "/images/logos/goodman.png",           priority: true },
  { name: "iCRYO",             src: "/images/logos/icryo.png",             priority: true, website: "https://icryo.com" },
  { name: "Kinetic",           src: "/images/logos/kinetic.png",           priority: true },
  { name: "Globo",             src: "/images/logos/globo.png",             priority: true },
  { name: "Excel Diagnostics", src: "/images/logos/excel.png",             priority: true, website: "https://exceldiagnostics.com" },

  // ── Tier 2 (still on display, lower visual priority) ──
  { name: "Cecilia Duarte",    src: "/images/logos/cecilia.png",           priority: false, website: "https://www.ceciliaduartemezzosoprano.com" },
  { name: "Caspian",           src: "/images/logos/caspian.png",           priority: false, website: "https://cafecaspian.com" },
  { name: "Athletico",         src: "/images/logos/athletico.png",         priority: false },
  { name: "AG",                src: "/images/logos/ag.png",                priority: false },
  { name: "ADC",               src: "/images/logos/adc.png",               priority: false, website: "https://theaustindanceconservatory.com" },
  { name: "Contour",           src: "/images/logos/contour.png",           priority: false },
  { name: "Élastique Athletics", src: "/images/logos/elastique.png",       priority: false, website: "https://www.elastiqueathletics.com" },
  { name: "Audaja Skincare",   src: "/images/logos/audaja.png",            priority: false, website: "https://audaja.com" },
  { name: "Outsmart",          src: "/images/logos/outsmart.png",          priority: false, website: "https://www.outsmartmagazine.com" },
  { name: "Student RDH",       src: "/images/logos/student-rdh.png",       priority: false, website: "https://www.studentrdh.com" },
  { name: "BAHBT",             src: "/images/logos/bahbt.png",             priority: false, website: "https://www.bahbt.org" },
  { name: "Rubia",             src: "/images/logos/rubia.png",             priority: false },
  { name: "Schaeffer",         src: "/images/logos/schaeffer.png",         priority: false },
  { name: "Jamil",             src: "/images/logos/jamil.png",             priority: false },
  { name: "HUN",               src: "/images/logos/hun.png",               priority: false },
  { name: "Makartt",           src: "/images/logos/makartt.png",           priority: false, website: "https://makartt.com" },
  { name: "Euphree",           src: "/images/logos/euphree.png",           priority: false, website: "https://euphree.com" },
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
