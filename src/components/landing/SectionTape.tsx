"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { getStickerBgClass, type StickerColorKey } from "@/lib/design-tokens";

type Position = "top-left" | "top-right" | "bottom-left" | "bottom-right";
type TapeColor = StickerColorKey;

interface SectionTapeProps {
  position?: Position;
  rotation?: number;
  color?: TapeColor;
  className?: string;
}

const positionMap: Record<Position, { classes: string; defaultRotation: number }> = {
  "top-left":     { classes: "top-4 left-4",   defaultRotation: -42 },
  "top-right":    { classes: "top-4 right-4",   defaultRotation:  42 },
  "bottom-left":  { classes: "bottom-4 left-4", defaultRotation:  42 },
  "bottom-right": { classes: "bottom-4 right-4",defaultRotation: -42 },
};

export function SectionTape({
  position = "top-left",
  rotation,
  color = "yellow",
  className,
}: SectionTapeProps) {
  const { classes, defaultRotation } = positionMap[position];
  const rotate = rotation ?? defaultRotation;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      style={{ rotate }}
      aria-hidden="true"
      className={cn(
        "absolute z-20 pointer-events-none hidden sm:block",
        classes,
        className
      )}
    >
      {/* Tape strip body */}
      <div
        className={cn(
          "section-tape relative w-[72px] h-[22px] rounded-sm opacity-75",
          "shadow-sticker-sm-soft",
          getStickerBgClass(color).split(" ")[0]
        )}
      >
        {/* Left crinkle edge */}
        <div className="absolute left-0 top-0 bottom-0 w-[6px] bg-black/10 rounded-l-sm" />
        {/* Right crinkle edge */}
        <div className="absolute right-0 top-0 bottom-0 w-[6px] bg-black/10 rounded-r-sm" />
        {/* Tape sheen highlight */}
        <div className="absolute inset-x-[6px] top-0 h-[40%] bg-white/20 rounded-sm" />
      </div>
    </motion.div>
  );
}
