import React, { useRef } from "react";
import { motion, useScroll, useTransform, MotionValue } from "framer-motion";
import hero from "@/assets/hero-kiwi.jpg";
import melon from "@/assets/p-watermelon.jpg";
import peach from "@/assets/p-peach.jpg";
import vanilla from "@/assets/p-vanilla.jpg";

interface ScentCardData {
  n: string;
  tag: string;
  notes: string;
  i: string;
  bg: string;
}

const SCENTS: ScentCardData[] = [
  {
    n: "Citrus",
    tag: "Fresh & Crisp",
    notes: "Zesty, green, wake-up energy. Features bright notes of Bergamot, Lime, and Mandarin to instantly refresh your senses.",
    i: hero,
    bg: "bg-kiwi",
  },
  {
    n: "Sweet",
    tag: "Juicy & Playful",
    notes: "Juicy, sweet & a little extra. A delicious blend of Watermelon, Strawberry, and soft Musk for an addictive trail.",
    i: melon,
    bg: "bg-melon",
  },
  {
    n: "Floral",
    tag: "Sunny & Golden",
    notes: "Warm, golden, blooming fields. Elegant notes of Jasmine, White Rose, and Neroli that evoke a sun-drenched stroll.",
    i: peach,
    bg: "bg-peach-gradient",
  },
  {
    n: "Gourmand",
    tag: "Rich & Edible",
    notes: "Rich, edible, cozy comfort. Decadent layers of Salted Caramel, Tahitian Vanilla, and Tonka Bean that smell good enough to eat.",
    i: vanilla,
    bg: "bg-cream",
  },
];

interface CardStackProps {
  scent: ScentCardData;
  y?: MotionValue<string> | MotionValue<number> | number | string | undefined;
  scale?: MotionValue<number> | number | undefined;
  overlayOpacity?: MotionValue<number> | number | undefined;
  zIndex: number;
}

function CardItem({ scent, y = 0, scale = 1, overlayOpacity = 0, zIndex }: CardStackProps) {
  return (
    <motion.div
      {...({ z: 0 } as any)}
      style={{
        y,
        scale,
        transformOrigin: "top",
        zIndex,
        willChange: "transform, opacity",
      }}
      className="absolute inset-0 w-full rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col md:flex-row border border-foreground/10 bg-card"
    >
      {/* Left Column: Scent Details & Typography */}
      <div className={`${scent.bg} w-full md:w-1/2 p-6 md:p-12 flex flex-col justify-center relative z-10`}>
        <span className="pill w-fit mb-3 bg-background/80 backdrop-blur-md px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-foreground">
          {scent.tag}
        </span>
        <h3 className="text-3xl md:text-5xl font-serif italic mb-4 text-foreground">
          {scent.n}
        </h3>
        <p className="text-sm md:text-base text-foreground/85 leading-relaxed mb-6">
          {scent.notes}
        </p>
        <a
          href="#shop"
          className="pill w-fit bg-foreground px-7 py-3 text-sm font-medium text-background transition-transform hover:scale-105 shadow-md"
        >
          Explore {scent.n}
        </a>
      </div>

      {/* Right Column: Imagery with fixed bounds & lazy loading */}
      <div className={`${scent.bg} w-full md:w-1/2 h-[190px] md:h-full relative overflow-hidden`}>
        <img
          src={scent.i}
          alt={scent.n}
          loading="lazy"
          width={600}
          height={450}
          className="w-full h-full object-cover mix-blend-multiply opacity-90 transition-transform duration-500 hover:scale-105"
        />
      </div>

      {/* 3D Push-Back Dimming Overlay */}
      <motion.div
        style={{
          opacity: overlayOpacity,
          willChange: "opacity",
        }}
        className="absolute inset-0 bg-black/40 pointer-events-none rounded-[2.5rem] z-20"
      />
    </motion.div>
  );
}

export function ShopByScent() {
  const containerRef = useRef<HTMLElement>(null);

  // 1. Track scroll progress of the 300vh container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // 1. Dynamic Background Crossfade: Exact light theme hex stops
  // Citrus (#dcfce7), Sweet (#fce7f3), Floral (#ffedd5), Gourmand (#fef3c7)
  const sectionBg = useTransform(
    scrollYProgress,
    [0, 0.33, 0.66, 1],
    ["#dcfce7", "#fce7f3", "#ffedd5", "#fef3c7"]
  );

  // 2 & 3. Card Transformations & 3D Push-Back Physics (Raw useTransform - Zero Lag)
  // Card 0: Citrus (at base, pushes back when Card 1 arrives)
  const scale0 = useTransform(scrollYProgress, [0.02, 0.33], [1, 0.94], { clamp: true });
  const overlay0 = useTransform(scrollYProgress, [0.02, 0.33], [0, 0.38], { clamp: true });

  // Card 1: Sweet (slides up responsive from 120%, pushes back during 0.33-0.66)
  const y1 = useTransform(scrollYProgress, [0.03, 0.33], ["120%", "0%"], { clamp: true });
  const scale1 = useTransform(scrollYProgress, [0.35, 0.66], [1, 0.94], { clamp: true });
  const overlay1 = useTransform(scrollYProgress, [0.35, 0.66], [0, 0.38], { clamp: true });

  // Card 2: Floral (slides up responsive from 120%, pushes back during 0.66-0.98)
  const y2 = useTransform(scrollYProgress, [0.36, 0.66], ["120%", "0%"], { clamp: true });
  const scale2 = useTransform(scrollYProgress, [0.68, 0.98], [1, 0.94], { clamp: true });
  const overlay2 = useTransform(scrollYProgress, [0.68, 0.98], [0, 0.38], { clamp: true });

  // Card 3: Gourmand (slides up responsive from 120%, stays on top)
  const y3 = useTransform(scrollYProgress, [0.69, 0.98], ["120%", "0%"], { clamp: true });

  return (
    <motion.section
      ref={containerRef}
      style={{
        backgroundColor: sectionBg,
        willChange: "background-color",
      }}
      className="relative min-h-[300vh] transition-colors duration-300 ease-out"
    >
      {/* Single Sticky Viewport Container - Smooth, 0 Layout Thrashing */}
      <div className="sticky top-0 h-screen w-full flex flex-col justify-center items-center overflow-hidden px-4 md:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-6 md:mb-8 shrink-0">
          <span className="pill mb-2 inline-block bg-background/80 backdrop-blur-md px-3.5 py-1 text-xs font-semibold uppercase tracking-widest text-foreground/80 shadow-sm">
            Sensory Profiles
          </span>
          <h2 className="text-3xl md:text-5xl font-medium tracking-tight">
            Shop by <em>scent</em>
          </h2>
          <p className="mt-2 text-muted-foreground text-xs md:text-sm max-w-md mx-auto">
            Scroll to reveal each signature aroma from crisp citrus pops to rich, decadent gourmands.
          </p>
        </div>

        {/* Unified Card Stacking Stage */}
        <div className="relative w-full max-w-4xl h-[420px] md:h-[460px]">
          {/* Card 0: Citrus */}
          <CardItem
            scent={SCENTS[0]!}
            y={0}
            scale={scale0}
            overlayOpacity={overlay0}
            zIndex={10}
          />

          {/* Card 1: Sweet */}
          <CardItem
            scent={SCENTS[1]!}
            y={y1}
            scale={scale1}
            overlayOpacity={overlay1}
            zIndex={20}
          />

          {/* Card 2: Floral */}
          <CardItem
            scent={SCENTS[2]!}
            y={y2}
            scale={scale2}
            overlayOpacity={overlay2}
            zIndex={30}
          />

          {/* Card 3: Gourmand */}
          <CardItem
            scent={SCENTS[3]!}
            y={y3}
            scale={1}
            overlayOpacity={0}
            zIndex={40}
          />
        </div>

        {/* Visual Progress Indicator */}
        <div className="mt-6 flex gap-2 shrink-0">
          {SCENTS.map((scent) => (
            <span
              key={scent.n}
              className="text-[11px] font-medium tracking-wide uppercase px-3 py-1 rounded-full bg-background/50 backdrop-blur-sm border border-foreground/5 text-foreground/75"
            >
              {scent.n}
            </span>
          ))}
        </div>

      </div>
    </motion.section>
  );
}

export default ShopByScent;
