import React, { useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string | undefined;
  maxPull?: number | undefined;
  onClick?: (() => void) | undefined;
}

export function MagneticButton({
  children,
  className = "",
  maxPull = 18,
  onClick,
}: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null);

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);

  // Tight spring (stiffness: 400, damping: 25)
  const springConfig = { stiffness: 400, damping: 25 };
  const x = useSpring(rawX, springConfig);
  const y = useSpring(rawY, springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const distanceX = e.clientX - centerX;
    const distanceY = e.clientY - centerY;

    // Constrain pull to maxPull (15-20px)
    const pullX = Math.max(-maxPull, Math.min(maxPull, distanceX * 0.35));
    const pullY = Math.max(-maxPull, Math.min(maxPull, distanceY * 0.35));

    rawX.set(pullX);
    rawY.set(pullY);
  };

  const handleMouseLeave = () => {
    rawX.set(0);
    rawY.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={{ x, y }}
      className={`inline-block ${className}`}
    >
      {children}
    </motion.div>
  );
}

export default MagneticButton;
