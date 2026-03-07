import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sparkles, ArrowRight } from "lucide-react";
import { CreateTripModal } from "@/components/trip/CreateTripModal";
import { TripCard } from "@/components/trip/TripCard";
import { NewTripCard } from "@/components/trip/NewTripCard";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatCard } from "@/components/ui/StatCard";
import { getTrips } from "@/actions/trip";
import { StampBadge, TicketButton } from "@/components/landing/StickerCard";
import { Trip } from "@/types";

export default async function DashboardPage() {
  const trips = (await getTrips()) as unknown as Trip[];
  const upcomingTrips = trips.filter((t: Trip) => t.startDate > new Date());

  return (
    <DashboardLayout>
      <div className="relative min-h-[80vh]">
        <div className="relative z-10 space-y-6 md:space-y-8 max-w-7xl p-4 md:p-0">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <div className="mb-4 inline-block">
                <StampBadge color="coral" className="text-black dark:text-white">
                  <Sparkles className="h-4 w-4" /> Welcome back
                </StampBadge>
              </div>
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-black tracking-tighter text-foreground leading-[0.9]">
                Your Dashboard
              </h1>
              <p className="text-muted-foreground font-bold mt-3 text-sm md:text-base max-w-xl">
                Plan, explore, and share unforgettable journeys with friends.
              </p>
            </div>
            <div className="hidden md:block">
              <CreateTripModal>
                <TicketButton>
                  <Sparkles className="h-4 w-4 shrink-0" strokeWidth={3} />
                  New Trip
                  <ArrowRight className="h-4 w-4 shrink-0 ml-1" strokeWidth={3} />
                </TicketButton>
              </CreateTripModal>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
            <StatCard
              label="Total Trips"
              value={trips.length}
              icon="Plane"
              coverColor="sky"
              rotation={-1}
            />
            <StatCard
              label="Upcoming"
              value={upcomingTrips.length}
              icon="CalendarDays"
              coverColor="lime"
              rotation={1.5}
            />
            <StatCard
              label="Countries"
              value={new Set(trips.map((t: Trip) => t.destination)).size}
              icon="Globe2"
              coverColor="coral"
              rotation={-1.5}
            />
            <StatCard
              label="Places Saved"
              value={47} // Placeholder or calculate if data available
              icon="Bookmark"
              coverColor="electric"
              rotation={2}
            />
          </div>

          {/* Trip Grid */}
          <div className="space-y-6 bg-card/50 backdrop-blur-md rounded-3xl p-5 md:p-6 border-2 border-border shadow-[0_8px_0_rgba(0,0,0,0.04)]">
            <div className="flex items-center justify-between">
              <h2 className="text-xl md:text-lg font-bold text-foreground flex items-center gap-2">
                Your Adventures
              </h2>
              <Button variant="outline" className="font-bold border-2 border-border shadow-[0_3px_0_rgba(0,0,0,0.08)] hover:-translate-y-px hover:shadow-[0_4px_0_rgba(0,0,0,0.1)] transition-all rounded-full" asChild>
                <Link href="/profile">View All</Link>
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {trips.map((trip: Trip) => (
                <TripCard key={trip.id} trip={trip} />
              ))}
              <NewTripCard />
            </div>
          </div>

          {/* Mobile FAB */}
          <div className="md:hidden fixed bottom-24 right-4 z-40">
            <CreateTripModal>
              <div className="h-16 w-16 bg-sticker-coral text-white rounded-full flex items-center justify-center shadow-[0_8px_0_rgba(0,0,0,0.15)] border-2 border-border">
                <ArrowRight className="h-8 w-8" strokeWidth={3} />
              </div>
            </CreateTripModal>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
