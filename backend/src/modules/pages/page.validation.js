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

const booleanInputSchema = z.preprocess((value) => {
  if (typeof value === "string") {
    if (value.toLowerCase() === "true") {
      return true
    }

    if (value.toLowerCase() === "false") {
      return false
    }
  }

  return value
}, z.boolean())

const localizedRequiredSchema = z.preprocess(
  parseJsonInput,
  z.object({
    en: z.string().trim().min(1, "English value is required"),
    ar: z.string().trim().optional(),
  })
)

const pageIdParamSchema = z.object({
  id: z.coerce.number().int().positive("Page id must be a positive number"),
})

export const createPageSchema = z.object({
  body: z
    .object({
      title: localizedRequiredSchema,
      slug: z.string().trim().optional().nullable(),
      description: localizedRequiredSchema,
      status: booleanInputSchema.optional(),
    })
    .strict(),
})

export const updatePageSchema = z.object({
  params: pageIdParamSchema,
  body: z
    .object({
      title: localizedRequiredSchema.optional(),
      slug: z.string().trim().optional().nullable(),
      description: localizedRequiredSchema.optional(),
      status: booleanInputSchema.optional(),
    })
    .strict()
    .refine((value) => Object.keys(value).length > 0, {
      message: "At least one field is required",
    }),
})

export const pageIdSchema = z.object({
  params: pageIdParamSchema,
})
