import { z } from "zod"

const contactUsIdParamSchema = z.object({
  id: z.coerce.number().int().positive("Contact message id must be a positive number"),
})

const createContactUsBodySchema = z
  .object({
    name: z.string().trim().min(1, "Name is required"),
    email: z.string().trim().email("A valid email is required"),
    phone: z.string().trim().optional().nullable(),
    title: z.string().trim().optional().nullable(),
    message: z.string().trim().min(1, "Message is required"),
  })
  .strict()

export const createContactUsSchema = z.object({
  body: createContactUsBodySchema,
})

export const contactUsIdSchema = z.object({
  params: contactUsIdParamSchema,
})
