import { successResponse } from "../../utils/apiResponse.js"
import { createHttpError, extractUploadedFiles } from "./media.helper.js"
import mediaService from "./media.service.js"

const asyncHandler = (handler) => (req, res, next) =>
  Promise.resolve(handler(req, res, next)).catch(next)

export const uploadSingleMedia = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw createHttpError("File is required", 400)
  }

  const media = await mediaService.uploadSingleMedia({
    file: req.file,
    modelType: req.body.modelType,
    modelId: req.body.modelId,
    collectionName: req.body.collectionName,
  })

  return successResponse(res, {
    statusCode: 201,
    message: "Media uploaded successfully",
    data: { media },
  })
})

export const uploadMultipleMedia = asyncHandler(async (req, res) => {
  const files = extractUploadedFiles(req)

  if (files.length === 0) {
    throw createHttpError("At least one file is required", 400)
  }

  const media = await mediaService.uploadMultipleMedia({
    files,
    modelType: req.body.modelType,
    modelId: req.body.modelId,
    collectionName: req.body.collectionName,
  })

  return successResponse(res, {
    statusCode: 201,
    message: "Media uploaded successfully",
    data: { media },
  })
})

export const replaceSingleMedia = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw createHttpError("File is required", 400)
  }

  const media = await mediaService.replaceSingleMedia({
    file: req.file,
    modelType: req.body.modelType,
    modelId: req.body.modelId,
    collectionName: req.body.collectionName,
  })

  return successResponse(res, {
    message: "Media replaced successfully",
    data: { media },
  })
})

export const getMedia = asyncHandler(async (req, res) => {
  const media = await mediaService.getMedia({
    modelType: req.query.modelType,
    modelId: req.query.modelId,
    collectionName: req.query.collectionName,
  })

  return successResponse(res, {
    message: "Media fetched successfully",
    data: { media },
  })
})

export const deleteMedia = asyncHandler(async (req, res) => {
  const media = await mediaService.deleteMedia(req.params.id)

  return successResponse(res, {
    message: "Media deleted successfully",
    data: { media },
  })
})
