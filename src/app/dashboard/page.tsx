import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { CreateTripModal } from "@/components/trip/CreateTripModal";
import { TripCard } from "@/components/trip/TripCard";
import { NewTripCard } from "@/components/trip/NewTripCard";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatCard } from "@/components/ui/StatCard";
import { getTrips } from "@/actions/trip";

import { Trip } from "@/types";

export default async function DashboardPage() {
  const trips = (await getTrips()) as unknown as Trip[];
  const upcomingTrips = trips.filter((t: Trip) => t.startDate > new Date());

  return (
    <DashboardLayout>
      <div className="space-y-10 max-w-7xl p-4 md:p-0">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="h-7 w-7 rounded-lg bg-[var(--accent-subtle)] flex items-center justify-center">
                <Sparkles className="h-4 w-4 text-[var(--accent)]" />
              </div>
              <span className="text-sm font-medium text-[var(--accent)]">
                Welcome back
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-[var(--text-primary)]">
              Dashboard
            </h1>
            <p className="text-[var(--text-secondary)] mt-2 text-base">
              Plan, explore, and share unforgettable journeys with friends.
            </p>
          </div>
          <div className="hidden md:block">
            <CreateTripModal />
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard
            label="Total Trips"
            value={trips.length}
            icon="TrendingUp"
            coverColor="electric"
          />
          <StatCard
            label="Upcoming"
            value={upcomingTrips.length}
            icon="Sparkles"
            coverColor="coral"
          />
          <StatCard
            label="Countries"
            value={new Set(trips.map((t: Trip) => t.destination)).size}
            icon="TrendingUp"
            coverColor="sky"
          />
          <StatCard
            label="Trip Types"
            value={1}
            icon="TrendingUp"
            coverColor="amber"
          />
        </div>

        {/* Trip Grid */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-[var(--text-primary)]">
              Your Adventures
            </h2>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/profile">View All</Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {trips.map((trip: Trip) => (
              <TripCard key={trip.id} trip={trip} />
            ))}
            <NewTripCard />
          </div>
        </div>

        {/* Mobile FAB */}
        <div className="md:hidden fixed bottom-24 right-4 z-40">
          <CreateTripModal />
        </div>
      </div>
    </DashboardLayout>
  );
}
