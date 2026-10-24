// ────────────────────────────────────────────────────────────────
// Retail portfolio sections for /work/photography/retail/.
//
// Source: the "Retail Portfolio Section Copy" tab of the client's
// on-page SEO sheet, which Ashkan approved verbatim on 2026-10-22
// ("Retail portfolio section copy - Approved as is. Please go ahead
// and publish."). Every `description` below is that sheet's FINAL
// COPY column pasted as written, so edit the sheet first, not this
// file.
//
// The other three photography categories (fashion, the-arts,
// headshots) stay flat galleries. Retail is the only one split into
// sections, because each of its categories either has its own
// landing page to hand off to or is deliberately kept as gallery
// proof with no page behind it.
//
// Two rules the sheet attaches to this page, both load-bearing:
//
//  1. Each section lists RESERVED keywords that a landing page owns.
//     The copy here stays descriptive and never repeats a landing
//     page's H1/H2 phrasing, so the portfolio page does not compete
//     with the page it links to. CTA labels avoid the reserved
//     exact-match phrases too - the one documented exception is the
//     Food & Artisan in-text anchor, which the sheet explicitly
//     allows ("use only as the in-text link anchor").
//
//  2. HARD RULE, site-wide: never "dance photography", "dance
//     photographer" or "performance photography" anywhere on
//     ashkanstudios.com. "Performance apparel" as a plain noun is
//     fine and is what the approved copy uses.
// ────────────────────────────────────────────────────────────────

export interface RetailImage {
  src: string;
  alt: string;
}

export interface RetailSectionCta {
  label: string;
  /** Real destination path - rendered into href so crawlers see a link. */
  href: string;
  /** "seo" = one of the landing pages in seo-pages.ts, "campaign" = /work/campaigns/<slug>/. */
  kind: "seo" | "campaign";
  slug: string;
}

export interface RetailSection {
  /** Anchor id from the sheet, without the leading "#". */
  id: string;
  /** H2, exactly as the sheet names the section. */
  heading: string;
  /** FINAL COPY column, pasted as written. */
  description: string;
  images: RetailImage[];
  /** Button under the section. Omitted where the sheet says no CTA. */
  cta?: RetailSectionCta;
  /**
   * Food & Artisan only. The approved copy ends on a sentence that is
   * meant to carry an in-text link rather than a button, so the
   * renderer splits `description` on `anchor` and wraps that phrase.
   * Keeping it this way means the copy string stays verbatim.
   */
  inTextLink?: {
    anchor: string;
    href: string;
    slug: string;
  };
}

/**
 * Page intro, above all sections - row 0 of the sheet, which replaces
 * the old one-line retail blurb. It deliberately does NOT repeat the
 * page's exact-match phrase word for word; the sheet reserves that for
 * the Title and H1.
 */
export const retailIntro =
  "Product and brand photography that turns merchandise into a visual experience. From luxury cars, jewelry and activewear to artisan food and eyewear, our Houston studio builds campaign-ready imagery that strengthens brand presence and drives consumer connection. Browse the work by category below.";

export const retailSections: RetailSection[] = [
  {
    id: "luxury-car-brands",
    heading: "Luxury Car Brands",
    description:
      "Ferrari, Cadillac and classic Clenet builds, shot in our Sawyer Yards studio and on location across Texas. Full-vehicle stance frames, cabin interiors and badge-level detail, each panel lit for clean reflections so the paint and lines read as sharply on a listing as they do in print.",
    /* The sheet names seven frames and then asks for "4-6 new frames
       (client pulling additional car frames)". Those have not arrived,
       but two unused Ferrari SF90 frames were already in the repo, so
       the section ships with nine. Three Ford Mustang frames are also
       sitting in /images/categories/retail/ and are deliberately left
       out: the approved copy names Ferrari, Cadillac and Clenet, and
       the sheet's guardrail says this section must "name the actual
       marques shot". Adding the Mustangs needs a copy change first. */
    images: [
      { src: "/images/categories/retail/296gtb-070.jpg", alt: "Ferrari 296 GTB exterior - luxury car brand photography by Ashkan Studios" },
      { src: "/images/categories/retail/296gtb-121.jpg", alt: "Ferrari 296 GTB badge detail - luxury car brand photography by Ashkan Studios" },
      { src: "/images/categories/retail/296gtb-137.jpg", alt: "Ferrari 296 GTB cabin interior - luxury car brand photography by Ashkan Studios" },
      { src: "/images/categories/retail/sf90-895.jpg", alt: "Ferrari SF90 full-vehicle stance frame - luxury car brand photography by Ashkan Studios" },
      { src: "/images/categories/retail/sf90-949.jpg", alt: "Ferrari SF90 panel and paint detail - luxury car brand photography by Ashkan Studios" },
      { src: "/images/categories/retail/ct4-581.jpg", alt: "Cadillac CT4 cabin interior - luxury car brand photography by Ashkan Studios" },
      { src: "/images/categories/retail/clenet-500.jpg", alt: "Classic Clenet exterior - luxury car brand photography by Ashkan Studios" },
      { src: "/images/categories/retail/clenet-505.jpg", alt: "Classic Clenet chrome detail - luxury car brand photography by Ashkan Studios" },
      { src: "/images/categories/retail/clenet-519.jpg", alt: "Clenet heritage build on location in Texas - luxury car brand photography by Ashkan Studios" },
    ],
    /* Label avoids the reserved exact-match phrase "car photography
       Houston" - the landing page owns that, and this section is not
       allowed to compete for it. */
    cta: {
      label: "See our car photography services",
      href: "/car-photography-houston/",
      kind: "seo",
      slug: "car-photography-houston",
    },
  },
  {
    id: "food-artisan",
    heading: "Food & Artisan",
    description:
      "Artisan chocolates, confections and craft food brands, photographed for packaging and campaign use. Controlled studio light, texture-led styling and motion frames that catch the moment a caramel pours, built so flavor reads on screen long before a customer tastes it. For packaged and artisan food, work with our product photographer in Houston.",
    images: [
      { src: "/images/categories/retail/retail-60.jpg", alt: "Artisan chocolate gift box - food and artisan product photography by Ashkan Studios" },
      { src: "/images/categories/retail/retail-59.jpg", alt: "Artisan strawberry chocolate - food and artisan product photography by Ashkan Studios" },
      { src: "/images/categories/retail/retail-61.jpg", alt: "Artisan chocolate collection - food and artisan product photography by Ashkan Studios" },
      { src: "/images/categories/retail/retail-71.jpg", alt: "Caramel pour motion frame - food and artisan product photography by Ashkan Studios" },
      { src: "/images/categories/retail/5.jpg", alt: "Artisan confections color study - food and artisan product photography by Ashkan Studios" },
    ],
    /* Gallery section only: no CTA button, one permanent in-text link.
       The sheet points this at /product-photographer-houston/, but that
       page no longer exists - it was retired into
       /product-photographer-in-houston/ when the duplicate pair was
       merged in October 2026, which is after the sheet was approved.
       The surviving page is the only correct target. */
    inTextLink: {
      anchor: "product photographer in Houston",
      href: "/product-photographer-in-houston/",
      slug: "product-photographer-in-houston",
    },
  },
  {
    id: "eyewear",
    heading: "Eyewear",
    description:
      "Optical frames and sunglasses shot with reflection-controlled lighting: seamless studio sets, three-quarter hero angles and on-model editorial, including campaign work for Eye Gallery. Color-true files that hold up at full zoom across ecommerce listings, print catalogs and paid social.",
    /* Gallery section only - no landing page will be built, so there is
       no CTA and no link, and the copy stays descriptive with no
       eyewear keyword targeting. Selects are existing Eye Gallery
       campaign frames; the client's own eyewear image request is on
       hold and none were needed. */
    images: [
      { src: "/images/categories/retail/retail-4.jpg", alt: "Optical frames on model - eyewear photography by Ashkan Studios" },
      { src: "/images/campaigns/eye-gallery/eye-gallery-04.jpg", alt: "Designer eyewear frames on seamless - Eye Gallery campaign by Ashkan Studios" },
      { src: "/images/campaigns/eye-gallery/eye-gallery-02.jpg", alt: "JMM acetate frames - Eye Gallery campaign by Ashkan Studios" },
      { src: "/images/campaigns/eye-gallery/eye-gallery-16.jpg", alt: "Frame lineup on seamless - Eye Gallery campaign by Ashkan Studios" },
      { src: "/images/campaigns/eye-gallery/eye-gallery-11.jpg", alt: "Sunglasses close-up with controlled reflections - Eye Gallery campaign by Ashkan Studios" },
      { src: "/images/campaigns/eye-gallery/eye-gallery-03.jpg", alt: "Designer frame feature - Eye Gallery campaign by Ashkan Studios" },
      { src: "/images/campaigns/eye-gallery/eye-gallery-08.jpg", alt: "Eyewear editorial detail - Eye Gallery campaign by Ashkan Studios" },
    ],
  },
  {
    id: "jewelry-accessories",
    heading: "Jewelry & Accessories",
    description:
      "Fine jewelry and leather goods, from macro detail on stones, metal finishes and stitching through to styled lifestyle sets. Handbags, watches and everyday accessories captured with color accuracy that survives retouch, resize and a full-screen zoom.",
    /* Thinnest section on the page: the sheet asks for "5-7 new frames"
       on top of these two and the client has not sent them yet. Shipped
       with what exists on the client's instruction (2026-10-24) rather
       than holding the whole page. */
    images: [
      { src: "/images/categories/retail/retail-74.jpg", alt: "Diamond and emerald stack with gold bracelet - jewelry and accessories photography by Ashkan Studios" },
      { src: "/images/categories/retail/retail-10.jpg", alt: "Red designer handbag on red seamless - jewelry and accessories photography by Ashkan Studios" },
    ],
    /* "jewelry photography Houston" and "jewelry lifestyle photography"
       are reserved for the landing page, so the label stays off both. */
    cta: {
      label: "See our jewelry photography services",
      href: "/jewelry-photography-houston/",
      kind: "seo",
      slug: "jewelry-photography-houston",
    },
  },
  {
    id: "activewear-apparel",
    heading: "Activewear and Apparel",
    description:
      "Activewear, performance apparel and swimwear shot in studio and on location, on model and on form. Fabric stretch, construction detail and movement-ready sets, plus dancewear apparel for seasonal collections. Our work for Elastique Athletics and Weissman shows the range, from single-SKU packshots to campaign-ready sets.",
    /* Renamed from "Dancewear & Apparel" per the client, 22 Sep. The
       apparel keywords moved to the planned Activewear & Performance
       Apparel landing page, so this block is descriptive only: plain
       nouns, never the "... photography" or "... photoshoot" phrases.
       Elastique Athletics selects are still with the client, so the
       section ships with the four named retail frames plus existing
       Weissman campaign selects. */
    images: [
      { src: "/images/categories/retail/_leah-anthoni-070.jpg", alt: "Leah Anthoni apparel on model in studio - Ashkan Studios" },
      { src: "/images/categories/retail/retail-36.jpg", alt: "Apparel editorial in studio - Ashkan Studios" },
      { src: "/images/categories/retail/retail-37.jpg", alt: "Apparel light study on form - Ashkan Studios" },
      { src: "/images/categories/retail/retail-89.jpg", alt: "Apparel movement frame - Ashkan Studios" },
      { src: "/images/campaigns/weissman/weissman-01.jpg", alt: "Weissman apparel construction detail - Ashkan Studios" },
      { src: "/images/campaigns/weissman/weissman-09.jpg", alt: "Weissman neutral tone in motion - Ashkan Studios" },
      { src: "/images/campaigns/weissman/weissman-11.jpg", alt: "Weissman copper and black layered look - Ashkan Studios" },
      { src: "/images/campaigns/weissman/weissman-17.jpg", alt: "Weissman high-energy motion set - Ashkan Studios" },
      { src: "/images/campaigns/weissman/weissman-21.jpg", alt: "Weissman seasonal collection full set styling - Ashkan Studios" },
    ],
    /* The sheet points this at /activewear-photography-houston/, a
       proposed slug for a page that is not built - the client has not
       approved its keyword research yet. The sheet's own instruction
       is to keep the Weissman campaign link until that page goes live
       and then swap, so that is what this is. */
    cta: {
      label: "See the Weissman campaign",
      href: "/work/campaigns/weissman/",
      kind: "campaign",
      slug: "weissman",
    },
  },
];
