/**
 * TEST VARIANT - hero-font (letter-match lab)
 *
 * Lightweight, video-free page used to match the Inter "WE CREATE" /
 * "THAT" letterforms to Brandi's reference exactly. Each candidate row
 * shows a different weight + tracking + horizontal-scale combo so we can
 * eyeball the glyph shapes against the reference and lock the winner.
 * No cutouts / no Vimeo here so it renders (and screenshots) instantly.
 */

type Candidate = {
  label: string;
  weight: number;
  letterSpacing: string;
  scaleX: number;
};

const CANDIDATES: Candidate[] = [
  { label: "A · Thin 100 · ls 0.04 · natural", weight: 100, letterSpacing: "0.04em", scaleX: 1 },
  { label: "B · Thin 100 · ls 0.02 · natural", weight: 100, letterSpacing: "0.02em", scaleX: 1 },
  { label: "C · Thin 100 · ls 0.00 · natural", weight: 100, letterSpacing: "0em", scaleX: 1 },
  { label: "D · Thin 100 · ls 0.06 · natural", weight: 100, letterSpacing: "0.06em", scaleX: 1 },
  { label: "E · ExtraLight 200 · ls 0.02 · natural", weight: 200, letterSpacing: "0.02em", scaleX: 1 },
];

function Row({ c }: { c: Candidate }) {
  return (
    <div className="border-b border-dark/10 py-6">
      <p className="text-[11px] font-mono tracking-wider text-dark/45 mb-2 px-6">{c.label}</p>
      <div className="px-6 overflow-hidden">
        <span
          className="font-sans uppercase inline-block leading-[0.9]"
          style={{
            fontWeight: c.weight,
            letterSpacing: c.letterSpacing,
            transform: `scaleX(${c.scaleX})`,
            transformOrigin: "left center",
            color: "#1A1A1A",
            fontSize: "clamp(40px, 9vw, 120px)",
          }}
        >
          WE CREATE THAT
        </span>
      </div>
    </div>
  );
}

export function TestHeroFontVariant() {
  return (
    <section className="bg-cream min-h-screen pt-28 pb-24">
      <div className="max-w-[1600px] mx-auto">
        <p className="text-xs font-semibold tracking-[0.3em] text-dark/50 uppercase px-6 mb-2">
          Inter letter-match lab — WE CREATE / THAT
        </p>
        <p className="text-sm text-dark/50 px-6 mb-8 max-w-2xl">
          Same font (Inter). Each row tweaks weight + tracking so we can
          pick the exact match to your reference. Tell us the row letter.
        </p>
        {CANDIDATES.map((c) => (
          <Row key={c.label} c={c} />
        ))}
      </div>
    </section>
  );
}
