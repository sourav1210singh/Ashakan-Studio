import { useState, useRef, type ReactNode } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { clients } from "@/data/portfolio";

/* ════════════════════════════════════════════════════════════════════
   OUR FRIENDS — Marquee + Magnetic combo. Two infinite-scrolling rows
   in opposite directions; each name is magnetic and snaps to the
   cursor on hover. When real client logos arrive from Brandi, drop
   them into the same MarqueeRow in place of the text — layout stays
   identical. Approved on /test/work-split/.
   ════════════════════════════════════════════════════════════════════ */

/* ──────────────────────────────────────────────────────────────────── */
/*  MagneticItem — pulls the wrapped child toward the cursor on hover   */
/* ──────────────────────────────────────────────────────────────────── */
function MagneticItem({
  children,
  strength = 0.4,
}: {
  children: ReactNode;
  strength?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const mvX = useMotionValue(0);
  const mvY = useMotionValue(0);
  const x = useSpring(mvX, { stiffness: 280, damping: 18, mass: 0.6 });
  const y = useSpring(mvY, { stiffness: 280, damping: 18, mass: 0.6 });
  const [hover, setHover] = useState(false);

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    mvX.set((e.clientX - cx) * strength);
    mvY.set((e.clientY - cy) * strength);
  };
  const onLeave = () => {
    mvX.set(0);
    mvY.set(0);
    setHover(false);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={onLeave}
      style={{ x, y, display: "inline-block", willChange: "transform" }}
      animate={{ scale: hover ? 1.12 : 1 }}
      transition={{ type: "spring", stiffness: 240, damping: 20 }}
    >
      {children}
    </motion.div>
  );
}

/* ──────────────────────────────────────────────────────────────────── */
/*  MarqueeRow — infinite horizontal scroll with magnetic items inside  */
/* ──────────────────────────────────────────────────────────────────── */
function MarqueeRow({
  items,
  direction = "left",
  speedSec = 40,
}: {
  items: string[];
  direction?: "left" | "right";
  speedSec?: number;
}) {
  // Duplicate the list so the loop is seamless
  const repeated = [...items, ...items, ...items, ...items];
  const fromX = direction === "left" ? "0%" : "-50%";
  const toX = direction === "left" ? "-50%" : "0%";

  return (
    <div className="overflow-hidden py-3">
      <motion.div
        className="flex items-center gap-12 sm:gap-16 lg:gap-20 whitespace-nowrap"
        animate={{ x: [fromX, toX] }}
        transition={{ duration: speedSec, repeat: Infinity, ease: "linear" }}
        style={{ width: "max-content", willChange: "transform" }}
      >
        {repeated.map((name, idx) => (
          <MagneticItem key={`${name}-${idx}`} strength={0.35}>
            <span
              className="font-display text-3xl sm:text-4xl lg:text-5xl xl:text-6xl tracking-tight uppercase select-none transition-colors duration-300"
              style={{
                color: "rgba(26,26,26,0.55)",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.color = "#1A1A1A";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.color = "rgba(26,26,26,0.55)";
              }}
            >
              {name}
            </span>
          </MagneticItem>
        ))}
      </motion.div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────── */
/*  Section wrapper                                                     */
/* ──────────────────────────────────────────────────────────────────── */
export function FriendsMarqueeSection() {
  // Split the client list into two halves so each row has different names
  const half = Math.ceil(clients.length / 2);
  const rowA = clients.slice(0, half);
  const rowB = clients.slice(half).concat(clients.slice(0, half).reverse());

  return (
    <section className="py-20 sm:py-28 bg-cream relative overflow-hidden">
      {/* Soft glow blobs in background — subdued for cream theme */}
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[28rem] h-[28rem] bg-amber-200/40 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-[28rem] h-[28rem] bg-dark/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10">
        {/* Section header — center */}
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 text-center mb-10 sm:mb-14">
          <p className="text-xs font-semibold tracking-[0.3em] text-dark/50 uppercase mb-4">
            Brands We've Worked With
          </p>
          <h2 className="font-display text-6xl sm:text-7xl md:text-8xl lg:text-[105px] xl:text-[132px] text-dark tracking-tight leading-none">
            OUR FRIENDS
          </h2>
        </div>

        {/* Two marquee rows — opposite directions */}
        <div className="space-y-4 sm:space-y-6">
          <MarqueeRow items={rowA} direction="left" speedSec={45} />
          {/* Thin divider line — dark variant for the cream background */}
          <div className="h-px bg-gradient-to-r from-transparent via-dark/15 to-transparent" />
          <MarqueeRow items={rowB} direction="right" speedSec={55} />
        </div>
      </div>
    </section>
  );
}
