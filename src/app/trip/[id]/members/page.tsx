import { use } from "react";
import TripLayout from "@/components/layout/TripLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Crown, Shield, User } from "lucide-react";
import { Role } from "@/types";
import { getTripMembers, getPendingInvites } from "@/actions/invite";
import { InviteMemberModal } from "@/components/trip/InviteMemberModal";
import { CancelInviteButton } from "@/components/trip/CancelInviteButton";

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

export default async function MembersPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [members, pendingInvites] = await Promise.all([
    getTripMembers(id),
    getPendingInvites(id),
  ]);

  return (
    <TripLayout tripId={id}>
      <div className="space-y-4 md:space-y-6 max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl md:text-2xl font-bold">Members</h2>
            <p className="text-sm md:text-base text-muted-foreground">{members.length} people on this trip</p>
          </div>
          <InviteMemberModal tripId={id} />
        </div>

        {/* Member List */}
        <div className="space-y-2 md:space-y-3">
          {members.map((member) => {
            const role = member.role as Role;
            const RoleIcon = roleIcons[role];
            return (
              <Card key={member.id} className="border-border/40 bg-card/50">
                <CardContent className="p-3 md:p-4">
                  <div className="flex items-center gap-3 md:gap-4">
                    <Avatar className="h-10 w-10 md:h-12 md:w-12">
                      <AvatarImage src={member.user.avatar || undefined} alt={member.user.name} />
                      <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white text-sm">
                        {member.user.name[0]}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 md:gap-2 flex-wrap">
                        <h3 className="font-semibold text-sm md:text-base truncate">{member.user.name}</h3>
                        <Badge variant="outline" className={`text-[10px] md:text-xs px-1.5 py-0 h-5 ${roleColors[role]}`}>
                          <RoleIcon className="h-3 w-3 mr-0.5 md:mr-1" />
                          {member.role}
                        </Badge>
                      </div>
                      <p className="text-xs md:text-sm text-muted-foreground truncate">{member.user.email}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Pending Invites */}
        <div className="space-y-3 md:space-y-4">
          <h3 className="font-semibold text-sm md:text-base text-muted-foreground">Pending Invites</h3>
          {pendingInvites.length === 0 ? (
            <Card className="border-dashed border-border/40 bg-muted/20">
              <CardContent className="p-4 md:p-6 text-center">
                <p className="text-xs md:text-sm text-muted-foreground">No pending invitations</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-2">
              {pendingInvites.map((invite) => (
                <Card key={invite.id} className="border-border/40 bg-card/50 border-dashed">
                  <CardContent className="p-3 md:p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="bg-muted text-muted-foreground text-sm">
                            {invite.email ? invite.email[0].toUpperCase() : "P"}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">{invite.email || "Public Link"}</p>
                          <p className="text-xs text-muted-foreground">
                            Invited as {invite.role} · Expires {new Date(invite.expiresAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <CancelInviteButton inviteId={invite.id} />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </TripLayout>
  );
}
