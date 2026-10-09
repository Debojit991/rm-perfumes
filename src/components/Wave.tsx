import React from "react";
import { motion } from "framer-motion";

interface WaveProps {
  fill: string;
  flip?: boolean | undefined;
}

export function Wave({ fill, flip }: WaveProps) {
  return (
    <div className={`overflow-hidden w-full ${flip ? "rotate-180" : ""}`} aria-hidden>
      {/* Infinite looping organic wave: duplicate path to be 200% width */}
      <motion.div
        className="flex w-[200%]"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ repeat: Infinity, ease: "linear", duration: 25 }}
      >
        <svg
          viewBox="0 0 1440 80"
          preserveAspectRatio="none"
          className={`block h-12 w-1/2 md:h-20 ${fill} shrink-0`}
        >
          <path
            fill="currentColor"
            d="M0,40 C240,90 480,0 720,30 C960,60 1200,10 1440,40 L1440,80 L0,80 Z"
          />
        </svg>
        <svg
          viewBox="0 0 1440 80"
          preserveAspectRatio="none"
          className={`block h-12 w-1/2 md:h-20 ${fill} shrink-0`}
        >
          <path
            fill="currentColor"
            d="M0,40 C240,90 480,0 720,30 C960,60 1200,10 1440,40 L1440,80 L0,80 Z"
          />
        </svg>
      </motion.div>
    </div>
  );
}

export default Wave;
