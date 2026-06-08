import { z } from "zod"

const roleBodySchema = z
  .object({
    name: z.string().trim().min(1, "Role name is required"),
    permissions: z.array(z.string().trim().min(1)).optional().default([]),
  })
  .strict()

export const createRoleSchema = z.object({
  body: roleBodySchema,
})

export const updateRoleSchema = z.object({
  params: z.object({
    id: z.coerce.number().int().positive("Role id must be a positive number"),
  }),
  body: roleBodySchema.partial().refine((value) => Object.keys(value).length > 0, {
    message: "At least one field is required",
  }),
})

export const roleIdParamSchema = z.object({
  params: z.object({
    id: z.coerce.number().int().positive("Role id must be a positive number"),
  }),
})
