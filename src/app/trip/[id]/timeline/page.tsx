import { getTripEvents } from "@/actions/event";
import { Button } from "@/components/ui/button";
import { Plus, Calendar, FileSpreadsheet } from "lucide-react";
import { AddEventModal } from "@/components/trip/AddEventModal";
import { ImportPlanModal } from "@/components/trip/ImportPlanModal";
import { format } from "date-fns";
import { TimelineEventList } from "@/components/trip/TimelineEventList"; // New client component

type TripEvent = Awaited<ReturnType<typeof getTripEvents>>[number];
type EventWithTime = TripEvent & { time: string };

export default async function TimelinePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const events = await getTripEvents(id);

  // Group events by date
  const groupedEvents: Record<string, EventWithTime[]> = events.reduce((acc: Record<string, EventWithTime[]>, event: TripEvent) => {
    const dateKey = event.startTime.toISOString().split("T")[0];
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push({
      ...event,
      time: format(event.startTime, "HH:mm")
    });
    return acc;
  }, {});

  return (
    <div className="space-y-5 md:space-y-6 max-w-4xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b-2 border-border pb-4">
        <div>
          <div className="bg-sticker-blue text-foreground px-3 py-1 rounded-full font-black text-xs border-2 border-border shadow-[0_3px_0_rgba(0,0,0,0.08)] inline-block mb-2 rotate-1">
            📅 Itinerary
          </div>
          <h2 className="text-2xl md:text-3xl font-black tracking-tighter text-foreground leading-[0.9]">Timeline</h2>
          <p className="text-muted-foreground font-bold text-sm mt-1">Your trip schedule day by day</p>
        </div>
        <div className="flex gap-3">
          <ImportPlanModal tripId={id}>
            <Button variant="outline" className="gap-2 font-bold border-2 border-border shadow-[0_3px_0_rgba(0,0,0,0.08)] hover:-translate-y-px transition-all rounded-full bg-card">
              <FileSpreadsheet className="h-4 w-4" strokeWidth={3} />
              <span className="hidden sm:inline">Import</span>
            </Button>
          </ImportPlanModal>
          <AddEventModal tripId={id}>
            <Button className="gap-2 font-bold border-2 border-border shadow-[0_3px_0_rgba(0,0,0,0.1)] hover:-translate-y-px transition-all rounded-full bg-primary text-primary-foreground hover:bg-primary/90">
              <Plus className="h-5 w-5" strokeWidth={3} />
              Add Event
            </Button>
          </AddEventModal>
        </div>
      </div>

      {/* Timeline List (Client Component for interactivity) */}
      <TimelineEventList groupedEvents={groupedEvents} tripId={id} />

      {/* Empty State */}
      {Object.keys(groupedEvents).length === 0 && (
        <div className="text-center py-16 px-4 border-4 border-dashed border-border rounded-3xl bg-secondary/30 shadow-[0_4px_0_rgba(0,0,0,0.04)]">
          <div className="h-20 w-20 rounded-full bg-sticker-yellow flex items-center justify-center mx-auto mb-6 border-2 border-border shadow-[0_4px_0_rgba(0,0,0,0.08)] -rotate-3">
            <Calendar className="h-10 w-10 text-foreground" strokeWidth={2.5} />
          </div>
          <h3 className="text-2xl font-bold mb-2 text-foreground">No events yet</h3>
          <p className="text-muted-foreground font-medium mb-8">
            Start building your itinerary by adding events.
          </p>
          <AddEventModal tripId={id}>
            <Button className="font-bold border-2 border-border shadow-[0_4px_0_rgba(0,0,0,0.1)] hover:-translate-y-1 transition-all rounded-full bg-sticker-green text-foreground hover:bg-sticker-green/90 px-8 py-6 text-lg">
              <Plus className="h-5 w-5 mr-2" strokeWidth={3} />
              Add First Event
            </Button>
          </AddEventModal>
        </div>
      )}
    </div>
  );
}
