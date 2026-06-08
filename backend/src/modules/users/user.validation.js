import { z } from "zod"

const userBaseSchema = z
  .object({
    name: z.string().trim().min(1, "Name is required"),
    email: z.string().trim().email("Valid email is required"),
    phoneCountryCode: z.string().trim().optional().nullable(),
    phoneNumber: z.string().trim().optional().nullable(),
    roles: z.array(z.string().trim().min(1)).optional().default([]),
    permissions: z.array(z.string().trim().min(1)).optional().default([]),
  })
  .strict()

export const createUserSchema = z.object({
  body: userBaseSchema.extend({
    password: z.string().min(8, "Password must be at least 8 characters"),
  }),
})

export const updateUserSchema = z.object({
  params: z.object({
    id: z.coerce.number().int().positive("User id must be a positive number"),
  }),
  body: userBaseSchema
    .extend({
      password: z.string().min(8, "Password must be at least 8 characters").optional(),
    })
    .partial()
    .refine((value) => Object.keys(value).length > 0, {
      message: "At least one field is required",
    }),
})

export const userIdParamSchema = z.object({
  params: z.object({
    id: z.coerce.number().int().positive("User id must be a positive number"),
  }),
})
