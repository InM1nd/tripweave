import { getMyPlaces } from "@/actions/place";
import { getTrips } from "@/actions/trip";
import { ExploreContent } from "@/components/explore/ExploreContent";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { PageHeader } from "@/components/ui/PageHeader";
import { mockTrips } from "@/lib/mock-data";
import { Compass, Sparkles } from "lucide-react";

export default async function ExplorePage() {
    // Generate recommendations based on "upcoming" trips
    const upcomingTrip = mockTrips.find(t => t.startDate > new Date()) || mockTrips[0];
    const myPlaces = await getMyPlaces();
    const trips = await getTrips();

    // Mock recommendations related to the upcoming trip destination (e.g., Japan)
    const recommendations = [
        {
            id: 1,
            title: "Fushimi Inari Taisha",
            type: "Must See",
            image: "https://images.unsplash.com/photo-1478436127897-769e1b3f0f36?q=80&w=2070&auto=format&fit=crop",
            rating: 4.9,
            description: "Famous for its thousands of vermilion torii gates.",
            source: "AI_RECOMMENDATION"
        },
        {
            id: 2,
            title: "Arashiyama Bamboo Grove",
            type: "Nature",
            image: "https://images.unsplash.com/photo-1598894170669-e7300c19ec20?q=80&w=2070&auto=format&fit=crop",
            rating: 4.7,
            description: "Walking paths through a soaring bamboo forest.",
            source: "AI_RECOMMENDATION"
        },
        {
            id: 3,
            title: "Best Ramen in Tokyo",
            type: "Food",
            image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?q=80&w=2070&auto=format&fit=crop",
            rating: 4.8,
            description: "Curated list of top-rated ramen spots.",
            source: "AI_RECOMMENDATION"
        }
    ];

    return (
        <DashboardLayout>
            <div className="relative min-h-[80dvh]">
                <div className="relative z-10 space-y-6 md:space-y-8 max-w-7xl p-4 md:p-0">
                    <PageHeader
                        badge={{ label: "Discover places", icon: <Compass className="h-4 w-4" />, color: "green" }}
                        title="Explore & Discover"
                        description={
                            <span className="flex flex-wrap items-center gap-1.5">
                                <Sparkles className="w-5 h-5 text-sticker-yellow fill-current" />
                                Curated for your upcoming trip to <span className="font-black text-foreground bg-sticker-yellow/30 px-2 py-0.5 rounded-md border-2 border-sticker-yellow/40">{upcomingTrip.destination}</span>
                            </span>
                        }
                        className="border-b-2 border-border pb-4 mb-1"
                    />

                    <ExploreContent
                        myPlaces={myPlaces}
                        recommendations={recommendations}
                        trips={trips}
                    />
                </div>
            </div>
        </DashboardLayout>
    );
}
