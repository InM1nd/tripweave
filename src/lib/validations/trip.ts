import { z } from "zod";

export const createTripSchema = z.object({
    name: z.string().min(3, { message: "Trip name must be at least 3 characters." }),
    destination: z.string().min(2, { message: "Destination is required." }),
    dateRange: z.object({
        from: z.date({ message: "Start date is required." }),
        to: z.date({ message: "End date is required." }),
    }).refine((data) => data.from <= data.to, { message: "End date cannot be before start date.", path: ["to"] }),
    currency: z.string().min(1, { message: "Currency is required." }),
});

export type CreateTripValues = z.infer<typeof createTripSchema>;
