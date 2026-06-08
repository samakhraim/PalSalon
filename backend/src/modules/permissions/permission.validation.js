import { z } from "zod"

const permissionBodySchema = z
  .object({
    name: z.string().trim().min(1, "Permission name is required"),
  })
  .strict()

export const createPermissionSchema = z.object({
  body: permissionBodySchema,
})

export const updatePermissionSchema = z.object({
  params: z.object({
    id: z.coerce
      .number()
      .int()
      .positive("Permission id must be a positive number"),
  }),
  body: permissionBodySchema,
})

export const permissionIdParamSchema = z.object({
  params: z.object({
    id: z.coerce
      .number()
      .int()
      .positive("Permission id must be a positive number"),
  }),
})
