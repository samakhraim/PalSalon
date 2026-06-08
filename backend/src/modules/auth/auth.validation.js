import { z } from "zod"

export const registerSchema = z.object({
  body: z
    .object({
      name: z.string().trim().min(1, "Name is required"),
      email: z.string().trim().email("Valid email is required"),
      phoneCountryCode: z
        .string()
        .trim()
        .min(1, "Phone country code cannot be empty")
        .optional()
        .nullable(),
      phoneNumber: z
        .string()
        .trim()
        .min(1, "Phone number cannot be empty")
        .optional()
        .nullable(),
      password: z.string().min(8, "Password must be at least 8 characters"),
    })
    .strict(),
})

export const loginSchema = z.object({
  body: z
    .object({
      email: z.string().trim().email("Valid email is required"),
      password: z.string().min(1, "Password is required"),
    })
    .strict(),
})
