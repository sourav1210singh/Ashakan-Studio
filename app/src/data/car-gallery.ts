/**
 * Car album - ashkanstudios.com ki apni automotive gallery.
 *
 * Ashkan ne 9/18 ko kaha tha: "there is 1-2 image on each please add the
 * whole album like the example page". Wo ashkanmedia.com/car-photography-houston/
 * ke 21-image showcase ki baat kar raha tha. Ye wahi album hai.
 *
 * Zyadatar shots repo ki 2400px master copies se aaye hain - ashkanmedia
 * par wahi images sirf 1229px par hain, to hamari quality behtar hai.
 * Sirf jo repo me nahi thi wo unke page se li gayi hain.
 *
 * w/h har image pe isliye hain ki masonry me browser jagah pehle se
 * reserve kar le - warna images load hote hi layout kood-ta hai (CLS).
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
  { src: "/images/seo/car-gallery/car-ferrari-sf90-949.jpg", w: 1400, h: 934, alt: "Ferrari SF90 low angle, luxury car photography Houston" },
  { src: "/images/seo/car-gallery/car-clenet-519.jpg", w: 934, h: 1400, alt: "Clenet classic car detail, studio lighting on chrome and paintwork" },
  { src: "/images/seo/car-gallery/car-mustang-111.jpg", w: 1400, h: 934, alt: "Ford Mustang GT front end, cinematic garage lighting" },
  { src: "/images/seo/car-gallery/car-ferrari-296gtb-137.jpg", w: 934, h: 1400, alt: "Ferrari 296 GTB vertical composition, Houston studio" },
  { src: "/images/seo/car-gallery/car-cadillac-ct4-581.jpg", w: 1400, h: 934, alt: "Cadillac CT4 on location in Houston, Texas" },
  { src: "/images/seo/car-gallery/car-ferrari-sf90-895.jpg", w: 934, h: 1400, alt: "Ferrari SF90 photographed for a Houston dealership campaign" },
  { src: "/images/seo/car-gallery/car-clenet-507.jpg", w: 1229, h: 820, alt: "Clenet convertible interior with wood steering wheel and tan leather" },
  { src: "/images/seo/car-gallery/car-ferrari-296gtb-121.jpg", w: 1400, h: 934, alt: "Ferrari 296 GTB profile, Ashkan Studios automotive shoot" },
  { src: "/images/seo/car-gallery/car-clenet-500.jpg", w: 934, h: 1400, alt: "Classic Clenet convertible photographed in the Ashkan Studios Houston studio" },
  { src: "/images/seo/car-gallery/car-mustang-218.jpg", w: 1400, h: 934, alt: "Ford Mustang GT detail, classic American muscle car shoot" },
  { src: "/images/seo/car-gallery/car-cadillac-ct4-572.jpg", w: 1229, h: 820, alt: "Cadillac CT4 front grille detail shot" },
  { src: "/images/seo/car-gallery/car-mustang-095.jpg", w: 1400, h: 934, alt: "Ford Mustang GT in an auto shop, Houston automotive photography" },
];

/* Ashkan ne dono pages pe album maanga tha ("1-2 image on each"), aur
   automotive video page ko iski zyada zaroorat hai - uske paas abhi
   sirf EK hi car video hai (1968 Mustang GT), to bharne ke liye images
   hi bachti hain.

   Dono pages pe album intro ke turant baad aata hai. Video page ka
   Mustang video ek content section ke andar baitha hai, page ke beech
   me - album ko usse neeche daalne ka matlab hota album ko text ke
   neeche dabana, jo Ashkan ki shikayat ka ulta hai. */
export const CAR_GALLERY_SLUGS = new Set([
  "car-photography-houston",
  "automotive-video-production-houston",
]);

// Album ki baaki images abhi baaki hain - ashkanmedia se download Chrome
// ne block kar diya tha. Aate hi yahan add karni hain:
  //   CT4-571
  //   296GTB-082
  //   296GTB-122
  //   SF90-900
  //   SF90-979
  //   4Q7A1052-03
  //   IMG_7604
