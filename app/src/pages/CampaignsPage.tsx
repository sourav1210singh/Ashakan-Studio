import { ArrowLeft } from "lucide-react";
import { FadeIn } from "@/components/animations/FadeIn";
import { Footer } from "@/components/layout/Footer";
import { campaigns } from "@/data/navigation";
import { getProjectById } from "@/data/projects";
import type { View } from "@/App";

interface CampaignsPageProps {
  onNavigate: (view: View, slug?: string) => void;
}

export function CampaignsPage({ onNavigate }: CampaignsPageProps) {
  const campaignData = campaigns.map(c => {
    const project = getProjectById(c.id);
    return {
      ...c,
      image: project?.heroImage || "/images/portfolio/placeholder.jpg",
      description: project?.description || "",
    };
  });

  return (
    <>
      <main className="pt-20">
        {/* Header */}
        <section className="py-12 sm:py-16 bg-cream border-b border-dark/10">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">
            <FadeIn>
              <button
                onClick={() => onNavigate("work")}
                className="group flex items-center gap-3 mb-8"
              >
                <div className="w-10 h-10 rounded-full border border-dark flex items-center justify-center group-hover:bg-dark group-hover:text-white transition-colors">
                  <ArrowLeft className="w-4 h-4" />
                </div>
                <span className="text-sm font-medium tracking-wider text-dark">BACK TO WORK</span>
              </button>
              <h1 className="font-display text-5xl sm:text-7xl lg:text-8xl text-dark tracking-tight">
                CAMPAIGNS
              </h1>
              <p className="text-lg sm:text-xl text-dark/70 max-w-2xl mt-6">
                Full-scale production campaigns that combine photography, videography, 
                and creative direction to tell complete brand stories.
              </p>
            </FadeIn>
          </div>
        </section>

        {/* Campaigns Grid */}
        <section className="py-16 sm:py-24">
          <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
              {campaignData.map((campaign, index) => (
                <FadeIn key={campaign.id} delay={index * 0.15}>
                  <button
                    onClick={() => onNavigate("portfolio", campaign.id)}
                    className="group block relative overflow-hidden rounded-2xl sm:rounded-3xl w-full text-left"
                  >
                    <div className="relative overflow-hidden aspect-[16/10]">
                      <img
                        src={campaign.image}
                        alt={campaign.name}
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-dark/80 via-dark/20 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
                        <p className="text-xs sm:text-sm font-medium tracking-wider text-white/60 mb-2">
                          CASE STUDY
                        </p>
                        <h3 className="font-display text-3xl sm:text-4xl lg:text-5xl text-white tracking-tight">
                          {campaign.name}
                        </h3>
                      </div>
                    </div>
                  </button>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer onLogoClick={() => onNavigate("home")} />
    </>
  );
}
