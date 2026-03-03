"use client";

import Link from "next/link";
import { format } from "date-fns";
import { MapPin, Plane } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage, AvatarGroup } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Trip } from "@/types";
import { getGradient, getAccentBgRgba, getCoverColor, type CoverColorKey } from "@/lib/colors";

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
  const daysDuration = Math.ceil(
    (trip.endDate.getTime() - trip.startDate.getTime()) / (1000 * 60 * 60 * 24)
  );
  const daysUntilTrip = Math.ceil(
    (trip.startDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );
  const isUpcoming = daysUntilTrip > 0;
  const isPast = trip.endDate < new Date();
  const isOngoing = !isPast && !isUpcoming;

  const coverColor = getTripCoverColor(trip);
  const gradient = getGradient(coverColor);

  const eventsCount = trip._count?.events ?? 0;
  const progressPercent = Math.min(
    100,
    Math.round((eventsCount / Math.max(1, daysDuration)) * 25)
  );

  const statusBadge =
    isPast ? "completed" : isOngoing ? "ongoing" : daysUntilTrip <= 30 ? "upcoming" : "draft";

  return (
    <Link
      href={`/trip/${trip.id}/timeline`}
      className="block group min-w-[280px]"
    >
      <Card
        data-cover-color={coverColor}
        className="overflow-hidden h-[200px] flex flex-col transition-all duration-200 shadow-sm hover:-translate-y-[3px] active:scale-[0.99] border border-border hover:border-border-hover hover:shadow-lg"
      >
        {/* Top 40% - gradient header */}
        <div
          className="relative h-[40%] min-h-[72px] flex items-center justify-center overflow-hidden"
          style={{ background: gradient }}
        >
          {trip.coverImage ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={trip.coverImage}
                alt=""
                className="absolute inset-0 w-full h-full object-cover opacity-60"
              />
              <div
                className="absolute inset-0"
                style={{ background: gradient }}
              />
            </>
          ) : null}
          <div
            className="relative z-10 flex items-center justify-center w-10 h-10 rounded-xl"
            style={{ backgroundColor: getAccentBgRgba(coverColor, 0.15), color: getCoverColor(coverColor) }}
          >
            <Plane className="h-6 w-6" />
          </div>
        </div>

        {/* Main content - 60% */}
        <div className="flex-1 p-4 flex flex-col bg-bg-surface">
          <h3 className="font-bold text-base text-foreground line-clamp-1">
            {trip.name}
          </h3>
          <div className="flex items-center gap-1.5 mt-0.5 text-text-muted text-xs">
            <MapPin className="h-3 w-3 shrink-0" />
            <span className="line-clamp-1">{trip.destination}</span>
          </div>
          <div className="text-[10px] text-text-muted mt-0.5">
            {format(trip.startDate, "MMM d, yyyy")}
          </div>

          {/* Bottom: Progress + Avatars + Badge */}
          <div className="mt-auto pt-3 flex items-center justify-between gap-2">
            <div className="flex-1 min-w-0">
              <Progress
                value={progressPercent}
                accentColor={coverColor}
                className="h-1.5"
              />
            </div>
            <AvatarGroup max={3} className="shrink-0">
              {trip.members.slice(0, 3).map((member) => (
                <Avatar key={member.id} className="h-6 w-6">
                  <AvatarImage src={member.user.avatar} alt={member.user.name} />
                  <AvatarFallback className="bg-accent/20 text-accent text-[8px] font-medium">
                    {member.user.name[0]}
                  </AvatarFallback>
                </Avatar>
              ))}
            </AvatarGroup>
            <Badge
              variant={statusBadge as "upcoming" | "ongoing" | "completed" | "draft"}
              className="shrink-0 text-[10px]"
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
        </div>
      </Card>
    </Link>
  );
}
