"use client";

import { Plus } from "lucide-react";
import { motion } from "framer-motion";

export function NewTripCard() {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="hidden md:flex w-full h-[180px] flex-col items-center justify-center p-8 border-4 border-dashed rounded-3xl border-border bg-card/50 hover:bg-secondary/40 transition-colors cursor-pointer group"
      onClick={() => {
        document.getElementById("create-trip-trigger")?.click();
      }}
    >
      <div className="h-14 w-14 rounded-full bg-background border-2 border-border shadow-sticker-sm group-hover:shadow-sticker-card group-hover:-translate-y-1 flex items-center justify-center mb-4 transition-all">
        <Plus className="h-6 w-6 text-foreground" strokeWidth={3} />
      </div>
      <h3 className="font-bold text-xl text-foreground mb-1">
        New Adventure
      </h3>
      <p className="text-sm font-medium text-muted-foreground text-center max-w-[180px]">
        Start planning your next trip
      </p>
    </motion.div>
  );
}
