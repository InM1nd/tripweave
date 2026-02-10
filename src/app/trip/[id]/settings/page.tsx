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
      <div className="space-y-6 max-w-4xl mx-auto">
        <div>
          <h2 className="text-2xl font-bold">Trip Settings</h2>
          <p className="text-muted-foreground">Manage your trip details and preferences</p>
        </div>

        <div className="grid gap-6">
          {/* General Settings */}
          <Card className="border-border/40 bg-card/50">
            <CardHeader>
              <CardTitle>General Information</CardTitle>
              <CardDescription>Update the basic details of your trip.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Trip Name</Label>
                <Input id="name" defaultValue={defaultValues.tripName} />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="destination">Destination</Label>
                <Input id="destination" defaultValue={defaultValues.destination} />
              </div>

              <div className="grid gap-2">
                <Label>Dates</Label>
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
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  defaultValue={defaultValues.description}
                  className="resize-none min-h-[100px]"
                />
              </div>
            </CardContent>
            <CardFooter className="border-t border-border/40 px-6 py-4">
              <Button className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white">
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </CardFooter>
          </Card>

          {/* Danger Zone */}
          <Card className="border-red-500/20 bg-red-500/5">
            <CardHeader>
              <CardTitle className="text-red-500">Danger Zone</CardTitle>
              <CardDescription>
                Irreversible actions for this trip.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h4 className="font-medium">Delete this trip</h4>
                  <p className="text-sm text-muted-foreground">
                    Once you delete a trip, there is no going back. Please be certain.
                  </p>
                </div>
                <Button variant="destructive">
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
