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
  [Role.ADMIN]: "bg-teal/10 text-teal border-teal/20",
  [Role.MEMBER]: "bg-muted text-muted-foreground border-border",
};

import { createClient } from "@/lib/supabase/server";
import { MemberRoleSelect } from "@/components/trip/MemberRoleSelect";

type TripMemberWithUser = {
  id: string;
  role: string;
  user: { authId: string | null; name: string; email: string; avatar: string | null };
};
type PendingInviteRow = {
  id: string;
  email: string | null;
  role: string;
  expiresAt: Date;
};

export default async function MembersPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user: authUser } } = await supabase.auth.getUser();

  const [members, pendingInvites] = await Promise.all([
    getTripMembers(id),
    getPendingInvites(id),
  ]);

  // Find current user's role
  const currentUserMember = members.find((m: TripMemberWithUser) => m.user.authId === authUser?.id);
  const isOwner = currentUserMember?.role === "OWNER";

  return (
    <div className="space-y-5 md:space-y-6 max-w-4xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b-2 border-border pb-4">
        <div>
          <div className="bg-sticker-yellow text-foreground px-3 py-1 rounded-full font-black text-xs border-2 border-border shadow-[0_3px_0_rgba(0,0,0,0.08)] inline-block mb-2 rotate-1">
            👯 Crew
          </div>
          <h2 className="text-2xl md:text-3xl font-black tracking-tighter text-foreground leading-[0.9]">Members</h2>
          <p className="text-muted-foreground font-bold text-sm mt-1">{members.length} people on this trip</p>
        </div>
        <InviteMemberModal tripId={id} />
      </div>

      {/* Member List */}
      <div className="space-y-2 md:space-y-3">
        {members.map((member: TripMemberWithUser) => {
          const role = member.role as Role;
          const RoleIcon = roleIcons[role];
          const isMe = member.user.authId === authUser?.id;

          return (
            <Card key={member.id} className="border-2 border-border bg-card shadow-[0_4px_0_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-transform rounded-2xl">
              <CardContent className="p-3 md:p-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10 md:h-11 md:w-11 border-2 border-border shadow-[0_2px_0_rgba(0,0,0,0.06)] rounded-xl">
                    <AvatarImage src={member.user.avatar || undefined} alt={member.user.name} />
                    <AvatarFallback className="bg-sticker-pink text-foreground font-black text-sm rounded-xl">
                      {member.user.name[0]}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-0.5">
                      <h3 className="font-black text-sm truncate">{member.user.name}</h3>
                      {isOwner && member.role !== "OWNER" && !isMe ? (
                        <MemberRoleSelect
                          tripId={id}
                          memberId={member.id}
                          currentRole={role}
                        />
                      ) : (
                        <Badge variant="outline" className={`font-bold px-1.5 py-0 h-5 border-2 shadow-[0_2px_0_rgba(0,0,0,0.04)] rounded-lg text-[10px] ${roleColors[role]}`}>
                          <RoleIcon className="h-2.5 w-2.5 mr-0.5" strokeWidth={3} />
                          {member.role}
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs font-bold text-muted-foreground truncate">{member.user.email}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Pending Invites */}
      <div className="space-y-3 pt-3">
        <h3 className="font-black text-lg text-foreground">Pending Invites</h3>
        {pendingInvites.length === 0 ? (
          <Card className="border-4 border-dashed border-border bg-secondary/30 rounded-2xl shadow-[0_4px_0_rgba(0,0,0,0.04)]">
            <CardContent className="p-4 text-center">
              <p className="text-sm font-bold text-muted-foreground">No pending invitations</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-2">
            {pendingInvites.map((invite: PendingInviteRow) => (
              <Card key={invite.id} className="border-2 border-dashed border-border bg-card rounded-2xl shadow-[0_3px_0_rgba(0,0,0,0.06)]">
                <CardContent className="p-3 md:p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9 border-2 border-border rounded-xl">
                        <AvatarFallback className="bg-secondary text-muted-foreground font-black text-xs rounded-xl">
                          {invite.email ? invite.email[0].toUpperCase() : "P"}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-black truncate">{invite.email || "Public Link"}</p>
                        <p className="text-[11px] font-bold text-muted-foreground mt-0.5">
                          Invited as {invite.role} · Expires {new Date(invite.expiresAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="scale-90 opacity-80 hover:opacity-100 hover:scale-100 transition-all origin-right">
                      <CancelInviteButton inviteId={invite.id} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
