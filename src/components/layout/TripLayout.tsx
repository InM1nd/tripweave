"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import { TripHeader } from "@/components/trip/TripHeader";
import { TripTabs } from "@/components/trip/TripTabs";
import { mockTrips } from "@/lib/mock-data";

interface TripLayoutProps {
  children: React.ReactNode;
  tripId: string;
}

export default function TripLayout({ children, tripId }: TripLayoutProps) {
  // In real app, fetch trip data based on tripId
  const trip = mockTrips.find(t => t.id === tripId) || mockTrips[0];

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-4 md:gap-6">
        <TripHeader trip={trip} />
        <div className="flex flex-col gap-4 md:gap-6">
          <TripTabs tripId={tripId} />
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 px-4 md:px-0">
            {children}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
