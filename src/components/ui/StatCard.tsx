"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { getCoverStickerClass } from "@/lib/colors";
import { TrendingUp, Sparkles, Globe2, Bookmark, Plane, CalendarDays } from "lucide-react";
import { motion } from "framer-motion";

const ICON_MAP = {
  TrendingUp,
  Sparkles,
  Globe2,
  Bookmark,
  Plane,
  CalendarDays,
} as const;

type StatIconName = keyof typeof ICON_MAP;

interface StatCardProps {
  label: string;
  value: number;
  icon: StatIconName;
  coverColor?: "electric" | "coral" | "sky" | "amber" | "lime" | "pink";
  className?: string;
  rotation?: number;
}

export function StatCard({
  label,
  value,
  icon: iconName,
  coverColor = "electric",
  className,
  rotation = 0,
}: StatCardProps) {
  const Icon = ICON_MAP[iconName] ?? TrendingUp;
  const bgColor = getCoverStickerClass(coverColor);

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ duration: 0.2 }}
      style={{ rotate: rotation }}
      className={cn(
        "rounded-2xl border-2 border-border p-5 md:p-3 flex gap-4 items-center shadow-sticker-card",
        bgColor,
        className
      )}
    >
      <div
        className={cn(
          "w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center",
          "bg-white/40"
        )}
      >
        <Icon className={cn("h-4 w-4 md:h-3.5 md:w-3.5", "text-foreground")} strokeWidth={2.5} />
      </div>
      <div className="flex flex-col">
      <div className={cn("font-black text-2xl md:text-xl text-text-primary")}>
        {value}
      </div>
      <div className={cn("text-xs font-bold opacity-80 text-text-secondary")}>
        {label}
      </div>
      </div>
    </motion.div>
  );
}
