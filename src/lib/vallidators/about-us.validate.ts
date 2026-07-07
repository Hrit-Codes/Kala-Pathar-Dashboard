import { z } from "zod";

const ceoQuoteSchema = z.object({
    quoteText: z.string().trim().min(20, "Quote must be at least 20 characters"),
    ceoName: z.string().trim().min(4, "CEO name must be at least 4 characters"),
    ceoTitle: z.string().trim().min(2, "CEO title must be at least 2 characters"),
});

const statSchema = z.object({
    label: z.string().trim().min(1, "Metric label is required"),
    value: z.string().trim().min(1, "Metric value is required"),
});

export const aboutUsSchema = z.object({
    heading: z.string().trim().min(2, "Heading must be at least 2 characters"),
    tagline: z.string().trim().min(5, "Tagline must be at least 5 characters"),
    description: z.string().trim().min(10, "Description must be at least 10 characters"),
    ceoQuote: ceoQuoteSchema,
    stats: z
        .array(statSchema)
        .length(4, "Exactly 4 stats are required"),
});

export type AboutUsFormValues = z.infer<typeof aboutUsSchema>;