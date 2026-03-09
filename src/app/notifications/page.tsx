"use client";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { StickerAnimator } from "@/components/ui/StickerAnimator";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/button";
import { Bell, Calendar, Check, UserPlus, Wallet } from "lucide-react";
import { getStickerBgClass } from "@/lib/design-tokens";

// Mock notifications
const mockNotifications = [
  {
    id: "1",
    type: "invite",
    title: "Trip Invitation",
    message: "Alex invited you to join 'Summer in Italy'",
    time: "2 hours ago",
    read: false,
    action: true,
  },
  {
    id: "2",
    type: "expense",
    title: "New Expense Added",
    message: "Sarah added 'Dinner at Mario's' (€120)",
    time: "5 hours ago",
    read: false,
    action: false,
  },
  {
    id: "3",
    type: "update",
    title: "Trip Updated",
    message: "New event added to 'Tokyo Adventure'",
    time: "1 day ago",
    read: true,
    action: false,
  },
  {
    id: "4",
    type: "reminder",
    title: "Upcoming Trip",
    message: "Your trip to Paris starts in 3 days!",
    time: "2 days ago",
    read: true,
    action: false,
  },
];

const getIcon = (type: string) => {
  switch (type) {
    case "invite":
      return <UserPlus className="h-5 w-5 text-teal" />;
    case "expense":
      return <Wallet className="h-5 w-5 text-success" />;
    case "update":
      return <Calendar className="h-5 w-5 text-muted-foreground" />;
    default:
      return <Bell className="h-5 w-5 text-muted-foreground" />;
  }
};

export default function NotificationsPage() {
  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto space-y-6 p-4 md:p-0">
        <PageHeader
          badge={{ label: "🔔 What's new", color: "coral" }}
          title="Notifications"
          description="Stay updated with your trips"
          actions={
            <Button variant="stickerOutline" className="gap-2 hidden sm:flex">
              <Check className="h-4 w-4" strokeWidth={3} />
              Mark all read
            </Button>
          }
          className="border-b-2 border-border pb-4"
        />

        <div className="space-y-4">
          {mockNotifications.map((notification, i) => (
            <StickerAnimator key={notification.id} delay={i * 0.06}>
              <Card
                className={`transition-all duration-300 border-2 border-border shadow-sticker-card hover:shadow-sticker-card-hover hover:-translate-y-1 rounded-2xl ${notification.read ? "bg-card/80 opacity-80" : "bg-card relative overflow-hidden"
                  }`}
              >
                {!notification.read && (
                  <div className={`absolute top-0 left-0 w-2 h-full ${getStickerBgClass("coral").split(" ")[0]}`} />
                )}
                <CardContent className="p-4 flex items-start gap-3">
                  <div className={`shrink-0 mt-0.5 h-10 w-10 rounded-full flex items-center justify-center border-2 shadow-sticker-sm-soft ${notification.read ? "bg-secondary border-border" : `${getStickerBgClass("yellow")} border-border`
                    }`}>
                    {getIcon(notification.type)}
                  </div>

                  <div className="flex-1 space-y-1 pt-0.5">
                    <div className="flex items-start justify-between">
                      <h4 className={`font-black text-base leading-tight ${notification.read ? "text-foreground" : "text-foreground"}`}>
                        {notification.title}
                      </h4>
                      <span className="text-xs font-bold text-muted-foreground whitespace-nowrap ml-2 bg-secondary px-2 py-0.5 rounded-md border border-border">
                        {notification.time}
                      </span>
                    </div>
                    <p className="font-bold text-muted-foreground leading-relaxed text-sm">
                      {notification.message}
                    </p>

                    {notification.action && (
                      <div className="flex gap-3 mt-4">
                        <Button size="sm" variant="stickerGreen">
                          Accept
                        </Button>
                        <Button size="sm" variant="stickerOutline">
                          Decline
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </StickerAnimator>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
