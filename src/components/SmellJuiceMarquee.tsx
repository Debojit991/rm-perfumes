import React, { useState } from "react";
import { motion } from "framer-motion";
import hero from "@/assets/hero-kiwi.jpg";
import melon from "@/assets/p-watermelon.jpg";
import peach from "@/assets/p-peach.jpg";
import vanilla from "@/assets/p-vanilla.jpg";

interface SocialPost {
  img: string;
  handle: string;
}

const POSTS: SocialPost[] = [
  { img: hero, handle: "@aanya.vibes" },
  { img: melon, handle: "@rohan.daily" },
  { img: peach, handle: "@mira_glows" },
  { img: vanilla, handle: "@kabirspritz" },
];

export function SmellJuiceMarquee() {
  const [isHovered, setIsHovered] = useState(false);
  // Task 6: Clone array of 4 images to create a seamless infinite marquee
  const marqueeItems = [...POSTS, ...POSTS, ...POSTS, ...POSTS];

  return (
    <section className="bg-background pt-10 pb-20 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 md:px-8 text-center mb-12">
        <span className="pill mb-3 inline-block bg-muted px-4 py-1 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Community
        </span>
        <h2 className="text-4xl md:text-5xl font-medium tracking-tight">
          #SmellJuicé
        </h2>
        <p className="mt-3 text-center text-foreground/75 max-w-md mx-auto text-sm md:text-base">
          Real people, real spritzes. Tag us on socials to be featured in our gallery.
        </p>
      </div>

      {/* Marquee Wrapper with Pause on Hover */}
      <div
        className="relative w-full overflow-hidden select-none"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <motion.div
          className="flex gap-4 md:gap-6 w-max cursor-grab active:cursor-grabbing"
          animate={{ x: ["0%", "-50%"] }}
          transition={{
            repeat: Infinity,
            ease: "linear",
            duration: 20,
          }}
          style={{
            animationPlayState: isHovered ? "paused" : "running",
          }}
        >
          {marqueeItems.map((post, idx) => (
            <div
              key={idx}
              className="relative w-64 md:w-72 shrink-0 overflow-hidden rounded-[2rem] group shadow-sm transition-transform duration-300 hover:scale-[1.03]"
            >
              <img
                src={post.img}
                alt={`Community post by ${post.handle}`}
                loading="lazy"
                className="aspect-[3/4] w-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
              <span className="pill absolute bottom-3.5 left-3.5 bg-card/90 backdrop-blur-md px-3.5 py-1 text-xs font-medium text-foreground shadow-sm">
                {post.handle}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

export default SmellJuiceMarquee;
