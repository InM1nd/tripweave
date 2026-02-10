"use client";

import { use } from "react";
import TripLayout from "@/components/layout/TripLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { UserPlus, Crown, Shield, User, MoreHorizontal, Mail } from "lucide-react";
import { mockTrips } from "@/lib/mock-data";
import { Role } from "@/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const roleIcons = {
  [Role.OWNER]: Crown,
  [Role.ADMIN]: Shield,
  [Role.MEMBER]: User,
};

const roleColors = {
  [Role.OWNER]: "bg-amber-500/10 text-amber-500 border-amber-500/20",
  [Role.ADMIN]: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  [Role.MEMBER]: "bg-muted text-muted-foreground border-border",
};

export default function MembersPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const trip = mockTrips.find(t => t.id === id) || mockTrips[0];

  return (
    <TripLayout tripId={id}>
      <div className="space-y-6 max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Members</h2>
            <p className="text-muted-foreground">{trip.members.length} people on this trip</p>
          </div>
          <Button className="gap-2">
            <UserPlus className="h-4 w-4" />
            Invite
          </Button>
        </div>

        {/* Member List */}
        <div className="space-y-3">
          {trip.members.map((member) => {
            const RoleIcon = roleIcons[member.role];
            return (
              <Card key={member.id} className="border-border/40 bg-card/50">
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={member.user.avatar} alt={member.user.name} />
                      <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white">
                        {member.user.name[0]}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold truncate">{member.user.name}</h3>
                        <Badge variant="outline" className={roleColors[member.role]}>
                          <RoleIcon className="h-3 w-3 mr-1" />
                          {member.role}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground truncate">{member.user.email}</p>
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Mail className="h-4 w-4 mr-2" />
                          Send Message
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Shield className="h-4 w-4 mr-2" />
                          Change Role
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          Remove from Trip
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Pending Invites */}
        <div className="space-y-4">
          <h3 className="font-semibold text-muted-foreground">Pending Invites</h3>
          <Card className="border-dashed border-border/40 bg-muted/20">
            <CardContent className="p-6 text-center">
              <p className="text-sm text-muted-foreground">No pending invitations</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </TripLayout>
  );
}
