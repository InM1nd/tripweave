"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Camera, MapPin, Plane, Trophy } from "lucide-react";
import { TripCard } from "@/components/trip/TripCard";
import { mockTrips } from "@/lib/mock-data";

export default function ProfilePage() {
    // Mock user data
    const user = {
        name: "Alex Z.",
        email: "alex@example.com",
        joinDate: "January 2026",
        tripsCount: 4,
        placesCount: 12,
        achievements: [
            { id: 1, name: "Planner Pro", icon: "📅", description: "Created 3 trips" },
            { id: 2, name: "Jet Setter", icon: "✈️", description: "Visited 5 countries" },
            { id: 3, name: "Early Bird", icon: "🌅", description: "Joined the platform early" },
        ],
    };

    return (
        <DashboardLayout>
            <div className="max-w-4xl mx-auto space-y-6 p-4 md:p-0">
                {/* Header */}
                <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                    <div className="relative group mx-auto md:mx-0">
                        <Avatar className="h-24 w-24 md:h-32 md:w-32 border-4 border-background shadow-xl">
                            <AvatarImage src="https://github.com/shadcn.png" alt={user.name} />
                            <AvatarFallback className="text-2xl bg-primary/20 text-primary">AZ</AvatarFallback>
                        </Avatar>
                        <Button size="icon" variant="secondary" className="absolute bottom-0 right-0 rounded-full h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Camera className="h-4 w-4" />
                        </Button>
                    </div>

                    <div className="space-y-2 text-center md:text-left flex-1">
                        <h1 className="text-2xl md:text-3xl font-bold">{user.name}</h1>
                        <p className="text-sm text-muted-foreground italic max-w-sm mx-auto md:mx-0 pt-1 pb-2">
                            "Plan, explore, and share unforgettable journeys with friends."
                        </p>
                        <p className="text-muted-foreground flex items-center justify-center md:justify-start gap-2">
                            <MapPin className="h-4 w-4" /> Kyiv, Ukraine
                        </p>
                        <div className="flex items-center justify-center md:justify-start gap-2 text-sm text-muted-foreground">
                            <span>Member since {user.joinDate}</span>
                        </div>
                        <div className="flex gap-2 justify-center md:justify-start pt-2">
                            <Badge variant="secondary" className="gap-1">
                                <Plane className="h-3 w-3" />
                                {user.tripsCount} Trips
                            </Badge>
                            <Badge variant="outline" className="gap-1">
                                <MapPin className="h-3 w-3" />
                                {user.placesCount} Places
                            </Badge>
                        </div>
                    </div>

                    <Button variant="outline" className="w-full md:w-auto">Edit Profile</Button>
                </div>

                {/* content */}
                <div className="grid gap-6 md:grid-cols-2">
                    {/* Stats/Bio */}
                    <Card className="h-full">
                        <CardHeader>
                            <CardTitle>About</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                Love traveling to Asia and Europe. Always looking for the best coffee spots and hidden gems.
                                Currently planning a big trip to Japan in 2026!
                            </p>

                            <div className="grid grid-cols-2 gap-4 pt-4">
                                <div className="p-4 rounded-xl bg-muted/50 text-center">
                                    <div className="text-2xl font-bold text-primary">12</div>
                                    <div className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Countries</div>
                                </div>
                                <div className="p-4 rounded-xl bg-muted/50 text-center">
                                    <div className="text-2xl font-bold text-primary">48</div>
                                    <div className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Cities</div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Achievements */}
                    <Card className="h-full">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Trophy className="h-5 w-5 text-yellow-500" />
                                Achievements
                            </CardTitle>
                            <CardDescription>Badges earned from your travels</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {user.achievements.map((badge) => (
                                    <div key={badge.id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-default">
                                        <div className="h-10 w-10 md:h-12 md:w-12 rounded-full bg-primary/10 flex items-center justify-center text-xl md:text-2xl shrink-0">
                                            {badge.icon}
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-sm md:text-base">{badge.name}</h4>
                                            <p className="text-xs text-muted-foreground">{badge.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Your Adventures Section */}
                <div className="space-y-6 pt-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold flex items-center gap-2">
                            <Plane className="h-5 w-5 text-primary" />
                            Your Adventures
                        </h2>
                        <Button variant="outline" size="sm">View All</Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {mockTrips.map((trip) => (
                            <TripCard key={trip.id} trip={trip} />
                        ))}
                    </div>
                </div>
            </div>
        </DashboardLayout >
    );
}
