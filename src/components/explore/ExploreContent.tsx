"use client";

import { useState, useMemo } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SocialSpotImporter } from "@/components/explore/SocialSpotImporter";
import { PlaceCard } from "@/components/explore/PlaceCard";
import { Place } from "@prisma/client";
import { Sparkles, Bookmark, LayoutGrid, Zap, Plus, X, Search, Filter } from "lucide-react";
import { AddToTripModal } from "@/components/explore/AddToTripModal";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogDescription, DialogHeader } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ForYouRecommendations } from "@/components/explore/ForYouRecommendations";

interface ExploreContentProps {
    myPlaces: Place[];
    recommendations: any[]; // Used for old recs, but we will use the new component
    trips: any[];
}

export function ExploreContent({ myPlaces, recommendations, trips }: ExploreContentProps) {
    const [activeTab, setActiveTab] = useState("for-you");
    const [selectedPlace, setSelectedPlace] = useState<any>(null);
    const [isImporterOpen, setIsImporterOpen] = useState(false);

    // Filtering states
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

    const categories = useMemo(() => {
        const cats = new Set<string>();
        myPlaces.forEach(p => {
            if (p.source) cats.add(p.source);
        });
        return Array.from(cats);
    }, [myPlaces]);

    const filteredAndGroupedPlaces = useMemo(() => {
        const filtered = myPlaces.filter(p => {
            if (searchQuery && !p.name?.toLowerCase().includes(searchQuery.toLowerCase()) && !p.location?.toLowerCase().includes(searchQuery.toLowerCase())) return false;
            // Use source since Place doesn't have a 'type' field in the schema
            if (selectedCategory && p.source !== selectedCategory) return false;
            return true;
        });

        // Group by City/Country based on location string heuristically
        const groups: Record<string, Place[]> = {};
        filtered.forEach(p => {
            const loc = p.location || "Other Places";
            // Simple heuristic mapping the last part of location string
            const parts = loc.split(", ");
            const groupKey = parts.length > 1 ? parts[parts.length - 1] : loc;

            if (!groups[groupKey]) groups[groupKey] = [];
            groups[groupKey].push(p);
        });

        return groups;
    }, [myPlaces, searchQuery, selectedCategory]);

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
                            <Bookmark className="h-4 w-4 text-teal" />
                            My List
                        </TabsTrigger>
                    </TabsList>
                </div>

                <TabsContent value="for-you" className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <ForYouRecommendations initialPlaces={recommendations} onAddPlace={(p: any) => setSelectedPlace(p)} />
                </TabsContent>

                <TabsContent value="my-list" className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {/* Desktop Importer */}
                    <div className="hidden md:block bg-accent-subtle/30 dark:bg-accent-subtle/10 border border-accent/20 rounded-xl p-6 md:p-8 relative overflow-hidden">
                        {/* Decorative background element */}
                        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                            <Sparkles className="w-32 h-32" />
                        </div>
                        <div className="max-w-xl mx-auto space-y-6 relative z-10">
                            <div className="text-center space-y-3 flex flex-col items-center">
                                <div className="p-3 bg-white dark:bg-black/20 rounded-2xl shadow-sm border border-accent/20">
                                    <Zap className="w-6 h-6 text-accent" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold tracking-tight">Social Spot Importer</h2>
                                    <p className="text-muted-foreground text-sm mt-1">
                                        Paste an Instagram, TikTok, or YouTube Shorts link to extract places to your list.
                                    </p>
                                </div>
                            </div>
                            <SocialSpotImporter />
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="flex items-center gap-2">
                                <LayoutGrid className="h-5 w-5 text-muted-foreground" />
                                <h2 className="text-xl font-semibold tracking-tight">Saved Places</h2>
                                <span className="text-sm text-muted-foreground bg-secondary px-2.5 py-0.5 rounded-full font-mono">
                                    {myPlaces.length}
                                </span>
                            </div>

                            <div className="flex items-center gap-2 w-full sm:w-auto">
                                <div className="relative flex-1 sm:w-64">
                                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Search places..."
                                        className="pl-9 h-9"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>

                                {categories.length > 0 && (
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button variant="outline" size="icon" className="h-9 w-9 shrink-0">
                                                <Filter className="h-4 w-4" />
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent>
                                            <DialogHeader>
                                                <DialogTitle>Filter by Category</DialogTitle>
                                            </DialogHeader>
                                            <div className="flex flex-wrap gap-2 pt-4">
                                                <Badge
                                                    variant={selectedCategory === null ? "default" : "outline"}
                                                    className="cursor-pointer"
                                                    onClick={() => setSelectedCategory(null)}
                                                >
                                                    All
                                                </Badge>
                                                {categories.map(cat => (
                                                    <Badge
                                                        key={cat}
                                                        variant={selectedCategory === cat ? "default" : "outline"}
                                                        className="cursor-pointer"
                                                        onClick={() => setSelectedCategory(cat)}
                                                    >
                                                        {cat}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </DialogContent>
                                    </Dialog>
                                )}
                            </div>
                        </div>

                        {myPlaces.length === 0 ? (
                            <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-lg bg-muted/20 text-center">
                                <p className="text-muted-foreground">You haven't saved any places yet.</p>
                                <p className="text-sm text-muted-foreground mt-1 hidden md:block">Paste a link above to get started!</p>
                                <p className="text-sm text-muted-foreground mt-1 md:hidden">Tap the + button to import a place.</p>
                            </div>
                        ) : (
                            <div className="space-y-8">
                                {Object.entries(filteredAndGroupedPlaces).map(([group, places]) => (
                                    <div key={group} className="space-y-4">
                                        <h3 className="font-semibold text-lg border-b pb-2">{group}</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                            {places.map((place) => (
                                                <PlaceCard
                                                    key={place.id}
                                                    place={place}
                                                    onAddToTrip={() => setSelectedPlace(place)}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                ))}
                                {Object.keys(filteredAndGroupedPlaces).length === 0 && (
                                    <div className="text-center py-12 text-muted-foreground">
                                        No places matched your filters.
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </TabsContent>
            </Tabs>

            {/* Mobile Floating Action Button for Importer */}
            {activeTab === "my-list" && (
                <div className="md:hidden fixed bottom-6 right-6 z-40 animate-in zoom-in duration-300">
                    <Dialog open={isImporterOpen} onOpenChange={setIsImporterOpen}>
                        <DialogTrigger asChild>
                            <Button size="icon" className="h-14 w-14 rounded-full shadow-xl bg-accent hover:bg-accent-hover text-accent-text">
                                <Plus className="h-6 w-6" />
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md p-0 overflow-hidden border-0">
                            <div className="bg-bg-surface p-6 pt-10 border-accent/20 border-t">
                                <DialogTitle className="text-center mb-4 text-xl">Import Social Spot</DialogTitle>
                                <DialogDescription className="sr-only">Import places from social media links</DialogDescription>
                                <SocialSpotImporter />
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
            )}

            <AddToTripModal
                isOpen={!!selectedPlace}
                onClose={() => setSelectedPlace(null)}
                place={selectedPlace}
                trips={trips}
            />
        </>
    );
}
