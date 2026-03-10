import { StickerAnimator } from "@/components/ui/StickerAnimator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { Crown, Shield, User } from "lucide-react";
import { Role } from "@/types";
import { getTripMembers, getPendingInvites } from "@/actions/invite";
import { InviteMemberModal } from "@/components/trip/InviteMemberModal";
import { CancelInviteButton } from "@/components/trip/CancelInviteButton";
import { TripDocumentCard, DocumentBadge } from "@/components/trip/TripDocumentCard";
import { getStickerBgClass } from "@/lib/design-tokens";
import { createClient } from "@/lib/supabase/server";
import { MemberRoleSelect } from "@/components/trip/MemberRoleSelect";
import { StickerSurface } from "@/components/ui/StickerSurface";
import { SubSectionTitle } from "@/components/ui/SubSectionTitle";

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

  const currentUserMember = members.find((m: TripMemberWithUser) => m.user.authId === authUser?.id);
  const isOwner = currentUserMember?.role === "OWNER";

  return (
    <div className="space-y-5 md:space-y-6 max-w-4xl mx-auto pb-24 sm:pb-12 min-w-0 w-full">
      <TripDocumentCard
        perforation
        title="Members"
        subtitle={`${members.length} people on this trip`}
        badge={<DocumentBadge color="yellow">👯 Crew</DocumentBadge>}
        actions={<InviteMemberModal tripId={id} />}
      >
        {/* Member List */}
        <div className="space-y-2 md:space-y-3">
          {members.map((member: TripMemberWithUser, i) => {
            const role = member.role as Role;
            const RoleIcon = roleIcons[role];
            const isMe = member.user.authId === authUser?.id;

            return (
              <StickerAnimator key={member.id} delay={i * 0.06}>
                <StickerSurface hoverStrong className="bg-background/50 p-3 md:p-4">
                  <div className="flex items-center gap-3">
                    <Avatar className={`h-10 w-10 md:h-11 md:w-11 border-2 border-border shadow-sticker-sm-soft rounded-xl`}>
                      <AvatarImage src={member.user.avatar || undefined} alt={member.user.name} />
                      <AvatarFallback className={`${getStickerBgClass("pink")} font-black text-sm rounded-xl`}>
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
                          <Badge variant="outline" className={`font-bold px-1.5 py-0 h-5 border-2 shadow-sticker-badge rounded-lg text-[10px] ${roleColors[role]}`}>
                            <RoleIcon className="h-2.5 w-2.5 mr-0.5" strokeWidth={3} />
                            {member.role}
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs font-bold text-muted-foreground truncate">{member.user.email}</p>
                    </div>
                  </div>
                </StickerSurface>
              </StickerAnimator>
            );
          })}
        </div>

        {/* Pending Invites */}
        <div className="space-y-3 pt-5 mt-5 border-t-2 border-dashed border-border">
          <SubSectionTitle>Pending Invites</SubSectionTitle>
          {pendingInvites.length === 0 ? (
            <EmptyState
              variant="sticker"
              title="No pending invitations"
              description="Invites you send will appear here until they accept or expire."
              className="p-6"
            />
          ) : (
            <div className="space-y-2">
              {pendingInvites.map((invite: PendingInviteRow, i) => (
                <StickerAnimator key={invite.id} delay={i * 0.06}>
                  <div className="border-2 border-dashed border-border bg-background/50 rounded-2xl shadow-sticker-sm-soft p-3 md:p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <Avatar className="h-9 w-9 border-2 border-border rounded-xl shrink-0">
                          <AvatarFallback className="bg-secondary text-muted-foreground font-black text-xs rounded-xl">
                            {invite.email ? invite.email[0].toUpperCase() : "P"}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-black truncate">{invite.email || "Public Link"}</p>
                          <p className="text-[11px] font-bold text-muted-foreground mt-0.5 truncate">
                            Invited as {invite.role} · Expires {new Date(invite.expiresAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="scale-90 opacity-80 hover:opacity-100 hover:scale-100 transition-all origin-right shrink-0 ml-2">
                        <CancelInviteButton inviteId={invite.id} />
                      </div>
                    </div>
                  </div>
                </StickerAnimator>
              ))}
            </div>
          )}
        </div>
      </TripDocumentCard>
    </div>
  );
}
