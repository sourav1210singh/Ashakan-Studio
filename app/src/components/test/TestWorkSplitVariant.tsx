import { HeroSection } from "@/components/sections/HeroSection";
import { AboutSection } from "@/components/sections/AboutSection";
import { CampaignSection } from "@/components/sections/CampaignSection";
import { WorkCategoriesSection } from "@/components/sections/WorkCategoriesSection";
import { FriendsMarqueeSection } from "@/components/sections/FriendsMarqueeSection";
import { FullServiceHybridSection } from "@/components/sections/FullServiceHybridSection";

/* ════════════════════════════════════════════════════════════════════
   TEST VARIANT: full new-home-page mock for client review.
   As of 2026-05-07 the new sections were promoted to the live home
   page. This variant now simply composes the same shared components
   so /test/work-split/ stays in sync with what users see on /.
   The variant is kept so future experiments can be staged here
   before they go live.
   ════════════════════════════════════════════════════════════════════ */

interface VariantProps {
  onProjectClick: (slug: string) => void;
  onSeeMoreClick?: () => void;
}

export function TestWorkSplitVariant({ onProjectClick, onSeeMoreClick }: VariantProps) {
  return (
    <>
      <HeroSection />
      <CampaignSection onProjectClick={onProjectClick} />
      <WorkCategoriesSection onSeeMoreClick={onSeeMoreClick} />
      <FriendsMarqueeSection />
      <FullServiceHybridSection />
      <AboutSection />
    </>
  );
}
