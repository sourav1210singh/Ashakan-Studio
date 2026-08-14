/**
 * Shared size for the page H1.
 *
 * The SEO sheet replaced the old one- and two-word display headings
 * ("CONTACT", "WHAT WE DO", "VIDEOGRAPHER HOUSTON") with keyword-rich
 * sentences of 35-60 characters. At the old display sizes - up to 150px -
 * those would have run over three or four lines, so the size is now
 * fluid and tuned to keep the longest of them on a single row.
 *
 * The longest heading in use is 59 characters. In Anton a string that
 * length renders about 25.2x its font-size wide, and the widest column
 * on these pages is 1320px (max-w-[1400px] minus lg:px-10), so the cap
 * works out at 1320 / 25.2 = 52px. 48px is used to leave headroom for
 * a slightly longer heading later, and 3.2vw keeps it inside narrower
 * columns on the way up. Below lg the heading wraps, as it should.
 *
 * Colour is deliberately NOT included: light pages pass text-dark, the
 * dark hero pages pass text-white.
 */
export const PAGE_H1_SIZE =
  "text-3xl sm:text-4xl lg:text-[clamp(1.75rem,3.2vw,48px)]";
