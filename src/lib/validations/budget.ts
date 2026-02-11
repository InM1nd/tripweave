import { z } from "zod";

export const expenseSchema = z.object({
    title: z.string().min(2, "Title must be at least 2 characters"),
    amount: z.string().regex(/^\d+(\.\d{1,2})?$/, "Invalid amount"),
    currency: z.string().min(1, "Currency is required"),
    category: z.enum(["accommodation", "transport", "food", "activity", "shopping", "other"]),
    paidBy: z.string().min(1, "Payer is required"),
    splitType: z.enum(["equal", "custom", "you"]),
});

export type ExpenseFormValues = z.infer<typeof expenseSchema>;
