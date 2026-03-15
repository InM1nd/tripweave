import { getTrip } from "@/actions/trip";
import { TripSettingsForm } from "@/components/trip/TripSettingsForm";
import { notFound } from "next/navigation";

export default async function SettingsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const trip = await getTrip(id);

  if (!trip) {
    notFound();
  }

  return <TripSettingsForm trip={trip} />;
}
