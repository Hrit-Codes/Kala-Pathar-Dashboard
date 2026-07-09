import { z } from "zod";

export const destinationSchema = z.object({
    name: z.string()
        .min(2, "Name must be at least 2 characters")
        .max(100, "Name must be at most 100 characters")
        .trim(),
    description: z.string()
        .max(1000, "Description must be at most 1000 characters"),
    order: z.number()
        .int()
        .min(0, "Order must be at least 0"),
    isActive: z.boolean(),
});

export type DestinationFormValues = z.infer<typeof destinationSchema>;