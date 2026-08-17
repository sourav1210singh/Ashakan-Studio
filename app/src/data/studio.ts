/**
 * The studio's real name, address and phone - the NAP that has to match
 * everywhere Google reads it: the footer, the Google Business Profile,
 * and the LocalBusiness JSON-LD on the SEO landing pages.
 *
 * Kept in one place so schema markup can never drift from what the
 * footer shows a visitor. These values mirror Footer.tsx and the
 * "Ashkan Studios" GBP listing (renamed from Ashkan Media, 7/29).
 */
export const SITE = "https://ashkanstudios.com";

export const STUDIO = {
  name: "Ashkan Studios",
  street: "1502 Sawyer St #108",
  city: "Houston",
  region: "TX",
  postalCode: "77007",
  phone: "+1-346-335-7973",
  email: "info@ashkanstudios.com",
} as const;
