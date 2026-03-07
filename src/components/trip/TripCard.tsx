"use client";

import Link from "next/link";
import { format } from "date-fns";
import { MapPin, Plane } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Trip } from "@/types";
import { type CoverColorKey } from "@/lib/colors";
import { motion } from "framer-motion";

const COVER_COLORS: CoverColorKey[] = [
  "electric",
  "coral",
  "lime",
  "sky",
  "amber",
  "pink",
];

function getTripCoverColor(trip: Trip): CoverColorKey {
  const raw = trip.coverColor;
  if (raw && COVER_COLORS.includes(raw as CoverColorKey)) {
    return raw as CoverColorKey;
  }
  return "electric";
}

export function TripCard({ trip }: { trip: Trip }) {
  const daysUntilTrip = Math.ceil(
    (trip.startDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );
  const isUpcoming = daysUntilTrip > 0;
  const isPast = trip.endDate < new Date();
  const isOngoing = !isPast && !isUpcoming;

  const coverColor = getTripCoverColor(trip);

  const statusBadge =
    isPast ? "completed" : isOngoing ? "ongoing" : daysUntilTrip <= 30 ? "upcoming" : "draft";

  return (
    <Link
      href={`/trip/${trip.id}/timeline`}
      className="block w-full min-w-0 group"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        whileHover={{ y: -6, scale: 1.02 }}
        className={cn(
          "overflow-hidden h-[180px] flex flex-col rounded-2xl p-5 md:p-4 border-2 border-border relative shadow-[0_4px_0_rgba(0,0,0,0.08)] group-hover:shadow-[0_8px_0_rgba(0,0,0,0.12)] transition-shadow",
          {
            'bg-sticker-yellow text-foreground': coverColor === 'electric' || coverColor === 'amber',
            'bg-sticker-coral text-white': coverColor === 'coral',
            'bg-sticker-blue text-foreground': coverColor === 'sky',
            'bg-sticker-pink text-foreground': coverColor === 'pink',
            'bg-sticker-green text-foreground': coverColor === 'lime',
          }
        )}
      >
        {/* Top prominent icon */}
        <div className="flex justify-between items-start z-10 relative">
          <div className="bg-black/15 p-2 md:p-1.5 rounded-full border-2 border-transparent group-hover:border-black/10 transition-colors">
            <Plane className="h-5 w-5 md:h-4 md:w-4" strokeWidth={3} />
          </div>
          <Badge
            variant="outline"
            className="shrink-0 text-[10px] font-black uppercase tracking-widest border-2 border-current/20 px-3 py-1.5 bg-black/5 shadow-none rounded-full"
          >
            {statusBadge === "upcoming"
              ? `In ${daysUntilTrip}d`
              : statusBadge === "ongoing"
                ? "Ongoing"
                : statusBadge === "completed"
                  ? "Done"
                  : "Upcoming"}
          </Badge>
        </div>

        {/* Main content */}
        <div className="mt-auto flex flex-col z-10 relative">
          <h3 className="font-bold text-2xl md:text-xl line-clamp-1 leading-none mb-1.5">
            {trip.name}
          </h3>
          <div className="flex items-center gap-1.5 font-semibold opacity-80 text-xs">
            <MapPin className="h-3.5 w-3.5 shrink-0" strokeWidth={3} />
            <span className="line-clamp-1">{trip.destination}</span>
          </div>
          <div className="text-[10px] font-medium opacity-70 mt-1.5 uppercase tracking-wider flex items-center gap-1">
            {format(trip.startDate, "MMM d")} <span className="mx-0.5 opacity-50">—</span> {format(trip.endDate, "MMM d, yyyy")}
          </div>
        </div>

        {/* Decorative elements - simple flat shapes */}
        <div className="absolute -bottom-6 -right-6 opacity-[0.08] pointer-events-none transition-transform group-hover:scale-110 duration-300">
          <Plane className="h-32 w-32 md:h-28 md:w-28" strokeWidth={3} />
        </div>
      </motion.div>
    </Link>
  );
}
