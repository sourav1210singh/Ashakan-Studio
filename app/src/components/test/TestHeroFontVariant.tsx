/**
 * TEST VARIANT - hero-font (FONT IDENTITY lab)
 *
 * The earlier rounds matched weight + width but the user reports the
 * GLYPH SHAPES differ (e.g. the "C"). That means the reference is likely
 * a different typeface than the Inter we render. This lab puts candidate
 * fonts side by side at natural width (no squeeze, so glyphs are NOT
 * distorted) so we can identify which font's letterforms actually match
 * the reference. No cutouts / no video so it renders instantly.
 */

type Candidate = {
  label: string;
  fontFamily: string;
  weight: number;
};

// Fonts already loaded by the app (index.css Google Fonts import):
//   Inter (100-900), Montserrat (100-300), Bebas Neue, Anton.
const CANDIDATES: Candidate[] = [
  { label: "1 · INTER · Thin 100", fontFamily: "Inter", weight: 100 },
  { label: "2 · MONTSERRAT · Thin 100", fontFamily: "Montserrat", weight: 100 },
  { label: "3 · INTER · ExtraLight 200", fontFamily: "Inter", weight: 200 },
  { label: "4 · MONTSERRAT · ExtraLight 200", fontFamily: "Montserrat", weight: 200 },
  { label: "5 · HELVETICA NEUE · Thin", fontFamily: "'Helvetica Neue', Arial", weight: 200 },
];

function Row({ c }: { c: Candidate }) {
  return (
    <div className="border-b border-dark/10 py-6">
      <p className="text-[11px] font-mono tracking-wider text-dark/45 mb-2 px-6">{c.label}</p>
      <div className="px-6 overflow-hidden">
        <span
          className="uppercase inline-block leading-[0.9]"
          style={{
            fontFamily: c.fontFamily,
            fontWeight: c.weight,
            letterSpacing: "0.02em",
            color: "#1A1A1A",
            fontSize: "clamp(44px, 10vw, 130px)",
          }}
        >
          WE CREATE
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
          Font identity lab — which one&apos;s &quot;C&quot; matches?
        </p>
        <p className="text-sm text-dark/50 px-6 mb-8 max-w-2xl">
          Natural width (no squeeze) so the letter shapes are honest.
          Compare each row&apos;s C / E / A / R / G to your reference and
          tell us the row number. Width/weight we tune after the font is right.
        </p>
        {CANDIDATES.map((c) => (
          <Row key={c.label} c={c} />
        ))}
      </div>
    </section>
  );
}
