import { z } from "zod"

export const updateProfileSchema = z.object({
  body: z
    .object({
      name: z.string().trim().min(1, "Name is required").optional(),
      email: z.string().trim().email("Valid email is required").optional(),
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
    })
    .strict()
    .refine((value) => Object.keys(value).length > 0, {
      message: "At least one field is required",
    }),
})

export const updatePasswordSchema = z.object({
  body: z
    .object({
      currentPassword: z.string().min(1, "Current password is required"),
      newPassword: z.string().min(8, "New password must be at least 8 characters"),
      confirmPassword: z.string().min(1, "Confirm password is required"),
    })
    .strict()
    .refine((value) => value.newPassword === value.confirmPassword, {
      message: "New password and confirm password must match",
      path: ["confirmPassword"],
    }),
})
