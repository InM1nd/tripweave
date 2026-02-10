"use client";

import { use } from "react";
import TripLayout from "@/components/layout/TripLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Calendar, MapPin, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { AddEventModal } from "@/components/trip/AddEventModal";

// Mock timeline events
const events: any[] = [];

const eventTypeColors: Record<string, string> = {
  transport: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  accommodation: "bg-purple-500/10 text-purple-500 border-purple-500/20",
  activity: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  food: "bg-orange-500/10 text-orange-500 border-orange-500/20",
  other: "bg-gray-500/10 text-gray-500 border-gray-500/20",
};

export default function TimelinePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  // Group events by date
  const groupedEvents: Record<string, any[]> = events.reduce((acc: any, event: any) => {
    const dateKey = event.date.toISOString().split("T")[0];
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(event);
    return acc;
  }, {});

  return (
    <TripLayout tripId={id}>
      <div className="space-y-6 max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Timeline</h2>
            <p className="text-muted-foreground">Your trip schedule day by day</p>
          </div>
          <AddEventModal>
            <Button className="gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all">
              <Plus className="h-4 w-4" />
              Add Event
            </Button>
          </AddEventModal>
        </div>

        {/* Timeline */}
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
                    <Card key={event.id} className="border-border/40 bg-card/50 backdrop-blur-sm hover:shadow-md transition-shadow cursor-pointer">
                      <CardContent className="p-3 md:p-4">
                        <div className="flex items-start gap-3 md:gap-4">
                          <div className="flex flex-col items-center gap-1 shrink-0 mt-0.5">
                            <Clock className="h-3.5 w-3.5 md:h-4 md:w-4 text-muted-foreground" />
                            <span className="text-xs md:text-sm font-medium">{event.time}</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-2 mb-1">
                              <h4 className="font-semibold truncate text-sm md:text-base">{event.title}</h4>
                              <Badge variant="outline" className={`w-fit text-[10px] px-1.5 py-0 h-5 ${eventTypeColors[event.type] || eventTypeColors.other}`}>
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
        </div>

        {/* Empty State */}
        {Object.keys(groupedEvents).length === 0 && (
          <div className="text-center py-16">
            <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Calendar className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No events yet</h3>
            <p className="text-muted-foreground mb-6">
              Start building your itinerary by adding events.
            </p>
            <AddEventModal>
              <Button className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all">
                <Plus className="h-4 w-4 mr-2" />
                Add First Event
              </Button>
            </AddEventModal>
          </div>
        )}
      </div>
    </TripLayout>
  );
}
