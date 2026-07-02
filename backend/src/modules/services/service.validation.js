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

const nullablePositiveIntegerSchema = z.preprocess((value) => {
  if (value === undefined || value === null || value === "") {
    return null
  }

  return value
}, z.coerce.number().int().positive("Must be a positive number").nullable())

const nullablePositiveDecimalSchema = z.preprocess((value) => {
  if (value === undefined || value === null || value === "") {
    return null
  }

  return value
}, z.coerce.number().positive("Must be a positive number").nullable())

const localizedRequiredSchema = z.preprocess(
  parseJsonInput,
  z.object({
    en: z.string().trim().min(1, "English value is required"),
    ar: z.string().trim().optional(),
  })
)

const localizedOptionalSchema = z.preprocess(
  parseJsonInput,
  z.object({
    en: z.string().trim().optional(),
    ar: z.string().trim().optional(),
  })
)

const servicePriceOptionSchema = z
  .object({
    id: z.coerce.number().int().positive().optional(),
    name: localizedRequiredSchema,
    price: z.coerce.number().positive("Price must be a positive number"),
    discount_price: nullablePositiveDecimalSchema.optional(),
    duration_minutes: nullablePositiveIntegerSchema.optional(),
    is_default: booleanInputSchema.optional(),
    isactive: booleanInputSchema.optional(),
  })
  .superRefine((value, context) => {
    if (
      value.discount_price !== undefined &&
      value.discount_price !== null &&
      value.discount_price >= value.price
    ) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Discount price must be less than price",
        path: ["discount_price"],
      })
    }
  })

const priceOptionsSchema = z.preprocess(
  parseJsonInput,
  z
    .array(servicePriceOptionSchema)
    .min(1, "At least one price option is required")
    .superRefine((value, context) => {
      const defaultCount = value.filter((option) => option.is_default).length

      if (defaultCount > 1) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Only one price option can be default",
        })
      }
    })
)

const serviceIdParamSchema = z.object({
  id: z.coerce.number().int().positive("Service id must be a positive number"),
})

export const createServiceSchema = z.object({
  body: z
    .object({
      salon_id: z.coerce.number().int().positive("Salon is required"),
      category_id: z.coerce.number().int().positive("Category is required"),
      name: localizedRequiredSchema,
      description: localizedOptionalSchema.optional().nullable(),
      duration_minutes: nullablePositiveIntegerSchema.optional(),
      isactive: booleanInputSchema.optional(),
      price_options: priceOptionsSchema,
    })
    .strict(),
})

export const updateServiceSchema = z.object({
  params: serviceIdParamSchema,
  body: z
    .object({
      salon_id: z.coerce.number().int().positive().optional(),
      category_id: z.coerce.number().int().positive().optional(),
      name: localizedRequiredSchema.optional(),
      description: localizedOptionalSchema.optional().nullable(),
      duration_minutes: nullablePositiveIntegerSchema.optional(),
      isactive: booleanInputSchema.optional(),
      price_options: priceOptionsSchema.optional(),
    })
    .strict()
    .refine((value) => Object.keys(value).length > 0, {
      message: "At least one field is required",
    }),
})

export const serviceIdSchema = z.object({
  params: serviceIdParamSchema,
})
