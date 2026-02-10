"use server";

import { prisma } from "@/lib/prisma";
import { createTripSchema, CreateTripValues } from "@/lib/validations/trip";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function createTrip(data: CreateTripValues) {
    const { userId } = await auth();

    if (!userId) {
        throw new Error("Unauthorized");
    }

    const validation = createTripSchema.safeParse(data);

    if (!validation.success) {
        throw new Error("Invalid data");
    }

    const { name, destination, dateRange, currency } = validation.data;

    // Find user in DB
    const user = await prisma.user.findUnique({
        where: { clerkId: userId },
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
    const { userId } = await auth();

    if (!userId) {
        return [];
    }

    const user = await prisma.user.findUnique({
        where: { clerkId: userId },
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
    const { userId } = await auth();

    if (!userId) {
        return null;
    }

    const user = await prisma.user.findUnique({
        where: { clerkId: userId },
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
