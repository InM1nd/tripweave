"use client";

import { use } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Calendar as CalendarIcon, Clock, Plus, MoreHorizontal } from "lucide-react";

// Mock data re-used/adapted
const days: any[] = [];

const typeColors: Record<string, string> = {
  transport: "bg-blue-500/10 text-blue-500",
  accommodation: "bg-purple-500/10 text-purple-500",
  activity: "bg-emerald-500/10 text-emerald-500",
  food: "bg-orange-500/10 text-orange-500",
};

export default function ItineraryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold">Itinerary Board</h2>
          <p className="text-sm md:text-base text-muted-foreground">High-level plan by day</p>
        </div>
        <Button variant="outline" className="w-full md:w-auto gap-2">
          <Calendar className="h-4 w-4" />
          Calendar View
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {days.map((day) => (
          <Card key={day.day} className="h-full border-border/40 bg-card/50 flex flex-col">
            <CardHeader className="pb-3 border-b border-border/40 bg-muted/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center font-bold text-primary">
                    {day.day}
                  </div>
                  <div>
                    <CardTitle className="text-base">{day.date}</CardTitle>
                    <p className="text-xs text-muted-foreground font-normal">{day.title}</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-3 flex-1 flex flex-col gap-2">
              {day.activities.length > 0 ? (
                day.activities.map((act: any) => (
                  <div key={act.id} className="p-3 rounded-lg bg-background border border-border/50 hover:border-primary/50 transition-colors group cursor-grab active:cursor-grabbing">
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-xs font-mono text-muted-foreground">{act.time}</span>
                      <Badge variant="secondary" className={`text-[10px] px-1 py-0 h-5 ${typeColors[act.type]}`}>
                        {act.type}
                      </Badge>
                    </div>
                    <p className="font-medium text-sm leading-tight group-hover:text-primary transition-colors">{act.title}</p>
                  </div>
                ))
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground py-8 border-2 border-dashed border-border/40 rounded-lg">
                  <p className="text-xs">No activities</p>
                </div>
              )}

              <Button variant="ghost" size="sm" className="w-full mt-auto border border-dashed border-border/50 text-muted-foreground hover:text-primary hover:border-primary/50">
                <Plus className="h-3 w-3 mr-2" />
                Add Activity
              </Button>
            </CardContent>
          </Card>
        ))}

        {/* Add Day Column */}
        <div className="h-[200px] md:h-auto border-2 border-dashed border-border/40 rounded-xl flex flex-col items-center justify-center text-muted-foreground hover:bg-muted/10 hover:border-primary/40 transition-all cursor-pointer">
          <Plus className="h-8 w-8 mb-2 opacity-50" />
          <span className="font-medium">Add Day</span>
        </div>
      </div>
    </div>
  );
}
