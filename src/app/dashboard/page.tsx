"use client";

import { Plus, Sparkles, TrendingUp } from "lucide-react";
import { CreateTripModal } from "@/components/trip/CreateTripModal";
import { TripCard } from "@/components/trip/TripCard";
import { mockTrips } from "@/lib/mock-data";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";

export default function DashboardPage() {
  const upcomingTrips = mockTrips.filter(t => t.startDate > new Date());
  // const pastTrips = mockTrips.filter(t => t.endDate < new Date());

  return (
    <DashboardLayout>
      <div className="space-y-10 max-w-7xl">
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
              Your Adventures
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
          <StatCard label="Total Trips" value={mockTrips.length} icon={TrendingUp} />
          <StatCard label="Upcoming" value={upcomingTrips.length} icon={Sparkles} />
          <StatCard label="Countries" value={3} icon={TrendingUp} />
          <StatCard label="Travel Days" value={27} icon={TrendingUp} />
        </div>

        {/* Trip Grid */}
        {mockTrips.length > 0 ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Recent Trips</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {mockTrips.map((trip) => (
                <TripCard key={trip.id} trip={trip} />
              ))}

              {/* Add New Trip Card - Desktop */}
              <div className="hidden md:flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-2xl border-border/50 hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer group min-h-[280px]">
                <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-teal-600/10 group-hover:from-emerald-500/20 group-hover:to-teal-600/20 flex items-center justify-center mb-4 transition-all">
                  <Plus className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-1">New Adventure</h3>
                <p className="text-sm text-muted-foreground text-center max-w-[180px]">
                  Start planning your next trip
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="h-24 w-24 rounded-3xl bg-gradient-to-br from-emerald-500/10 to-teal-600/10 flex items-center justify-center mb-6">
              <Plus className="h-12 w-12 text-primary" />
            </div>
            <h3 className="text-2xl font-semibold mb-2">No adventures yet</h3>
            <p className="text-muted-foreground max-w-sm mb-8">
              Create your first trip and start exploring the world with friends.
            </p>
            <CreateTripModal />
          </div>
        )}

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
