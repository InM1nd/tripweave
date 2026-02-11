"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LinkParser } from "@/components/explore/LinkParser";
import { PlaceCard } from "@/components/explore/PlaceCard";
import { Place } from "@prisma/client";
import { Sparkles, Bookmark, LayoutGrid } from "lucide-react";
import { AddToTripModal } from "@/components/explore/AddToTripModal";

interface ExploreContentProps {
    myPlaces: Place[];
    recommendations: any[]; // Using mock type for now
    trips: any[]; // Using any because Trip type might have relations attached
}

export function ExploreContent({ myPlaces, recommendations, trips }: ExploreContentProps) {
    const [activeTab, setActiveTab] = useState("for-you");
    const [selectedPlace, setSelectedPlace] = useState<any>(null);

    return (
        <>
            <Tabs defaultValue="for-you" className="space-y-8" onValueChange={setActiveTab}>
                <div className="flex items-center justify-between">
                    <TabsList className="bg-muted/50 p-1">
                        <TabsTrigger value="for-you" className="gap-2">
                            <Sparkles className="h-4 w-4 text-amber-500" />
                            For You
                        </TabsTrigger>
                        <TabsTrigger value="my-list" className="gap-2">
                            <Bookmark className="h-4 w-4 text-blue-500" />
                            My List
                        </TabsTrigger>
                    </TabsList>
                </div>

                <TabsContent value="for-you" className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {recommendations.map((item) => (
                            <PlaceCard
                                key={item.id}
                                place={item}
                                isRecommendation={true}
                                onAddToTrip={() => setSelectedPlace(item)}
                            />
                        ))}
                    </div>
                </TabsContent>

                <TabsContent value="my-list" className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="bg-gradient-to-br from-violet-50 to-indigo-50 dark:from-violet-950/20 dark:to-indigo-950/20 border border-violet-100 dark:border-violet-900 rounded-xl p-6 md:p-8">
                        <div className="max-w-xl mx-auto space-y-6">
                            <div className="text-center space-y-2">
                                <h2 className="text-2xl font-bold tracking-tight">AI Link Parser</h2>
                                <p className="text-muted-foreground">
                                    Paste a link to a restaurant, hotel, or attraction. Our AI will analyze it and create a card for your collection.
                                </p>
                            </div>
                            <LinkParser />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <LayoutGrid className="h-5 w-5 text-muted-foreground" />
                            <h2 className="text-xl font-semibold tracking-tight">Saved Places</h2>
                            <span className="text-sm text-muted-foreground ml-auto bg-secondary px-2.5 py-0.5 rounded-full font-mono">
                                {myPlaces.length}
                            </span>
                        </div>

                        {myPlaces.length === 0 ? (
                            <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-lg bg-muted/20 text-center">
                                <p className="text-muted-foreground">You haven't saved any places yet.</p>
                                <p className="text-sm text-muted-foreground mt-1">Paste a link above to get started!</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {myPlaces.map((place) => (
                                    <PlaceCard
                                        key={place.id}
                                        place={place}
                                        onAddToTrip={() => setSelectedPlace(place)}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </TabsContent>
            </Tabs>

            <AddToTripModal
                isOpen={!!selectedPlace}
                onClose={() => setSelectedPlace(null)}
                place={selectedPlace}
                trips={trips}
            />
        </>
    );
}
