import { getMyPlaces } from "@/actions/place";
import { getTrips } from "@/actions/trip";
import { ExploreContent } from "@/components/explore/ExploreContent";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
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
            <div className="space-y-8 max-w-7xl p-4 md:p-0">
                <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-border/50 pb-6 mb-2">
                    <div className="flex items-start gap-4">
                        <div className="p-3 bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 dark:from-violet-500/10 dark:to-fuchsia-500/10 rounded-2xl border border-violet-500/20 dark:border-violet-500/10 shadow-sm">
                            <Compass className="w-8 h-8 text-violet-600 dark:text-violet-400" />
                        </div>
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-fuchsia-600 dark:from-violet-400 dark:to-fuchsia-400">
                                Explore & Discover
                            </h1>
                            <p className="text-muted-foreground mt-1.5 flex items-center gap-2 text-base">
                                <Sparkles className="w-4 h-4 text-amber-500" />
                                Curated for your upcoming trip to <span className="font-semibold text-foreground bg-secondary/80 px-2 py-0.5 rounded-md border">{upcomingTrip.destination}</span>
                            </p>
                        </div>
                    </div>
                </div>

                <ExploreContent
                    myPlaces={myPlaces}
                    recommendations={recommendations}
                    trips={trips}
                />
            </div>
        </DashboardLayout>
    );
}
