import Link from "next/link";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Sparkles, ArrowRight, Plane, MapPin, Calendar, Bookmark, Globe2, CalendarDays } from "lucide-react";
import { CreateTripModal } from "@/components/trip/CreateTripModal";
import { TripCard } from "@/components/trip/TripCard";
import { NewTripCard } from "@/components/trip/NewTripCard";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StickerAnimator } from "@/components/ui/StickerAnimator";
import { PageHeader } from "@/components/ui/PageHeader";
import { getTrips } from "@/actions/trip";
import { TicketButton } from "@/components/landing/StickerCard";
import { StickerBadge } from "@/components/ui/StickerBadge";
import { Trip } from "@/types";
import { getStickerBgClass, type StickerColorKey } from "@/lib/design-tokens";
import { StickerSurface } from "@/components/ui/StickerSurface";

function NextTripBoardingPass({ trip }: { trip: Trip }) {
  const daysUntilTrip = Math.ceil(
    (trip.startDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );
  const daysDuration = Math.ceil(
    (trip.endDate.getTime() - trip.startDate.getTime()) / (1000 * 60 * 60 * 24)
  );
  const isPast = trip.endDate < new Date();
  const isUpcoming = daysUntilTrip > 0;

  return (
    <Link href={`/trip/${trip.id}/timeline`} className="block group">
      <StickerSurface hoverStrong className="overflow-hidden bg-card">
        <div className="flex flex-col md:flex-row">
          {/* Left: boarding info */}
          <div className="flex-1 p-5 md:p-6 min-w-0">
            <div className="flex items-center justify-between gap-4 mb-5">
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">
                  <Plane className="h-3 w-3 shrink-0" />
                  <span>Next Trip</span>
                </div>
                <h2 className="text-2xl md:text-3xl font-black tracking-tighter text-foreground leading-[0.9] truncate">
                  {trip.name}
                </h2>
              </div>
              <StickerBadge color="yellow" className="shrink-0 bg-primary text-primary-foreground" uppercase={false}>
                {isPast ? "Done" : isUpcoming ? (daysUntilTrip <= 30 ? `In ${daysUntilTrip}d` : "Upcoming") : "Ongoing"}
              </StickerBadge>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-4">
              <div>
                <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-0.5">Destination</div>
                <div className="flex items-center gap-1.5 font-black text-sm">
                  <MapPin className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                  <span className="truncate">{trip.destination}</span>
                </div>
              </div>
              <div>
                <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-0.5">Depart</div>
                <div className="flex items-center gap-1.5 font-black text-sm">
                  <Calendar className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                  <span>{format(trip.startDate, "MMM d")}</span>
                </div>
              </div>
              <div>
                <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-0.5">Return</div>
                <div className="flex items-center gap-1.5 font-black text-sm">
                  <Calendar className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                  <span>{format(trip.endDate, "MMM d")}</span>
                </div>
              </div>
              <div>
                <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-0.5">Duration</div>
                <div className="font-black text-sm">{daysDuration} days</div>
              </div>
            </div>
          </div>

          {/* Mobile: plain dashed line (no circles) */}
          <div className="md:hidden h-0 w-full border-t-2 border-dashed border-border" />

          {/* Desktop: plain vertical dashed line (no circles) */}
          <div className="hidden md:block w-px shrink-0 self-stretch border-l-2 border-dashed border-border" />

          {/* Right: boarding stub */}
          <div className="md:w-44 p-5 md:p-6 flex flex-col items-center justify-center gap-3 bg-muted/20 shrink-0">
            <div className="h-14 w-14 rounded-full bg-primary/10 border-2 border-border shadow-sticker-sm flex items-center justify-center">
              <Plane className="h-6 w-6 text-primary" strokeWidth={2.5} />
            </div>
            <div className="text-center">
              <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Boarding</div>
              <div className="font-black text-2xl text-foreground leading-none">{trip.members.length}</div>
              <div className="text-[10px] font-bold text-muted-foreground mt-0.5">travelers</div>
            </div>
          </div>
        </div>

        {/* Bottom perforation */}
        <div className="section-perforation" />
      </StickerSurface>
    </Link>
  );
}

function CouponStatCard({
  label,
  value,
  icon: Icon,
  color,
}: {
  label: string;
  value: number;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  color: StickerColorKey;
}) {
  return (
    <StickerSurface stickerColor={color} hover className="p-4 md:p-3 flex gap-3 items-center">
      <div className="w-9 h-9 rounded-full flex items-center justify-center bg-white/40 shrink-0">
        <Icon className="h-4 w-4 text-foreground" strokeWidth={2.5} />
      </div>
      <div className="flex flex-col min-w-0">
        <div className="font-black text-2xl md:text-xl text-foreground leading-none">{value}</div>
        <div className="text-[10px] font-bold text-foreground/70 uppercase tracking-widest mt-0.5 truncate">{label}</div>
      </div>
    </StickerSurface>
  );
}

export default async function DashboardPage() {
  const trips = (await getTrips()) as unknown as Trip[];
  const upcomingTrips = trips.filter((t: Trip) => t.startDate > new Date());

  // Pick the next upcoming trip, or the most recent one
  const nextTrip = upcomingTrips.sort(
    (a, b) => a.startDate.getTime() - b.startDate.getTime()
  )[0] || trips[0];

  return (
    <DashboardLayout>
      <div className="relative min-h-[80vh]">
        <div className="relative z-10 space-y-6 md:space-y-8 max-w-7xl p-4 md:p-0">
          {/* Header */}
          <PageHeader
            badge={{ label: "Welcome back", icon: <Sparkles className="h-4 w-4" />, color: "coral" }}
            title="Your Dashboard"
            description="Plan, explore, and share unforgettable journeys with friends."
            actions={
              <div className="hidden md:block">
                <CreateTripModal>
                  <TicketButton>
                    <Sparkles className="h-4 w-4 shrink-0" strokeWidth={3} />
                    New Trip
                    <ArrowRight className="h-4 w-4 shrink-0 ml-1" strokeWidth={3} />
                  </TicketButton>
                </CreateTripModal>
              </div>
            }
          />

          {/* Stats — coupon strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
            <StickerAnimator delay={0}>
              <CouponStatCard label="Total Trips" value={trips.length} icon={Plane} color="blue" />
            </StickerAnimator>
            <StickerAnimator delay={0.07}>
              <CouponStatCard label="Upcoming" value={upcomingTrips.length} icon={CalendarDays} color="green" />
            </StickerAnimator>
            <StickerAnimator delay={0.14}>
              <CouponStatCard label="Countries" value={new Set(trips.map((t: Trip) => t.destination)).size} icon={Globe2} color="coral" />
            </StickerAnimator>
            <StickerAnimator delay={0.21}>
              <CouponStatCard label="Saved" value={47} icon={Bookmark} color="yellow" />
            </StickerAnimator>
          </div>

          {/* Next Trip — Boarding Pass */}
          {nextTrip && (
            <StickerAnimator delay={0.1}>
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <h2 className="text-lg font-black text-foreground">Next Departure</h2>
                  <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" aria-hidden />
                </div>
                <NextTripBoardingPass trip={nextTrip} />
              </div>
            </StickerAnimator>
          )}

          {/* Trip Grid — Document folder */}
          <div className="bg-card/50 backdrop-blur-md rounded-3xl border-2 border-border shadow-sticker-dashed overflow-hidden">
            {/* Folder tab */}
            <div className="border-b-2 border-border px-5 md:px-6 pt-5 pb-4 flex items-center justify-between">
              <h2 className="text-lg font-black text-foreground flex items-center gap-2">
                Your Adventures
              </h2>
              <Button variant="stickerOutline" className="text-sm" asChild>
                <Link href="/profile">View All</Link>
              </Button>
            </div>
            <div className="p-5 md:p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {trips.map((trip: Trip, i) => (
                  <StickerAnimator key={trip.id} delay={i * 0.07}>
                    <TripCard trip={trip} />
                  </StickerAnimator>
                ))}
                <NewTripCard />
              </div>
            </div>
          </div>

          {/* Mobile FAB */}
          <div className="md:hidden fixed bottom-24 right-4 z-40">
            <CreateTripModal>
              <div className={`h-16 w-16 rounded-full flex items-center justify-center shadow-sticker-modal border-2 border-border ${getStickerBgClass("coral")}`}>
                <ArrowRight className="h-8 w-8" strokeWidth={3} />
              </div>
            </CreateTripModal>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
