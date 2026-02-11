import { getTripEvents } from "@/actions/event";
import { Button } from "@/components/ui/button";
import { Plus, Calendar, FileSpreadsheet } from "lucide-react";
import { AddEventModal } from "@/components/trip/AddEventModal";
import { ImportPlanModal } from "@/components/trip/ImportPlanModal";
import { format } from "date-fns";
import { TimelineEventList } from "@/components/trip/TimelineEventList"; // New client component

export default async function TimelinePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const events = await getTripEvents(id);

  // Group events by date
  const groupedEvents: Record<string, any[]> = events.reduce((acc: any, event: any) => {
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
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Timeline</h2>
          <p className="text-muted-foreground">Your trip schedule day by day</p>
        </div>
        <div className="flex gap-2">
          <ImportPlanModal tripId={id}>
            <Button variant="outline" className="gap-2">
              <FileSpreadsheet className="h-4 w-4" />
              <span className="hidden sm:inline">Import</span>
            </Button>
          </ImportPlanModal>
          <AddEventModal tripId={id}>
            <Button className="gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all">
              <Plus className="h-4 w-4" />
              Add Event
            </Button>
          </AddEventModal>
        </div>
      </div>

      {/* Timeline List (Client Component for interactivity) */}
      <TimelineEventList groupedEvents={groupedEvents} tripId={id} />

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
          <AddEventModal tripId={id}>
            <Button className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all">
              <Plus className="h-4 w-4 mr-2" />
              Add First Event
            </Button>
          </AddEventModal>
        </div>
      )}
    </div>
  );
}
