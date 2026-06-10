import { z } from "zod"

const localizedNameSchema = z.object({
  en: z.string().trim().min(1, "English name is required"),
  ar: z.string().trim().min(1, "Arabic name is required"),
})

const localizedDescriptionSchema = z.object({
  en: z.string().trim().optional(),
  ar: z.string().trim().optional(),
})

const createCityBodySchema = z
  .object({
    name: localizedNameSchema,
    description: localizedDescriptionSchema.optional().nullable(),
    image: z.string().trim().optional().nullable(),
    status: z.boolean().optional(),
  })
  .strict()

const updateLocalizedDescriptionSchema = z.object({
  en: z.string().trim().optional(),
  ar: z.string().trim().optional(),
})

const cityIdParamSchema = z.object({
  id: z.coerce.number().int().positive("City id must be a positive number"),
})

export const createCitySchema = z.object({
  body: createCityBodySchema,
})

export const updateCitySchema = z.object({
  params: cityIdParamSchema,
  body: z
    .object({
      name: localizedNameSchema.optional(),
      description: updateLocalizedDescriptionSchema.optional().nullable(),
      image: z.string().trim().optional().nullable(),
      status: z.boolean().optional(),
    })
    .strict()
    .refine((value) => Object.keys(value).length > 0, {
      message: "At least one field is required",
    }),
})

export const cityIdSchema = z.object({
  params: cityIdParamSchema,
})
