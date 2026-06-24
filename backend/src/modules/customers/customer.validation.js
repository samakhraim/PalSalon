import { z } from "zod"

const requiredTrimmedString = (message) => z.string().trim().min(1, message)

const optionalNullableString = z.string().trim().optional().nullable()

const createCustomerBodySchema = z
  .object({
    first_name: requiredTrimmedString("First name is required"),
    middle_name: optionalNullableString,
    last_name: requiredTrimmedString("Last name is required"),
    country_phone_code: requiredTrimmedString("Country phone code is required"),
    phone: requiredTrimmedString("Phone is required"),
    email: z.string().trim().email("A valid email address is required"),
    password: requiredTrimmedString("Password is required"),
    isactive: z.boolean().optional(),
  })
  .strict()

const customerIdParamSchema = z.object({
  id: z.coerce.number().int().positive("Customer id must be a positive number"),
})

export const createCustomerSchema = z.object({
  body: createCustomerBodySchema,
})

export const updateCustomerSchema = z.object({
  params: customerIdParamSchema,
  body: z
    .object({
      first_name: z.string().trim().min(1, "First name is required").optional(),
      middle_name: optionalNullableString,
      last_name: z.string().trim().min(1, "Last name is required").optional(),
      country_phone_code: z
        .string()
        .trim()
        .min(1, "Country phone code is required")
        .optional(),
      phone: z.string().trim().min(1, "Phone is required").optional(),
      email: z.string().trim().email("A valid email address is required").optional(),
      password: z.string().trim().min(1, "Password is required").optional(),
      isactive: z.boolean().optional(),
    })
    .strict()
    .refine((value) => Object.keys(value).length > 0, {
      message: "At least one field is required",
    }),
})

export const customerIdSchema = z.object({
  params: customerIdParamSchema,
})
