import { z } from "zod";

export const createTripSchema = z.object({
    name: z.string().min(3, { message: "Trip name must be at least 3 characters." }),
    destination: z.string().min(2, { message: "Destination is required." }),
    dateRange: z.object({
        from: z.date({ message: "Start date is required." }),
        to: z.date({ message: "End date is required." }),
    }).refine((data) => data.from <= data.to, { message: "End date cannot be before start date.", path: ["to"] }),
    currency: z.string().min(1, { message: "Currency is required." }),
    coverImage: z.string().optional(),
});

export const updateTripSchema = z.object({
    name: z.string().min(3, { message: "Trip name must be at least 3 characters." }).optional(),
    destination: z.string().min(2, { message: "Destination is required." }).optional(),
    description: z.string().optional(),
    startDate: z.date().optional(),
    endDate: z.date().optional(),
    coverImage: z.string().optional(),
});

export type CreateTripValues = z.infer<typeof createTripSchema>;
export type UpdateTripValues = z.infer<typeof updateTripSchema>;
