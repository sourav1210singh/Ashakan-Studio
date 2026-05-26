import { useState } from "react";
import { ArrowRight, MapPin, Play } from "lucide-react";
import { FadeIn } from "@/components/animations/FadeIn";
import { Footer } from "@/components/layout/Footer";
import { Lightbox } from "@/components/ui/Lightbox";
import type { View } from "@/App";

interface StudioPageProps {
  onNavigate: (view: View, slug?: string) => void;
}

/* ── Team roster ─────────────────────────────────────────────────
   Per Brandi's 5/7/26 review notes (PDF pages 70-72):
   • 6 members total (was 4 - William removed, 3 new additions).
   • 'Under each pic have role/titles, then name' - card layout
     shows role first, name second.
   • Brandi's PDF spelled 'CINEMAPHOTOGRAPHER' - clearly a typo for
     CINEMATOGRAPHER. Using the corrected term.
   • Photos sourced from C:\Ashakan-Studio\Studio & Staff\ on
     2026-05-12, mapped to first 4 team members in folder order.
     Tweak filenames if Brandi confirms a different mapping. */
const TEAM = [
  {
    role: "FOUNDER / DIRECTOR / PHOTOGRAPHER",
    name: "ASHKAN ROAYAEE",
    image: "/images/studio/team-ashkan.jpg",
  },
  {
    role: "DIRECTOR / CINEMATOGRAPHER / PHOTOGRAPHER / EDITOR",
    name: "BRANDI SHALLENBERGER",
    image: "/images/studio/team-brandi.jpg",
  },
  {
    role: "CINEMATOGRAPHER / PHOTOGRAPHER / EDITOR",
    name: "CHRISTOPHER POE",
    image: "/images/studio/team-christopher.jpg",
  },
  {
    role: "PHOTOGRAPHER / EDITOR",
    name: "NISHA PRADEEP",
    image: "/images/studio/team-nisha.jpg",
  },
  {
    role: "PROJECT MANAGER",
    name: "AVERY CARLIN",
    image: "/images/studio/team-avery.jpg",
  },
  {
    role: "COMMUNICATIONS",
    name: "AMAYA HUNSBERGER",
    image: "/images/studio/team-amaya.jpg",
  },
];

/* ── Studio space bullets ────────────────────────────────────────
   Brandi's 5/7/26 verbatim list (PDF page 66). Replaces the old
   '14.5-foot ceilings / cyclorama / set wall / amenities' bullets. */
const STUDIO_BULLETS = [
  "Seamless cyc wall for clean visuals",
  "Flexible set-building space for custom scene creation",
  "Full color range of paper backdrops for campaign variety",
  "High ceilings designed for controlled, cinematic lighting setups",
  "Dedicated makeup and prep area for talent and styling",
  "Client and crew amenities to support full production days",
];

/* ── Dark process row ─────────────────────────────────────────────
   Brandi 5/7/26: 'Change this section to dark row style' + 3 new
   titles + verbatim body copy (PDF page 68). */
const PROCESS = [
  {
    step: "01",
    title: "CONSULTATION & CREATIVE DIRECTION",
    body:
      "Every project begins with understanding your goals, brand identity, and intended impact. We align on creative direction to shape a production approach tailored to the campaign.",
  },
  {
    step: "02",
    title: "PRODUCTION",
    body:
      "On set, our team manages the full production process, from lighting and direction to styling, hair and makeup, and on-location coordination. Creative decisions are guided in real time to ensure the work reflects both vision and execution.",
  },
  {
    step: "03",
    title: "POST PRODUCTION & DELIVERY",
    body:
      "All editing, color, retouching, and video finishing is handled in-house. Final assets are refined into cohesive, ready-to-use content built for digital, print, and campaign distribution.",
  },
];

/* Studio interior gallery used by the Lightbox - Brandi's 5/7/26
   note 'this image, click to get to it directly' for the studio
   space photo cluster. Includes the wide hero shot for variety. */
const STUDIO_GALLERY = [
  { src: "/images/studio/studio-interior-2.jpg", alt: "Ashkan Studios - cyclorama wall and lighting setup" },
  { src: "/images/studio/studio-wide.jpg", alt: "Ashkan Studios - wide angle of the studio floor" },
  { src: "/images/studio/studio-sample-2.jpg", alt: "Ashkan Studios - dancer in motion on teal backdrop" },
  { src: "/images/studio/studio-interior-1.jpg", alt: "Ashkan Studios - full studio interior" },
];

export function StudioPage({ onNavigate }: StudioPageProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const openLightbox = (i: number) => setLightboxIndex(i);

  return (
    <>
      <main className="pt-20">
        {/* ━━━ SECTION 1 - Hero ━━━
            Brandi 5/7/26 (PDF page 65):
            • Add 'DEDICATED CREATIVE STUDIO' subtitle under THE STUDIO H1.
            • Hero photo previously overlaid a 'BTS Film · Coming Soon'
              placeholder (play-button circle + label) while waiting on
              Brandi's BTS clip. User asked to drop that overlay on
              2026-05-12, so the hero is now a clean photo + headline.
              When the BTS clip ships, swap the <img> below for a Vimeo
              background iframe (see FullServiceHybridSection). */}
        <section className="relative h-[70vh] min-h-[500px] overflow-hidden bg-dark">
          <div className="absolute inset-0">
            <img
              src="/images/studio/studio-interior-1.jpg"
              alt="Ashkan Studios - Houston production studio interior"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-dark/55" />
          </div>

          <div className="relative z-10 h-full flex items-end pb-16 sm:pb-24">
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 w-full">
              <FadeIn>
                {/* Hero subtitle 'Dedicated Creative Studio' moved
                    out 2026-05-12 per user request - the phrase is
                    now used as the heading for THE SPACE section
                    further down the page (matches Brandi's PDF page
                    66 annotation). */}
                <h1 className="font-display text-5xl sm:text-7xl lg:text-8xl xl:text-9xl text-white tracking-tight leading-[0.95]">
                  THE STUDIO
                </h1>
              </FadeIn>
            </div>
          </div>
        </section>

        {/* ━━━ SECTION 2 - About ━━━
            Brandi 5/7/26: 'Changes here should match exactly on changes
            requested to this section on home page'. The copy below
            mirrors the home AboutSection (BASED IN HOUSTON, TX / 2
            DEPARTMENTS, 1 COMPANY) so the brand voice stays consistent
            across both pages. CTA elements from home (italic 'Curious?'
            line and ABOUT US button) are intentionally dropped here -
            visitors are already on the Studio page. */}
        <section className="py-16 sm:py-24 bg-cream">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
              <FadeIn>
                {/* '2 DEPARTMENTS, 1 COMPANY.' subtitle removed
                    2026-05-12 per user request - matches the home
                    page AboutSection which had the same subtitle
                    dropped earlier today. */}
                <h2 className="font-display text-dark tracking-tight leading-[0.95]">
                  <span className="text-4xl sm:text-5xl lg:text-6xl">
                    BASED IN
                    <br />
                    HOUSTON, TX
                  </span>
                </h2>
              </FadeIn>
              <FadeIn delay={0.1}>
                <div className="space-y-6">
                  {/* 'Ashkan Studios is the parent company of Ashkan
                      Image and Ashkan Media...' paragraph removed
                      2026-05-12 per user request - column now opens
                      with the 'Every project begins with a story'
                      paragraph below. */}
                  <p className="text-lg sm:text-xl text-dark/80 leading-relaxed">
                    Every project at Ashkan Studios begins with a story - yours. We
                    guide it from concept to completion, handling all aspects of
                    production in-house with care, precision, and intention.
                  </p>
                  <p className="text-lg sm:text-xl text-dark/80 leading-relaxed">
                    Crazy concept? Bring it. Big production? No problem. Need total
                    artistic guidance? Can't wait.
                  </p>
                </div>
              </FadeIn>
            </div>
          </div>
        </section>

        {/* ━━━ SECTION 3 - Studio Space ━━━
            Brandi 5/7/26 (PDF page 66-67):
            • Replace bullet copy with the 6 new items in STUDIO_BULLETS.
            • 'This image, click to get to it directly' → wire the studio
              photos to the lightbox so visitors can enlarge each shot. */}
        <section className="py-16 sm:py-24 border-t border-dark/10">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              <FadeIn>
                <span className="text-sm font-medium tracking-wider text-dark/40 mb-4 block">THE SPACE</span>
                {/* Heading renamed 2026-05-12 from '1,500 SQ FT / OF
                    CREATIVE / POSSIBILITY.' to 'DEDICATED CREATIVE
                    STUDIO' per Brandi's PDF page 66 annotation. */}
                <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl text-dark tracking-tight leading-[0.95] mb-8">
                  DEDICATED
                  <br />
                  <span className="text-dark/40">CREATIVE</span>
                  <br />
                  <span className="text-dark/40">STUDIO</span>
                </h2>
                <ul className="space-y-4">
                  {STUDIO_BULLETS.map((bullet) => (
                    <li key={bullet} className="flex items-start gap-4">
                      <div className="w-1 h-full min-h-[20px] bg-dark/20 rounded-full mt-1 shrink-0" />
                      <p className="text-lg text-dark/70 leading-relaxed">
                        {bullet}
                      </p>
                    </li>
                  ))}
                </ul>
              </FadeIn>
              <FadeIn delay={0.1}>
                <div className="space-y-4">
                  {/* Top photo of THE SPACE cluster - per Brandi's PDF
                      page 66 this slot is reserved for the BTS in-studio
                      video. Until that clip is delivered the photo is
                      shown as a poster with a minimal play-icon overlay
                      so it reads as a video placeholder. The button still
                      opens the lightbox on click. When the BTS video
                      lands, swap the <img> for a Vimeo background iframe
                      (the FullServiceHybridSection pattern works well)
                      and remove the play-icon overlay. */}
                  <button
                    type="button"
                    onClick={() => openLightbox(0)}
                    aria-label="Enlarge cyclorama studio photo"
                    className="block w-full overflow-hidden cursor-zoom-in group relative"
                  >
                    <img
                      src={STUDIO_GALLERY[0].src}
                      alt={STUDIO_GALLERY[0].alt}
                      className="w-full object-cover aspect-[4/3] transition-transform duration-700 group-hover:scale-105"
                    />
                    <span className="absolute inset-0 bg-black/25 group-hover:bg-black/15 transition-colors duration-300 pointer-events-none" />
                    {/* Minimal play indicator - no extra label, just a
                        subtle white outlined circle with a play glyph
                        in the centre, so the slot reads as a video. */}
                    <span className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <span className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border-2 border-white/70 flex items-center justify-center bg-white/10 backdrop-blur-sm group-hover:bg-white/15 transition-colors">
                        <Play className="w-5 h-5 sm:w-6 sm:h-6 fill-white text-white ml-0.5" />
                      </span>
                    </span>
                  </button>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => openLightbox(1)}
                      aria-label="Enlarge studio wide angle photo"
                      className="block w-full overflow-hidden cursor-zoom-in group relative"
                    >
                      <img
                        src={STUDIO_GALLERY[1].src}
                        alt={STUDIO_GALLERY[1].alt}
                        className="w-full object-cover aspect-square transition-transform duration-700 group-hover:scale-105"
                      />
                      <span className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors duration-300" />
                    </button>
                    <button
                      type="button"
                      onClick={() => openLightbox(2)}
                      aria-label="Enlarge studio production photo"
                      className="block w-full overflow-hidden cursor-zoom-in group relative"
                    >
                      <img
                        src={STUDIO_GALLERY[2].src}
                        alt={STUDIO_GALLERY[2].alt}
                        className="w-full object-cover aspect-square transition-transform duration-700 group-hover:scale-105"
                      />
                      <span className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors duration-300" />
                    </button>
                  </div>
                </div>
              </FadeIn>
            </div>
          </div>
        </section>

        {/* Removed per Brandi 5/7/26 ('Completely remove'): the old
            'EVERYTHING YOU NEED UNDER ONE ROOF' Studio Features Grid
            (Profoto / Live Monitor / Wardrobe / etc.). */}

        {/* ━━━ SECTION 4 - Dark Process Row ━━━
            Brandi 5/7/26 (PDF page 68): 'Change this section to dark row
            style' + 3 new titles + verbatim body copy. */}
        <section className="py-20 sm:py-28 bg-dark text-white">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">
            <FadeIn>
              <span className="text-sm font-medium tracking-wider text-white/40 mb-4 block">OUR PROCESS</span>
              <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl tracking-tight mb-12 sm:mb-16">
                HOW WE WORK
              </h2>
            </FadeIn>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 sm:gap-12">
              {PROCESS.map((item, index) => (
                <FadeIn key={item.step} delay={index * 0.1}>
                  <div>
                    <span className="font-display text-6xl sm:text-7xl text-white/15 leading-none block mb-4">
                      {item.step}
                    </span>
                    <h3 className="font-display text-xl sm:text-2xl tracking-tight mb-4">
                      {item.title}
                    </h3>
                    <p className="text-base text-white/65 leading-relaxed">
                      {item.body}
                    </p>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        {/* Removed per Brandi 5/7/26 ('Completely remove'): the old
            'RENT THE SPACE' Studio Rental section (with the 7-bullet
            list and INQUIRE ABOUT RENTAL CTA). */}

        {/* ━━━ SECTION 5 - Meet the Team ━━━
            Brandi 5/7/26 (PDF pages 69-72):
            • 'Move MEET THE TEAM to here' - section now lives directly
              after the dark process row.
            • Three-paragraph intro added before the grid (verbatim).
            • Card layout per Brandi: 'Under each pic have role/titles,
              then name' - role first, name second.
            • Six members total (Ashkan, Brandi, Christopher, Nisha,
              Avery, Amaya); William removed. */}
        <section className="py-16 sm:py-24">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">
            <FadeIn>
              <span className="text-sm font-medium tracking-wider text-dark/40 mb-4 block">THE PEOPLE</span>
              <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl text-dark tracking-tight mb-12 sm:mb-16">
                MEET THE TEAM
              </h2>
            </FadeIn>

            {/* Top split: LEFT big group photo, RIGHT 3-paragraph intro
                - matches Brandi's PDF page 69 layout. Below this split,
                all six team members render in a single horizontal row. */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center mb-16 sm:mb-20">
              <FadeIn>
                <div className="overflow-hidden">
                  <img
                    src="/images/studio/team-group-2026.jpg"
                    alt="Ashkan Studios team - group photo"
                    className="w-full h-auto block"
                  />
                </div>
              </FadeIn>
              <FadeIn delay={0.1}>
                <div className="space-y-5">
                  <p className="text-lg sm:text-xl text-dark/75 leading-relaxed">
                    Ashkan Studios originated in 2017 and has grown into a collaborative creative collective.
                  </p>
                  <p className="text-lg sm:text-xl text-dark/75 leading-relaxed">
                    Our team is made up of artists, performers, and creative minds who bring a shared energy and perspective to the work.
                  </p>
                  <p className="text-lg sm:text-xl text-dark/75 leading-relaxed">
                    We expand our team as needed for any project with our trusted network of creatives across hair and makeup artists, stylists, set assistants, and more.
                  </p>
                </div>
              </FadeIn>
            </div>

            {/* All six team members in a single row on lg+ (matches the
                bottom strip in Brandi's reference). Stacks 2-cols on
                tablet and 1-col on mobile so the layout stays readable. */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-5 sm:gap-6 lg:gap-5">
              {TEAM.map((member, index) => (
                <FadeIn key={member.name} delay={index * 0.06}>
                  <div>
                    <div className="aspect-[3/4] overflow-hidden bg-dark/5 mb-4">
                      {member.image ? (
                        <img
                          src={member.image}
                          alt={member.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="font-display text-5xl sm:text-6xl text-dark/15">
                            {member.name[0]}
                          </span>
                        </div>
                      )}
                    </div>
                    {/* Role first, then name - Brandi's 5/7/26 instruction
                        'Under each pic have role/titles, then name'.
                        Role tightened to xs and name to base/lg so six
                        cards comfortably fit in a single row at lg+. */}
                    <p className="text-[0.65rem] sm:text-xs font-medium tracking-wider text-dark/45 uppercase mb-1 leading-snug">
                      {member.role}
                    </p>
                    <h3 className="font-display text-base sm:text-lg text-dark tracking-tight leading-tight">
                      {member.name}
                    </h3>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        {/* ━━━ SECTION 6 - Location ━━━
            Brandi 5/7/26 (PDF page 73): updated Sawyer Yards copy
            ('one of the largest working artist communities in Houston
            and among the largest in the United States'). */}
        <section className="py-16 sm:py-24 bg-dark text-white">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              <FadeIn>
                <div className="flex items-center gap-3 mb-6">
                  <MapPin className="w-6 h-6" />
                  <span className="text-sm font-medium tracking-wider text-white/60">OUR LOCATION</span>
                </div>
                <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl tracking-tight mb-6">
                  SAWYER YARDS,
                  <br />
                  <span className="text-white/40">HOUSTON.</span>
                </h2>
                <p className="text-lg text-white/70 leading-relaxed mb-4">
                  1502 Sawyer St #108
                  <br />
                  Houston, TX 77007
                </p>
                <p className="text-base text-white/55 leading-relaxed mb-8">
                  Located in Houston's Sawyer Yards - one of the largest working
                  artist communities in Houston and among the largest in the
                  United States. Just minutes from downtown, our studio sits
                  among galleries, artists, and creatives. Join us for Second
                  Saturday, a monthly open-studio event where the community
                  comes together to experience art firsthand.
                </p>
                <a
                  href="https://maps.google.com/?q=1502+Sawyer+St+%23108,+Houston,+TX+77007"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 text-white group"
                >
                  <span className="text-sm font-medium tracking-wider">GET DIRECTIONS</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </a>
              </FadeIn>
              <FadeIn delay={0.1}>
                <div className="aspect-video overflow-hidden">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3463.8!2d-95.3766!3d29.7716!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8640c0f1b7cfffff%3A0x5f0f3a1b1c1b1b1b!2s1502+Sawyer+St+%23108%2C+Houston%2C+TX+77007!5e0!3m2!1sen!2sus!4v1"
                    width="100%"
                    height="100%"
                    style={{ border: 0, minHeight: "300px" }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Ashkan Studios location map"
                  />
                </div>
              </FadeIn>
            </div>
          </div>
        </section>

        {/* ━━━ SECTION 7 - CTA ━━━ */}
        <section className="py-16 sm:py-24 border-t border-dark/10">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 text-center">
            <FadeIn>
              {/* Heading mb bumped from mb-6 to mb-10 after removing
                  the subtitle paragraph so the CTA button has the
                  same breathing room from the heading as before. */}
              <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl text-dark tracking-tight mb-10">
                LET'S CREATE TOGETHER
              </h2>
              {/* Subtitle 'Whether you need a full production team or
                  just the space, we're here to make it happen.' removed
                  2026-05-12 per user request. The CTA now flows
                  directly from the heading into the button. */}
              <button
                onClick={() => onNavigate("contact")}
                className="inline-flex items-center gap-3 px-8 py-4 bg-dark text-white font-medium tracking-wider text-sm group"
              >
                START A PROJECT
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </FadeIn>
          </div>
        </section>
      </main>
      <Footer onLogoClick={() => onNavigate("home")} />

      {/* Lightbox - opens when any studio space photo is clicked. */}
      <Lightbox
        images={STUDIO_GALLERY}
        isOpen={lightboxIndex !== null}
        initialIndex={lightboxIndex ?? 0}
        onClose={() => setLightboxIndex(null)}
      />
    </>
  );
}
