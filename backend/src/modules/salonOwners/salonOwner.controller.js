import { successResponse } from "../../utils/apiResponse.js"
import salonOwnerService from "./salonOwner.service.js"

const asyncHandler = (handler) => (req, res, next) =>
  Promise.resolve(handler(req, res, next)).catch(next)

export const listSalonOwners = asyncHandler(async (req, res) => {
  const salonOwners = await salonOwnerService.listSalonOwners()

  return successResponse(res, {
    message: "Salon owners fetched successfully",
    data: { salonOwners },
  })
})

export const getSalonOwner = asyncHandler(async (req, res) => {
  const salonOwner = await salonOwnerService.getSalonOwnerById(req.params.id)

  return successResponse(res, {
    message: "Salon owner fetched successfully",
    data: { salonOwner },
  })
})

export const createSalonOwner = asyncHandler(async (req, res) => {
  const salonOwner = await salonOwnerService.createSalonOwner(req.body)

  return successResponse(res, {
    statusCode: 201,
    message: "Salon owner created successfully",
    data: { salonOwner },
  })
})

export const updateSalonOwner = asyncHandler(async (req, res) => {
  const salonOwner = await salonOwnerService.updateSalonOwner(req.params.id, req.body)

  return successResponse(res, {
    message: "Salon owner updated successfully",
    data: { salonOwner },
  })
})

export const deleteSalonOwner = asyncHandler(async (req, res) => {
  await salonOwnerService.deleteSalonOwner(req.params.id)

  return successResponse(res, {
    message: "Salon owner deleted successfully",
  })
})
