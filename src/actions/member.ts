"use server";

import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { Role } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const updateRoleSchema = z.object({
    tripId: z.string(),
    memberId: z.string(),
    role: z.nativeEnum(Role),
});

export async function updateMemberRole(tripId: string, memberId: string, role: Role) {
    try {
        const supabase = await createClient();
        const { data: { user: authUser } } = await supabase.auth.getUser();
        if (!authUser) {
            return { error: "Unauthorized" };
        }

        // Check if the requester is the OWNER of the trip
        const requester = await prisma.tripMember.findUnique({
            where: {
                tripId_userId: {
                    tripId,
                    userId: authUser.id,
                },
            },
        });

        if (!requester || requester.role !== "OWNER") {
            return { error: "Only the trip owner can change member roles" };
        }

        // Prevent changing the owner's own role (optional safety check)
        if (requester.id === memberId) {
            return { error: "You cannot change your own role here" };
        }

        // Also, verify the target member exists in this trip
        const targetMember = await prisma.tripMember.findUnique({
            where: { id: memberId }
        });

        if (!targetMember || targetMember.tripId !== tripId) {
            return { error: "Member not found in this trip" };
        }


        await prisma.tripMember.update({
            where: { id: memberId },
            data: { role },
        });

        revalidatePath(`/trip/${tripId}/members`);
        return { success: true };
    } catch (error) {
        console.error("Failed to update role:", error);
        return { error: "Failed to update role" };
    }
}
