"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { mockTrips } from "@/lib/mock-data";
import { MapPin, Star, Calendar } from "lucide-react";

export default function ExplorePage() {
    // Generate recommendations based on "upcoming" trips
    const upcomingTrip = mockTrips.find(t => t.startDate > new Date()) || mockTrips[0];

    // Mock recommendations related to the upcoming trip destination (e.g., Japan)
    const recommendations = [
        {
            id: 1,
            title: "Fushimi Inari Taisha",
            type: "Must See",
            image: "https://images.unsplash.com/photo-1478436127897-769e1b3f0f36?q=80&w=2070&auto=format&fit=crop",
            rating: 4.9,
            description: "Famous for its thousands of vermilion torii gates."
        },
        {
            id: 2,
            title: "Arashiyama Bamboo Grove",
            type: "Nature",
            image: "https://images.unsplash.com/photo-1598894170669-e7300c19ec20?q=80&w=2070&auto=format&fit=crop",
            rating: 4.7,
            description: "Walking paths through a soaring bamboo forest."
        },
        {
            id: 3,
            title: "Best Ramen in Tokyo",
            type: "Food",
            image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?q=80&w=2070&auto=format&fit=crop",
            rating: 4.8,
            description: "Curated list of top-rated ramen spots."
        }
    ];

    return (
        <DashboardLayout>
            <div className="space-y-8 max-w-7xl p-4 md:p-0">
                <div className="">
                    <h1 className="text-3xl font-bold tracking-tight">Recommendations</h1>
                    <p className="text-muted-foreground mt-1">
                        Curated for your upcoming trip to <span className="font-semibold text-foreground">{upcomingTrip.destination}</span>
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {recommendations.map((item) => (
                        <Card key={item.id} className="overflow-hidden group cursor-pointer hover:shadow-lg transition-all border-border/50">
                            <div className="aspect-video relative overflow-hidden">
                                <img
                                    src={item.image}
                                    alt={item.title}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                                <Badge className="absolute top-3 left-3 bg-background/80 backdrop-blur-md text-foreground hover:bg-background/90">
                                    {item.type}
                                </Badge>
                            </div>
                            <CardContent className="p-4 space-y-2">
                                <div className="flex justify-between items-start">
                                    <h3 className="font-bold text-lg leading-tight">{item.title}</h3>
                                    <div className="flex items-center text-amber-500 text-xs font-bold gap-1 bg-amber-500/10 px-2 py-0.5 rounded-full">
                                        <Star className="h-3 w-3 fill-current" />
                                        {item.rating}
                                    </div>
                                </div>
                                <p className="text-sm text-muted-foreground line-clamp-2">
                                    {item.description}
                                </p>
                                <Button variant="outline" size="sm" className="w-full mt-2">
                                    Add to Itinerary
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </DashboardLayout>
    );
}
