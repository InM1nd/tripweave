"use server";

import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { eventFormSchema, EventFormValues } from "@/lib/validations/event";
import * as XLSX from "xlsx";
import { generateTextWithFallback, isLlmConfigured } from "@/lib/ai/llm";

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

    const { title, type, location, startDate, startTime, description, cost, url } = validation.data;

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
                url: url || null,
                createdBy: authUser.id,
            }
        });

        revalidatePath(`/trip/${tripId}/timeline`);
        return { success: true, event: newEvent };
    } catch (error: unknown) {
        console.error("Failed to create event:", error);
        return { success: false, error: error instanceof Error ? error.message : "Failed to create event" };
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
        where: { tripId, isSuggested: false },
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
        const updateData: Record<string, unknown> = { ...data };
        if (data.type) updateData.type = mapType(data.type);
        if (data.startTime && data.startDate) {
            const start = new Date(data.startDate);
            const [hours, minutes] = data.startTime.split(':').map(Number);
            start.setHours(hours, minutes);

            updateData.startTime = start;
            updateData.endTime = start; // Simplified: end time equals start time for now

            delete updateData.startDate;
        }
        if (data.cost) updateData.cost = parseFloat(data.cost as unknown as string);


        const updatedEvent = await prisma.event.update({
            where: { id: eventId },
            data: updateData as Prisma.EventUpdateInput,
        });

        revalidatePath(`/trip/${tripId}/timeline`);
        return { success: true, event: updatedEvent };
    } catch (error: unknown) {
        console.error("Failed to update event:", error);
        return { success: false, error: error instanceof Error ? error.message : "Failed to update event" };
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
    } catch (error: unknown) {
        console.error("Failed to delete event:", error);
        return { success: false, error: error instanceof Error ? error.message : "Failed to delete event" };
    }
}

export async function importPlanFromSpreadsheet(tripId: string, formData: FormData) {
    const supabase = await createClient();
    const { data: { user: authUser } } = await supabase.auth.getUser();

    if (!authUser) {
        return { success: false, error: "Unauthorized" };
    }

    const membership = await prisma.tripMember.findFirst({
        where: { tripId, user: { authId: authUser.id } }
    });

    if (!membership) {
        return { success: false, error: "You are not a member of this trip" };
    }

    const file = formData.get("file") as File | null;
    if (!file) return { success: false, error: "No file uploaded" };

    try {
        // 1. Read the file into a buffer
        const arrayBuffer = await file.arrayBuffer();
        const workbook = XLSX.read(arrayBuffer, { type: "array", cellDates: true });

        // 2. Get first sheet as JSON
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const rawData = XLSX.utils.sheet_to_json(worksheet, { defval: "" });

        if (!rawData || rawData.length === 0) {
            return { success: false, error: "The file appears to be empty or could not be parsed" };
        }




        // 3. Use AI to parse and map the spreadsheet data to events
        if (!isLlmConfigured()) {
            return { success: false, error: "AI service is not configured (missing Groq/OpenRouter API key)" };
        }

        // Send first 50 rows max to stay within token limits
        const sampleData = rawData.slice(0, 50);
        const dataString = JSON.stringify(sampleData, null, 2);

        const prompt = `You are a travel planning assistant. A user uploaded a spreadsheet with their trip plan. 
Your job is to parse this data and convert it into a list of structured events.

Here is the raw spreadsheet data (JSON):
${dataString}

Analyze the columns and map them to event fields. The user may have columns in ANY language (English, Ukrainian, German, etc.) and ANY naming convention.

Common column patterns to look for:
- Title/Name/Activity/Event/Place/Что → event title
- Date/Day/Дата/Datum → date (output as YYYY-MM-DD)  
- Time/Час/Uhrzeit → time (output as HH:MM in 24h format)
- Location/Address/Place/Адреса/Место/Ort → location
- Type/Category/Тип → type (map to: ACTIVITY, HOTEL, RESTAURANT, TRANSPORT, OTHER)
- Cost/Price/Budget/Бюджет/Цена/Kosten → cost (number only)
- Currency/Валюта/Währung → currency
- Description/Notes/Опис/Beschreibung → description
- URL/Link/Ссылка → url

You MUST return a valid JSON array of event objects. Each object should have:
{
  "title": "string (required)",
  "date": "YYYY-MM-DD (required, use best guess if only day name given)",
  "time": "HH:MM (default to 09:00 if not specified)",
  "type": "ACTIVITY | HOTEL | RESTAURANT | TRANSPORT | OTHER",
  "location": "string or empty",
  "cost": number or 0,
  "currency": "string, default USD",
  "description": "string or empty",
  "url": "string or empty"
}

IMPORTANT:
- Return ONLY the JSON array. No explanations, no markdown, no code fences.
- If a row clearly isn't an event (e.g. totals, headers, empty), SKIP it.
- If dates are relative (Day 1, Day 2...), start from today's date: ${new Date().toISOString().split('T')[0]}
- Be smart about type detection: "flight" → TRANSPORT, "hotel/airbnb" → HOTEL, "restaurant/cafe/dinner/lunch" → RESTAURANT, etc.`;

        const text = await generateTextWithFallback(prompt, {
            systemPrompt: "Return only valid JSON array. No prose.",
            temperature: 0.1,
        });



        // Parse AI response
        const jsonStr = text.replace(/```json/g, "").replace(/```/g, "").trim();
        const parsedEvents = JSON.parse(jsonStr);

        if (!Array.isArray(parsedEvents) || parsedEvents.length === 0) {
            return { success: false, error: "AI could not extract any events from the file" };
        }



        // 4. Create all events in DB
        let created = 0;
        let failed = 0;

        for (const ev of parsedEvents) {
            try {
                const startTime = new Date(`${ev.date}T${ev.time || "09:00"}:00`);
                if (isNaN(startTime.getTime())) {
                    console.warn(`[Import] Skipping event with invalid date: ${ev.title} (${ev.date} ${ev.time})`);
                    failed++;
                    continue;
                }

                await prisma.event.create({
                    data: {
                        tripId,
                        title: ev.title || "Imported Event",
                        type: ["ACTIVITY", "HOTEL", "RESTAURANT", "TRANSPORT", "OTHER"].includes(ev.type) ? ev.type : "ACTIVITY",
                        location: ev.location || null,
                        startTime,
                        endTime: new Date(startTime.getTime() + 2 * 60 * 60 * 1000), // +2h default
                        description: ev.description || null,
                        cost: typeof ev.cost === "number" ? ev.cost : 0,
                        currency: ev.currency || "USD",
                        url: ev.url || null,
                        createdBy: authUser.id,
                    }
                });
                created++;
            } catch (e: unknown) {
                console.error(`[Import] Failed to create event "${ev.title}":`, e instanceof Error ? e.message : e);
                failed++;
            }
        }

        revalidatePath(`/trip/${tripId}/timeline`);
        return {
            success: true,
            message: `Imported ${created} events${failed > 0 ? ` (${failed} failed)` : ""}`,
            totalParsed: parsedEvents.length,
            created,
            failed,
        };
    } catch (error: unknown) {
        console.error("[Import] Error:", error);
        return { success: false, error: "Failed to import: " + (error instanceof Error ? error.message : String(error)) };
    }
}

export async function getSuggestedEvents(tripId: string) {
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
        where: {
            tripId,
            isSuggested: true
        },
        include: {
            votes: true,
            trip: {
                select: {
                    members: {
                        select: {
                            user: {
                                select: {
                                    id: true,
                                    name: true,
                                    avatar: true
                                }
                            }
                        }
                    }
                }
            }
        },
        orderBy: { createdAt: 'desc' }
    });

    return events;
}

export async function promoteSuggestedToTimeline(tripId: string, eventId: string, date: Date, time: string = "12:00") {
    const supabase = await createClient();
    const { data: { user: authUser } } = await supabase.auth.getUser();

    if (!authUser) throw new Error("Unauthorized");

    const membership = await prisma.tripMember.findFirst({
        where: { tripId, user: { authId: authUser.id } }
    });

    if (!membership) throw new Error("Unauthorized");

    const event = await prisma.event.findFirst({
        where: { id: eventId, tripId, isSuggested: true }
    });

    if (!event) throw new Error("Event not found or not a suggestion");

    try {
        const [hours, minutes] = time.split(":").map(Number);
        const startTime = new Date(date);
        startTime.setHours(hours, minutes, 0, 0);

        const updatedEvent = await prisma.event.update({
            where: { id: eventId },
            data: {
                isSuggested: false,
                startTime,
                endTime: new Date(startTime.getTime() + 2 * 60 * 60 * 1000),
            },
        });

        revalidatePath(`/trip/${tripId}/timeline`);
        revalidatePath(`/trip/${tripId}/suggested`);
        return { success: true, event: updatedEvent };
    } catch (error: unknown) {
        console.error("Failed to promote suggested event:", error);
        return { success: false, error: error instanceof Error ? error.message : "Failed to add to schedule" };
    }
}

export async function toggleVote(eventId: string) {
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
        const existingVote = await prisma.vote.findUnique({
            where: {
                eventId_userId: {
                    eventId,
                    userId: user.id
                }
            }
        });

        if (existingVote) {
            await prisma.vote.delete({
                where: { id: existingVote.id }
            });
        } else {
            await prisma.vote.create({
                data: {
                    eventId,
                    userId: user.id
                }
            });
        }

        const event = await prisma.event.findUnique({
            where: { id: eventId },
            select: { tripId: true }
        });

        if (event) {
            revalidatePath(`/trip/${event.tripId}/suggested`);
        }

        return { success: true };
    } catch (error: unknown) {
        console.error("Failed to toggle vote:", error);
        return { success: false, error: "Failed to toggle vote" };
    }
}
