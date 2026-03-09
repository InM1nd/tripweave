"use client";

import { motion, type Variants } from "framer-motion";
import { type ReactNode } from "react";

const stickerRevealVariants: Variants = {
  hidden: { opacity: 0, y: 12, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

interface StickerAnimatorProps {
  children: ReactNode;
  delay?: number;
  className?: string;
}

export function StickerAnimator({
  children,
  delay = 0,
  className,
}: StickerAnimatorProps) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={stickerRevealVariants}
      transition={{ delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
