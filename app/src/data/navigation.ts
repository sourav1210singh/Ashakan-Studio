export interface NavItem {
  label: string;
  href: string;
  children?: NavItem[];
}

export const mainNavigation: NavItem[] = [
  { label: "HOME", href: "/" },
  {
    label: "WORK",
    href: "/work",
    children: [
      {
        label: "PHOTOGRAPHY",
        href: "/work/photography",
        children: [
          { label: "RETAIL", href: "/work/photography/retail" },
          { label: "THE ARTS", href: "/work/photography/the-arts" },
          { label: "FASHION", href: "/work/photography/fashion" },
          { label: "INDUSTRIAL", href: "/work/photography/industrial" },
        ],
      },
      {
        label: "VIDEOGRAPHY",
        href: "/work/videography",
        children: [
          { label: "RETAIL", href: "/work/videography/retail" },
          { label: "THE ARTS", href: "/work/videography/the-arts" },
          { label: "INDUSTRIAL", href: "/work/videography/industrial" },
          { label: "DOCUMENTARY", href: "/work/videography/documentary" },
          { label: "NARRATIVE", href: "/work/videography/narrative" },
        ],
      },
      {
        label: "CAMPAIGNS",
        href: "/work/campaigns",
        children: [
          { label: "DEUTSCH", href: "/work/campaigns/deutsch" },
          { label: "WEISSMAN", href: "/work/campaigns/weissman" },
          { label: "THE EYE GALLERY", href: "/work/campaigns/eye-gallery" },
          { label: "THE MONARCH SCHOOL", href: "/work/campaigns/monarch-school" },
        ],
      },
    ],
  },
  { label: "WHAT WE DO", href: "/services" },
  { label: "THE STUDIO", href: "/studio" },
  { label: "CONTACT", href: "/contact" },
  {
    label: "STORYTIME",
    href: "/storytime",
    children: [
      { label: "STORYTIME", href: "/storytime" },
      { label: "PRESS", href: "/press" },
    ],
  },
];

// Photography portfolio categories
export const photographyCategories = [
  { id: "retail", name: "RETAIL", href: "/work/photography/retail" },
  { id: "the-arts", name: "THE ARTS", href: "/work/photography/the-arts" },
  { id: "fashion", name: "FASHION", href: "/work/photography/fashion" },
  { id: "industrial", name: "INDUSTRIAL", href: "/work/photography/industrial" },
];

// Videography portfolio categories
export const videographyCategories = [
  { id: "retail", name: "RETAIL", href: "/work/videography/retail" },
  { id: "the-arts", name: "THE ARTS", href: "/work/videography/the-arts" },
  { id: "industrial", name: "INDUSTRIAL", href: "/work/videography/industrial" },
  { id: "documentary", name: "DOCUMENTARY", href: "/work/videography/documentary" },
  { id: "narrative", name: "NARRATIVE", href: "/work/videography/narrative" },
];

// Campaigns (Case Studies)
export const campaigns = [
  { id: "deutsch", name: "DEUTSCH", href: "/work/campaigns/deutsch" },
  { id: "weissman", name: "WEISSMAN", href: "/work/campaigns/weissman" },
  { id: "eye-gallery", name: "THE EYE GALLERY", href: "/work/campaigns/eye-gallery" },
  { id: "monarch-school", name: "THE MONARCH SCHOOL", href: "/work/campaigns/monarch-school" },
];
