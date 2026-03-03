
import { getTrip } from "@/actions/trip";
import { getSuggestedEvents } from "@/actions/event";
import { SuggestedPlacesBoard } from "@/components/trip/SuggestedPlacesBoard";
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
    <div className="space-y-6 flex flex-col h-full">
      <div className="flex flex-col shrink-0">
        <h2 className="text-xl md:text-2xl font-bold">Suggested Places</h2>
        <p className="text-sm md:text-base text-muted-foreground">Places added by the group to vote on</p>
      </div>

      <div className="flex-1 min-h-0">
        <SuggestedPlacesBoard
          tripId={trip.id}
          events={events as any}
          currentUserId={currentUserId}
        />
      </div>
    </div>
  );
}
