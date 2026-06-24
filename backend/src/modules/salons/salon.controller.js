import { successResponse } from "../../utils/apiResponse.js"
import salonService from "./salon.service.js"

const asyncHandler = (handler) => (req, res, next) =>
  Promise.resolve(handler(req, res, next)).catch(next)

export const listSalons = asyncHandler(async (req, res) => {
  const salons = await salonService.listSalons()

  return successResponse(res, {
    message: "Salons fetched successfully",
    data: { salons },
  })
})

export const getSalon = asyncHandler(async (req, res) => {
  const salon = await salonService.getSalonById(req.params.id)

  return successResponse(res, {
    message: "Salon fetched successfully",
    data: { salon },
  })
})

export const createSalon = asyncHandler(async (req, res) => {
  const salon = await salonService.createSalon(req.body)

  return successResponse(res, {
    statusCode: 201,
    message: "Salon created successfully",
    data: { salon },
  })
})

export const updateSalon = asyncHandler(async (req, res) => {
  const salon = await salonService.updateSalon(req.params.id, req.body)

  return successResponse(res, {
    message: "Salon updated successfully",
    data: { salon },
  })
})

export const deleteSalon = asyncHandler(async (req, res) => {
  await salonService.deleteSalon(req.params.id)

  return successResponse(res, {
    message: "Salon deleted successfully",
  })
})

export const incrementSalonClick = asyncHandler(async (req, res) => {
  const salon = await salonService.incrementSalonClick(req.params.id)

  return successResponse(res, {
    message: "Salon click count updated successfully",
    data: { salon },
  })
})
