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
    <div className="px-4 md:px-0 min-w-0">
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
          <span className="text-[8px] sm:text-[9px] font-bold text-muted-foreground tabular-nums truncate">TRIP · {trip.id.slice(0, 8).toUpperCase()}</span>
        </div>

        <div className="flex flex-col md:flex-row">
          {/* Left: cover image — ticket stub with photo */}
          <div className="relative h-32 sm:h-40 md:h-auto md:w-56 lg:w-72 overflow-hidden shrink-0 border-b md:border-b-0 md:border-r border-border">
            <div className="absolute inset-0 bg-linear-to-t md:bg-linear-to-r from-black/30 via-transparent to-transparent z-1" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={trip.coverImage || "/placeholder-trip.jpg"}
              alt={trip.name}
              className="object-cover w-full h-full"
            />

            {/* Mobile overlay buttons: Back (left), Share & More (right) */}
            <div className="absolute top-2 left-2 right-2 z-20 md:hidden flex items-center justify-between">
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full bg-black/40 backdrop-blur-sm text-white hover:bg-black/60 border-0" asChild>
                <Link href="/dashboard">
                  <ArrowLeft className="h-4 w-4" />
                </Link>
              </Button>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full bg-black/40 backdrop-blur-sm text-white hover:bg-black/60 border-0" aria-label="Share trip">
                  <Share2 className="h-3.5 w-3.5" strokeWidth={2.5} />
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full bg-black/40 backdrop-blur-sm text-white hover:bg-black/60 border-0" aria-label="More options">
                      <MoreHorizontal className="h-3.5 w-3.5" strokeWidth={2.5} />
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
          </div>

          {/* Vertical perforation divider (desktop) */}
          <div className="hidden md:block w-5 shrink-0 ticket-perforation-v" />

          {/* Right: ticket fields — tighter on mobile */}
          <div className="flex-1 p-2.5 sm:p-4 md:p-5 flex flex-col justify-between gap-2.5 sm:gap-4 min-w-0">
            {/* Row 1: Trip name + status — stack on mobile so nothing clips */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 sm:gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 sm:gap-2 text-[9px] sm:text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-0.5 sm:mb-1">
                  <Plane className="h-2.5 w-2.5 sm:h-3 sm:w-3 shrink-0" />
                  <span>Passenger</span>
                </div>
                <h1 className="text-lg sm:text-xl md:text-2xl font-black text-foreground leading-tight truncate">
                  {trip.name}
                </h1>
              </div>
              <div className="shrink-0">
                <div className="text-[9px] sm:text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-0.5 hidden sm:block">Status</div>
                <StickerBadge color="yellow" className="bg-primary text-primary-foreground text-[10px] sm:text-xs px-2 sm:px-2.5 py-0.5" uppercase={false}>
                  {isPast ? "Done" : isUpcoming ? (daysUntilTrip <= 30 ? `In ${daysUntilTrip}d` : "Upcoming") : "Ongoing"}
                </StickerBadge>
              </div>
            </div>

            {/* Row 2: From → To (ticket route) */}
            <div className="flex items-center gap-1 sm:gap-2 py-1.5 sm:py-2 border-y border-dashed border-border min-w-0">
              <div className="flex-1 min-w-0">
                <div className="text-[8px] sm:text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-0.5">From</div>
                <div className="font-black text-[11px] sm:text-sm text-foreground truncate">Your plans</div>
              </div>
              <div className="shrink-0 flex items-center gap-0.5 sm:gap-1 text-muted-foreground">
                <div className="w-2 sm:w-6 border-t-2 border-dashed border-current" />
                <Plane className="h-2.5 w-2.5 sm:h-3 sm:w-3" strokeWidth={2.5} />
                <div className="w-2 sm:w-6 border-t-2 border-dashed border-current" />
              </div>
              <div className="flex-1 min-w-0 text-right">
                <div className="text-[8px] sm:text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-0.5">To</div>
                <div className="font-black text-[11px] sm:text-sm text-foreground truncate">{trip.destination}</div>
              </div>
            </div>

            {/* Row 3: Depart, Return, Duration — 2 cols on mobile so labels don't squeeze */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-3 gap-y-2 sm:gap-3 md:gap-4">
              <div className="min-w-0 hidden md:block">
                <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-0.5">Destination</div>
                <div className="flex items-center gap-1.5 font-black text-sm text-foreground">
                  <MapPin className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                  <span className="truncate">{trip.destination}</span>
                </div>
              </div>
              <div className="min-w-0">
                <div className="text-[8px] sm:text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-0.5">Depart</div>
                <div className="flex items-center gap-1 font-black text-[11px] sm:text-sm text-foreground">
                  <Calendar className="h-3 w-3 sm:h-3.5 sm:w-3.5 shrink-0 text-muted-foreground" />
                  <span className="truncate">{format(trip.startDate, "MMM d")}</span>
                </div>
              </div>
              <div className="min-w-0">
                <div className="text-[8px] sm:text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-0.5">Return</div>
                <div className="flex items-center gap-1 font-black text-[11px] sm:text-sm text-foreground">
                  <Calendar className="h-3 w-3 sm:h-3.5 sm:w-3.5 shrink-0 text-muted-foreground" />
                  <span className="truncate">{format(trip.endDate, "MMM d")}</span>
                </div>
              </div>
              <div className="min-w-0 col-span-2 sm:col-span-1">
                <div className="text-[8px] sm:text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-0.5">Duration</div>
                <div className="font-black text-[11px] sm:text-sm text-foreground">
                  {daysDuration} days
                </div>
              </div>
            </div>

            {/* Row 4: Crew + Invite — Invite visible on mobile as icon */}
            <div className="flex items-center justify-between gap-2 sm:gap-3 pt-1.5 sm:pt-2 border-t-2 border-dashed border-border min-w-0">
              <div className="flex items-center gap-2 min-w-0">
                <div className="text-[9px] sm:text-[10px] font-bold text-muted-foreground uppercase tracking-widest shrink-0">
                  Crew
                </div>
                <div className="flex -space-x-2 min-w-0">
                  {trip.members.slice(0, 4).map((member, i) => (
                    <Avatar
                      key={member.id}
                      className="h-6 w-6 sm:h-7 sm:w-7 border-2 border-card ring-0"
                      style={{ zIndex: 4 - i }}
                    >
                      <AvatarImage src={member.user.avatar} alt={member.user.name} />
                      <AvatarFallback className="bg-primary/20 text-primary text-[8px] sm:text-[10px] font-bold">
                        {member.user.name[0]}
                      </AvatarFallback>
                    </Avatar>
                  ))}
                  {trip.members.length > 4 && (
                    <div className="h-6 w-6 sm:h-7 sm:w-7 rounded-full bg-muted flex items-center justify-center text-[8px] sm:text-[10px] font-bold text-muted-foreground border-2 border-card">
                      +{trip.members.length - 4}
                    </div>
                  )}
                </div>
              </div>
              <Button variant="outline" size="sm" className="flex h-8 w-8 sm:w-auto sm:px-3 rounded-full border-2 border-border shadow-sticker-badge font-bold text-xs hover:-translate-y-px transition-all shrink-0" asChild>
                <Link href={`/trip/${trip.id}/members`}>
                  <Users className="h-3.5 w-3.5 sm:mr-1.5" strokeWidth={2.5} />
                  <span className="hidden sm:inline">Invite</span>
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
