
import { z } from "zod";

export const whyPlanWithUsSchema = z.object({
    title: z.string().trim().min(3, "Title must be at least 3 characters").max(100, "Title must be at most 100 characters"),
    description: z.string().trim().min(10, "Description must be at least 10 characters").max(500, "Description must be at most 500 characters"),
    icon: z.string().trim().min(1, "Icon is required"),
    order: z.coerce.number().int().min(1, "Order must be 1 or greater").optional(),
    isActive: z.boolean().optional(),
});
