import { ArrowRight, ExternalLink } from "lucide-react";
import { FadeIn } from "@/components/animations/FadeIn";
import { Footer } from "@/components/layout/Footer";
import type { View } from "@/App";

interface PressPageProps {
  onNavigate: (view: View, slug?: string) => void;
}

/**
 * PRESS items - Brandi's 5/7/26 review notes (PDF pages 80-81).
 *
 * Replaces the four fabricated placeholder entries with the five
 * real links Brandi provided. Brandi: 'For now, please connect the
 * following links with excerpts and proper title/imagery' and 'Make
 * sure each image makes sense to the article or page given'.
 *
 * Titles + excerpts + dates were fetched directly from each source
 * page (2026-05-12). The one exception is Chasing Roots - its SSL
 * cert refused the fetch, so its title/excerpt are placeholder
 * approximations built from the URL slug and date. Easy to update
 * once Brandi or our team confirms the exact post copy.
 *
 * Image picks per Brandi's note ('Make sure each image makes sense
 * to the article'):
 *   1. Bold Journey 'Meet Ashkan Roayaee' → founder portrait.
 *   2. PhotoAwards (dancer with flowing veils, long exposure)
 *      → Vitacca Ballet shot - dance/movement match.
 *   3. YouTube 'Pas de Deux Photo Webinar' → studio interior, since
 *      the webinar is Ashkan teaching from the studio.
 *   4. Chasing Roots 'Ashkan Image' → fashion editorial - represents
 *      the Ashkan Image photography division's commercial output.
 *   5. Voyage Houston (post-Harvey Houston dance photography) →
 *      Cecilia Duarte portrait - Houston creative figure.
 */
const PRESS_ITEMS = [
  {
    id: "bold-journey",
    title: "Meet Ashkan Roayaee",
    outlet: "BOLD JOURNEY",
    date: "JAN 2025",
    excerpt:
      "A photographer and production company owner discusses navigating spaces where he was the only person of color, emphasizing how authenticity, hard work, and a strong team have been key to his success in the creative industry.",
    image: "/images/studio/team-ashkan.jpg",
    link: "https://boldjourney.com/meet-ashkan-roayaee/",
  },
  {
    id: "photoawards",
    title: "International Photography Awards Honorable Mention",
    outlet: "PHOTOAWARDS",
    date: "2023",
    excerpt:
      "A long-exposure photograph of a dancer with flowing veils, captured in the Houston studio, exploring how fabric in motion amplifies the drama and expressiveness of dance.",
    /* AI thumb replaced with a real client arts photo (Ashkan 6/11) */
    image: "/images/categories/the-arts/_abstract-1599.jpg",
    link: "https://photoawards.com/winner/zoom.php?eid=8-1722603089-25",
  },
  {
    id: "pas-de-deux-webinar",
    title: "Pas de Deux Photo Webinar with Ashkan Roayaee",
    outlet: "RON McKINNEY · YOUTUBE",
    date: "WEBINAR",
    excerpt:
      "A photography webinar featuring Ashkan Roayaee of Ashkan Image in Houston, walking through approach, technique, and creative direction behind pas de deux portraiture.",
    image: "/images/studio/studio-interior-1.jpg",
    link: "https://www.youtube.com/watch?v=lnWOMAFNDic",
  },
  {
    id: "chasing-roots",
    title: "Ashkan Image",
    outlet: "CHASING ROOTS",
    date: "JUL 2025",
    excerpt:
      "A feature on Ashkan Image, the photography division of Ashkan Studios, covering its creative practice, signature commercial work, and place within the Houston creative community.",
    image: "/images/categories/fashion/citybook-2024-633.jpg",
    link: "http://www.chasingroots.com/2025/07/ashkan-image.html",
  },
  {
    id: "voyage-houston",
    title: "Check Out Ashkan Roayaee's Artwork",
    outlet: "VOYAGE HOUSTON",
    date: "JUN 2018",
    excerpt:
      "Ashkan Roayaee discusses his journey from Iran to Houston, his mission to revive the city's creative spirit post-Hurricane Harvey through collaborative dance photography, and his vision of art as universal communication.",
    image: "/images/categories/the-arts/lauren-anderson-2490-edit.jpg",
    link: "https://voyagehouston.com/interview/check-ashkan-roayaees-artwork/",
  },
];

export function PressPage({ onNavigate }: PressPageProps) {
  return (
    <>
      <main className="pt-20">
        {/* ━━━ SECTION 1 - Hero ━━━
            Brandi 5/7/26 (PDF page 80): replace the marketing intro
            with her shorter, punchier copy that includes interviews
            and press releases as explicit categories. */}
        <section className="py-20 sm:py-32 bg-cream">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">
            <FadeIn>
              <h1 className="font-display text-6xl sm:text-8xl md:text-9xl lg:text-[120px] xl:text-[150px] text-dark tracking-tight leading-none mb-8">
                PRESS
              </h1>
              <p className="font-sans text-lg sm:text-xl text-dark/70 max-w-2xl">
                Coverage, interviews, media mentions, press releases, and
                recognition.
              </p>
            </FadeIn>
          </div>
        </section>

        {/* ━━━ SECTION 2 - Press items ━━━
            Alternating two-column rows, each row is a real anchor that
            opens the source link in a new tab. The image side flips
            sides every other row for visual rhythm. */}
        <section className="py-16 sm:py-24">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">
            <div className="space-y-16 sm:space-y-24">
              {PRESS_ITEMS.map((item, index) => (
                <FadeIn key={item.id} delay={index * 0.08}>
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12 items-center"
                  >
                    <div
                      className={`relative overflow-hidden ${
                        index % 2 === 1 ? "md:order-2" : ""
                      }`}
                    >
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-auto max-h-[500px] object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-4 mb-4 flex-wrap">
                        <span className="text-xs font-medium tracking-wider text-dark/50">
                          {item.outlet}
                        </span>
                        <span className="text-dark/30">|</span>
                        <span className="text-xs text-dark/50">
                          {item.date}
                        </span>
                      </div>
                      <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl text-dark tracking-tight mb-4 group-hover:text-dark/70 transition-colors">
                        {item.title}
                      </h2>
                      <p className="font-sans text-sm sm:text-base text-dark/60 leading-relaxed mb-6">
                        {item.excerpt}
                      </p>
                      <span className="inline-flex items-center gap-2 text-sm font-medium text-dark group-hover:gap-3 transition-all">
                        READ ARTICLE
                        <ExternalLink className="w-4 h-4" />
                      </span>
                    </div>
                  </a>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        {/* ━━━ SECTION 3 - Press Inquiries ━━━ */}
        <section className="py-16 sm:py-24 bg-dark text-white">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">
            <div className="max-w-2xl mx-auto text-center">
              <FadeIn>
                <h2 className="font-display text-3xl sm:text-4xl tracking-tight mb-4">
                  PRESS INQUIRIES
                </h2>
                <p className="font-sans text-white/70 mb-8">
                  For media inquiries, interview requests, or press kit access,
                  reach out to our communications team.
                </p>
                <button
                  onClick={() => onNavigate("contact")}
                  className="inline-flex items-center gap-2 px-8 py-4 bg-white text-dark font-medium tracking-wider text-sm hover:bg-white/90 transition-colors"
                >
                  GET IN TOUCH
                  <ArrowRight className="w-4 h-4" />
                </button>
              </FadeIn>
            </div>
          </div>
        </section>
      </main>
      <Footer onLogoClick={() => onNavigate("home")} />
    </>
  );
}
