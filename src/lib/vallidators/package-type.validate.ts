import { z } from "zod";

const hexColorRegex = /^#([0-9A-Fa-f]{6}|[0-9A-Fa-f]{3})$/;

export const packageTypeSchema = z.object({
    name: z
        .string()
        .trim()
        .min(2, "Name must be at least 2 characters")
        .max(100, "Name must be at most 100 characters"),
    icon: z.string().trim().min(1, "Icon is required"),
    themeColor: z
        .string()
        .trim()
        .regex(hexColorRegex, "Must be a valid hex color (e.g. #10B981)"),
    description: z.string().trim().max(500, "Description must be at most 500 characters"),
    hasDifficultyLevels: z.boolean(),
    order: z.number().int().min(0, "Order must be at least 0"),
    isActive: z.boolean(),
});

export type PackageTypeFormValues = z.infer<typeof packageTypeSchema>;