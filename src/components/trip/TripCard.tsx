"use client";

import Link from "next/link";
import { format } from "date-fns";
import { Calendar, MapPin, ChevronRight, Users } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Trip } from "@/types";

interface TripCardProps {
  trip: Trip;
}

export function TripCard({ trip }: TripCardProps) {
  const daysDuration = Math.ceil(
    (trip.endDate.getTime() - trip.startDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  const daysUntilTrip = Math.ceil(
    (trip.startDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );

  const isUpcoming = daysUntilTrip > 0;
  const isPast = trip.endDate < new Date();

  return (
    <Link href={`/trip/${trip.id}/timeline`} className="block group">
      <Card className="overflow-hidden border-border/40 hover:border-primary/40 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 active:scale-[0.98] h-full flex flex-col bg-card/80 backdrop-blur-sm">
        {/* Image Container */}
        <div className="relative aspect-[16/9] w-full overflow-hidden">
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10 z-10" />

          {/* Cover Image */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={trip.coverImage || "/placeholder-trip.jpg"}
            alt={trip.name}
            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-700 ease-out"
          />

          {/* Duration Badge */}
          <div className="absolute top-3 left-3 z-20">
            <Badge className="bg-black/40 hover:bg-black/40 text-white backdrop-blur-md border-0 font-medium">
              {daysDuration} days
            </Badge>
          </div>

          {/* Status Badge */}
          {isUpcoming && daysUntilTrip <= 30 && (
            <div className="absolute top-3 right-3 z-20">
              <Badge className="bg-gradient-to-r from-emerald-500 to-teal-600 border-0 text-white font-medium shadow-lg">
                In {daysUntilTrip}d
              </Badge>
            </div>
          )}
          {isPast && (
            <div className="absolute top-3 right-3 z-20">
              <Badge variant="secondary" className="bg-muted/80 backdrop-blur-md border-0">
                Completed
              </Badge>
            </div>
          )}

          {/* Title Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
            <h3 className="font-bold text-xl md:text-2xl text-white leading-tight drop-shadow-lg line-clamp-1">
              {trip.name}
            </h3>
            <div className="flex items-center text-white/80 text-sm gap-1.5 mt-1">
              <MapPin className="h-3.5 w-3.5" />
              <span className="line-clamp-1">{trip.destination}</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 flex items-center justify-between bg-gradient-to-r from-transparent to-muted/20">
          <div className="flex items-center gap-3">
            {/* Date */}
            <div className="flex items-center text-sm gap-2 text-muted-foreground">
              <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <Calendar className="h-4 w-4 text-primary" />
              </div>
              <div className="flex flex-col">
                <span className="font-medium text-foreground text-xs">{format(trip.startDate, "MMM d")}</span>
                <span className="text-[10px] text-muted-foreground">{format(trip.startDate, "yyyy")}</span>
              </div>
            </div>
          </div>

          {/* Members */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 text-muted-foreground">
              <Users className="h-3.5 w-3.5" />
              <span className="text-xs font-medium">{trip.members.length}</span>
            </div>
            <div className="flex -space-x-2">
              {trip.members.slice(0, 3).map((member, i) => (
                <Avatar
                  key={member.id}
                  className="h-7 w-7 border-2 border-card ring-0"
                  style={{ zIndex: 3 - i }}
                >
                  <AvatarImage src={member.user.avatar} alt={member.user.name} />
                  <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white text-[10px] font-medium">
                    {member.user.name[0]}
                  </AvatarFallback>
                </Avatar>
              ))}
              {trip.members.length > 3 && (
                <div className="h-7 w-7 rounded-full bg-muted flex items-center justify-center text-[10px] font-bold border-2 border-card">
                  +{trip.members.length - 3}
                </div>
              )}
            </div>

            <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
          </div>
        </div>
      </Card>
    </Link>
  );
}
