"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bell, Calendar, Check, UserPlus, Wallet } from "lucide-react";

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
      return <UserPlus className="h-5 w-5 text-blue-500" />;
    case "expense":
      return <Wallet className="h-5 w-5 text-emerald-500" />;
    case "update":
      return <Calendar className="h-5 w-5 text-orange-500" />;
    default:
      return <Bell className="h-5 w-5 text-gray-500" />;
  }
};

export default function NotificationsPage() {
  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Notifications</h2>
            <p className="text-muted-foreground">Stay updated with your trips</p>
          </div>
          <Button variant="outline" className="gap-2">
            <Check className="h-4 w-4" />
            Mark all as read
          </Button>
        </div>

        <div className="space-y-4">
          {mockNotifications.map((notification) => (
            <Card key={notification.id} className={`transition-colors ${notification.read ? "bg-card/50" : "bg-primary/5 border-primary/20"}`}>
              <CardContent className="p-4 flex items-start gap-4">
                <div className={`mt-1 h-10 w-10 rounded-full flex items-center justify-center border ${notification.read ? "bg-background border-border" : "bg-background border-primary/20"}`}>
                  {getIcon(notification.type)}
                </div>

                <div className="flex-1 space-y-1">
                  <div className="flex items-start justify-between">
                    <h4 className={`font-medium ${notification.read ? "" : "text-primary"}`}>
                      {notification.title}
                    </h4>
                    <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                      {notification.time}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {notification.message}
                  </p>

                  {notification.action && (
                    <div className="flex gap-2 mt-3">
                      <Button size="sm" className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white">
                        Accept
                      </Button>
                      <Button size="sm" variant="outline">
                        Decline
                      </Button>
                    </div>
                  )}
                </div>

                {!notification.read && (
                  <div className="h-2 w-2 rounded-full bg-primary mt-2" />
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
