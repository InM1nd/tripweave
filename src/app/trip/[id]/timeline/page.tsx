import { getTripEvents } from "@/actions/event";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/PageHeader";
import { Plus, FileSpreadsheet } from "lucide-react";
import { AddEventModal } from "@/components/trip/AddEventModal";
import { ImportPlanModal } from "@/components/trip/ImportPlanModal";
import { format } from "date-fns";
import { TimelineEventList } from "@/components/trip/TimelineEventList";
import { TimelineEmptyState } from "@/components/trip/TimelineEmptyState";

type TripEvent = Awaited<ReturnType<typeof getTripEvents>>[number];
type EventWithTime = TripEvent & { time: string };

export default async function TimelinePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const events = await getTripEvents(id);

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
    <div className="space-y-5 md:space-y-6 max-w-4xl mx-auto pb-24 sm:pb-12 min-w-0 w-full">
      <PageHeader
        badge={{ label: "📅 Itinerary", color: "blue" }}
        title="Timeline"
        description="Your trip schedule day by day"
        actions={
          <div className="flex flex-wrap gap-2 sm:gap-3">
            <ImportPlanModal tripId={id}>
              <Button variant="outline" size="sm" className="gap-1.5 sm:gap-2 text-xs sm:text-sm font-bold border-2 border-border shadow-sticker-sm hover:-translate-y-px transition-all rounded-full bg-card h-8 sm:h-9 px-3 sm:px-4">
                <FileSpreadsheet className="h-3.5 w-3.5 sm:h-4 sm:w-4" strokeWidth={3} />
                <span className="hidden sm:inline">Import</span>
              </Button>
            </ImportPlanModal>
            <AddEventModal tripId={id}>
              <Button size="sm" className="gap-1.5 sm:gap-2 text-xs sm:text-sm font-bold border-2 border-border shadow-sticker-sm hover:-translate-y-px hover:shadow-sticker-card transition-all rounded-full bg-primary text-primary-foreground hover:bg-primary/90 h-8 sm:h-9 px-3 sm:px-4">
                <Plus className="h-3.5 w-3.5 sm:h-5 sm:w-5" strokeWidth={3} />
                Add Event
              </Button>
            </AddEventModal>
          </div>
        }
        className="border-b-2 border-border pb-3 sm:pb-4"
      />

      <TimelineEventList groupedEvents={groupedEvents} tripId={id} />

      {Object.keys(groupedEvents).length === 0 && (
        <TimelineEmptyState tripId={id} />
      )}
    </div>
  );
}
