"use server";

import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function inviteToTrip(tripId: string, email: string, role: "ADMIN" | "MEMBER" = "MEMBER") {
    const supabase = await createClient();
    const { data: { user: authUser } } = await supabase.auth.getUser();
    if (!authUser || !authUser.id) throw new Error("Unauthorized");

    // Find the current user
    const currentUser = await prisma.user.findUnique({
        where: { authId: authUser.id },
    });
    if (!currentUser) throw new Error("User not found");

    // Check if current user is OWNER or ADMIN of this trip
    const membership = await prisma.tripMember.findUnique({
        where: { tripId_userId: { tripId, userId: currentUser.id } },
    });
    if (!membership || (membership.role !== "OWNER" && membership.role !== "ADMIN")) {
        throw new Error("Only trip owners and admins can invite members");
    }

    // Check if user is already a member
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
        const existingMember = await prisma.tripMember.findUnique({
            where: { tripId_userId: { tripId, userId: existingUser.id } },
        });
        if (existingMember) {
            throw new Error("This user is already a member of this trip");
        }
    }

    // Check if invite already exists
    const existingInvite = await prisma.tripInvite.findUnique({
        where: { tripId_email: { tripId, email } },
    });
    if (existingInvite && existingInvite.status === "PENDING") {
        throw new Error("An invite has already been sent to this email");
    }

    // Create or update invite (upsert handles re-inviting after expiry)
    const invite = await prisma.tripInvite.upsert({
        where: { tripId_email: { tripId, email } },
        update: {
            status: "PENDING",
            role,
            invitedBy: currentUser.id,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        },
        create: {
            tripId,
            email,
            role,
            invitedBy: currentUser.id,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        },
    });

    revalidatePath(`/trip/${tripId}/members`);
    return invite;
}

export async function createPublicInvite(tripId: string, role: "ADMIN" | "MEMBER" = "MEMBER") {
    const supabase = await createClient();
    const { data: { user: authUser } } = await supabase.auth.getUser();
    if (!authUser || !authUser.id) throw new Error("Unauthorized");

    const currentUser = await prisma.user.findUnique({
        where: { authId: authUser.id },
    });
    if (!currentUser) throw new Error("User not found");

    // Check permissions
    const membership = await prisma.tripMember.findUnique({
        where: { tripId_userId: { tripId, userId: currentUser.id } },
    });
    if (!membership || (membership.role !== "OWNER" && membership.role !== "ADMIN")) {
        throw new Error("Only trip owners and admins can create invites");
    }

    // Create a new public invite (email is null)
    const existingInvite = await prisma.tripInvite.findFirst({
        where: {
            tripId,
            email: null,
            status: "PENDING",
            expiresAt: { gt: new Date() },
        },
    });

    if (existingInvite) {
        return existingInvite;
    }

    const invite = await prisma.tripInvite.create({
        data: {
            tripId,
            email: null, // Public invite
            role,
            invitedBy: currentUser.id,
            expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days for public links
        },
    });

    revalidatePath(`/trip/${tripId}/members`);
    return invite;
}

export async function acceptInvite(token: string) {
    const supabase = await createClient();
    const { data: { user: authUser } } = await supabase.auth.getUser();
    if (!authUser || !authUser.id) throw new Error("Unauthorized");

    const currentUser = await prisma.user.findUnique({
        where: { authId: authUser.id },
    });
    if (!currentUser) throw new Error("User not found");

    // Find the invite
    const invite = await prisma.tripInvite.findUnique({
        where: { token },
        include: { trip: true },
    });

    if (!invite) throw new Error("Invite not found");
    if (invite.status === "ACCEPTED") throw new Error("Invite already accepted");
    if (invite.expiresAt < new Date()) {
        await prisma.tripInvite.update({
            where: { id: invite.id },
            data: { status: "EXPIRED" },
        });
        throw new Error("Invite has expired");
    }

    // Check if already a member
    const existingMember = await prisma.tripMember.findUnique({
        where: { tripId_userId: { tripId: invite.tripId, userId: currentUser.id } },
    });
    if (existingMember) {
        // Mark invite accepted anyway
        await prisma.tripInvite.update({
            where: { id: invite.id },
            data: { status: "ACCEPTED" },
        });
        return invite.trip;
    }

    // Add user as member and mark invite accepted
    await prisma.$transaction([
        prisma.tripMember.create({
            data: {
                tripId: invite.tripId,
                userId: currentUser.id,
                role: invite.role,
            },
        }),
    ]);

    // Handle public invite (reusable) vs private invite (one-time)
    if (invite.email) {
        await prisma.tripInvite.update({
            where: { id: invite.id },
            data: { status: "ACCEPTED" },
        });
    } else {
        // Public invite: increment uses
        await prisma.tripInvite.update({
            where: { id: invite.id },
            data: { uses: { increment: 1 } },
        });
    }

    revalidatePath(`/trip/${invite.tripId}/members`);
    revalidatePath("/dashboard");
    return invite.trip;
}

export async function getInviteDetails(token: string) {
    const invite = await prisma.tripInvite.findUnique({
        where: { token },
        include: {
            trip: {
                include: {
                    _count: {
                        select: { members: true }
                    }
                }
            },

        }
    });

    // Check if valid
    if (!invite || invite.status !== "PENDING" || invite.expiresAt < new Date()) {
        return null;
    }

    return invite;
}

export async function getPendingInvites(tripId: string) {
    const supabase = await createClient();
    const { data: { user: authUser } } = await supabase.auth.getUser();
    if (!authUser || !authUser.id) return [];

    const currentUser = await prisma.user.findUnique({
        where: { authId: authUser.id },
    });
    if (!currentUser) return [];

    return prisma.tripInvite.findMany({
        where: {
            tripId,
            status: "PENDING",
            expiresAt: { gt: new Date() },
        },
        orderBy: { createdAt: "desc" },
    });
}

export async function cancelInvite(inviteId: string) {
    const supabase = await createClient();
    const { data: { user: authUser } } = await supabase.auth.getUser();
    if (!authUser || !authUser.id) throw new Error("Unauthorized");

    const currentUser = await prisma.user.findUnique({
        where: { authId: authUser.id },
    });
    if (!currentUser) throw new Error("User not found");

    const invite = await prisma.tripInvite.findUnique({
        where: { id: inviteId },
    });
    if (!invite) throw new Error("Invite not found");

    // Check permission
    const membership = await prisma.tripMember.findUnique({
        where: { tripId_userId: { tripId: invite.tripId, userId: currentUser.id } },
    });
    if (!membership || (membership.role !== "OWNER" && membership.role !== "ADMIN")) {
        throw new Error("Only trip owners and admins can cancel invites");
    }

    await prisma.tripInvite.delete({ where: { id: inviteId } });
    revalidatePath(`/trip/${invite.tripId}/members`);
}

export async function getTripMembers(tripId: string) {
    const supabase = await createClient();
    const { data: { user: authUser } } = await supabase.auth.getUser();
    if (!authUser || !authUser.id) return [];

    const currentUser = await prisma.user.findUnique({
        where: { authId: authUser.id },
    });
    if (!currentUser) return [];

    // Check if user is a member
    const membership = await prisma.tripMember.findUnique({
        where: { tripId_userId: { tripId, userId: currentUser.id } },
    });
    if (!membership) return [];

    return prisma.tripMember.findMany({
        where: { tripId },
        include: { user: true },
        orderBy: { joinedAt: "asc" },
    });
}
