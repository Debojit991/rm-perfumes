import React, { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

// Static poster images
import hero from "@/assets/hero-kiwi.jpg";
import melon from "@/assets/p-watermelon.jpg";
import peach from "@/assets/p-peach.jpg";
import vanilla from "@/assets/p-vanilla.jpg";

// HTML5 Video assets
import kiwiVideo from "@/assets/vdos/kiwi.mp4";
import watermelonVideo from "@/assets/vdos/watermelon.mp4";
import peachVideo from "@/assets/vdos/peach.mp4";
import ambreVideo from "@/assets/vdos/ambre.mp4";

interface CategoryItem {
  t: string;
  img: string;
  video: string;
  bg: string;
  tag: string;
}

const leftCategories: CategoryItem[] = [
  { t: "EDP", tag: "Eau de Parfum", img: hero, video: kiwiVideo, bg: "bg-pastel" },
  { t: "Peach", tag: "Curated Sets", img: peach, video: peachVideo, bg: "bg-peach-gradient" },
];

const rightCategories: CategoryItem[] = [
  { t: "Attars", tag: "Pure Oils", img: melon, video: watermelonVideo, bg: "bg-melon" },
  { t: "Ambre", tag: "Pocket Spritz", img: vanilla, video: ambreVideo, bg: "bg-cream" },
];

export default function CategoryGrid() {
  const gridRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile, { passive: true });
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // 1. Asymmetrical Scroll Parallax Tracking
  const { scrollYProgress } = useScroll({
    target: gridRef,
    offset: ["start end", "end start"],
  });

  // Left Column: slight upward translation [0, -120]
  const yLeft = useTransform(scrollYProgress, [0, 1], [0, -120]);
  // Right Column: slower downward translation [0, 60] to break symmetry
  const yRight = useTransform(scrollYProgress, [0, 1], [0, 60]);

  return (
    <section className="mx-auto max-w-7xl px-4 py-20 md:px-8 overflow-hidden">
      <div className="text-center mb-14">
        <span className="pill mb-3 inline-block bg-muted px-4 py-1 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          ONE OF NONE
        </span>
        <h2 className="text-4xl md:text-5xl font-medium tracking-tight">
          Find your <em>format</em>
        </h2>
      </div>

      <div
        ref={gridRef}
        className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-5xl mx-auto items-start pt-8 pb-20"
      >
        {/* Left Column (EDP, Peach - Upward Parallax) */}
        <motion.div
          style={{
            y: isMobile ? 0 : yLeft,
            willChange: "transform",
          }}
          className="flex flex-col gap-6 md:gap-8"
        >
          {leftCategories.map((c) => (
            <a
              key={c.t}
              href="#shop"
              className={`${c.bg} group overflow-hidden rounded-[2.5rem] relative aspect-[4/5] flex items-end p-8 shadow-md transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl ring-2 ring-transparent hover:ring-foreground/10 block`}
            >
              {/* Auto-Playing Looping Video with Static Poster fallback & Deep Hover Zoom */}
              <video
                src={c.video}
                poster={c.img}
                autoPlay
                loop
                muted
                playsInline
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-[800ms] ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-110"
              />
              {/* Subtle background overlay darkens slightly on hover to make white text pop */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent opacity-85 group-hover:opacity-95 group-hover:bg-black/20 transition-all duration-500 pointer-events-none" />
              <div className="relative z-10 pointer-events-none">
                <span className="pill mb-2 inline-block bg-white/20 backdrop-blur-md px-3 py-0.5 text-xs font-semibold uppercase tracking-wider text-white">
                  {c.tag}
                </span>
                <h3 className="text-3xl md:text-4xl text-white font-serif italic drop-shadow-md group-hover:translate-x-1.5 transition-transform duration-500">
                  {c.t}
                </h3>
              </div>
            </a>
          ))}
        </motion.div>

        {/* Right Column (Attars, Ambre - Downward Parallax to Break Symmetry) */}
        <motion.div
          style={{
            y: isMobile ? 0 : yRight,
            willChange: "transform",
          }}
          className="flex flex-col gap-6 md:gap-8 md:pt-14"
        >
          {rightCategories.map((c) => (
            <a
              key={c.t}
              href="#shop"
              className={`${c.bg} group overflow-hidden rounded-[2.5rem] relative aspect-[4/5] flex items-end p-8 shadow-md transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl ring-2 ring-transparent hover:ring-foreground/10 block`}
            >
              {/* Auto-Playing Looping Video with Static Poster fallback & Deep Hover Zoom */}
              <video
                src={c.video}
                poster={c.img}
                autoPlay
                loop
                muted
                playsInline
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-[800ms] ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-110"
              />
              {/* Subtle background overlay darkens slightly on hover to make white text pop */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent opacity-85 group-hover:opacity-95 group-hover:bg-black/20 transition-all duration-500 pointer-events-none" />
              <div className="relative z-10 pointer-events-none">
                <span className="pill mb-2 inline-block bg-white/20 backdrop-blur-md px-3 py-0.5 text-xs font-semibold uppercase tracking-wider text-white">
                  {c.tag}
                </span>
                <h3 className="text-3xl md:text-4xl text-white font-serif italic drop-shadow-md group-hover:translate-x-1.5 transition-transform duration-500">
                  {c.t}
                </h3>
              </div>
            </a>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
