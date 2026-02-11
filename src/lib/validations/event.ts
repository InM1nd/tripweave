import { z } from "zod";

export const createEventSchema = z.object({
    tripId: z.string(),
    title: z.string().min(2, "Title must be at least 2 characters"),
    type: z.enum(["transport", "accommodation", "activity", "food", "other"]),
    location: z.string().optional(),
    startDate: z.date(),
    startTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format (HH:MM)"),
    description: z.string().optional(),
    coverImage: z.string().optional(),
    cost: z.number().optional().default(0), // Changed to number to match similar logic usually found in schemas, or keep string if input is string
    currency: z.string().default("USD"), // Default currency? Or should be passed from trip?
    // We'll keep cost as number for DB, but input might be string. Let's use coercion.
});

// For the form, we might want a slightly different schema that handles string inputs for numbers
export const eventFormSchema = z.object({
    title: z.string().min(2, "Title must be at least 2 characters"),
    type: z.enum(["transport", "accommodation", "activity", "food", "other"]),
    location: z.string().optional(),
    startDate: z.date(),
    startTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format (HH:MM)"),
    description: z.string().optional(),
    coverImage: z.string().url("Must be a valid URL").optional().or(z.literal("")),
    cost: z.string().optional(), // Input is string
});

export type EventFormValues = z.infer<typeof eventFormSchema>;
