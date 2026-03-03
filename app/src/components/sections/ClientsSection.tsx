import { clients } from "@/data/portfolio";
import { FadeIn } from "@/components/animations/FadeIn";

export function ClientsSection() {
  return (
    <section className="py-14 sm:py-24 lg:py-28 bg-dark relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-white rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white rounded-full blur-3xl" />
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 relative z-10">
        {/* Section Header */}
        <FadeIn className="text-center mb-8 sm:mb-12 lg:mb-16">
          <h2
            className="font-display text-6xl sm:text-7xl md:text-8xl lg:text-[105px] xl:text-[132px] text-white tracking-tight leading-none friends-heading-float"
            style={{ willChange: "transform" }}
          >
            OUR FRIENDS
          </h2>
        </FadeIn>

        {/* Client Logos Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-12">
          {clients.map((client, index) => (
            <FadeIn key={index} delay={index * 0.05}>
              <div className="flex items-center justify-center p-4 sm:p-6 transition-transform duration-200 hover:scale-105">
                <span className="font-display text-lg sm:text-xl lg:text-2xl text-white/80 tracking-tight text-center hover:text-white transition-colors cursor-default">
                  {client}
                </span>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
      <style>{`
        @keyframes friendsFloat {
          0%, 100% { transform: translate3d(0, 0, 0); }
          50%      { transform: translate3d(0, -16px, 0); }
        }
        .friends-heading-float {
          animation: friendsFloat 4.5s ease-in-out infinite;
        }
        @media (max-width: 1024px) {
          @keyframes friendsFloat {
            0%, 100% { transform: translate3d(0, 0, 0); }
            50%      { transform: translate3d(0, -10px, 0); }
          }
        }
        @media (max-width: 640px) {
          .friends-heading-float { animation: none; }
        }
        @media (prefers-reduced-motion: reduce) {
          .friends-heading-float { animation: none; }
        }
      `}</style>
    </section>
  );
}
