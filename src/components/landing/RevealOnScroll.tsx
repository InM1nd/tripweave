"use client";

import { motion, type Variants } from "framer-motion";
import { type ReactNode } from "react";

const revealVariants: Variants = {
  hidden: { opacity: 0, y: 16, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.05,
    },
  },
};

interface RevealOnScrollProps {
  children: ReactNode;
  className?: string;
  stagger?: boolean;
  delay?: number;
  direction?: "up" | "down" | "left" | "right";
}

export function RevealOnScroll({
  children,
  className,
  stagger = false,
  delay = 0,
  direction = "up",
}: RevealOnScrollProps) {
  const directionOffset = {
    up: { y: 16, x: 0 },
    down: { y: -16, x: 0 },
    left: { y: 0, x: -20 },
    right: { y: 0, x: 20 },
  };

  const offset = directionOffset[direction];

  const variants: Variants = stagger
    ? staggerContainer
    : {
        hidden: { opacity: 0, ...offset, scale: 0.97 },
        visible: {
          opacity: 1,
          y: 0,
          x: 0,
          scale: 1,
          transition: {
            duration: 0.5,
            delay,
            ease: [0.16, 1, 0.3, 1],
          },
        },
      };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      variants={variants}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function RevealItem({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div variants={revealVariants} className={className}>
      {children}
    </motion.div>
  );
}
