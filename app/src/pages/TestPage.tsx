import { Footer } from "@/components/layout/Footer";
import type { View } from "@/App";
import { TestWorkSplitVariant } from "@/components/test/TestWorkSplitVariant";

interface TestPageProps {
  variantSlug: string;
  onNavigate: (view: View, slug?: string) => void;
}

/**
 * Renders the specific test variant matching the URL slug. Each variant
 * lives in its own component under components/test/ and gets a Header,
 * a back-to-index banner, and a Footer wrapped around it here.
 */
export function TestPage({ variantSlug, onNavigate }: TestPageProps) {
  const renderVariant = () => {
    switch (variantSlug) {
      case "work-split":
        return (
          <TestWorkSplitVariant
            onProjectClick={(slug) => onNavigate("campaigns", slug)}
          />
        );
      default:
        return (
          <div className="py-32 text-center">
            <p className="text-lg text-white/60">
              Test variant not found:{" "}
              <span className="font-mono">{variantSlug}</span>
            </p>
            <button
              onClick={() => onNavigate("test")}
              className="mt-6 text-sm font-semibold tracking-[0.3em] text-white hover:text-white/70 uppercase"
            >
              ← Back to Test Index
            </button>
          </div>
        );
    }
  };

  return (
    <>
      {/* Banner removed - client should see the page exactly as the
          new home page would feel. To return to the test index, use
          the URL bar (/test/) or the regular Header navigation. */}

      <main className="bg-cream min-h-screen">
        {/* No outer FadeIn - internal sections handle their own reveal
            animations. Wrapping a very tall variant in FadeIn caused the
            IntersectionObserver threshold (0.1 + rootMargin -100px) to
            never fire on long pages, leaving everything stuck at opacity 0. */}
        {renderVariant()}
      </main>
      <Footer onLogoClick={() => onNavigate("home")} />
    </>
  );
}
