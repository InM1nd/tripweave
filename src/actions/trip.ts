"use server";

import { prisma } from "@/lib/prisma";
import { createTripSchema, CreateTripValues, updateTripSchema, UpdateTripValues } from "@/lib/validations/trip";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createTrip(data: CreateTripValues) {
    const supabase = await createClient();
    const { data: { user: authUser } } = await supabase.auth.getUser();

    if (!authUser || !authUser.id) {
        throw new Error("Unauthorized");
    }

    const validation = createTripSchema.safeParse(data);

    if (!validation.success) {
        throw new Error("Invalid data");
    }

    const { name, destination, dateRange, currency, coverImage } = validation.data;

    // Find user in DB
    const user = await prisma.user.findUnique({
        where: { authId: authUser.id },
    });

    if (!user) {
        throw new Error("User not found in database. Please try logging in again.");
    }

    const trip = await prisma.trip.create({
        data: {
            name,
            destination,
            startDate: dateRange.from,
            endDate: dateRange.to,
            currency,
            coverImage,
            createdBy: user.id,
            members: {
                create: {
                    userId: user.id,
                    role: "OWNER",
                },
            },
            // Create a default budget
            budget: {
                create: {
                    currency,
                    totalBudget: 0,
                },
            },
        },
    });

    // Increment totalTrips for user (Gamification)
    await prisma.user.update({
        where: { id: user.id },
        data: { totalTrips: { increment: 1 } },
    });

    revalidatePath("/dashboard");
    return trip;
}

export async function getTrips() {
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

    const trips = await prisma.trip.findMany({
        where: {
            members: {
                some: {
                    userId: user.id,
                },
            },
        },
        include: {
            members: {
                include: {
                    user: true,
                },
            },
            _count: {
                select: {
                    events: true,
                    documents: true,
                },
            },
        },
        orderBy: {
            startDate: "asc",
        },
    });

    return trips;
}

export async function getTrip(tripId: string) {
    const supabase = await createClient();
    const { data: { user: authUser } } = await supabase.auth.getUser();

    if (!authUser || !authUser.id) {
        return null;
    }

    const user = await prisma.user.findUnique({
        where: { authId: authUser.id },
    });

    if (!user) {
        return null;
    }

    const trip = await prisma.trip.findFirst({
        where: {
            id: tripId,
            members: {
                some: {
                    userId: user.id,
                },
            },
        },
        include: {
            members: {
                include: {
                    user: true,
                },
            },
            _count: {
                select: {
                    events: true,
                    documents: true,
                },
            },
        },
    });

    return trip;
}

export async function updateTrip(tripId: string, data: UpdateTripValues) {
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

    // Check if user is OWNER
    const member = await prisma.tripMember.findFirst({
        where: {
            tripId,
            userId: user.id,
            role: "OWNER",
        },
    });

    if (!member) {
        return { success: false, error: "Only the trip owner can edit settings." };
    }

    const validation = updateTripSchema.safeParse(data);
    if (!validation.success) {
        return { success: false, error: "Invalid data" };
    }

    try {
        const trip = await prisma.trip.update({
            where: { id: tripId },
            data: validation.data,
        });

        revalidatePath(`/trip/${tripId}`);
        revalidatePath(`/trip/${tripId}/settings`);
        return { success: true, trip };
    } catch (error: any) {
        console.error("Failed to update trip:", error);
        return { success: false, error: "Failed to update trip" };
    }
}

export async function deleteTrip(tripId: string) {
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

    // Check if user is OWNER
    const member = await prisma.tripMember.findFirst({
        where: {
            tripId,
            userId: user.id,
            role: "OWNER",
        },
    });

    if (!member) {
        return { success: false, error: "Only the trip owner can delete the trip." };
    }

    try {
        await prisma.trip.delete({
            where: { id: tripId },
        });

        revalidatePath("/dashboard");
        return { success: true };
    } catch (error: any) {
        console.error("Failed to delete trip:", error);
        return { success: false, error: "Failed to delete trip" };
    }
}
