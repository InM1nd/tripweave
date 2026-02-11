"use server";

import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { expenseSchema, ExpenseFormValues } from "@/lib/validations/budget";

export async function createExpense(tripId: string, data: ExpenseFormValues) {
    const supabase = await createClient();
    const { data: { user: authUser } } = await supabase.auth.getUser();

    if (!authUser || !authUser.id) {
        throw new Error("Unauthorized");
    }

    const validation = expenseSchema.safeParse(data);
    if (!validation.success) {
        throw new Error("Invalid expense data");
    }

    const { title, amount, currency, category, paidBy, splitType } = validation.data;

    // Verify membership
    const isMember = await prisma.tripMember.findFirst({
        where: { tripId, user: { authId: authUser.id } }
    });
    if (!isMember) throw new Error("Unauthorized");

    // Map category to EventType
    const mapType = (c: string) => {
        switch (c) {
            case "accommodation": return "HOTEL";
            case "transport": return "TRANSPORT";
            case "food": return "RESTAURANT";
            case "activity": return "ACTIVITY";
            default: return "OTHER";
        }
    };

    // Determine payload
    let payerId = paidBy;
    if (paidBy === "me") {
        // Find current user's User record ID (not authId)
        const user = await prisma.user.findUnique({ where: { authId: authUser.id } });
        if (!user) throw new Error("User not found");
        payerId = user.id;
    }

    try {
        await prisma.event.create({
            data: {
                tripId,
                title,
                type: mapType(category),
                startTime: new Date(), // Expense "happens" now or needs date field? For now default to now.
                endTime: new Date(),
                cost: parseFloat(amount),
                currency,
                category, // Store specific category string
                paidBy: payerId,
                createdBy: authUser.id,
                description: `Expense: ${title} (${splitType})`
            }
        });

        revalidatePath(`/trip/${tripId}/budget`);
        return { success: true };
    } catch (error: any) {
        console.error("Failed to create expense:", error);
        return { success: false, error: error.message };
    }
}

export async function getTripBudget(tripId: string) {
    const supabase = await createClient();
    const { data: { user: authUser } } = await supabase.auth.getUser();
    if (!authUser) throw new Error("Unauthorized");

    // Get all events with cost > 0
    const expenses = await prisma.event.findMany({
        where: {
            tripId,
            cost: { gt: 0 }
        },
        orderBy: { startTime: 'desc' }
    });

    // Calculate totals
    const total = expenses.reduce((acc, curr) => acc + (curr.cost || 0), 0);

    // Group by category
    const byCategory = expenses.reduce((acc: Record<string, number>, curr) => {
        const cat = curr.category || "Other";
        acc[cat] = (acc[cat] || 0) + (curr.cost || 0);
        return acc;
    }, {});

    // Get budget limit
    const budgetSettings = await prisma.budget.findUnique({
        where: { tripId }
    });
    const limit = budgetSettings?.totalBudget || 0;
    const currency = budgetSettings?.currency || "EUR";

    return { expenses, totalSpent: total, byCategory, limit, currency };
}
