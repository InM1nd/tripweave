import { z } from "zod";

export const documentSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    url: z.string().url("Must be a valid URL"),
    type: z.enum(["TICKET", "BOOKING", "PASSPORT", "VISA", "INSURANCE", "ITINERARY", "OTHER"]),
});

export type DocumentFormValues = z.infer<typeof documentSchema>;
