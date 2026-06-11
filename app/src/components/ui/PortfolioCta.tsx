import { ArrowRight } from "lucide-react";
import { FadeIn } from "@/components/animations/FadeIn";

/* ════════════════════════════════════════════════════════════════════
   PortfolioCta - call-to-action band shown at the bottom of the dark
   portfolio pages (Photography / Videography / Campaigns listings and
   their category views), above the footer.

   Added per Ashkan's 6/10 Discord note: "we need CTA on portfolio
   pages?" - mirrors the Get-in-Touch pattern Brandi approved for the
   home CampaignSection ("leads to the contact page, whatever works
   best wording wise for SEO"), styled for dark backgrounds (outlined
   white button, hover invert - same as FULL-SERVICE's Let's Create).
   ════════════════════════════════════════════════════════════════════ */

interface PortfolioCtaProps {
  /** SEO-friendly one-liner shown above the button */
  text: string;
  /** Navigate to the contact page */
  onContactClick: () => void;
}

export function PortfolioCta({ text, onContactClick }: PortfolioCtaProps) {
  return (
    <section className="pb-20 sm:pb-28">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">
        <FadeIn>
          <div className="border-t border-white/10 pt-14 sm:pt-16 text-center">
            <p className="text-base sm:text-lg lg:text-xl text-white/70 max-w-2xl mx-auto mb-8 text-balance">
              {text}
            </p>
            <button
              type="button"
              onClick={onContactClick}
              className="group inline-flex items-center gap-3 sm:gap-4 px-7 sm:px-9 py-3.5 sm:py-4 border border-white text-white font-semibold tracking-[0.3em] text-xs sm:text-sm uppercase hover:bg-white hover:text-dark transition-colors duration-300 cursor-pointer"
            >
              Get in Touch
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
