"use server";

import { generateTextWithFallback, isLlmConfigured } from "@/lib/ai/llm";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";

export async function getForYouRecommendations(offset = 0, filters: string[] = []) {
    const supabase = await createClient();
    const { data: { user: authUser } } = await supabase.auth.getUser();

    if (!isLlmConfigured()) {
        return { success: false, error: "AI is not configured" };
    }

    let tripDestinations = "various destinations worldwide";
    if (authUser) {
        // Try to get user's upcoming trips to personalize
        const dbUser = await prisma.user.findUnique({ where: { authId: authUser.id } });
        if (dbUser) {
            const upcomingTrips = await prisma.trip.findMany({
                where: {
                    members: { some: { userId: dbUser.id } },
                    endDate: { gte: new Date() }
                },
                select: { destination: true },
                take: 3
            });
            if (upcomingTrips.length > 0) {
                tripDestinations = upcomingTrips.map(t => t.destination).join(", ");
            }
        }
    }

    const filterText = filters.length > 0 ? `Focus specifically on: ${filters.join(", ")}.` : "";

    const prompt = `You are a travel recommender. Suggest exactly 10 exciting places to visit for someone who is traveling to: ${tripDestinations}. ${filterText}
    Avoid places that you might have suggested previously (imagine this is page ${offset / 10 + 1} of recommendations).
    Return a valid JSON array of objects with the following keys:
    [
      {
        "title": "Place Name",
        "description": "Short exciting description",
        "location": "City, Country",
        "type": "ACTIVITY, RESTAURANT, or HOTEL",
        "rating": 4.5
      }
    ]
    IMPORTANT: Provide ONLY the raw JSON array. No markdown formatting, no explanations.`;

    try {
        const text = await generateTextWithFallback(prompt, {
            systemPrompt: "Return only valid JSON. No prose.",
            temperature: 0.7,
        });

        const jsonStr = text.replace(/```json/g, "").replace(/```/g, "").trim();
        const parsed = JSON.parse(jsonStr);

        return { success: true, places: parsed };
    } catch (e: any) {
        console.error("Failed to generate recommendations:", e.message);
        return { success: false, error: "Failed to generate recommendations" };
    }
}
