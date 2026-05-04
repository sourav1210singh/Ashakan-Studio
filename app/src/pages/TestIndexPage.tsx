import { Footer } from "@/components/layout/Footer";
import { FadeIn } from "@/components/animations/FadeIn";
import type { View } from "@/App";

interface TestIndexPageProps {
  onNavigate: (view: View, slug?: string) => void;
}

interface TestVariant {
  slug: string;
  title: string;
  description: string;
  status: "draft" | "review" | "approved";
}

/**
 * Test variants — speculative experiments that aren't on the public site yet.
 * Add new entries here as new test variants are built. The corresponding
 * TestPage component reads `selectedCategory` and renders the matching variant.
 */
const VARIANTS: TestVariant[] = [
  {
    slug: "work-split",
    title: "WORK section split into CAMPAIGN + WORK",
    description:
      'Brandi mentioned "maybe there\'s two of them, and one says campaign, one says work" — this variant splits the home page leaf-card section into two separate sections so she can decide if she likes the split.',
    status: "draft",
  },
];

export function TestIndexPage({ onNavigate }: TestIndexPageProps) {
  const statusColor = (s: TestVariant["status"]) =>
    s === "approved"
      ? "text-green-400 border-green-400/30 bg-green-400/10"
      : s === "review"
        ? "text-amber-400 border-amber-400/30 bg-amber-400/10"
        : "text-white/60 border-white/20 bg-white/5";

  return (
    <>
      <main className="pt-32 pb-24 bg-dark min-h-screen">
        <div className="max-w-[1100px] mx-auto px-6 lg:px-10">
          <FadeIn>
            <p className="text-xs font-semibold tracking-[0.3em] text-white/50 uppercase mb-6">
              Internal — Not Linked Publicly
            </p>
            <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl text-white tracking-tight mb-6">
              Test Variants
            </h1>
            <p className="text-lg text-white/60 max-w-2xl mb-16 leading-relaxed">
              Speculative experiments built before applying to the live site.
              Open a variant, share the URL with the client for feedback, then
              promote to production once approved.
            </p>
          </FadeIn>

          <div className="space-y-6">
            {VARIANTS.map((v, i) => (
              <FadeIn key={v.slug} delay={i * 0.08}>
                <button
                  onClick={() => onNavigate("test", v.slug)}
                  className="w-full text-left block bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/30 transition-all duration-300 p-8 sm:p-10 group"
                >
                  <div className="flex items-start justify-between gap-6 mb-4">
                    <h2 className="font-display text-2xl sm:text-3xl text-white tracking-tight group-hover:text-white/90">
                      {v.title}
                    </h2>
                    <span
                      className={`text-[10px] font-semibold tracking-[0.2em] uppercase px-3 py-1 rounded-full border whitespace-nowrap ${statusColor(v.status)}`}
                    >
                      {v.status}
                    </span>
                  </div>
                  <p className="text-base text-white/60 leading-relaxed mb-6">
                    {v.description}
                  </p>
                  <div className="flex items-center gap-3 text-xs font-semibold tracking-[0.3em] text-white/70 uppercase group-hover:text-white">
                    <span className="w-8 h-px bg-white/40 group-hover:bg-white transition-colors" />
                    Open Variant
                    <span className="font-mono normal-case tracking-normal text-white/40">
                      /test/{v.slug}/
                    </span>
                  </div>
                </button>
              </FadeIn>
            ))}
          </div>

          <FadeIn delay={0.3}>
            <p className="text-sm text-white/40 mt-16">
              <span className="font-semibold text-white/60">How it works:</span>{" "}
              When the client approves a variant, copy the implementation into
              the relevant production page and remove the test entry from this
              list.
            </p>
          </FadeIn>
        </div>
      </main>
      <Footer onLogoClick={() => onNavigate("home")} />
    </>
  );
}
