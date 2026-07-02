import { z } from "zod"

const parseJsonInput = (value) => {
  if (typeof value !== "string") {
    return value
  }

  try {
    return JSON.parse(value)
  } catch {
    return value
  }
}

const localizedRequiredSchema = z.preprocess(
  parseJsonInput,
  z.object({
    en: z.string().trim().min(1, "English value is required"),
    ar: z.string().trim().optional(),
  })
)

const introIdParamSchema = z.object({
  id: z.coerce.number().int().positive("Intro id must be a positive number"),
})

export const createIntroSchema = z.object({
  body: z
    .object({
      title: localizedRequiredSchema,
      description: localizedRequiredSchema,
    })
    .strict(),
})

export const updateIntroSchema = z.object({
  params: introIdParamSchema,
  body: z
    .object({
      title: localizedRequiredSchema.optional(),
      description: localizedRequiredSchema.optional(),
    })
    .strict()
    .refine((value) => Object.keys(value).length > 0, {
      message: "At least one field is required",
    }),
})

export const introIdSchema = z.object({
  params: introIdParamSchema,
})
