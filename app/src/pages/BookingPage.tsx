import { Calendar, Camera, Video, Lightbulb, Users, ArrowLeft, ArrowRight } from "lucide-react";
import { FadeIn } from "@/components/animations/FadeIn";
import { Footer } from "@/components/layout/Footer";
import type { View } from "@/App";

interface BookingPageProps {
  onNavigate: (view: View, slug?: string) => void;
}

const sessionTypes = [
  {
    icon: Camera,
    title: "PHOTOGRAPHY SESSION",
    description:
      "Commercial, portrait, dance, or editorial photography tailored to your creative vision. From product shots to full-scale productions.",
    includes: ["Creative consultation", "Professional lighting & direction", "Retouched final images", "Online gallery delivery"],
  },
  {
    icon: Video,
    title: "VIDEOGRAPHY SESSION",
    description:
      "Cinematic video production for brands, campaigns, and storytelling. From concept to final cut.",
    includes: ["Pre-production planning", "Professional crew & equipment", "Color grading & editing", "Multiple format delivery"],
  },
  {
    icon: Lightbulb,
    title: "PRIVATE COACHING",
    description:
      "One-on-one photography coaching with Ashkan Roayaee. Learn professional lighting techniques, business strategy, portfolio review, and more.",
    includes: ["Personalized curriculum", "Live session shadowing", "Portfolio & business review", "Virtual options available"],
  },
  {
    icon: Users,
    title: "WORKSHOP",
    description:
      "Group lighting and business workshops broken into 3 levels: beginner, intermediate, and advanced. Learn dramatic lighting techniques for commercial and dance photography.",
    includes: ["Hands-on lighting practice", "3 skill levels available", "Business & marketing strategies", "Certificate of completion"],
  },
];

const processSteps = [
  {
    step: "01",
    title: "CONSULTATION",
    description:
      "We review the creative layout of your session or project, go over logistics like time, location, hair and makeup needs, and get you ready for the day.",
  },
  {
    step: "02",
    title: "SESSION DAY",
    description:
      "Our team handles every detail, from lighting and direction to styling and set design. You show up, we create magic.",
  },
  {
    step: "03",
    title: "DELIVERY",
    description:
      "Professional retouching, color grading, and final delivery through your private online gallery. Typical turnaround is 2-3 weeks.",
  },
];

export function BookingPage({ onNavigate }: BookingPageProps) {
  return (
    <>
      <main className="pt-20 bg-dark">
        {/* ━━━ SECTION 1 - Hero ━━━ */}
        <section className="py-20 sm:py-32 bg-dark text-white">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">
            <FadeIn>
              <button
                onClick={() => onNavigate("contact")}
                className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-10 text-sm font-medium tracking-wider"
              >
                <ArrowLeft className="w-4 h-4" />
                BACK TO CONTACT
              </button>
              <span className="text-sm font-medium tracking-[0.2em] text-white/60 uppercase mb-4 block">
                BOOKING · ASHKAN STUDIOS
              </span>
              <h1 className="font-display text-5xl sm:text-7xl lg:text-8xl text-white tracking-tight leading-[0.95] mb-6">
                BOOK YOUR
                <br />
                SESSION
              </h1>
              <p className="text-lg sm:text-xl text-white/70 max-w-2xl leading-relaxed">
                Whether you need a commercial shoot, private coaching, or a full production -
                we'll build a session tailored to your goals. Located at Sawyer Yards,
                one of Houston's most cutting-edge creative spaces.
              </p>
            </FadeIn>
          </div>
        </section>

        {/* ━━━ SECTION 2 - Session Types ━━━ */}
        <section className="py-16 sm:py-24 bg-cream">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">
            <FadeIn>
              <span className="text-sm font-medium tracking-wider text-dark/40 uppercase mb-4 block">
                WHAT WE OFFER
              </span>
              <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl text-dark tracking-tight leading-[0.95] mb-6">
                SESSION TYPES
              </h2>
              <p className="text-lg text-dark/60 max-w-xl mb-12 sm:mb-16 leading-relaxed">
                Every session is customized. Select the type that fits your project,
                or contact us for a custom package.
              </p>
            </FadeIn>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
              {sessionTypes.map((session, i) => (
                <FadeIn key={session.title} delay={i * 0.1}>
                  <div className="border border-dark/10 p-8 sm:p-10 h-full hover:border-dark/30 transition-colors">
                    <session.icon className="w-8 h-8 text-dark mb-8" />
                    <h3 className="font-display text-xl sm:text-2xl text-dark tracking-tight leading-tight mb-4">
                      {session.title}
                    </h3>
                    <p className="text-dark/60 leading-relaxed mb-8">
                      {session.description}
                    </p>
                    <ul className="space-y-3">
                      {session.includes.map((item) => (
                        <li key={item} className="flex items-center gap-3 text-sm text-dark/70">
                          <span className="w-1.5 h-1.5 rounded-full bg-dark/40 shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        {/* ━━━ SECTION 3 - Process ━━━ */}
        <section className="py-20 sm:py-28 bg-dark text-white">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">
            <FadeIn>
              <span className="text-sm font-medium tracking-wider text-white/40 uppercase mb-4 block">
                THE PROCESS
              </span>
              <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl tracking-tight leading-[0.95] mb-12 sm:mb-16">
                HOW IT WORKS
              </h2>
            </FadeIn>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 sm:gap-12">
              {processSteps.map((step, i) => (
                <FadeIn key={step.step} delay={i * 0.1}>
                  <div>
                    <span className="font-display text-6xl sm:text-7xl text-white/15 leading-none block mb-4">
                      {step.step}
                    </span>
                    <h3 className="font-display text-xl sm:text-2xl tracking-tight mb-4">
                      {step.title}
                    </h3>
                    <p className="text-base text-white/65 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        {/* ━━━ SECTION 4 - CTA / Book Now ━━━ */}
        <section className="py-20 sm:py-28 border-t border-dark/10">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 text-center">
            <FadeIn>
              <span className="text-sm font-medium tracking-wider text-dark/40 uppercase mb-4 block">
                LET'S BEGIN
              </span>
              <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl text-dark tracking-tight leading-[0.95] mb-6">
                READY TO GET STARTED?
              </h2>
              <p className="text-lg text-dark/60 mb-10 max-w-xl mx-auto leading-relaxed">
                Schedule a free consultation to discuss your project. We'll help you
                choose the right session and plan every detail.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="https://app.acuityscheduling.com/schedule/a147a55c"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-dark text-white font-medium tracking-wider text-sm group"
                >
                  <Calendar className="w-4 h-4" />
                  BOOK A SESSION
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </a>
                <button
                  onClick={() => onNavigate("contact")}
                  className="inline-flex items-center justify-center gap-3 px-8 py-4 border border-dark/30 text-dark font-medium tracking-wider text-sm hover:bg-dark hover:text-white transition-colors"
                >
                  SEND US A MESSAGE
                </button>
              </div>
              <p className="text-dark/40 text-sm mt-8">
                1502 Sawyer St #108, Houston, TX 77007 &nbsp;·&nbsp; (346) 335-7973
              </p>
            </FadeIn>
          </div>
        </section>
      </main>
      <Footer onLogoClick={() => onNavigate("home")} />
    </>
  );
}
