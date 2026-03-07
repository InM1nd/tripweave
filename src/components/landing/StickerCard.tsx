"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { type ReactNode } from "react";

type StickerColor = "pink" | "blue" | "green" | "lilac" | "yellow" | "coral" | "olive" | "primary" | "card";

const colorMap: Record<StickerColor, string> = {
  pink: "bg-sticker-pink",
  blue: "bg-sticker-blue",
  green: "bg-sticker-green",
  lilac: "bg-sticker-lilac",
  yellow: "bg-sticker-yellow",
  coral: "bg-sticker-coral text-white",
  olive: "bg-sticker-olive text-white",
  primary: "bg-primary text-primary-foreground",
  card: "bg-card",
};

interface StickerCardProps {
  children: ReactNode;
  color?: StickerColor;
  rotate?: number;
  className?: string;
  hoverLift?: boolean;
  tape?: boolean;
}

export function StickerCard({
  children,
  color = "card",
  rotate = 0,
  className,
  hoverLift = true,
  tape = false,
}: StickerCardProps) {
  return (
    <motion.div
      style={{ rotate }}
      whileHover={
        hoverLift
          ? { y: -5, rotate: 0, boxShadow: "0 12px 0 rgba(0,0,0,0.10), 0 4px 24px rgba(0,0,0,0.08)" }
          : undefined
      }
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={cn(
        "rounded-3xl border-2 border-border p-6 text-foreground relative",
        "shadow-[0_6px_0_rgba(0,0,0,0.10),0_2px_12px_rgba(0,0,0,0.06)]",
        colorMap[color],
        tape && "tape-strip",
        className
      )}
    >
      {children}
    </motion.div>
  );
}

interface StampBadgeProps {
  children: ReactNode;
  className?: string;
  color?: StickerColor;
}

export function StampBadge({
  children,
  className,
  color = "primary",
}: StampBadgeProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "inline-flex items-center gap-2 px-5 py-2.5 rounded-full border-2 border-border font-black text-sm uppercase tracking-widest",
        "shadow-[0_4px_0_rgba(0,0,0,0.08),0_2px_8px_rgba(0,0,0,0.05)]",
        colorMap[color],
        className
      )}
    >
      {children}
    </motion.div>
  );
}

interface TicketButtonProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  href?: string;
}

export function TicketButton({
  children,
  className,
  onClick,
}: TicketButtonProps) {
  return (
    <motion.span
      role="button"
      onClick={onClick}
      className={cn(
        "relative bg-primary text-primary-foreground font-black text-lg pl-10 pr-10 py-4 inline-flex items-center justify-center gap-3 cursor-pointer select-none",
        "rounded-none",
        "shadow-[0_6px_0_rgba(0,0,0,0.10),0_2px_12px_rgba(0,0,0,0.06)]",
        "transition-[transform,box-shadow] duration-200 ease-out",
        "hover:shadow-[0_9px_0_rgba(0,0,0,0.10),0_4px_20px_rgba(0,0,0,0.08)] hover:-translate-y-0.5",
        "active:shadow-[0_2px_0_rgba(0,0,0,0.12)] active:translate-y-0.5",
        "animate-wiggle-cta",
        "overflow-visible isolate",
        className
      )}
    >
      <span className="absolute left-0 top-0 bottom-0 w-6 ticket-edge pointer-events-none" />
      <span className="absolute right-0 top-0 bottom-0 w-6 ticket-edge rotate-180 pointer-events-none" />
      {children}
    </motion.span>
  );
}
