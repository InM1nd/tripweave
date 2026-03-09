
import { getTrip } from "@/actions/trip";
import { getSuggestedEvents } from "@/actions/event";
import { SuggestedPlacesBoard } from "@/components/trip/SuggestedPlacesBoard";
import { PageHeader } from "@/components/ui/PageHeader";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

export default async function SuggestedPlacesPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const trip = await getTrip(id);

  const supabase = await createClient();
  const { data: { user: authUser } } = await supabase.auth.getUser();

  let currentUserId = "";
  if (authUser) {
    const dbUser = await prisma.user.findUnique({
      where: { authId: authUser.id }
    });
    if (dbUser) currentUserId = dbUser.id;
  }

  if (!trip) {
    notFound();
  }

  const events = await getSuggestedEvents(id);

  return (
    <div className="space-y-6 flex flex-col h-full pb-12">
      <PageHeader
        badge={{ label: "💡 Idea Board", color: "pink" }}
        title="Suggested Places"
        description="Places added by the group to vote on"
        className="border-b-2 border-border pb-4 shrink-0"
      />

      <div className={`flex-1 min-h-0 bg-card rounded-3xl border-2 border-border overflow-hidden shadow-sticker-sm-soft relative p-2 md:p-6`}>
        <SuggestedPlacesBoard
          tripId={trip.id}
          events={events}
          currentUserId={currentUserId}
          tripStartDate={trip.startDate}
          tripEndDate={trip.endDate}
        />
      </div>
    </div>
  );
}
