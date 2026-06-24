import { z } from "zod"

const localizedFieldSchema = z.object({
  en: z.string().trim().optional(),
  ar: z.string().trim().optional(),
})

const requiredLocalizedFieldSchema = z.object({
  en: z.string().trim().min(1, "English value is required"),
  ar: z.string().trim().optional(),
})

const faqIdParamSchema = z.object({
  id: z.coerce.number().int().positive("FAQ id must be a positive number"),
})

export const createFaqSchema = z.object({
  body: z
    .object({
      question: requiredLocalizedFieldSchema,
      answer: requiredLocalizedFieldSchema,
    })
    .strict(),
})

export const updateFaqSchema = z.object({
  params: faqIdParamSchema,
  body: z
    .object({
      question: localizedFieldSchema.optional(),
      answer: localizedFieldSchema.optional(),
    })
    .strict()
    .refine((value) => Object.keys(value).length > 0, {
      message: "At least one field is required",
    }),
})

export const faqIdSchema = z.object({
  params: faqIdParamSchema,
})
