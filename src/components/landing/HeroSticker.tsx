"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { getStickerBgClass, type StickerColorKey } from "@/lib/design-tokens";

const SHADOW_CLASSES = {
  elevated: "shadow-sticker-elevated",
  card: "shadow-sticker-card",
  "card-hover": "shadow-sticker-card-hover",
} as const;

const SHAPE_CLASSES: Record<
  "stadium" | "rect" | "tag" | "squircle" | "pill" | "blob" | "circle",
  string
> = {
  stadium: "sticker-shape-stadium",
  rect: "sticker-shape-rect",
  tag: "sticker-shape-tag",
  squircle: "sticker-shape-squircle",
  pill: "sticker-shape-pill",
  blob: "sticker-shape-blob",
  circle: "rounded-full",
};

function ParallaxWrapper({
  children,
  speed = 0.1,
  className,
}: {
  children: React.ReactNode;
  speed?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, speed * -120]);
  return (
    <motion.div ref={ref} style={{ y }} className={className}>
      {children}
    </motion.div>
  );
}

export type HeroStickerProps = {
  children: React.ReactNode;
  color: StickerColorKey;
  shape?: "stadium" | "rect" | "tag" | "squircle" | "pill" | "blob" | "circle";
  shadow?: "elevated" | "card" | "card-hover";
  rotate?: number;
  className?: string;
  animate?: { delay?: number; y?: number; scale?: number };
  parallax?: boolean;
  parallaxSpeed?: number;
};

export function HeroSticker({
  children,
  color,
  shape,
  shadow = "elevated",
  rotate,
  className = "",
  animate = {},
  parallax = false,
  parallaxSpeed = 0.1,
}: HeroStickerProps) {
  const {
    delay = 0,
    y: animateY = -20,
    scale = 1,
  } = animate;

  const shadowClass = SHADOW_CLASSES[shadow];
  const shapeClass = shape ? SHAPE_CLASSES[shape] : "";

  const sticker = (
    <motion.div
      initial={{
        opacity: 0,
        y: animateY,
        scale: scale !== 1 ? scale : undefined,
      }}
      animate={{
        opacity: 1,
        y: 0,
        scale: 1,
      }}
      transition={{
        delay,
        duration: scale !== 1 ? 0.5 : 0.6,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={`${getStickerBgClass(color)} border-2 border-border ${shadowClass} ${shapeClass} ${parallax ? "" : className}`.trim()}
      style={rotate !== undefined && rotate !== 0 ? { rotate } : undefined}
    >
      {children}
    </motion.div>
  );

  if (parallax) {
    return (
      <ParallaxWrapper speed={parallaxSpeed} className={className || undefined}>
        {sticker}
      </ParallaxWrapper>
    );
  }
  return sticker;
}
