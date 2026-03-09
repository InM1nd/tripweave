"use client";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Camera, MapPin, Plane, Trophy } from "lucide-react";
import { TripCard } from "@/components/trip/TripCard";
import { StickerAnimator } from "@/components/ui/StickerAnimator";
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
            <div className="max-w-4xl mx-auto space-y-5 p-4 md:p-0">
                {/* Header */}
                <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
                    <div className="relative group mx-auto md:mx-0">
                        <Avatar className="h-20 w-20 md:h-24 md:w-24 border-2 border-border shadow-sticker-card">
                            <AvatarImage src="https://github.com/shadcn.png" alt={user.name} />
                            <AvatarFallback className="text-lg font-black bg-primary/20 text-primary">AZ</AvatarFallback>
                        </Avatar>
                        <Button size="icon" variant="secondary" className="absolute bottom-0 right-0 rounded-full h-7 w-7 border-2 border-border opacity-0 group-hover:opacity-100 transition-opacity">
                            <Camera className="h-3.5 w-3.5" />
                        </Button>
                    </div>

                    <div className="space-y-1 text-center md:text-left flex-1">
                        <h1 className="text-xl md:text-2xl font-black">{user.name}</h1>
                        <p className="text-xs text-muted-foreground italic max-w-sm mx-auto md:mx-0 pt-0.5 pb-1">
                            &quot;Plan, explore, and share unforgettable journeys with friends.&quot;
                        </p>
                        <p className="text-muted-foreground text-sm flex items-center justify-center md:justify-start gap-1.5">
                            <MapPin className="h-3.5 w-3.5" /> Kyiv, Ukraine
                        </p>
                        <div className="text-xs text-muted-foreground flex items-center justify-center md:justify-start gap-2">
                            <span>Member since {user.joinDate}</span>
                        </div>
                        <div className="flex gap-2 justify-center md:justify-start pt-1">
                            <Badge variant="secondary" className="gap-1 text-xs">
                                <Plane className="h-3 w-3" />
                                {user.tripsCount} Trips
                            </Badge>
                            <Badge variant="outline" className="gap-1 text-xs">
                                <MapPin className="h-3 w-3" />
                                {user.placesCount} Places
                            </Badge>
                        </div>
                    </div>

                    <Button variant="stickerOutline" size="sm" className="w-full md:w-auto rounded-xl">Edit Profile</Button>
                </div>

                {/* content */}
                <div className="grid gap-4 md:grid-cols-2">
                    {/* Stats/Bio */}
                    <Card className="h-full border-2 border-border rounded-2xl shadow-sticker-card">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-lg font-black">About</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3 pt-0">
                            <p className="text-xs text-muted-foreground leading-relaxed">
                                Love traveling to Asia and Europe. Always looking for the best coffee spots and hidden gems.
                                Currently planning a big trip to Japan in 2026!
                            </p>

                            <div className="grid grid-cols-2 gap-3 pt-3">
                                <div className="p-3 rounded-xl bg-muted/50 text-center border-2 border-border">
                                    <div className="text-xl font-black text-primary">12</div>
                                    <div className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold">Countries</div>
                                </div>
                                <div className="p-3 rounded-xl bg-muted/50 text-center border-2 border-border">
                                    <div className="text-xl font-black text-primary">48</div>
                                    <div className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold">Cities</div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Achievements */}
                    <Card className="h-full border-2 border-border rounded-2xl shadow-sticker-card">
                        <CardHeader className="pb-2">
                            <CardTitle className="flex items-center gap-2 text-lg font-black">
                                <Trophy className="h-4 w-4 text-gold" />
                                Achievements
                            </CardTitle>
                            <CardDescription className="text-xs">Badges earned from your travels</CardDescription>
                        </CardHeader>
                        <CardContent className="pt-0">
                            <div className="space-y-3">
                                {user.achievements.map((badge, i) => (
                                    <StickerAnimator key={badge.id} delay={i * 0.06}>
                                        <div className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-muted/50 transition-colors cursor-default border border-transparent hover:border-border">
                                            <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-lg shrink-0 border-2 border-border">
                                                {badge.icon}
                                            </div>
                                            <div>
                                                <h4 className="font-black text-sm">{badge.name}</h4>
                                                <p className="text-[11px] text-muted-foreground">{badge.description}</p>
                                            </div>
                                        </div>
                                    </StickerAnimator>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Your Adventures Section */}
                <div className="space-y-4 pt-2">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-black flex items-center gap-1.5">
                            <Plane className="h-4 w-4 text-primary" />
                            Your Adventures
                        </h2>
                        <Button variant="stickerOutline" size="sm" className="rounded-xl">View All</Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {mockTrips.map((trip, i) => (
                            <StickerAnimator key={trip.id} delay={i * 0.07}>
                                <TripCard trip={trip} />
                            </StickerAnimator>
                        ))}
                    </div>
                </div>
            </div>
        </DashboardLayout >
    );
}
