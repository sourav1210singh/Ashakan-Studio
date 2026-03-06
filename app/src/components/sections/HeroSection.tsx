import { ChevronDown } from "lucide-react";

/* ------------------------------------------------------------------ */
/*  InlineCutout — image embedded INSIDE the text flow                 */
/* ------------------------------------------------------------------ */
interface InlineCutoutProps {
  src: string;
  alt: string;
  className?: string;
  width: string;
  height: string;
  driftName: string;
  enterDelay: number;
  style?: React.CSSProperties;
}

function InlineCutout({
  src,
  alt,
  className = "",
  width,
  height,
  driftName,
  enterDelay,
  style = {},
}: InlineCutoutProps) {
  return (
    <span
      className={`inline-block align-bottom pointer-events-none select-none ${className}`}
      style={{
        width,
        height,
        animation: `cutoutFadeIn 0.7s ease-out ${enterDelay}s forwards, ${driftName} 8s ease-in-out ${enterDelay + 0.7}s infinite`,
        willChange: "transform, opacity",
        opacity: 0,
        position: "relative",
        ...style,
      }}
    >
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-contain"
        style={{
          filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.06))",
        }}
      />
    </span>
  );
}

/* ------------------------------------------------------------------ */
/*  Hero Section — Word-Integrated Cutout Composition                  */
/*                                                                     */
/*    [dancer] WE CREATE                                               */
/*    VISUAL [cameraman] STORIES                                       */
/*    THAT INSPIRE [portrait]                                          */
/* ------------------------------------------------------------------ */
export function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center bg-cream overflow-hidden pt-16">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #1A1A1A 1px, transparent 0)`,
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <div className="relative z-10 w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 py-4 sm:py-8">

        {/* ============================================================ */}
        {/*  TEXT + INLINE CUTOUTS — tight composition                    */}
        {/* ============================================================ */}
        <div className="text-center">

          {/* ---- LINE 1: [dancer] WE CREATE ---- */}
          <div
            className="mb-2 lg:mb-4"
            style={{
              opacity: 0,
              animation: "fadeInUp 0.8s ease-out 0.3s forwards",
            }}
          >
            {/* Dancer — medium-large, aligned with text baseline */}
            <InlineCutout
              src="/images/hero/dance-cutout.png"
              alt="Dance photography"
              className="hidden md:inline-block"
              width="clamp(100px, 11.5vw, 180px)"
              height="clamp(80px, 9.5vw, 145px)"
              driftName="driftA"
              enterDelay={0.6}
              style={{ marginRight: "4px", marginTop: "-25px", top: "6px" }}
            />
            <span className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-[88px] xl:text-[110px] text-dark leading-none tracking-tight">
              WE CREATE
            </span>
          </div>

          {/* ---- LINE 2: VISUAL [cameraman] STORIES ---- */}
          <div
            className="mb-2 lg:mb-4"
            style={{
              opacity: 0,
              animation: "fadeInUp 0.8s ease-out 0.4s forwards",
            }}
          >
            <span className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-[88px] xl:text-[110px] text-dark leading-none tracking-tight">
              VISUAL
            </span>
            {/* Cameraman — medium, tall silhouette between words */}
            <InlineCutout
              src="/images/hero/cameraman-cutout.png"
              alt="Video production"
              className="hidden md:inline-block"
              width="clamp(88px, 9.5vw, 145px)"
              height="clamp(125px, 15vw, 230px)"
              driftName="driftB"
              enterDelay={1.1}
              style={{ margin: "0 8px 0 14px", marginTop: "-100px", top: "30px" }}
            />
            <span className="md:hidden">{" "}</span>
            <span className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-[88px] xl:text-[110px] text-dark leading-none tracking-tight">
              STORIES
            </span>
          </div>

          {/* ---- LINE 3: THAT INSPIRE [portrait] ---- */}
          <div
            style={{
              opacity: 0,
              animation: "fadeInUp 0.8s ease-out 0.5s forwards",
            }}
          >
            <span className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-[88px] xl:text-[110px] text-dark leading-none tracking-tight">
              THAT{" "}
              <span className="text-emerald-700">INSPIRE</span>
            </span>
            {/* Portrait — medium-large, anchored to INSPIRE */}
            <InlineCutout
              src="/images/hero/portrait-cutout.png"
              alt="Portrait photography"
              className="hidden md:inline-block"
              width="clamp(65px, 7.5vw, 115px)"
              height="clamp(80px, 9.5vw, 145px)"
              driftName="driftC"
              enterDelay={1.5}
              style={{ marginLeft: "20px", marginTop: "-25px", top: "-2px" }}
            />
          </div>
        </div>

        {/* Subtext */}
        <p
          className="font-sans max-w-2xl mx-auto text-center mt-6 sm:mt-10 text-sm sm:text-base lg:text-lg text-dark/70 leading-relaxed relative z-30"
          style={{
            opacity: 0,
            animation: "fadeInUp 0.6s ease-out 0.9s forwards",
          }}
        >
          Ashkan Studios is a Houston-based production company specializing in
          commercial photography, videography, and creative direction. We partner
          with brands to craft visually compelling narratives that capture
          attention and drive measurable impact.
        </p>

        {/* Scroll Indicator */}
        <div
          className="flex flex-col items-center mt-8 sm:mt-12 relative z-30"
          style={{
            opacity: 0,
            animation: "fadeIn 0.6s ease-out 1.2s forwards",
          }}
        >
          <span className="font-sans text-xs sm:text-sm font-medium tracking-wider text-dark/50 mb-3">
            SCROLL FOR MORE
          </span>
          <div className="animate-bounce-slow">
            <ChevronDown className="w-5 h-5 sm:w-6 sm:h-6 text-dark/50" />
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(60px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .animate-bounce-slow {
          animation: bounceSlow 2s ease-in-out infinite;
        }
        @keyframes bounceSlow {
          0%, 100% { transform: translateY(0); }
          50%      { transform: translateY(10px); }
        }
        @keyframes cutoutFadeIn {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes driftA {
          0%, 100% { transform: translateY(0);   }
          50%      { transform: translateY(-6px); }
        }
        @keyframes driftB {
          0%, 100% { transform: translateY(0);   }
          50%      { transform: translateY(5px);  }
        }
        @keyframes driftC {
          0%, 100% { transform: translateY(0);   }
          40%      { transform: translateY(-5px); }
          80%      { transform: translateY(3px);  }
        }
      `}</style>
    </section>
  );
}
