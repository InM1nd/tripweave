"use client";

import { use } from "react";
import TripLayout from "@/components/layout/TripLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarIcon, Save, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useState } from "react";

export default function SettingsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [date, setDate] = useState<Date | undefined>(new Date());

  // Mock initial data
  const defaultValues = {
    tripName: "Trip to Tokyo",
    destination: "Tokyo, Japan",
    description: "A wonderul 2-week trip exploring the best of Japan.",
  };

  return (
    <TripLayout tripId={id}>
      <div className="space-y-4 md:space-y-6 max-w-4xl mx-auto">
        <div>
          <h2 className="text-xl md:text-2xl font-bold">Trip Settings</h2>
          <p className="text-sm md:text-base text-muted-foreground">Manage your trip details and preferences</p>
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
                <Label htmlFor="name" className="text-sm">Trip Name</Label>
                <Input id="name" defaultValue={defaultValues.tripName} />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="destination" className="text-sm">Destination</Label>
                <Input id="destination" defaultValue={defaultValues.destination} />
              </div>

              <div className="grid gap-2">
                <Label className="text-sm">Dates</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="description" className="text-sm">Description</Label>
                <Textarea
                  id="description"
                  defaultValue={defaultValues.description}
                  className="resize-none min-h-[100px]"
                />
              </div>
            </CardContent>
            <CardFooter className="border-t border-border/40 px-4 md:px-6 py-3 md:py-4">
              <Button className="w-full md:w-auto bg-gradient-to-r from-emerald-500 to-teal-600 text-white">
                <Save className="h-4 w-4 mr-2" />
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
                <Button variant="destructive" className="w-full sm:w-auto shrink-0">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Trip
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </TripLayout>
  );
}
