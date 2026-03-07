
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
    <div className="space-y-6 flex flex-col h-full pb-12">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b-2 border-border pb-4 shrink-0">
        <div>
          <div className="bg-sticker-pink text-foreground px-3 py-1 rounded-full font-black text-xs border-2 border-border shadow-[0_3px_0_rgba(0,0,0,0.08)] inline-block mb-2 -rotate-1">
            💡 Idea Board
          </div>
          <h2 className="text-2xl md:text-3xl font-black tracking-tighter text-foreground leading-[0.9]">Suggested Places</h2>
          <p className="text-muted-foreground font-bold text-sm mt-1">Places added by the group to vote on</p>
        </div>
      </div>

      <div className="flex-1 min-h-0 bg-card rounded-3xl border-2 border-border overflow-hidden shadow-[0_4px_0_rgba(0,0,0,0.06)] relative p-2 md:p-6">
        <SuggestedPlacesBoard
          tripId={trip.id}
          events={events}
          currentUserId={currentUserId}
        />
      </div>
    </div>
  );
}
