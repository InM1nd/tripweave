"use client";

import { use, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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

import { getTrip, updateTrip, deleteTrip } from "@/actions/trip";
import { updateTripSchema, UpdateTripValues } from "@/lib/validations/trip";

export default function SettingsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [trip, setTrip] = useState<any>(null);

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
      } catch (error) {
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
    } catch (error) {
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
    <div className="space-y-4 md:space-y-6 max-w-4xl mx-auto pb-10">
      <div>
        <h2 className="text-xl md:text-2xl font-bold">Trip Settings</h2>
        <p className="text-sm md:text-base text-muted-foreground">Manage your trip details and preferences</p>
        <p className="text-sm text-foreground/50 mt-2">
          Tip: You can now drag and drop an image to update the trip cover!
        </p>
      </div>

      <div className="grid gap-4 md:gap-6">
        {/* General Settings */}
        <Card className="border-border/40 bg-card/50">
          <CardHeader className="p-4 md:p-6 pb-2 md:pb-2">
            <CardTitle className="text-base md:text-lg">General Information</CardTitle>
            <CardDescription className="text-xs md:text-sm">Update the basic details of your trip.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 p-4 md:p-6 pt-2 md:pt-4">
            <div className="grid gap-2">
              <Label htmlFor="coverImage" className="text-sm">Trip Cover Image</Label>
              <ImageUpload
                value={form.watch("coverImage")}
                onChange={(url) => form.setValue("coverImage", url)}
                endpoint="trip-covers"
                folder={id}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="name" className="text-sm">Trip Name</Label>
              <Input id="name" {...form.register("name")} />
              {form.formState.errors.name && <p className="text-red-500 text-xs">{form.formState.errors.name.message}</p>}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="destination" className="text-sm">Destination</Label>
              <Input id="destination" {...form.register("destination")} />
              {form.formState.errors.destination && <p className="text-red-500 text-xs">{form.formState.errors.destination.message}</p>}
            </div>

            <div className="grid gap-2">
              <Label className="text-sm">Dates</Label>
              <div className="flex gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !form.watch("startDate") && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {form.watch("startDate") ? format(form.watch("startDate")!, "PPP") : <span>Start Date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
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
                        "w-full justify-start text-left font-normal",
                        !form.watch("endDate") && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {form.watch("endDate") ? format(form.watch("endDate")!, "PPP") : <span>End Date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
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
              <Label htmlFor="description" className="text-sm">Description</Label>
              <Textarea
                id="description"
                {...form.register("description")}
                className="resize-none min-h-[100px]"
              />
            </div>
          </CardContent>
          <CardFooter className="border-t border-border/40 px-4 md:px-6 py-3 md:py-4">
            <Button
              onClick={form.handleSubmit(onSubmit)}
              disabled={saving}
              className="w-full md:w-auto bg-gradient-to-r from-emerald-500 to-teal-600 text-white"
            >
              {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
              Save Changes
            </Button>
          </CardFooter>
        </Card>

        {/* Danger Zone */}
        <Card className="border-red-500/20 bg-red-500/5">
          <CardHeader className="p-4 md:p-6 pb-2 md:pb-2">
            <CardTitle className="text-base md:text-lg text-red-500">Danger Zone</CardTitle>
            <CardDescription className="text-xs md:text-sm">
              Irreversible actions for this trip.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 md:p-6 pt-2 md:pt-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-0.5 md:space-y-1">
                <h4 className="font-medium text-sm md:text-base">Delete this trip</h4>
                <p className="text-xs md:text-sm text-muted-foreground">
                  Once you delete a trip, there is no going back.
                </p>
              </div>
              <Button variant="destructive" className="w-full sm:w-auto shrink-0" onClick={handleDelete} disabled={saving}>
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Trip
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
