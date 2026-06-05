import { HeroSection } from "@/components/sections/HeroSection";

/**
 * TEST VARIANT - hero-font
 *
 * A copy of the live home-page hero, but with the Inter words
 * "WE CREATE" / "THAT" rendered at their NATURAL letter width
 * (interNaturalWidth) instead of the squeezed scaleX(0.7) used on the
 * live site. This is what Brandi's reference shows - real Inter Thin
 * proportions, not condensed. For client review before pushing to home.
 */
export function TestHeroFontVariant() {
  return <HeroSection interNaturalWidth />;
}
