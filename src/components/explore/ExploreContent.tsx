"use client";

import { useState, useMemo } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SocialSpotImporter } from "@/components/explore/SocialSpotImporter";
import { PlaceCard } from "@/components/explore/PlaceCard";
import { StickerAnimator } from "@/components/ui/StickerAnimator";
import { Place } from "@prisma/client";
import { Sparkles, Bookmark, LayoutGrid, Zap, Plus, Search } from "lucide-react";
import { AddToTripModal } from "@/components/explore/AddToTripModal";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ForYouRecommendations } from "@/components/explore/ForYouRecommendations";
import { EmptyState } from "@/components/ui/empty-state";
import { getStickerBgClass } from "@/lib/design-tokens";

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
                    <TabsList className="inline-flex h-auto p-1.5 gap-1 rounded-3xl border-2 border-border bg-muted/40 shadow-sticker-sm-soft">
                        <TabsTrigger
                            value="for-you"
                            className="gap-1.5 font-black text-sm rounded-2xl border-2 border-transparent px-4 py-2 transition-all data-[state=inactive]:bg-transparent data-[state=inactive]:text-muted-foreground data-[state=inactive]:hover:bg-muted/60 data-[state=inactive]:hover:text-foreground data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:border-border data-[state=active]:shadow-sticker-sm"
                        >
                            <Sparkles className="h-4 w-4 fill-current" />
                            For You
                        </TabsTrigger>
                        <TabsTrigger
                            value="my-list"
                            className="gap-1.5 font-black text-sm rounded-2xl border-2 border-transparent px-4 py-2 transition-all data-[state=inactive]:bg-transparent data-[state=inactive]:text-muted-foreground data-[state=inactive]:hover:bg-muted/60 data-[state=inactive]:hover:text-foreground data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:border-border data-[state=active]:shadow-sticker-sm"
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
                    <div className="hidden md:block bg-card/50 backdrop-blur-md border-4 border-dashed border-border rounded-2xl p-4 md:p-5 relative overflow-hidden shadow-sticker-dashed">
                        {/* Decorative background element */}
                        <div className="absolute top-0 right-0 p-8 opacity-20 pointer-events-none -rotate-12 text-sticker-yellow">
                            <Sparkles className="w-32 h-32" />
                        </div>
                        <div className="relative z-10 space-y-4">
                            <div className="flex items-center gap-3">
                                <div className={`p-2 ${getStickerBgClass("blue")} rounded-full shadow-sticker-card border-2 border-border shrink-0`}>
                                    <Zap className="w-5 h-5" strokeWidth={3} />
                                </div>
                                <div>
                                    <h2 className="text-base font-black tracking-tighter text-foreground leading-none">Social Spot Importer</h2>
                                    <p className="text-xs text-muted-foreground mt-0.5">Extract travel spots from social posts</p>
                                </div>
                            </div>
                            <div className="bg-background rounded-2xl p-4 border-2 border-border shadow-sticker-dashed">
                                <SocialSpotImporter />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-5">
                        <div className="flex flex-col gap-3">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                <div className="flex items-center gap-2.5">
                                    <div className="p-1.5 bg-sticker-yellow border-2 border-border rounded-xl shadow-sticker-badge">
                                        <LayoutGrid className="h-4 w-4" />
                                    </div>
                                    <h2 className="text-xl font-black tracking-tighter">Saved Places</h2>
                                    <span className="text-xs font-black bg-primary text-primary-foreground border-2 border-border px-2 py-0.5 rounded-full shadow-sticker-badge">
                                        {myPlaces.length}
                                    </span>
                                </div>
                                <div className="relative w-full sm:w-64">
                                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Search places..."
                                        className="pl-9 h-9"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>
                            </div>

                            {categories.length > 0 && (
                                <div className="flex flex-wrap items-center gap-2">
                                    <button
                                        onClick={() => setSelectedCategory(null)}
                                        className={`text-xs font-bold px-3 py-1 rounded-full border-2 border-border transition-all ${selectedCategory === null ? "bg-primary text-primary-foreground shadow-sticker-sm" : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground shadow-sticker-badge"}`}
                                    >
                                        All
                                    </button>
                                    {categories.map(cat => (
                                        <button
                                            key={cat}
                                            onClick={() => setSelectedCategory(cat)}
                                            className={`text-xs font-bold px-3 py-1 rounded-full border-2 border-border transition-all ${selectedCategory === cat ? "bg-primary text-primary-foreground shadow-sticker-sm" : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground shadow-sticker-badge"}`}
                                        >
                                            {cat}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {myPlaces.length === 0 ? (
                            <EmptyState
                                variant="sticker"
                                title="You haven't saved any places yet."
                                description={
                                    <>
                                        <p className="hidden md:block">Paste a link above to get started!</p>
                                        <p className="md:hidden">Tap the + button to import a place.</p>
                                    </>
                                }
                            />
                        ) : (
                            <div className="space-y-8">
                                {Object.entries(filteredAndGroupedPlaces).map(([group, places]) => (
                                    <div key={group} className="space-y-4">
                                        <h3 className="font-black tracking-tighter text-sm uppercase text-muted-foreground">{group}</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 items-stretch">
                                            {places.map((place, i) => (
                                                <StickerAnimator key={place.id} delay={i * 0.05} className="h-full flex flex-col">
                                                    <PlaceCard
                                                        place={place}
                                                        onAddToTrip={() => setSelectedPlace(place)}
                                                    />
                                                </StickerAnimator>
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
                <div className="md:hidden fixed bottom-20 right-4 z-40 animate-in zoom-in duration-300">
                    <Dialog open={isImporterOpen} onOpenChange={setIsImporterOpen}>
                    <DialogTrigger asChild>
                        <Button variant="stickerCoral" size="icon" className="h-16 w-16 rounded-full">
                            <Plus className="h-8 w-8" strokeWidth={3} />
                        </Button>
                    </DialogTrigger>
                        <DialogContent className="sm:max-w-md p-0 overflow-hidden border-2 border-border rounded-2xl shadow-sticker-modal">
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
