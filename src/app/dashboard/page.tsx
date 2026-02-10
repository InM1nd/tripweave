import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus, Sparkles, TrendingUp } from "lucide-react";
import { CreateTripModal } from "@/components/trip/CreateTripModal";
import { TripCard } from "@/components/trip/TripCard";
import { NewTripCard } from "@/components/trip/NewTripCard";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { getTrips } from "@/actions/trip";

import { Trip } from "@/types";

export default async function DashboardPage() {
  const trips = await getTrips() as unknown as Trip[];
  const upcomingTrips = trips.filter((t: Trip) => t.startDate > new Date());

  return (
    <DashboardLayout>
      <div className="space-y-10 max-w-7xl p-4 md:p-0">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-emerald-500/20 to-teal-600/20 flex items-center justify-center">
                <Sparkles className="h-4 w-4 text-primary" />
              </div>
              <span className="text-sm font-medium text-primary">Welcome back</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
              Dashboard
            </h1>
            <p className="text-muted-foreground mt-2 text-base">
              Plan, explore, and share unforgettable journeys with friends.
            </p>
          </div>
          <div className="hidden md:block">
            <CreateTripModal />
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard label="Total Trips" value={trips.length} icon={TrendingUp} />
          <StatCard label="Upcoming" value={upcomingTrips.length} icon={Sparkles} />
          <StatCard label="Countries" value={new Set(trips.map((t: Trip) => t.destination)).size} icon={TrendingUp} />
          <StatCard label="Trip Types" value={1} icon={TrendingUp} />
        </div>

        {/* Trip Grid */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Your Adventures</h2>
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

function StatCard({
  label,
  value,
  icon: Icon
}: {
  label: string;
  value: number;
  icon: React.ElementType;
}) {
  return (
    <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
      <CardContent className="p-4 md:p-6">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Icon className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-2xl font-bold">{value}</p>
            <p className="text-xs text-muted-foreground">{label}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
