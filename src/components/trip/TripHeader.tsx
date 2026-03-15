"use client";

import Link from "next/link";
import { format } from "date-fns";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Users,
  Share2,
  MoreHorizontal,
  Edit,
  Plane,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { StickerBadge } from "@/components/ui/StickerBadge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Trip } from "@/types";

interface TripHeaderProps {
  trip: Trip;
}

export function TripHeader({ trip }: TripHeaderProps) {
  const daysDuration = Math.ceil(
    (trip.endDate.getTime() - trip.startDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  const daysUntilTrip = Math.ceil(
    (trip.startDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );

  const isUpcoming = daysUntilTrip > 0;
  const isPast = trip.endDate < new Date();

  return (
    <div className="min-w-0">
      {/* Row above card: Back (left) + Share & More (right) — hidden on mobile since Back is on the cover image */}
      <div className="hidden md:flex items-center justify-between gap-2 mb-2">
        <Button
          variant="outline"
          size="sm"
          className="h-9 rounded-full font-bold border-2 border-border bg-card text-foreground shadow-sticker-sm hover:-translate-y-px hover:shadow-sticker-card transition-all -ml-1"
          asChild
        >
          <Link href="/dashboard">
            <ArrowLeft className="h-3.5 w-3.5 mr-1.5" strokeWidth={2.5} />
            Back
          </Link>
        </Button>
        <div className="flex items-center gap-2 ml-auto">
          <Button
            variant="stickerIcon"
            size="icon"
            aria-label="Share trip"
          >
            <Share2 className="h-4 w-4" strokeWidth={2.5} />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="stickerIcon"
                size="icon"
                aria-label="More options"
              >
                <MoreHorizontal className="h-4 w-4" strokeWidth={2.5} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="rounded-2xl border-2 border-border shadow-sticker-elevated">
              <DropdownMenuItem className="rounded-xl">
                <Edit className="h-4 w-4 mr-2" />
                Edit Trip
              </DropdownMenuItem>
              <DropdownMenuItem className="rounded-xl">
                <Users className="h-4 w-4 mr-2" />
                Manage Members
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive rounded-xl">
                Delete Trip
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Boarding pass style card */}
      <div className="rounded-2xl md:rounded-3xl border-2 border-border bg-card shadow-sticker-card overflow-hidden">
        {/* Ticket top: airline (no barcode) — compact on mobile */}
        <div className="flex items-center justify-between gap-2 px-2.5 sm:px-4 py-1 sm:py-1.5 bg-muted/30 border-b border-border min-w-0">
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            <Plane className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-muted-foreground" strokeWidth={2.5} />
            <span className="text-[8px] sm:text-[9px] font-black text-muted-foreground uppercase tracking-widest">TripWeave</span>
          </div>
          <span className="text-[8px] sm:text-[9px] font-bold text-muted-foreground tabular-nums truncate min-w-0">TRIP · {trip.id.slice(0, 8).toUpperCase()}</span>
        </div>

        <div className="flex flex-col md:flex-row">
          {/* Left: cover image — ticket stub with photo, hard inset shadow (pressed into ticket) */}
          <div
            className="relative h-32 sm:h-40 md:h-auto md:w-56 lg:w-72 overflow-hidden shrink-0 border-b md:border-b-0 md:border-r border-border"
            style={{
              boxShadow: "inset 0 0 0 10px rgba(0,0,0,0.22), inset 0 6px 0 0 rgba(0,0,0,0.18), inset 0 -4px 0 0 rgba(0,0,0,0.12), inset 6px 0 0 0 rgba(0,0,0,0.15), inset -6px 0 0 0 rgba(0,0,0,0.12)",
            }}
          >
            {trip.coverImage && (
              <div className="absolute inset-0 bg-linear-to-t md:bg-linear-to-r from-black/30 via-transparent to-transparent pointer-events-none z-1" aria-hidden />
            )}
            {trip.coverImage ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={trip.coverImage}
                alt={trip.name}
                className="object-cover w-full h-full relative z-0"
              />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 sm:gap-3 bg-linear-to-br from-muted/60 via-muted/40 to-primary/10 z-0">
                <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-2xl border-2 border-border bg-card/80 flex items-center justify-center shadow-sticker-sm">
                  <Plane className="h-6 w-6 sm:h-7 sm:w-7 text-muted-foreground" strokeWidth={2} />
                </div>
                <span className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-muted-foreground px-2 text-center">
                  No cover
                </span>
              </div>
            )}

          </div>

          {/* Right: ticket fields */}
          <div className="flex-1 p-3 sm:p-4 md:p-5 flex flex-col justify-between gap-3 sm:gap-4 min-w-0">
            {/* Row 1: Trip name + status */}
            <div className="flex items-start justify-between gap-2 sm:gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">
                  <Plane className="h-2.5 w-2.5 shrink-0" />
                  <span>Passenger</span>
                </div>
                <h1 className="text-xl sm:text-2xl md:text-2xl font-black text-foreground leading-tight truncate">
                  {trip.name}
                </h1>
              </div>
              <div className="shrink-0 pt-0.5">
                <StickerBadge color="yellow" className="bg-primary text-primary-foreground text-xs px-2.5 py-1" uppercase={false}>
                  {isPast ? "Done" : isUpcoming ? (daysUntilTrip <= 30 ? `In ${daysUntilTrip}d` : "Upcoming") : "Ongoing"}
                </StickerBadge>
              </div>
            </div>

            {/* Row 2: From → To */}
            <div className="flex items-center gap-2 py-2 border-y border-dashed border-border min-w-0">
              <div className="flex-1 min-w-0 shrink">
                <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-0.5">From</div>
                <div className="font-black text-sm text-foreground truncate">Your plans</div>
              </div>
              <div className="shrink-0 flex items-center gap-1 text-muted-foreground">
                <div className="w-3 sm:w-6 border-t-2 border-dashed border-current" />
                <Plane className="h-3 w-3 shrink-0" strokeWidth={2.5} />
                <div className="w-3 sm:w-6 border-t-2 border-dashed border-current" />
              </div>
              <div className="flex-1 min-w-0 shrink text-right">
                <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-0.5">To</div>
                <div className="font-black text-sm text-foreground truncate">{trip.destination}</div>
              </div>
            </div>

            {/* Row 3: Depart, Return, Duration */}
            <div className="grid grid-cols-3 md:grid-cols-4 gap-x-2 gap-y-2 sm:gap-3 min-w-0">
              <div className="min-w-0 hidden md:block">
                <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-0.5">Destination</div>
                <div className="flex items-center gap-1.5 font-black text-sm text-foreground">
                  <MapPin className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                  <span className="truncate">{trip.destination}</span>
                </div>
              </div>
              <div className="min-w-0">
                <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-0.5">Depart</div>
                <div className="flex items-center gap-1 font-black text-sm text-foreground">
                  <Calendar className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                  <span className="truncate">{format(trip.startDate, "MMM d")}</span>
                </div>
              </div>
              <div className="min-w-0">
                <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-0.5">Return</div>
                <div className="flex items-center gap-1 font-black text-sm text-foreground">
                  <Calendar className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                  <span className="truncate">{format(trip.endDate, "MMM d")}</span>
                </div>
              </div>
              <div className="min-w-0">
                <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-0.5">Duration</div>
                <div className="font-black text-sm text-foreground">
                  {daysDuration} days
                </div>
              </div>
            </div>

            {/* Row 4: Crew + Invite */}
            <div className="flex items-center justify-between gap-2 pt-2 border-t-2 border-dashed border-border min-w-0">
              <div className="flex items-center gap-2 min-w-0">
                <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest shrink-0">
                  Crew
                </div>
                <div className="flex -space-x-2 min-w-0">
                  {trip.members.slice(0, 4).map((member, i) => (
                    <Avatar
                      key={member.id}
                      className="h-7 w-7 border-2 border-card ring-0"
                      style={{ zIndex: 4 - i }}
                    >
                      <AvatarImage src={member.user.avatar} alt={member.user.name} />
                      <AvatarFallback className="bg-primary/20 text-primary text-[10px] font-bold">
                        {member.user.name[0]}
                      </AvatarFallback>
                    </Avatar>
                  ))}
                  {trip.members.length > 4 && (
                    <div className="h-7 w-7 rounded-full bg-muted flex items-center justify-center text-[10px] font-bold text-muted-foreground border-2 border-card">
                      +{trip.members.length - 4}
                    </div>
                  )}
                </div>
              </div>
              <Button variant="outline" size="sm" className="h-8 px-4 rounded-full border-2 border-border shadow-sticker-sm font-bold text-xs hover:-translate-y-px transition-all shrink-0 gap-1.5" asChild>
                <Link href={`/trip/${trip.id}/members`}>
                  <Users className="h-3.5 w-3.5" strokeWidth={2.5} />
                  <span>Invite</span>
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom perforation — tear line */}
        <div className="section-perforation" />
      </div>

    </div>
  );
}
