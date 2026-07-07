import { z } from "zod";

const optionalUrl = z
  .string()
  .trim()
  .refine((val) => val === "" || /^https?:\/\/.+/i.test(val), {
    message: "Must be a valid URL starting with http:// or https://",
  });

const latLngString = z
  .string()
  .trim()
  .min(1, "Required")
  .refine((val) => !Number.isNaN(Number(val)), {
    message: "Must be a valid number",
  });

export const companyInfoSchema = z.object({
  companyName: z
    .string()
    .trim()
    .min(2, "Company name must be at least 2 characters")
    .min(1, "Company name is required"),

  description: z.string().trim(),

  officeAddress: z
    .string()
    .trim()
    .min(5, "Office address must be at least 5 characters"),

  officeTelephone: z.string().trim().min(1, "Office telephone is required"),

  emails: z
    .array(
      z.object({
        value: z
          .string()
          .trim()
          .refine((val) => val === "" || z.string().email().safeParse(val).success, {
            message: "Must be a valid email address",
          }),
      })
    )
    .min(1, "At least one email is required")
    .max(3, "Maximum of 3 emails allowed")
    .superRefine((emails, ctx) => {
      const nonEmpty = emails.filter((e) => e.value.trim() !== "");
      if (nonEmpty.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "At least one email is required",
          path: [0, "value"],
        });
      }
    }),

  phones: z
    .array(
      z.object({
        value: z.string().trim(),
      })
    )
    .min(1, "At least one phone number is required")
    .max(2, "Maximum of 2 phone numbers allowed")
    .superRefine((phones, ctx) => {
      const nonEmpty = phones.filter((p) => p.value.trim() !== "");
      if (nonEmpty.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "At least one phone number is required",
          path: [0, "value"],
        });
      }
    }),

  mapLatitude: latLngString,
  mapLongitude: latLngString,
  mapEmbedUrl: z.string().trim(),

  socialLinks: z.object({
    facebook: optionalUrl,
    instagram: optionalUrl,
    linkedin: optionalUrl,
    twitter: optionalUrl,
    youtube: optionalUrl,
  }),
});

export type CompanyInfoFormValues = z.infer<typeof companyInfoSchema>;