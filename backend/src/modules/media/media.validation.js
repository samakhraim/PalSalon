import { z } from "zod"

const mediaPayloadSchema = z
  .object({
    modelType: z.string().trim().min(1, "modelType is required"),
    modelId: z.coerce.number().int().positive("modelId must be a positive number"),
    collectionName: z.string().trim().min(1, "collectionName is required"),
  })
  .strict()

export const uploadMediaSchema = z.object({
  body: mediaPayloadSchema,
})

export const getMediaSchema = z.object({
  query: mediaPayloadSchema.extend({
    collectionName: z.string().trim().min(1).optional(),
  }),
})

export const mediaIdParamSchema = z.object({
  params: z.object({
    id: z.coerce.number().int().positive("Media id must be a positive number"),
  }),
})
