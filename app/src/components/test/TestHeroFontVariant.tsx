import { HeroSection } from "@/components/sections/HeroSection";

/**
 * TEST VARIANT - hero-font
 *
 * The live home hero, but with "WE CREATE" / "THAT" rendered in
 * OSWALD weight 240 (Brandi's final spec, Discord 6/5) instead of the
 * Inter + scaleX(0.7) squeeze. Oswald is a condensed gothic, so the
 * words are naturally tall + narrow with the correct letterforms.
 * For client review before pushing to the live home page.
 */
export function TestHeroFontVariant() {
  return <HeroSection interNaturalWidth />;
}
