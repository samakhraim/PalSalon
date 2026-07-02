import { successResponse } from "../../utils/apiResponse.js"
import serviceService from "./service.service.js"

const asyncHandler = (handler) => (req, res, next) =>
  Promise.resolve(handler(req, res, next)).catch(next)

const extractServiceFiles = (req) => ({
  mainImageFile:
    req.files?.main_image?.[0] || req.files?.["main_image[]"]?.[0] || null,
  galleryFiles: [
    ...(req.files?.gallery || []),
    ...(req.files?.["gallery[]"] || []),
  ],
})

export const listServices = asyncHandler(async (req, res) => {
  const services = await serviceService.listServices()

  return successResponse(res, {
    message: "Services fetched successfully",
    data: { services },
  })
})

export const getService = asyncHandler(async (req, res) => {
  const service = await serviceService.getServiceById(req.params.id)

  return successResponse(res, {
    message: "Service fetched successfully",
    data: { service },
  })
})

export const createService = asyncHandler(async (req, res) => {
  const service = await serviceService.createService(req.body, extractServiceFiles(req))

  return successResponse(res, {
    statusCode: 201,
    message: "Service created successfully",
    data: { service },
  })
})

export const updateService = asyncHandler(async (req, res) => {
  const service = await serviceService.updateService(
    req.params.id,
    req.body,
    extractServiceFiles(req)
  )

  return successResponse(res, {
    message: "Service updated successfully",
    data: { service },
  })
})

export const deleteService = asyncHandler(async (req, res) => {
  await serviceService.deleteService(req.params.id)

  return successResponse(res, {
    message: "Service deleted successfully",
  })
})
