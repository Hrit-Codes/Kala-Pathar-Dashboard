import { z } from "zod";

export const gallerySchema = z.object({
    image: z.custom<File>((val) => val instanceof File, {
        message: "Image is required",
    }).optional(),
    title: z.string().trim().min(2, "Title must be at least 2 characters"),
    subtitle: z.string().trim().min(2, "Subtitle must be at least 2 characters"),
    description: z.string().trim().min(10, "Description must be at least 10 characters"),
    order: z.coerce.number().min(1, "Order must be 1 or greater").optional(),
});
