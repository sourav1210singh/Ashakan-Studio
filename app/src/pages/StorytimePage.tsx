import { BookOpen } from "lucide-react";
import { FadeIn } from "@/components/animations/FadeIn";
import { Footer } from "@/components/layout/Footer";
import type { View } from "@/App";

interface StorytimePageProps {
  onNavigate: (view: View, slug?: string) => void;
}

/**
 * STORYTIME page - Brandi's 5/7/26 review notes (PDF pages 78-79):
 *   • Hero intro paragraph replaced with new verbatim copy that covers
 *     studio updates, BTS, campaigns, press, and industry thoughts.
 *   • Blog content: 'This will need to change obviously from our blog
 *     input, but I think our team should handle that personally once
 *     the site is in place to be live, to be most efficient'. Until
 *     Brandi's team adds the real posts, the page renders a clean
 *     'Coming Soon' empty state instead of the previous placeholder
 *     grid (which referenced real client names with fabricated titles
 *     and dates - confusing for any visitor who lands here today).
 *
 * When the team is ready to populate, the easiest path is to replace
 * the empty state with a `posts` array + grid that mirrors the
 * pattern used elsewhere in the codebase (see VideographyPage for
 * a similar masonry-card layout). The category filter pills can be
 * reintroduced at the same time once the real categories are known.
 */
export function StorytimePage({ onNavigate }: StorytimePageProps) {
  return (
    <>
      <main className="pt-20">
        {/* ━━━ SECTION 1 - Hero ━━━
            Brandi 5/7/26 (PDF page 78) - new intro copy covers studio
            updates, BTS, campaigns, press, and industry thoughts. */}
        <section className="py-20 sm:py-32 bg-cream">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">
            <FadeIn>
              <h1 className="font-display text-6xl sm:text-8xl md:text-9xl lg:text-[120px] xl:text-[150px] text-dark tracking-tight leading-none mb-8">
                STORYTIME
              </h1>
              <p className="text-lg sm:text-xl text-dark/70 max-w-2xl">
                Studio updates, behind-the-scenes from shoots, campaign work,
                press, and thoughts from the industry.
              </p>
            </FadeIn>
          </div>
        </section>

        {/* ━━━ SECTION 2 - Coming Soon empty state ━━━
            Per Brandi's 5/7/26 note (PDF page 79), the blog is waiting
            on her team's content. Renders a clean placeholder so the
            page reads as intentionally in-progress rather than empty
            of content. The previous 12 placeholder posts (with stale
            paths and fabricated titles) have been removed.

            When real posts arrive, this section can be replaced with
            a post grid; the newsletter section below can stay as the
            recurring engagement hook. */}
        <section className="py-24 sm:py-32 border-t border-dark/10">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">
            <FadeIn>
              <div className="max-w-2xl mx-auto text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full border border-dark/20 mb-8">
                  <BookOpen className="w-7 h-7 sm:w-8 sm:h-8 text-dark/60" />
                </div>
                <p className="text-xs sm:text-sm font-semibold tracking-[0.4em] text-dark/45 uppercase mb-6">
                  Coming Soon
                </p>
                <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-dark tracking-tight leading-tight mb-6">
                  Stories in the making.
                </h2>
                <p className="text-base sm:text-lg text-dark/65 leading-relaxed">
                  We're putting together the first round of stories - campaign
                  recaps, behind-the-scenes notes, press features, and a few
                  honest takes from the industry. Subscribe below and we'll
                  let you know the moment the first piece goes live.
                </p>
              </div>
            </FadeIn>
          </div>
        </section>

        {/* ━━━ SECTION 3 - Newsletter ━━━
            Retained from the previous layout - gives visitors a way
            to stay engaged with the brand even with no posts yet. */}
        <section className="py-16 sm:py-24 bg-dark text-white border-t border-white/10">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">
            <div className="max-w-2xl mx-auto text-center">
              <FadeIn>
                <h2 className="font-display text-3xl sm:text-4xl tracking-tight mb-4">
                  STAY IN THE LOOP
                </h2>
                <p className="text-white/70 mb-8">
                  Subscribe to our newsletter for the latest stories, tips, and studio updates.
                </p>
                <form className="flex flex-col sm:flex-row gap-4">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="flex-1 px-6 py-4 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/50 focus:outline-none focus:border-white/50"
                  />
                  <button
                    type="submit"
                    className="px-8 py-4 bg-white text-dark font-medium tracking-wider text-sm"
                  >
                    SUBSCRIBE
                  </button>
                </form>
              </FadeIn>
            </div>
          </div>
        </section>
      </main>
      <Footer onLogoClick={() => onNavigate("home")} />
    </>
  );
}
