"use server";

import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { eventFormSchema, EventFormValues } from "@/lib/validations/event";

export async function createEvent(tripId: string, data: EventFormValues) {
    const supabase = await createClient();
    const { data: { user: authUser } } = await supabase.auth.getUser();

    if (!authUser || !authUser.id) {
        throw new Error("Unauthorized");
    }

    // Validate data
    const validation = eventFormSchema.safeParse(data);
    if (!validation.success) {
        throw new Error("Invalid event data");
    }

    const { title, type, location, startDate, startTime, description, cost } = validation.data;

    // Verify user is a member of the trip
    const isMember = await prisma.tripMember.findFirst({
        where: {
            tripId,
            user: { authId: authUser.id }
        }
    });

    if (!isMember) {
        throw new Error("You are not a member of this trip");
    }

    // Get trip currency for default
    const trip = await prisma.trip.findUnique({
        where: { id: tripId },
        select: { currency: true }
    });

    const mapType = (t: string) => {
        switch (t) {
            case "accommodation": return "HOTEL";
            case "food": return "RESTAURANT";
            case "transport": return "TRANSPORT";
            case "activity": return "ACTIVITY";
            default: return "OTHER";
        }
    };

    try {
        const newEvent = await prisma.event.create({
            data: {
                tripId,
                title,
                type: mapType(type),
                location: location || null,
                startTime: new Date(`${startDate.toISOString().split('T')[0]}T${startTime}:00`),
                endTime: new Date(`${startDate.toISOString().split('T')[0]}T${startTime}:00`), // Default end time same as start
                description: description || null,
                coverImage: data.coverImage || null,
                cost: cost ? parseFloat(cost) : 0,
                currency: trip?.currency || "USD",
                createdBy: authUser.id,
            }
        });

        revalidatePath(`/trip/${tripId}/timeline`);
        return { success: true, event: newEvent };
    } catch (error: any) {
        console.error("Failed to create event:", error);
        return { success: false, error: error.message };
    }
}

export async function getTripEvents(tripId: string) {
    const supabase = await createClient();
    const { data: { user: authUser } } = await supabase.auth.getUser();

    if (!authUser) throw new Error("Unauthorized");

    // Check access
    const isMember = await prisma.tripMember.findFirst({
        where: {
            tripId,
            user: { authId: authUser.id }
        }
    });

    if (!isMember) throw new Error("Unauthorized");

    const events = await prisma.event.findMany({
        where: { tripId },
        orderBy: { startTime: 'asc' }
    });

    return events;
}

export async function updateEvent(tripId: string, eventId: string, data: Partial<EventFormValues> & { coverImage?: string }) {
    const supabase = await createClient();
    const { data: { user: authUser } } = await supabase.auth.getUser();

    if (!authUser) throw new Error("Unauthorized");

    // Check access & ownership (or admin)
    const membership = await prisma.tripMember.findFirst({
        where: { tripId, user: { authId: authUser.id } }
    });

    if (!membership) throw new Error("Unauthorized");

    const event = await prisma.event.findUnique({ where: { id: eventId } });
    if (!event) throw new Error("Event not found");

    // Only creator or Admin/Owner can edit? 
    // For now, let's say only creator or Trip Owner/Admin
    if (event.createdBy !== authUser.id && membership.role === "MEMBER") {
        throw new Error("You don't have permission to edit this event");
    }

    const mapType = (t: string) => {
        switch (t) {
            case "accommodation": return "HOTEL";
            case "food": return "RESTAURANT";
            case "transport": return "TRANSPORT";
            case "activity": return "ACTIVITY";
            default: return "OTHER";
        }
    };

    try {
        const updateData: any = { ...data };
        if (data.type) updateData.type = mapType(data.type);
        if (data.startTime && data.startDate) { // Reconstruct date objects if provided
            updateData.startTime = new Date(`${data.startDate.toISOString().split('T')[0]}T${data.startTime}:00`);
            updateData.endTime = updateData.startTime; // Simplified
            delete updateData.startDate; // Remove as not in DB
        }
        if (data.cost) updateData.cost = parseFloat(data.cost as unknown as string);


        const updatedEvent = await prisma.event.update({
            where: { id: eventId },
            data: updateData,
        });

        revalidatePath(`/trip/${tripId}/timeline`);
        return { success: true, event: updatedEvent };
    } catch (error: any) {
        console.error("Failed to update event:", error);
        return { success: false, error: error.message };
    }
}

export async function deleteEvent(tripId: string, eventId: string) {
    const supabase = await createClient();
    const { data: { user: authUser } } = await supabase.auth.getUser();

    if (!authUser) throw new Error("Unauthorized");

    const membership = await prisma.tripMember.findFirst({
        where: { tripId, user: { authId: authUser.id } }
    });

    if (!membership) throw new Error("Unauthorized");

    const event = await prisma.event.findUnique({ where: { id: eventId } });
    if (!event) throw new Error("Event not found");

    if (event.createdBy !== authUser.id && membership.role === "MEMBER") {
        throw new Error("You don't have permission to delete this event");
    }

    try {
        await prisma.event.delete({ where: { id: eventId } });
        revalidatePath(`/trip/${tripId}/timeline`);
        return { success: true };
    } catch (error: any) {
        console.error("Failed to delete event:", error);
        return { success: false, error: error.message };
    }
}
