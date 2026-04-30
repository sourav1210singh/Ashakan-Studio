import { HeroSection } from "@/components/sections/HeroSection";
import { LensIntroSection } from "@/components/sections/LensIntroSection";
import { PortfolioSection } from "@/components/sections/PortfolioSection";
import { ClientsSection } from "@/components/sections/ClientsSection";
import { ServicesSection } from "@/components/sections/ServicesSection";
import { AboutSection } from "@/components/sections/AboutSection";
import { Footer } from "@/components/layout/Footer";
import type { View } from "@/App";

interface HomePageProps {
  onNavigate: (view: View, slug?: string) => void;
}

export function HomePage({ onNavigate }: HomePageProps) {
  return (
    <>
      <main>
        <LensIntroSection />
        <HeroSection />
        <PortfolioSection onProjectClick={(slug) => onNavigate("campaigns", slug)} onSeeMoreClick={() => onNavigate("work")} />
        <ClientsSection />
        <ServicesSection onNavigate={onNavigate} />
        <AboutSection />
      </main>
      <Footer onLogoClick={() => onNavigate("home")} />
    </>
  );
}
