/**
 * Car album - ashkanstudios.com's own automotive gallery.
 *
 * Ashkan on 9/18: "there is 1-2 image on each please add the whole album
 * like the example page". He meant the 21-image showcase on
 * ashkanmedia.com/car-photography-houston/. This is that album.
 *
 * Most shots come from the repo's 2400px masters - ashkanmedia serves the
 * same images at only 1229px, so ours are the better copies. Sourav
 * supplied the rest on 9/19.
 *
 * Every image carries w/h so the browser can reserve the space up front in
 * the masonry layout - without it the page jumps as the images load (CLS).
 */
export interface CarGalleryImage {
  src: string;
  alt: string;
  w: number;
  h: number;
}

export const carGalleryImages: CarGalleryImage[] = [
  { src: "/images/seo/car-gallery/car-ferrari-296gtb-070.jpg", w: 934, h: 1400, alt: "Ferrari 296 GTB full body shot, commercial car photography Houston" },
  { src: "/images/seo/car-gallery/car-clenet-505.jpg", w: 1400, h: 934, alt: "Clenet roadster side profile, Houston car photography" },
  { src: "/images/seo/car-gallery/car-mustang-111.jpg", w: 1400, h: 934, alt: "Ford Mustang GT front end, cinematic garage lighting" },
  { src: "/images/seo/car-gallery/car-cadillac-ct4-581.jpg", w: 1400, h: 934, alt: "Cadillac CT4 on location in Houston, Texas" },
  { src: "/images/seo/car-gallery/car-clenet-519.jpg", w: 934, h: 1400, alt: "Clenet classic car detail, studio lighting on chrome and paintwork" },
  { src: "/images/seo/car-gallery/car-ferrari-sf90-949.jpg", w: 1400, h: 934, alt: "Ferrari SF90 low angle, luxury car photography Houston" },
  { src: "/images/seo/car-gallery/car-cadillac-ct4-571.jpg", w: 1229, h: 820, alt: "Cadillac CT4 three-quarter view, Houston automotive photography" },
  { src: "/images/seo/car-gallery/car-ferrari-296gtb-121.jpg", w: 1400, h: 934, alt: "Ferrari 296 GTB profile, Ashkan Studios automotive shoot" },
  { src: "/images/seo/car-gallery/car-ferrari-sf90-895.jpg", w: 934, h: 1400, alt: "Ferrari SF90 photographed for a Houston dealership campaign" },
  { src: "/images/seo/car-gallery/car-mustang-218.jpg", w: 1400, h: 934, alt: "Ford Mustang GT detail, classic American muscle car shoot" },
  { src: "/images/seo/car-gallery/car-clenet-507.jpg", w: 1229, h: 820, alt: "Clenet convertible interior with wood steering wheel and tan leather" },
  { src: "/images/seo/car-gallery/car-ferrari-296gtb-082.jpg", w: 1229, h: 820, alt: "Ferrari 296 GTB rear three-quarter with studio lighting" },
  { src: "/images/seo/car-gallery/car-ferrari-296gtb-137.jpg", w: 934, h: 1400, alt: "Ferrari 296 GTB vertical composition, Houston studio" },
  { src: "/images/seo/car-gallery/car-detail-4q7a1052.jpg", w: 1229, h: 820, alt: "Automotive detail shot from an Ashkan Studios car shoot in Houston" },
  { src: "/images/seo/car-gallery/car-cadillac-ct4-572.jpg", w: 1229, h: 820, alt: "Cadillac CT4 front grille detail shot" },
  { src: "/images/seo/car-gallery/car-ferrari-sf90-900.jpg", w: 1229, h: 820, alt: "Ferrari SF90 body line and paint detail" },
  { src: "/images/seo/car-gallery/car-clenet-500.jpg", w: 934, h: 1400, alt: "Classic Clenet convertible photographed in the Ashkan Studios Houston studio" },
  { src: "/images/seo/car-gallery/car-ferrari-296gtb-122.jpg", w: 1229, h: 820, alt: "Ferrari 296 GTB wheel and brake caliper detail" },
  { src: "/images/seo/car-gallery/car-on-location-7604.jpg", w: 1400, h: 792, alt: "Car photography on location in Houston, Texas" },
  { src: "/images/seo/car-gallery/car-ferrari-sf90-979.jpg", w: 820, h: 1229, alt: "Ferrari SF90 rear detail with studio reflection" },
  { src: "/images/seo/car-gallery/car-mustang-095.jpg", w: 1400, h: 934, alt: "Ford Mustang GT in an auto shop, Houston automotive photography" },
];

/* Ashkan asked for the album on both pages ("1-2 image on each"), and the
   automotive video page needs it more - it has exactly ONE car video so
   far (the 1968 Mustang GT), so images are all there is to fill it.

   On both pages the album sits straight after the intro. The video page's
   Mustang video lives inside a content section halfway down, and putting
   the album below that would bury it under the copy - the opposite of
   what Ashkan complained about. */
export const CAR_GALLERY_SLUGS = new Set([
  "car-photography-houston",
  "automotive-video-production-houston",
]);

