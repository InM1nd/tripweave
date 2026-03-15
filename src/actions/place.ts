"use server";

import { prisma } from "@/lib/prisma";
import { EventType } from "@prisma/client";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

// ---------- CRUD ----------

export async function getMyPlaces() {
    const supabase = await createClient();
    const { data: { user: authUser } } = await supabase.auth.getUser();

    if (!authUser || !authUser.id) {
        return [];
    }

    const user = await prisma.user.findUnique({
        where: { authId: authUser.id },
    });

    if (!user) {
        return [];
    }

    return await prisma.place.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: "desc" },
    });
}

export async function convertPlaceToEvent(tripId: string, place: { title?: string; name?: string; description?: string | null; image?: string | null; url?: string | null; address?: string | null; location?: string | null; lat?: number | null; lng?: number | null; type?: string; source?: string }) {
    const supabase = await createClient();
    const { data: { user: authUser } } = await supabase.auth.getUser();

    if (!authUser || !authUser.id) {
        return { success: false, error: "Unauthorized" };
    }

    const user = await prisma.user.findUnique({
        where: { authId: authUser.id },
    });

    if (!user) {
        return { success: false, error: "User not found" };
    }

    const title = place.title || place.name || "Untitled Place";

    const VALID_EVENT_TYPES: EventType[] = ["FLIGHT", "HOTEL", "ACTIVITY", "RESTAURANT", "TRANSPORT", "OTHER"];

    try {
        // Map place types to EventType enum — check type first, then source (saved places use source)
        let eventType: EventType = "ACTIVITY";
        const lowerType = (place.type || place.source)?.toLowerCase() || "";
        if (lowerType.includes("food") || lowerType.includes("restaurant") || lowerType.includes("cafe") || lowerType.includes("bar")) eventType = "RESTAURANT";
        else if (lowerType.includes("hotel") || lowerType.includes("hostel") || lowerType.includes("stay") || lowerType.includes("accommodation")) eventType = "HOTEL";
        else if (lowerType.includes("flight") || lowerType.includes("transport")) eventType = "TRANSPORT";

        if (!VALID_EVENT_TYPES.includes(eventType)) {
            eventType = "ACTIVITY";
        }

        const event = await prisma.event.create({
            data: {
                tripId,
                title: title,
                description: place.description || "",
                type: eventType,
                startTime: new Date(),
                endTime: new Date(new Date().setHours(new Date().getHours() + 2)),
                location: place.address || place.location || title,
                lat: place.lat,
                lng: place.lng,
                url: place.url,
                coverImage: place.image,
                createdBy: user.id,
                isSuggested: true,
            },
        });

        const placeTypeValue = place.type || place.source || null;
        if (placeTypeValue) {
            try {
                await prisma.event.update({
                    where: { id: event.id },
                    data: { placeType: placeTypeValue },
                });
            } catch {
                // ignore if client cache doesn't support placeType yet
            }
        }

        revalidatePath(`/trip/${tripId}/suggested`);
        return { success: true, event: { ...event, placeType: placeTypeValue } };
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Unknown error";
        console.error("Failed to convert place to event:", error);
        return {
            success: false,
            error: process.env.NODE_ENV === "development" ? message : "Failed to add to trip",
        };
    }
}

export async function deletePlace(id: string) {
    const supabase = await createClient();
    const { data: { user: authUser } } = await supabase.auth.getUser();

    if (!authUser || !authUser.id) {
        return { success: false, error: "Unauthorized" };
    }

    const user = await prisma.user.findUnique({
        where: { authId: authUser.id },
    });

    if (!user) {
        return { success: false, error: "User not found" };
    }

    try {
        await prisma.place.delete({
            where: {
                id,
                userId: user.id,
            },
        });

        revalidatePath("/explore");
        return { success: true };
    } catch (error: unknown) {
        console.error("Failed to delete place:", error);
        return { success: false, error: "Failed to delete place" };
    }
}
