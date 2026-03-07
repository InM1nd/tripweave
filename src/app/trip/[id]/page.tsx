"use client";

import { use } from "react";
import { Plane, CalendarDays, ArrowRight } from "lucide-react";
import { TicketButton } from "@/components/landing/StickerCard";
import Link from "next/link";
import { motion } from "framer-motion";

export default function TripPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 min-h-[60vh]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-sticker-yellow rounded-3xl p-8 md:p-12 border-4 border-dashed border-border shadow-[0_8px_0_rgba(0,0,0,0.1)] max-w-lg w-full text-center relative overflow-hidden"
      >
        <Plane className="absolute -bottom-10 -right-10 w-48 h-48 opacity-10 -rotate-12 pointer-events-none" />

        <div className="bg-black/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-border shadow-[0_4px_0_rgba(0,0,0,0.06)]">
          <CalendarDays className="w-8 h-8 text-foreground" strokeWidth={2.5} />
        </div>

        <h2 className="text-3xl md:text-4xl font-black mb-3 text-foreground leading-tight">Your Journey <br />Awaits!</h2>
        <p className="text-foreground/80 font-bold mb-8 text-lg max-w-sm mx-auto">
          You&apos;ve created a new trip. Start by checking your timeline or inviting friends.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href={`/trip/${id}/timeline`}>
            <TicketButton className="w-full sm:w-auto">
              Open Timeline
              <ArrowRight className="w-5 h-5 ml-2" strokeWidth={3} />
            </TicketButton>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
