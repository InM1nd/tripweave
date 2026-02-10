"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import { TripHeader } from "@/components/trip/TripHeader";
import { TripTabs } from "@/components/trip/TripTabs";
import { getTrip } from "@/actions/trip";
import { useEffect, useState } from "react";
import { Trip } from "@/types";
import { Loader2 } from "lucide-react";

interface TripLayoutProps {
  children: React.ReactNode;
  tripId: string;
}

export default function TripLayout({ children, tripId }: TripLayoutProps) {
  const [trip, setTrip] = useState<Trip | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTrip = async () => {
      try {
        const data = await getTrip(tripId);
        setTrip(data as unknown as Trip);
      } catch (error) {
        console.error("Failed to fetch trip:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTrip();
  }, [tripId]);

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-[50vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  if (!trip) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold">Trip not found</h2>
          <p className="text-muted-foreground">The trip you are looking for does not exist or you don't have access to it.</p>
        </div>
      </DashboardLayout>
    );
  }

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
