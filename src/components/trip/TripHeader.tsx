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
  Edit
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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

  return (
    <div className="relative">
      {/* Cover Image */}
      <div className="relative h-40 md:h-64 lg:h-80 w-full overflow-hidden md:rounded-3xl">
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20 z-10" />

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={trip.coverImage || "/placeholder-trip.jpg"}
          alt={trip.name}
          className="object-cover w-full h-full"
        />

        {/* Back Button - Mobile */}
        <div className="absolute top-4 left-4 z-20 md:hidden">
          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full bg-black/30 backdrop-blur-md text-white hover:bg-black/50" asChild>
            <Link href="/dashboard">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        {/* Actions - Top Right */}
        <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
          <Button variant="ghost" size="icon" className="h-8 w-8 md:h-10 md:w-10 rounded-full bg-black/30 backdrop-blur-md text-white hover:bg-black/50">
            <Share2 className="h-4 w-4 md:h-5 md:w-5" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 md:h-10 md:w-10 rounded-full bg-black/30 backdrop-blur-md text-white hover:bg-black/50">
                <MoreHorizontal className="h-4 w-4 md:h-5 md:w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Edit className="h-4 w-4 mr-2" />
                Edit Trip
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Users className="h-4 w-4 mr-2" />
                Manage Members
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">
                Delete Trip
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Title & Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 z-20">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3 md:gap-4">
            <div className="space-y-1 md:space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge className="bg-black/40 hover:bg-black/40 text-white backdrop-blur-md border-0 text-[10px] md:text-xs">
                  {daysDuration} days
                </Badge>
                {isUpcoming && daysUntilTrip <= 30 && (
                  <Badge className="bg-gradient-to-r from-emerald-500 to-teal-600 border-0 text-white text-[10px] md:text-xs">
                    In {daysUntilTrip} days
                  </Badge>
                )}
              </div>
              <h1 className="text-xl md:text-4xl font-bold text-white drop-shadow-lg leading-tight">
                {trip.name}
              </h1>
              <div className="flex items-center gap-3 md:gap-4 text-white/80 text-xs md:text-base">
                <div className="flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 md:h-4 md:w-4" />
                  <span>{trip.destination}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 md:h-4 md:w-4" />
                  <span>
                    {format(trip.startDate, "MMM d")} - {format(trip.endDate, "MMM d, yyyy")}
                  </span>
                </div>
              </div>
            </div>

            {/* Members */}
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2">
                {trip.members.slice(0, 4).map((member, i) => (
                  <Avatar
                    key={member.id}
                    className="h-7 w-7 md:h-9 md:w-9 border-2 border-white ring-0"
                    style={{ zIndex: 4 - i }}
                  >
                    <AvatarImage src={member.user.avatar} alt={member.user.name} />
                    <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white text-[10px] md:text-xs font-medium">
                      {member.user.name[0]}
                    </AvatarFallback>
                  </Avatar>
                ))}
                {trip.members.length > 4 && (
                  <div className="h-7 w-7 md:h-9 md:w-9 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center text-[10px] md:text-xs font-bold text-white border-2 border-white">
                    +{trip.members.length - 4}
                  </div>
                )}
              </div>
              <Button variant="ghost" size="sm" className="hidden md:flex h-9 rounded-full bg-white/10 backdrop-blur-md text-white hover:bg-white/20 border-0">
                <Users className="h-4 w-4 mr-2" />
                Invite
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Back Button */}
      <div className="hidden md:block absolute top-4 left-4 z-20">
        <Button variant="ghost" size="sm" className="h-9 rounded-full bg-black/30 backdrop-blur-md text-white hover:bg-black/50" asChild>
          <Link href="/dashboard">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Link>
        </Button>
      </div>
    </div>
  );
}
