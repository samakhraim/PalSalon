import { z } from "zod"

const localizedRequiredSchema = z.object({
  en: z.string().trim().min(1, "English value is required"),
  ar: z.string().trim().optional(),
})

const localizedOptionalSchema = z.object({
  en: z.string().trim().optional(),
  ar: z.string().trim().optional(),
})

const dayHoursSchema = z.object({
  is_open: z.boolean(),
  opening_time: z.string().trim().nullable(),
  closing_time: z.string().trim().nullable(),
})

const openingHoursSchema = z.object({
  monday: dayHoursSchema,
  tuesday: dayHoursSchema,
  wednesday: dayHoursSchema,
  thursday: dayHoursSchema,
  friday: dayHoursSchema,
  saturday: dayHoursSchema,
  sunday: dayHoursSchema,
})

const optionalNumberString = z
  .union([z.string().trim(), z.number()])
  .optional()
  .nullable()
  .refine(
    (value) =>
      value === undefined ||
      value === null ||
      value === "" ||
      !Number.isNaN(Number(value)),
    "Must be a valid number"
  )

const salonIdParamSchema = z.object({
  id: z.coerce.number().int().positive("Salon id must be a positive number"),
})

export const createSalonSchema = z.object({
  body: z
    .object({
      salon_owner_id: z.coerce
        .number()
        .int()
        .positive("Salon owner is required"),
      city_id: z.coerce.number().int().positive().optional().nullable(),
      name: localizedRequiredSchema,
      description: localizedOptionalSchema.optional().nullable(),
      address: localizedOptionalSchema.optional().nullable(),
      cancellation_policy: localizedOptionalSchema.optional().nullable(),
      country_phone_code: z.string().trim().optional().nullable(),
      city_phone_code: z.string().trim().optional().nullable(),
      telephone: z.string().trim().optional().nullable(),
      phone_number: z.string().trim().optional().nullable(),
      latitude: optionalNumberString,
      longitude: optionalNumberString,
      opening_hours: openingHoursSchema.optional().nullable(),
      off_days: z.array(z.string().trim()).optional().nullable(),
      isactive: z.boolean().optional(),
    })
    .strict(),
})

export const updateSalonSchema = z.object({
  params: salonIdParamSchema,
  body: z
    .object({
      salon_owner_id: z.coerce.number().int().positive().optional(),
      city_id: z.coerce.number().int().positive().optional().nullable(),
      name: localizedRequiredSchema.optional(),
      description: localizedOptionalSchema.optional().nullable(),
      address: localizedOptionalSchema.optional().nullable(),
      cancellation_policy: localizedOptionalSchema.optional().nullable(),
      country_phone_code: z.string().trim().optional().nullable(),
      city_phone_code: z.string().trim().optional().nullable(),
      telephone: z.string().trim().optional().nullable(),
      phone_number: z.string().trim().optional().nullable(),
      latitude: optionalNumberString,
      longitude: optionalNumberString,
      opening_hours: openingHoursSchema.optional().nullable(),
      off_days: z.array(z.string().trim()).optional().nullable(),
      isactive: z.boolean().optional(),
    })
    .strict()
    .refine((value) => Object.keys(value).length > 0, {
      message: "At least one field is required",
    }),
})

export const salonIdSchema = z.object({
  params: salonIdParamSchema,
})
