import { getTripEvents } from "@/actions/event";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/PageHeader";
import { Plus, Calendar, FileSpreadsheet } from "lucide-react";
import { AddEventModal } from "@/components/trip/AddEventModal";
import { ImportPlanModal } from "@/components/trip/ImportPlanModal";
import { format } from "date-fns";
import { TimelineEventList } from "@/components/trip/TimelineEventList";

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
    <div className="space-y-5 md:space-y-6 max-w-4xl mx-auto pb-12">
      <PageHeader
        badge={{ label: "📅 Itinerary", color: "blue" }}
        title="Timeline"
        description="Your trip schedule day by day"
        actions={
          <div className="flex gap-3">
            <ImportPlanModal tripId={id}>
              <Button variant="outline" className={`gap-2 font-bold border-2 border-border shadow-sticker-sm hover:-translate-y-px transition-all rounded-full bg-card`}>
                <FileSpreadsheet className="h-4 w-4" strokeWidth={3} />
                <span className="hidden sm:inline">Import</span>
              </Button>
            </ImportPlanModal>
            <AddEventModal tripId={id}>
              <Button className="gap-2 font-bold border-2 border-border shadow-sticker-sm hover:-translate-y-px hover:shadow-sticker-card transition-all rounded-full bg-primary text-primary-foreground hover:bg-primary/90">
                <Plus className="h-5 w-5" strokeWidth={3} />
                Add Event
              </Button>
            </AddEventModal>
          </div>
        }
        className="border-b-2 border-border pb-4"
      />

      <TimelineEventList groupedEvents={groupedEvents} tripId={id} />

      {Object.keys(groupedEvents).length === 0 && (
        <EmptyState
          variant="sticker"
          icon={Calendar}
          iconBgColor="yellow"
          title="No events yet"
          description="Start building your itinerary by adding events."
          action={
            <AddEventModal tripId={id}>
              <Button variant="stickerGreen" className="px-8 py-6 text-lg">
                <Plus className="h-5 w-5 mr-2" strokeWidth={3} />
                Add First Event
              </Button>
            </AddEventModal>
          }
        />
      )}
    </div>
  );
}
