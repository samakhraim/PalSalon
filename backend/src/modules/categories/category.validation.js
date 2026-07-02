import { z } from "zod"

const localizedRequiredSchema = z.object({
  en: z.string().trim().min(1, "English value is required"),
  ar: z.string().trim().optional(),
})

const localizedOptionalSchema = z.object({
  en: z.string().trim().optional(),
  ar: z.string().trim().optional(),
})

const categoryIdParamSchema = z.object({
  id: z.coerce.number().int().positive("Category id must be a positive number"),
})

export const createCategorySchema = z.object({
  body: z
    .object({
      name: localizedRequiredSchema,
      description: localizedOptionalSchema.optional().nullable(),
      isactive: z.boolean().optional(),
    })
    .strict(),
})

export const updateCategorySchema = z.object({
  params: categoryIdParamSchema,
  body: z
    .object({
      name: localizedRequiredSchema.optional(),
      description: localizedOptionalSchema.optional().nullable(),
      isactive: z.boolean().optional(),
    })
    .strict()
    .refine((value) => Object.keys(value).length > 0, {
      message: "At least one field is required",
    }),
})

export const categoryIdSchema = z.object({
  params: categoryIdParamSchema,
})
