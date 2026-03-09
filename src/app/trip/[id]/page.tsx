"use client";

import { use } from "react";
import { CalendarDays, ArrowRight } from "lucide-react";
import { TicketButton } from "@/components/landing/StickerCard";
import Link from "next/link";
import { motion } from "framer-motion";
import { EmptyState } from "@/components/ui/empty-state";

export default function TripPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 min-h-[60vh]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-lg w-full"
      >
        <EmptyState
          variant="sticker"
          icon={CalendarDays}
          iconBgColor="yellow"
          title="Your Journey Awaits!"
          description="You've created a new trip. Start by checking your timeline or inviting friends."
          action={
            <Link href={`/trip/${id}/timeline`}>
              <TicketButton className="w-full sm:w-auto">
                Open Timeline
                <ArrowRight className="w-5 h-5 ml-2" strokeWidth={3} />
              </TicketButton>
            </Link>
          }
        />
      </motion.div>
    </div>
  );
}
