import { ArrowRight, MapPin, Camera, Film, Palette, Monitor, Shirt, Scissors } from "lucide-react";
import { FadeIn } from "@/components/animations/FadeIn";
import { Footer } from "@/components/layout/Footer";
import type { View } from "@/App";

interface StudioPageProps {
  onNavigate: (view: View, slug?: string) => void;
}

export function StudioPage({ onNavigate }: StudioPageProps) {
  const team = [
    {
      name: "ASHKAN ROAYAEE",
      role: "FOUNDER & CREATIVE DIRECTOR",
      image: null,
      bio: "With over a decade behind the lens, Ashkan founded Ashkan Studios to merge commercial photography and cinematic video production under one roof. His vision drives every project — from Fortune 500 campaigns to intimate dance portraits.",
    },
    {
      name: "BRANDI SHALLENBERGER",
      role: "DIRECTOR / CINEMATOGRAPHER / PHOTOGRAPHER / EDITOR",
      image: "/images/studio/team-brandi.jpg",
      bio: "Part of the team since 2017, Brandi holds a BFA in Photography and brings a diverse creative background spanning fashion, dance, commercial, and fine art. Her eye for composition and lighting elevates every frame.",
    },
    {
      name: "WILLIAM BYRNE",
      role: "CINEMATOGRAPHER / EDITOR",
      image: "/images/studio/team-william.jpg",
      bio: "William holds a BSA in Digital Cinematography with a focus on documentary filmmaking. His storytelling instincts and technical precision make him an essential force behind our video productions.",
    },
    {
      name: "CHRISTOPHER POE",
      role: "CINEMATOGRAPHER / PHOTOGRAPHER / EDITOR",
      image: "/images/studio/team-christopher.jpg",
      bio: "A Concordia University graduate, Christopher brings deep expertise in sports and documentary work. His versatility across photography and video makes him a powerhouse on set.",
    },
  ];

  const studioFeatures = [
    {
      icon: Camera,
      title: "PROFOTO LIGHTING SYSTEM",
      description: "Profoto 7A 2400 w/s, Profoto D1 Air 500w/s, Pro Heads, Elinchrom Deep Octa, Mola beauty dishes, strip boxes, and a full overhead lighting grid with LED RGB — all iPad-controlled.",
    },
    {
      icon: Monitor,
      title: "LIVE MONITOR",
      description: "A tethered live monitor lets clients see every shot in real time during the session, ensuring you're part of the creative process from start to finish.",
    },
    {
      icon: Shirt,
      title: "DESIGNER WARDROBE",
      description: "On-site wardrobe featuring pieces by Alan Gonzalez (Project Runway), Luani, and Mysterious By N.P.N — gowns, dancewear, leather jackets, and styled casual pieces ready for your session.",
    },
    {
      icon: Scissors,
      title: "HAIR & MAKEUP",
      description: "Professional hair and makeup artists from the Houston Grand Opera available for your session, ensuring you look camera-ready from every angle.",
    },
    {
      icon: Palette,
      title: "COLORED BACKDROPS",
      description: "A full selection of colored seamless backdrops to match any mood or brand palette, plus our signature infinity wall for clean, editorial looks.",
    },
    {
      icon: Film,
      title: "FULL POST-PRODUCTION",
      description: "From color grading to retouching, our in-house editing team handles everything so your final deliverables are polished, on-brand, and ready to publish.",
    },
  ];

  return (
    <>
      <main className="pt-20">
        {/* Hero Section */}
        <section className="relative h-[70vh] min-h-[500px] overflow-hidden">
          <div className="absolute inset-0">
            <img
              src="/images/studio/studio-interior-1.jpg"
              alt="Ashkan Studios — Houston production studio interior"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-dark/50" />
          </div>
          <div className="relative z-10 h-full flex items-end pb-16 sm:pb-24">
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 w-full">
              <FadeIn>
                <h1 className="font-display text-5xl sm:text-7xl lg:text-8xl xl:text-9xl text-white tracking-tight leading-[0.95]">
                  THE STUDIO
                </h1>
              </FadeIn>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section className="py-16 sm:py-24 bg-cream">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
              <FadeIn>
                <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl text-dark tracking-tight leading-[0.95]">
                  BASED IN HOUSTON,
                  <br />
                  <span className="text-dark/40">2 DEPARTMENTS,</span>
                  <br />
                  <span className="text-dark/40">1 COMPANY.</span>
                </h2>
              </FadeIn>
              <FadeIn delay={0.1}>
                <div className="space-y-6">
                  <p className="text-lg sm:text-xl text-dark/80 leading-relaxed">
                    Ashkan Studios is the parent company of <span className="font-medium text-dark">Ashkan Image</span> and{" "}
                    <span className="font-medium text-dark">Ashkan Media</span>. We specialize in commercial photography,
                    videography, and creative production out of our 1,500 sq ft studio in Houston's Sawyer Yards.
                  </p>
                  <p className="text-lg sm:text-xl text-dark/80 leading-relaxed">
                    From dance photography to corporate video campaigns, our passion is storytelling through stunning visuals
                    that embody your brand's energy and essence. Every project begins with understanding your vision and ends
                    with content that drives results.
                  </p>
                  <p className="text-lg sm:text-xl text-dark/80 leading-relaxed">
                    With over a decade of experience, we've partnered with brands ranging from local startups to
                    Fortune 500 companies — always delivering work that exceeds expectations.
                  </p>
                </div>
              </FadeIn>
            </div>
          </div>
        </section>

        {/* Studio Space Section */}
        <section className="py-16 sm:py-24 border-t border-dark/10">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              <FadeIn>
                <span className="text-sm font-medium tracking-wider text-dark/40 mb-4 block">THE SPACE</span>
                <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl text-dark tracking-tight leading-[0.95] mb-8">
                  1,500 SQ FT
                  <br />
                  <span className="text-dark/40">OF CREATIVE</span>
                  <br />
                  <span className="text-dark/40">POSSIBILITY.</span>
                </h2>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-1 h-full min-h-[20px] bg-dark/20 rounded-full mt-1" />
                    <p className="text-lg text-dark/70 leading-relaxed">
                      <span className="font-medium text-dark">14.5-foot ceilings</span> — room for dramatic lighting setups and full-length fashion shoots.
                    </p>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-1 h-full min-h-[20px] bg-dark/20 rounded-full mt-1" />
                    <p className="text-lg text-dark/70 leading-relaxed">
                      <span className="font-medium text-dark">Cyclorama wall</span> — 16' wide × 14' high × 12' deep infinity wall for seamless editorial and product shots.
                    </p>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-1 h-full min-h-[20px] bg-dark/20 rounded-full mt-1" />
                    <p className="text-lg text-dark/70 leading-relaxed">
                      <span className="font-medium text-dark">Free-standing set wall</span> — 8' wide × 10' high for versatile scene setups.
                    </p>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-1 h-full min-h-[20px] bg-dark/20 rounded-full mt-1" />
                    <p className="text-lg text-dark/70 leading-relaxed">
                      <span className="font-medium text-dark">Full amenities</span> — washroom with shower, makeup station, freight elevator access, and complimentary Nespresso.
                    </p>
                  </div>
                </div>
              </FadeIn>
              <FadeIn delay={0.1}>
                <div className="space-y-4">
                  <img
                    src="/images/studio/studio-interior-2.jpg"
                    alt="Ashkan Studios cyclorama and lighting setup"
                    className="w-full rounded-2xl object-cover aspect-[4/3]"
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <img
                      src="/images/studio/studio-wide.jpg"
                      alt="Studio wide angle view"
                      className="w-full rounded-xl object-cover aspect-square"
                    />
                    <img
                      src="/images/studio/studio-sample-2.jpg"
                      alt="Studio sample work"
                      className="w-full rounded-xl object-cover aspect-square"
                    />
                  </div>
                </div>
              </FadeIn>
            </div>
          </div>
        </section>

        {/* Studio Features Grid */}
        <section className="py-16 sm:py-24 bg-dark text-white">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">
            <FadeIn>
              <span className="text-sm font-medium tracking-wider text-white/40 mb-4 block">WHAT'S INCLUDED</span>
              <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl tracking-tight mb-16">
                EVERYTHING YOU NEED
                <br />
                <span className="text-white/40">UNDER ONE ROOF.</span>
              </h2>
            </FadeIn>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
              {studioFeatures.map((feature, index) => (
                <FadeIn key={feature.title} delay={index * 0.08}>
                  <div className="group">
                    <feature.icon className="w-8 h-8 text-white/40 mb-4 group-hover:text-white transition-colors" />
                    <h3 className="font-display text-xl tracking-tight mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-white/60 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        {/* Process Section */}
        <section className="py-16 sm:py-24">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">
            <FadeIn>
              <span className="text-sm font-medium tracking-wider text-dark/40 mb-4 block">OUR PROCESS</span>
              <h2 className="font-display text-4xl sm:text-5xl text-dark tracking-tight mb-16">
                HOW WE WORK
              </h2>
            </FadeIn>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12">
              <FadeIn delay={0}>
                <div className="relative">
                  <span className="font-display text-7xl sm:text-8xl text-dark/10 leading-none">01</span>
                  <h3 className="font-display text-2xl text-dark tracking-tight mt-4 mb-3">CONSULTATION</h3>
                  <p className="text-dark/60 leading-relaxed">
                    Every project starts with a conversation. We learn your goals, brand identity, and creative vision to design a session that's tailored specifically to you.
                  </p>
                </div>
              </FadeIn>
              <FadeIn delay={0.1}>
                <div className="relative">
                  <span className="font-display text-7xl sm:text-8xl text-dark/10 leading-none">02</span>
                  <h3 className="font-display text-2xl text-dark tracking-tight mt-4 mb-3">SESSION</h3>
                  <p className="text-dark/60 leading-relaxed">
                    On shoot day, our team handles everything — lighting, direction, wardrobe, hair and makeup. You see every shot live on our tethered monitor and stay involved throughout.
                  </p>
                </div>
              </FadeIn>
              <FadeIn delay={0.2}>
                <div className="relative">
                  <span className="font-display text-7xl sm:text-8xl text-dark/10 leading-none">03</span>
                  <h3 className="font-display text-2xl text-dark tracking-tight mt-4 mb-3">EDITING & DELIVERY</h3>
                  <p className="text-dark/60 leading-relaxed">
                    Our post-production team handles color grading, retouching, and video editing in-house. You receive polished, publish-ready content that's on-brand and on-time.
                  </p>
                </div>
              </FadeIn>
            </div>
          </div>
        </section>

        {/* Studio Rental Section */}
        <section className="py-16 sm:py-24 border-t border-dark/10 bg-cream">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              <FadeIn>
                <img
                  src="/images/studio/studio-process.jpg"
                  alt="Studio production in progress"
                  className="w-full rounded-2xl object-cover aspect-[4/3]"
                />
              </FadeIn>
              <FadeIn delay={0.1}>
                <span className="text-sm font-medium tracking-wider text-dark/40 mb-4 block">STUDIO RENTAL</span>
                <h2 className="font-display text-4xl sm:text-5xl text-dark tracking-tight leading-[0.95] mb-6">
                  RENT THE SPACE
                </h2>
                <p className="text-lg text-dark/70 leading-relaxed mb-6">
                  Our studio is available for rent to photographers, videographers, and creatives who need a professional space
                  with top-tier equipment already in place. Half-day and full-day rates available.
                </p>
                <ul className="space-y-3 mb-8">
                  {[
                    "1,500 sq ft with 14.5' ceilings",
                    "Cyclorama infinity wall (16'W × 14'H × 12'D)",
                    "Profoto & Elinchrom lighting included",
                    "Overhead LED RGB grid (iPad-controlled)",
                    "Colored seamless backdrops",
                    "Makeup station & washroom with shower",
                    "Freight elevator for large equipment",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3 text-dark/70">
                      <span className="w-1.5 h-1.5 rounded-full bg-dark/40 mt-2.5 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => onNavigate("contact")}
                  className="inline-flex items-center gap-3 px-8 py-4 bg-dark text-white font-medium tracking-wider text-sm group"
                >
                  INQUIRE ABOUT RENTAL
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </FadeIn>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-16 sm:py-24">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">
            <FadeIn>
              <span className="text-sm font-medium tracking-wider text-dark/40 mb-4 block">THE PEOPLE</span>
              <h2 className="font-display text-4xl sm:text-5xl text-dark tracking-tight mb-16">
                MEET THE TEAM
              </h2>
            </FadeIn>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10">
              {team.map((member, index) => (
                <FadeIn key={member.name} delay={index * 0.1}>
                  <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-dark/5 mb-5">
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
                  <h3 className="font-display text-xl sm:text-2xl text-dark tracking-tight">
                    {member.name}
                  </h3>
                  <p className="text-xs font-medium tracking-wider text-dark/40 mt-1 mb-3">
                    {member.role}
                  </p>
                  <p className="text-sm text-dark/60 leading-relaxed">
                    {member.bio}
                  </p>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        {/* Location Section */}
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
                  1502 Sawyer St #108<br />
                  Houston, TX 77007
                </p>
                <p className="text-base text-white/50 leading-relaxed mb-8">
                  Located in Houston's Sawyer Yards — one of the largest fine art communities in the country.
                  Just minutes from downtown, our studio sits among galleries, artists, and creatives. Join us for
                  Second Saturday, a monthly open-studio event where the community comes together to experience art firsthand.
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
                <div className="aspect-video rounded-2xl overflow-hidden">
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

        {/* CTA Section */}
        <section className="py-16 sm:py-24 border-t border-dark/10">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 text-center">
            <FadeIn>
              <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl text-dark tracking-tight mb-6">
                LET'S CREATE TOGETHER
              </h2>
              <p className="text-lg text-dark/60 max-w-2xl mx-auto mb-10">
                Whether you need a full production team or just the space, we're here to make it happen.
              </p>
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
    </>
  );
}
