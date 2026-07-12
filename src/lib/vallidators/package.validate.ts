// src/lib/validators/package.validate.ts
import { z } from "zod";

const itinerarySchema = z.object({
    day: z.coerce.number().int().min(1, "Day must be at least 1"),
    title: z.string().trim().min(2, "Itinerary title must be at least 2 characters"),
    description: z.string().trim().min(5, "Itinerary description must be at least 5 characters"),
});

const supportContactSchema = z.object({
    name: z.string().trim().min(2, "Contact name must be at least 2 characters"),
    phone: z.string().trim().min(7, "Phone must be at least 7 characters"),
});

const termsAndConditionsSchema = z.object({
    title: z.string().trim().min(2, "Terms title must be at least 2 characters"),
    description: z.string().trim().min(5, "Terms description must be at least 5 characters"),
    isRequired: z.boolean(),
});

const faqSchema = z.object({
    question: z.string().trim().min(5, "Question must be at least 5 characters"),
    answer: z.string().trim().min(5, "Answer must be at least 5 characters"),
    order: z.coerce.number().int().min(0).optional(),
});

const faqSectionSchema = z.object({
    title: z.string().trim().min(2, "FAQ section title must be at least 2 characters"),
    description: z.string().trim().optional(),
    faqs: z.array(faqSchema).min(1, "At least one FAQ is required"),
});

export const packageSchema = z.object({
    title: z.string().trim().min(3, "Title must be at least 3 characters").max(150, "Title must be at most 150 characters"),
    badge: z.string().trim().optional(),
    overviewTitle: z.string().trim().min(3, "Overview title must be at least 3 characters").optional(),
    description: z.string().trim().min(10, "Description must be at least 10 characters"),
    price: z.coerce.number().min(1, "Price must be greater than 0"),
    currency: z.string().trim().default("USD"),
    priceLabel:z.enum(["per person","per group","per vehicle"]),
    durationDays: z.coerce.number().int().min(1, "Duration must be at least 1 day"),
    maxAltitude: z.string().trim().optional(),

    // difficulty is optional — only required when packageType.hasDifficultyLevels is true
    // that check is done at submit time in the form, not in the schema
    difficulty: z.enum(["Easy", "Moderate", "Hard", "Extreme"]).optional(),

    // groupSize is optional
    groupSize: z.coerce.number().int().min(1, "Group size must be at least 1").optional(),

    highlights: z.array(z.string().trim().min(1)).min(1, "At least one highlight is required"),
    inclusions: z.array(z.string().trim().min(1)).min(1, "At least one inclusion is required"),
    exclusions: z.array(z.string().trim().min(1)).min(1, "At least one exclusion is required"),

    // itinerary is optional
    itinerary: z.array(itinerarySchema).optional(),

    supportContacts: z.array(supportContactSchema).min(1, "At least one support contact is required"),
    termsAndConditions: z.array(termsAndConditionsSchema).min(1, "At least one term is required"),
    faqSection: faqSectionSchema.optional(),

    packageType: z.string().trim().min(1, "Package type is required"),
    destination: z.string().trim().min(1, "Destination is required"),
    isFeatured: z.boolean().default(false),
    isActive: z.boolean().default(true),

    thumbnail: z.custom<File>((val) => val instanceof File || val === undefined, { 
        message: "Thumbnail must be a valid file" 
    }).optional(),
    gallery: z.array(z.custom<File>((val) => val instanceof File)).optional(),
});

export interface PackageFormValues {
    title: string;
    badge?: string;
    overviewTitle?: string;
    description: string;
    price: number;
    currency: string;
    priceLabel: "per person" | "per group" | "per vehicle";
    durationDays: number;
    maxAltitude?: string;
    difficulty?: "Easy" | "Moderate" | "Hard" | "Extreme";
    groupSize?: number;
    highlights: string[];
    inclusions: string[];
    exclusions: string[];
    itinerary?: { day: number; title: string; description: string }[];
    supportContacts: { name: string; phone: string }[];
    termsAndConditions: { title: string; description: string; isRequired: boolean }[];
    faqSection?: {
        title: string;
        description?: string;
        faqs: { question: string; answer: string; order?: number }[];
    };
    packageType: string;
    destination: string;
    isFeatured: boolean;
    isActive: boolean;
    thumbnail?: File;
    gallery?: File[];

    // internal — not sent to backend, used to know if difficulty is required
    _packageTypeHasDifficultyLevels?: boolean;
}