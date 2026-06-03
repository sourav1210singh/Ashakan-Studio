import { HeroSection } from "@/components/sections/HeroSection";
import { VideoBannerSection } from "@/components/sections/VideoBannerSection";
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
 * Home page - promoted from /test/work-split/ on 2026-05-07 after Brandi
 * approved the new layout in her May 5 feedback.
 *
 * Section order (LensIntroSection was removed 2026-05-08 per Brandi's
 * second-round notes - page now starts directly with the hero):
 *   1. HeroSection              "WE CREATE VISUAL STORIES" + video-in-text on STORIES only
 *   2. CampaignSection          THE CAMPAIGN on cream background with leaf cards
 *   3. WorkCategoriesSection    THE WORK - expanding accordion bands on dark
 *   4. FriendsMarqueeSection    OUR FRIENDS - magnetic marquee of client logos
 *   5. FullServiceHybridSection FULL-SERVICE PRODUCTION - editorial + hover swap
 *   6. AboutSection             Houston / 2 Departments
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
        <HeroSection />
        <VideoBannerSection />
        <CampaignSection
          onProjectClick={(slug) => onNavigate("campaigns", slug)}
        />
        <WorkCategoriesSection />
        <FriendsMarqueeSection />
        <FullServiceHybridSection />
        <AboutSection />
      </main>
      <Footer onLogoClick={() => onNavigate("home")} />
    </>
  );
}
