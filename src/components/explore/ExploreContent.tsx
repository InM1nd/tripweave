"use client";

import { useState, useMemo } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SocialSpotImporter } from "@/components/explore/SocialSpotImporter";
import { PlaceCard } from "@/components/explore/PlaceCard";
import { Place } from "@prisma/client";
import { Sparkles, Bookmark, LayoutGrid, Zap, Plus, Search, Filter } from "lucide-react";
import { AddToTripModal } from "@/components/explore/AddToTripModal";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogDescription, DialogHeader } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ForYouRecommendations } from "@/components/explore/ForYouRecommendations";

interface ExploreContentProps {
    myPlaces: Place[];
    recommendations: PlaceLike[];
    trips: { id: string; name: string; startDate: string | Date; endDate: string | Date }[];
}

type PlaceLike = Place | { id?: string | number; title?: string; name?: string; description?: string | null; location?: string | null; type?: string; rating?: number | null; image?: string | null; url?: string | null; source?: string };

export function ExploreContent({ myPlaces, recommendations, trips }: ExploreContentProps) {
    const [activeTab, setActiveTab] = useState("for-you");
    const [selectedPlace, setSelectedPlace] = useState<PlaceLike | null>(null);
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
            <Tabs defaultValue="for-you" className="space-y-5 md:space-y-6" onValueChange={setActiveTab}>
                <div className="flex items-center justify-between">
                    {/* Single bar, no overlap: one container with two clear segments */}
                    <TabsList className="inline-flex h-auto p-1.5 gap-0 rounded-2xl border-2 border-border bg-muted/40 shadow-[0_2px_0_rgba(0,0,0,0.06)]">
                        <TabsTrigger
                            value="for-you"
                            className="gap-1.5 font-bold text-sm rounded-xl border-0 px-4 py-2.5 transition-all data-[state=inactive]:bg-transparent data-[state=inactive]:text-muted-foreground data-[state=inactive]:hover:bg-muted/60 data-[state=inactive]:hover:text-foreground data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-[0_3px_0_rgba(0,0,0,0.12)]"
                        >
                            <Sparkles className="h-4 w-4 fill-current" />
                            For You
                        </TabsTrigger>
                        <TabsTrigger
                            value="my-list"
                            className="gap-1.5 font-bold text-sm rounded-xl border-0 px-4 py-2.5 transition-all data-[state=inactive]:bg-transparent data-[state=inactive]:text-muted-foreground data-[state=inactive]:hover:bg-muted/60 data-[state=inactive]:hover:text-foreground data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-[0_3px_0_rgba(0,0,0,0.12)]"
                        >
                            <Bookmark className="h-4 w-4" strokeWidth={3} />
                            My List
                        </TabsTrigger>
                    </TabsList>
                </div>

                <TabsContent value="for-you" className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <ForYouRecommendations initialPlaces={recommendations} onAddPlace={(p: PlaceLike) => setSelectedPlace(p)} />
                </TabsContent>

                <TabsContent value="my-list" className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {/* Desktop Importer */}
                    <div className="hidden md:block bg-card/50 backdrop-blur-md border-4 border-dashed border-border rounded-2xl p-4 md:p-5 relative overflow-hidden shadow-[0_4px_0_rgba(0,0,0,0.04)]">
                        {/* Decorative background element */}
                        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none -rotate-12">
                            <Sparkles className="w-32 h-32" />
                        </div>
                        <div className="max-w-xl mx-auto space-y-6 relative z-10">
                            <div className="text-center space-y-3 flex flex-col items-center">
                                <div className="p-3 bg-sticker-blue text-foreground rounded-full shadow-[0_4px_0_rgba(0,0,0,0.08)] border-2 border-border mb-2">
                                    <Zap className="w-6 h-6" strokeWidth={3} />
                                </div>
                                <div>
                                    <h2 className="text-lg font-black tracking-tight text-foreground">Social Spot Importer</h2>
                                    <p className="text-muted-foreground font-bold text-xs mt-1">
                                        Paste an Instagram, TikTok, or YouTube Shorts link to extract places to your list.
                                    </p>
                                </div>
                            </div>
                            <div className="bg-background rounded-2xl p-4 border-2 border-border shadow-[0_4px_0_rgba(0,0,0,0.05)]">
                                <SocialSpotImporter />
                            </div>
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
                            <div className="flex flex-col items-center justify-center p-12 border-4 border-dashed border-border rounded-3xl bg-secondary/30 text-center shadow-[0_4px_0_rgba(0,0,0,0.04)]">
                                <p className="text-foreground font-black text-xl">You haven&apos;t saved any places yet.</p>
                                <p className="text-sm font-bold text-muted-foreground mt-2 hidden md:block">Paste a link above to get started!</p>
                                <p className="text-sm font-bold text-muted-foreground mt-2 md:hidden">Tap the + button to import a place.</p>
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
                            <Button size="icon" className="h-16 w-16 rounded-full shadow-[0_8px_0_rgba(0,0,0,0.15)] bg-sticker-coral hover:bg-sticker-coral text-white border-2 border-border hover:-translate-y-1 transition-all">
                                <Plus className="h-8 w-8" strokeWidth={3} />
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md p-0 overflow-hidden border-2 border-border rounded-2xl shadow-[0_8px_0_rgba(0,0,0,0.1)]">
                            <div className="bg-bg-surface p-6 pt-10 border-border border-t-2">
                                <DialogTitle className="text-center mb-4 text-xl font-black">Import Social Spot</DialogTitle>
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
                place={selectedPlace ?? { title: "", name: "" }}
                trips={trips}
            />
        </>
    );
}
