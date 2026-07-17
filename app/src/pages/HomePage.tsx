import { lazy, Suspense } from "react";
import { HeroSection } from "@/components/sections/HeroSection";
import { VideoBannerSection } from "@/components/sections/VideoBannerSection";
import { LazySection } from "@/components/LazySection";
import { Footer } from "@/components/layout/Footer";
import type { View } from "@/App";

/* Perf (7/17): below-fold sections are code-split AND mount-on-approach
   (LazySection), so their JS neither downloads nor executes during the
   initial load - main-thread blocking (TBT) was the remaining mobile
   score ceiling. The prerenderer renders them immediately (see
   LazySection), so the static HTML still ships every section. */
const CampaignSection = lazy(() => import("@/components/sections/CampaignSection").then((m) => ({ default: m.CampaignSection })));
const WorkCategoriesSection = lazy(() => import("@/components/sections/WorkCategoriesSection").then((m) => ({ default: m.WorkCategoriesSection })));
const FriendsMarqueeSection = lazy(() => import("@/components/sections/FriendsMarqueeSection").then((m) => ({ default: m.FriendsMarqueeSection })));
const FullServiceHybridSection = lazy(() => import("@/components/sections/FullServiceHybridSection").then((m) => ({ default: m.FullServiceHybridSection })));
const AboutSection = lazy(() => import("@/components/sections/AboutSection").then((m) => ({ default: m.AboutSection })));

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
        {/* SEO H1: the visual hero renders "WE CREATE VISUAL STORIES
            THAT INSPIRE" as animated spans (not a heading tag), so the
            home page had no H1 at all. This screen-reader-only H1
            supplies it without touching the approved hero design. */}
        <h1 className="sr-only">
          Houston Video Production Company and Commercial Photography Studio
        </h1>
        {/* interNaturalWidth = WE CREATE / THAT in Oswald 200 (Brandi's
            approved banner font), replacing the old Inter + squeeze. */}
        <HeroSection interNaturalWidth />
        <VideoBannerSection />
        <Suspense fallback={null}>
          <LazySection minHeight="100vh">
            <CampaignSection
              onProjectClick={(slug) => onNavigate("campaigns", slug)}
            />
          </LazySection>
          <LazySection minHeight="150vh">
            <WorkCategoriesSection />
          </LazySection>
          <LazySection minHeight="100vh">
            <FullServiceHybridSection />
          </LazySection>
          <LazySection minHeight="40vh">
            <FriendsMarqueeSection />
          </LazySection>
          <LazySection minHeight="80vh">
            <AboutSection />
          </LazySection>
        </Suspense>
      </main>
      <Footer onLogoClick={() => onNavigate("home")} />
    </>
  );
}
