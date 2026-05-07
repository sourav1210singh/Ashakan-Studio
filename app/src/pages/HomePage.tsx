import { HeroSection } from "@/components/sections/HeroSection";
import { LensIntroSection } from "@/components/sections/LensIntroSection";
import { CampaignSection } from "@/components/sections/CampaignSection";
import { WorkCategoriesSection } from "@/components/sections/WorkCategoriesSection";
import { FriendsMarqueeSection } from "@/components/sections/FriendsMarqueeSection";
import { FullServiceHybridSection } from "@/components/sections/FullServiceHybridSection";
import { AboutSection } from "@/components/sections/AboutSection";
import { Footer } from "@/components/layout/Footer";
import type { View } from "@/App";

interface HomePageProps {
  onNavigate: (view: View, slug?: string) => void;
}

/**
 * Home page — promoted from /test/work-split/ on 2026-05-07 after Brandi
 * approved the new layout in her May 5 feedback.
 *
 * Section order:
 *   1. LensIntroSection         cinematic flash burst intro (unchanged)
 *   2. HeroSection              "WE CREATE VISUAL STORIES" + video-in-text (unchanged)
 *   3. CampaignSection          NEW — was the unified PortfolioSection;
 *                                now THE CAMPAIGN on cream background with leaf cards
 *   4. WorkCategoriesSection    NEW — split off as THE WORK
 *                                on dark background with photography category tiles
 *   5. FriendsMarqueeSection    NEW — was ClientsSection (static text grid);
 *                                now an infinite marquee + magnetic items
 *   6. FullServiceHybridSection NEW — was ServicesSection (static block);
 *                                now editorial layout with hover image swap
 *   7. AboutSection             Houston / 2 Departments (unchanged)
 *
 * The old PortfolioSection / ClientsSection / ServicesSection components
 * are no longer referenced from the home page. They remain in the
 * codebase for now in case Brandi wants to compare or roll back, but
 * can be removed in a future cleanup pass.
 */
export function HomePage({ onNavigate }: HomePageProps) {
  return (
    <>
      <main>
        <LensIntroSection />
        <HeroSection />
        <CampaignSection
          onProjectClick={(slug) => onNavigate("campaigns", slug)}
        />
        <WorkCategoriesSection
          onSeeMoreClick={() => onNavigate("work")}
        />
        <FriendsMarqueeSection />
        <FullServiceHybridSection />
        <AboutSection />
      </main>
      <Footer onLogoClick={() => onNavigate("home")} />
    </>
  );
}
