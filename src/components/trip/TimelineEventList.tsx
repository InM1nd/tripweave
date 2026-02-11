"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock } from "lucide-react";
import { EditEventSheet } from "@/components/trip/EditEventSheet";

const eventTypeColors: Record<string, string> = {
    TRANSPORT: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    HOTEL: "bg-purple-500/10 text-purple-500 border-purple-500/20",
    ACTIVITY: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    RESTAURANT: "bg-orange-500/10 text-orange-500 border-orange-500/20",
    OTHER: "bg-gray-500/10 text-gray-500 border-gray-500/20",
};

interface TimelineEventListProps {
    groupedEvents: Record<string, any[]>;
    tripId: string;
}

export function TimelineEventList({ groupedEvents, tripId }: TimelineEventListProps) {
    const [selectedEvent, setSelectedEvent] = useState<any | null>(null);

    return (
        <div className="space-y-6 md:space-y-8">
            {Object.entries(groupedEvents).map(([dateKey, events]: [string, any[]]) => {
                const date = new Date(dateKey);
                return (
                    <div key={dateKey} className="relative">
                        {/* Date Header - Mobile optimized */}
                        <div className="flex items-center gap-3 md:gap-4 mb-3 md:mb-4 sticky top-28 z-20 bg-background/95 backdrop-blur-sm py-2 bo rounded-lg">
                            <div className="h-10 w-10 md:h-12 md:w-12 rounded-xl bg-primary/10 flex flex-col items-center justify-center shrink-0">
                                <span className="text-base md:text-lg font-bold text-primary leading-none">
                                    {date.getDate()}
                                </span>
                                <span className="text-[10px] text-primary uppercase">
                                    {date.toLocaleDateString("en-US", { month: "short" })}
                                </span>
                            </div>
                            <div>
                                <h3 className="font-semibold text-sm md:text-base">
                                    {date.toLocaleDateString("en-US", { weekday: "long" })}
                                </h3>
                                <p className="text-xs md:text-sm text-muted-foreground">
                                    {events.length} {events.length === 1 ? "event" : "events"}
                                </p>
                            </div>
                        </div>

                        {/* Events */}
                        <div className="ml-5 md:ml-6 pl-4 md:pl-6 border-l-2 border-border/50 space-y-3 md:space-y-4">
                            {events.map((event: any) => (
                                <Card
                                    key={event.id}
                                    className="border-border/40 bg-card/50 backdrop-blur-sm hover:shadow-md transition-shadow cursor-pointer overflow-hidden group"
                                    onClick={() => setSelectedEvent(event)}
                                >
                                    {event.coverImage && (
                                        <div className="relative h-32 w-full overflow-hidden">
                                            <img
                                                src={event.coverImage}
                                                alt={event.title}
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                            />
                                        </div>
                                    )}
                                    <CardContent className="p-3 md:p-4">
                                        <div className="flex items-start gap-3 md:gap-4">
                                            <div className="flex flex-col items-center gap-1 shrink-0 mt-0.5">
                                                <Clock className="h-3.5 w-3.5 md:h-4 md:w-4 text-muted-foreground" />
                                                <span className="text-xs md:text-sm font-medium">{event.time}</span>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-2 mb-1">
                                                    <h4 className="font-semibold truncate text-sm md:text-base group-hover:text-primary transition-colors">{event.title}</h4>
                                                    <Badge variant="outline" className={`w-fit text-[10px] px-1.5 py-0 h-5 ${eventTypeColors[event.type] || eventTypeColors.OTHER}`}>
                                                        {event.type}
                                                    </Badge>
                                                </div>
                                                <p className="text-xs md:text-sm text-muted-foreground mb-1.5 line-clamp-2">
                                                    {event.description}
                                                </p>
                                                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                                    <MapPin className="h-3 w-3" />
                                                    <span className="truncate">{event.location}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                );
            })}

            {selectedEvent && (
                <EditEventSheet
                    event={selectedEvent}
                    open={!!selectedEvent}
                    onOpenChange={(open) => !open && setSelectedEvent(null)}
                    tripId={tripId}
                />
            )}
        </div>
    );
}
