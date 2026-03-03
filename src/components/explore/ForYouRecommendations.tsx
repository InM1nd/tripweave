"use client";

import { useState, useEffect } from "react";
import { getForYouRecommendations } from "@/actions/recommendations";
import { PlaceCard } from "./PlaceCard";
import { Button } from "@/components/ui/button";
import { Loader2, RefreshCw, Telescope, Utensils, TreePine, Landmark } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";

interface ForYouRecommendationsProps {
    initialPlaces: any[];
    onAddPlace: (place: any) => void;
}

const FILTER_OPTIONS = [
    { id: "unusual", label: "Unusual Places", icon: Telescope },
    { id: "restaurants", label: "Restaurants & Food", icon: Utensils },
    { id: "nature", label: "Nature & Outdoors", icon: TreePine },
    { id: "culture", label: "History & Culture", icon: Landmark }
];

export function ForYouRecommendations({ initialPlaces, onAddPlace }: ForYouRecommendationsProps) {
    const [places, setPlaces] = useState<any[]>(initialPlaces || []);
    const [isLoading, setIsLoading] = useState(false);
    const [offset, setOffset] = useState(initialPlaces?.length || 0);
    const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

    const loadMore = async (reset = false) => {
        setIsLoading(true);
        const currentOffset = reset ? 0 : offset;

        try {
            const activeFilterLabels = FILTER_OPTIONS
                .filter(f => selectedFilters.includes(f.id))
                .map(f => f.label);

            const res = await getForYouRecommendations(currentOffset, activeFilterLabels);
            if (res.success && res.places) {
                // Map the results to have unique IDs so PlaceCard works
                const newPlaces = res.places.map((p: any) => ({
                    ...p,
                    id: crypto.randomUUID(),
                    source: "AI_RECOMMENDATION"
                }));

                if (reset) {
                    setPlaces(newPlaces);
                    setOffset(newPlaces.length);
                } else {
                    setPlaces(prev => [...prev, ...newPlaces]);
                    setOffset(prev => prev + newPlaces.length);
                }
            } else {
                toast.error(res.error || "Failed to load recommendations");
            }
        } catch (e) {
            toast.error("An error occurred");
        } finally {
            setIsLoading(false);
        }
    };

    const toggleFilter = (id: string) => {
        const newFilters = selectedFilters.includes(id)
            ? selectedFilters.filter(f => f !== id)
            : [...selectedFilters, id];

        setSelectedFilters(newFilters);
    };

    // Load initial places if empty
    useEffect(() => {
        if (places.length === 0 && !isLoading) {
            loadMore(true);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap items-center gap-4 bg-muted/30 p-4 rounded-xl border">
                <span className="text-sm font-medium">Personalize:</span>
                {FILTER_OPTIONS.map(option => (
                    <div key={option.id} className="flex items-center space-x-2">
                        <Checkbox
                            id={option.id}
                            checked={selectedFilters.includes(option.id)}
                            onCheckedChange={() => toggleFilter(option.id)}
                        />
                        <label
                            htmlFor={option.id}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex items-center gap-1.5"
                        >
                            <option.icon className="h-4 w-4 text-primary/70" />
                            {option.label}
                        </label>
                    </div>
                ))}

                <Button
                    variant="secondary"
                    size="sm"
                    className="ml-auto"
                    onClick={() => loadMore(true)}
                    disabled={isLoading}
                >
                    <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
                    Refresh
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {places.map((item) => (
                    <PlaceCard
                        key={item.id}
                        place={item}
                        isRecommendation={true}
                        onAddToTrip={() => onAddPlace(item)}
                    />
                ))}
            </div>

            {places.length > 0 && (
                <div className="flex justify-center pt-6 pb-12">
                    <Button
                        size="lg"
                        variant="outline"
                        onClick={() => loadMore()}
                        disabled={isLoading}
                        className="w-full max-w-sm gap-2"
                    >
                        {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                        Load More Recommendations
                    </Button>
                </div>
            )}
        </div>
    );
}
