import { getTrip } from "@/actions/trip";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { TripHeader } from "@/components/trip/TripHeader";
import { TripTabs } from "@/components/trip/TripTabs";
import { Trip } from "@/types";
import { redirect } from "next/navigation";

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
                    <TripTabs tripId={id} />
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 px-4 md:px-0">
                        {children}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
