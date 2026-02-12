"use server";

import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { documentSchema, DocumentFormValues } from "@/lib/validations/document";

export async function createDocument(tripId: string, data: DocumentFormValues) {
    const supabase = await createClient();
    const { data: { user: authUser } } = await supabase.auth.getUser();

    if (!authUser || !authUser.id) {
        throw new Error("Unauthorized");
    }

    const validation = documentSchema.safeParse(data);
    if (!validation.success) {
        throw new Error("Invalid document data");
    }

    const { name, url, type, fileSize, mimeType } = validation.data;

    // Verify membership
    const isMember = await prisma.tripMember.findFirst({
        where: { tripId, user: { authId: authUser.id } }
    });
    if (!isMember) throw new Error("Unauthorized");

    // Get current user id
    const user = await prisma.user.findUnique({ where: { authId: authUser.id } });
    if (!user) throw new Error("User not found");

    try {
        await prisma.document.create({
            data: {
                tripId,
                name,
                url,
                type: type as any,
                fileSize: fileSize || 0,
                mimeType: mimeType || "application/link",
                uploadedBy: user.id
            }
        });

        revalidatePath(`/trip/${tripId}/documents`);
        return { success: true };
    } catch (error: any) {
        console.error("Failed to create document:", error);
        return { success: false, error: error.message };
    }
}

export async function getTripDocuments(tripId: string) {
    const supabase = await createClient();
    const { data: { user: authUser } } = await supabase.auth.getUser();
    if (!authUser) throw new Error("Unauthorized");

    const docs = await prisma.document.findMany({
        where: { tripId },
        orderBy: { createdAt: 'desc' },
    });

    // We also need uploader names, but `Document` model stores `uploadedBy` string (userId).
    // Prisma schema: `uploadedBy String`. Use join or fetch separately?
    // Schema: `uploadedBy String`. No relation defined to User in Document model in provided schema snippet for `uploadedBy`.
    // Let's check schema again. `uploadedBy String`. No `@relation`.
    // So we need to fetch user names manually.

    const userIds = Array.from(new Set(docs.map(d => d.uploadedBy)));
    const users = await prisma.user.findMany({
        where: { id: { in: userIds } },
        select: { id: true, name: true }
    });

    const userMap = new Map(users.map(u => [u.id, u.name]));

    return docs.map(doc => ({
        ...doc,
        uploaderName: userMap.get(doc.uploadedBy) || "Unknown"
    }));
}
