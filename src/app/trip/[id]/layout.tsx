import { getTrip } from "@/actions/trip";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { TripHeader } from "@/components/trip/TripHeader";
import { TripTabs } from "@/components/trip/TripTabs";
import { TripTabContent } from "@/components/trip/TripTabContent";
import { Trip } from "@/types";

interface TripLayoutProps {
    children: React.ReactNode;
    params: Promise<{ id: string }>;
}

export default async function TripLayout({ children, params }: TripLayoutProps) {
    const { id } = await params;

    let trip: Trip | null = null;
    try {
        const data = await getTrip(id);
        trip = data as unknown as Trip;
    } catch (error) {
        console.error("Failed to fetch trip:", error);
    }

    if (!trip) {
        return (
            <DashboardLayout>
                <div className="text-center py-12">
                    <h2 className="text-xl font-semibold">Trip not found</h2>
                    <p className="text-muted-foreground">The trip you are looking for does not exist or you don&apos;t have access to it.</p>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="flex flex-col gap-2 md:gap-3 [--trip-tabs-offset:6.5rem] md:[--trip-tabs-offset:3.5rem]">
                <TripHeader trip={trip} />
                <div className="flex flex-col gap-2 md:gap-3">
                    <TripTabs tripId={id} />
                    <TripTabContent>
                        {children}
                    </TripTabContent>
                </div>
            </div>
        </DashboardLayout>
    );
}
