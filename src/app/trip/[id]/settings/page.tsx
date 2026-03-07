"use client";

import { use, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Save, Trash2, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ImageUpload } from "@/components/ui/image-upload";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Trip } from "@prisma/client";

import { getTrip, updateTrip, deleteTrip } from "@/actions/trip";
import { updateTripSchema, UpdateTripValues } from "@/lib/validations/trip";

export default function SettingsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [trip, setTrip] = useState<Trip | null>(null);

  const form = useForm<UpdateTripValues>({
    resolver: zodResolver(updateTripSchema),
    defaultValues: {
      name: "",
      destination: "",
      description: "",
      coverImage: "",
    },
  });

  useEffect(() => {
    async function loadTrip() {
      try {
        const data = await getTrip(id);
        if (data) {
          setTrip(data);
          form.reset({
            name: data.name,
            destination: data.destination,
            description: data.description || "",
            coverImage: data.coverImage || "",
            startDate: new Date(data.startDate),
            endDate: new Date(data.endDate),
          });
        }
      } catch {
        toast.error("Failed to load trip settings");
      } finally {
        setLoading(false);
      }
    }
    loadTrip();
  }, [id, form]);

  async function onSubmit(data: UpdateTripValues) {
    setSaving(true);
    try {
      const result = await updateTrip(id, data);
      if (result.success) {
        toast.success("Trip updated successfully");
        router.refresh();
      } else {
        toast.error(result.error || "Failed to update trip");
      }
    } catch {
      toast.error("An error occurred");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!confirm("Are you sure you want to delete this trip? This action cannot be undone.")) return;

    setSaving(true);
    try {
      const result = await deleteTrip(id);
      if (result.success) {
        toast.success("Trip deleted");
        router.push("/dashboard");
      } else {
        toast.error(result.error || "Failed to delete trip");
        setSaving(false);
      }
    } catch {
      toast.error("An error occurred");
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!trip) {
    return <div>Trip not found</div>;
  }

  return (
    <div className="space-y-5 md:space-y-6 max-w-4xl mx-auto pb-12">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b-2 border-border pb-4">
        <div>
          <div className="bg-sticker-blue text-foreground px-3 py-1 rounded-full font-black text-xs border-2 border-border shadow-[0_3px_0_rgba(0,0,0,0.08)] inline-block mb-2 rotate-1">
            ⚙️ Configuration
          </div>
          <h2 className="text-2xl md:text-3xl font-black tracking-tighter text-foreground leading-[0.9]">Trip Settings</h2>
          <p className="text-muted-foreground font-bold text-sm mt-1">Manage your trip details and preferences</p>
          <p className="text-sm font-bold text-foreground/60 mt-2 bg-secondary/50 inline-block px-3 py-1 rounded-md border border-border">
            ✨ Tip: You can now drag and drop an image to update the trip cover!
          </p>
        </div>
      </div>

      <div className="grid gap-5 md:gap-6">
        {/* General Settings */}
        <Card className="border-2 border-border bg-card shadow-[0_4px_0_rgba(0,0,0,0.08)] rounded-3xl overflow-hidden">
          <CardHeader className="p-5 md:p-6 pb-4 md:pb-4 border-b-2 border-border bg-secondary/30">
            <CardTitle className="text-lg md:text-xl font-black">General Information</CardTitle>
            <CardDescription className="text-sm font-bold text-muted-foreground">Update the basic details of your trip.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5 p-5 md:p-6 pt-5 md:pt-6">
            <div className="grid gap-2">
              <Label htmlFor="coverImage" className="font-bold text-sm">Trip Cover Image</Label>
              <ImageUpload
                value={form.watch("coverImage")}
                onChange={(url) => form.setValue("coverImage", url)}
                endpoint="trip-covers"
                folder={id}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="name" className="font-bold text-sm">Trip Name</Label>
              <Input id="name" {...form.register("name")} className="border-2 border-border shadow-[0_2px_0_rgba(0,0,0,0.04)] font-bold rounded-xl h-11" />
              {form.formState.errors.name && <p className="text-danger font-bold text-xs">{form.formState.errors.name.message}</p>}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="destination" className="font-bold text-sm">Destination</Label>
              <Input id="destination" {...form.register("destination")} className="border-2 border-border shadow-[0_2px_0_rgba(0,0,0,0.04)] font-bold rounded-xl h-11" />
              {form.formState.errors.destination && <p className="text-danger font-bold text-xs">{form.formState.errors.destination.message}</p>}
            </div>

            <div className="grid gap-2">
              <Label className="font-bold text-sm">Dates</Label>
              <div className="flex gap-3">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-bold border-2 border-border shadow-[0_2px_0_rgba(0,0,0,0.04)] rounded-xl h-11",
                        !form.watch("startDate") && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" strokeWidth={3} />
                      {form.watch("startDate") ? format(form.watch("startDate")!, "PPP") : <span>Start Date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 border-2 border-border shadow-[0_4px_0_rgba(0,0,0,0.08)] rounded-xl overflow-hidden">
                    <Calendar
                      mode="single"
                      selected={form.watch("startDate")}
                      onSelect={(date) => date && form.setValue("startDate", date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-bold border-2 border-border shadow-[0_2px_0_rgba(0,0,0,0.04)] rounded-xl h-11",
                        !form.watch("endDate") && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" strokeWidth={3} />
                      {form.watch("endDate") ? format(form.watch("endDate")!, "PPP") : <span>End Date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 border-2 border-border shadow-[0_4px_0_rgba(0,0,0,0.08)] rounded-xl overflow-hidden">
                    <Calendar
                      mode="single"
                      selected={form.watch("endDate")}
                      onSelect={(date) => date && form.setValue("endDate", date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description" className="font-bold text-sm">Description</Label>
              <Textarea
                id="description"
                {...form.register("description")}
                className="resize-none min-h-[120px] border-2 border-border shadow-[0_2px_0_rgba(0,0,0,0.04)] font-bold rounded-xl"
              />
            </div>
          </CardContent>
          <CardFooter className="border-t-2 border-border bg-secondary/10 px-5 md:px-6 py-4 md:py-5 flex justify-end">
            <Button
              onClick={form.handleSubmit(onSubmit)}
              disabled={saving}
              className="w-full md:w-auto font-bold border-2 border-border shadow-[0_3px_0_rgba(0,0,0,0.1)] hover:-translate-y-px transition-all rounded-2xl bg-sticker-green text-foreground hover:bg-sticker-green/90 px-8 h-11"
            >
              {saving ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Save className="h-5 w-5 mr-2" strokeWidth={3} />}
              Save Changes
            </Button>
          </CardFooter>
        </Card>

        {/* Danger Zone */}
        <Card className="border-4 border-dashed border-danger bg-danger/5 rounded-3xl shadow-[0_4px_0_rgba(0,0,0,0.04)]">
          <CardHeader className="p-5 md:p-6 pb-2 md:pb-3 border-b-4 border-dashed border-danger/20">
            <CardTitle className="text-xl md:text-2xl font-black text-danger">Danger Zone</CardTitle>
            <CardDescription className="text-sm font-bold text-danger/80">
              Irreversible actions for this trip.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-5 md:p-6 pt-5 md:pt-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1 md:space-y-1.5">
                <h4 className="font-black text-base md:text-lg text-danger">Delete this trip</h4>
                <p className="text-sm font-bold text-danger/70">
                  Once you delete a trip, there is no going back.
                </p>
              </div>
              <Button variant="destructive" className="w-full sm:w-auto shrink-0 font-bold border-2 border-danger shadow-[0_3px_0_rgba(220,38,38,0.2)] hover:-translate-y-px transition-all rounded-2xl h-11 px-6" onClick={handleDelete} disabled={saving}>
                <Trash2 className="h-5 w-5 mr-2" strokeWidth={3} />
                Delete Trip
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
