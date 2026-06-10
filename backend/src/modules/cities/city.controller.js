import { successResponse } from "../../utils/apiResponse.js"
import cityService from "./city.service.js"

const asyncHandler = (handler) => (req, res, next) =>
  Promise.resolve(handler(req, res, next)).catch(next)

export const listCities = asyncHandler(async (req, res) => {
  const cities = await cityService.getCities()

  return successResponse(res, {
    message: "Cities fetched successfully",
    data: { cities },
  })
})

export const getCity = asyncHandler(async (req, res) => {
  const city = await cityService.getCityById(req.params.id)

  return successResponse(res, {
    message: "City fetched successfully",
    data: { city },
  })
})

export const createCity = asyncHandler(async (req, res) => {
  const city = await cityService.createCity(req.body)

  return successResponse(res, {
    statusCode: 201,
    message: "City created successfully",
    data: { city },
  })
})

export const updateCity = asyncHandler(async (req, res) => {
  const city = await cityService.updateCity(req.params.id, req.body)

  return successResponse(res, {
    message: "City updated successfully",
    data: { city },
  })
})

export const deleteCity = asyncHandler(async (req, res) => {
  await cityService.deleteCity(req.params.id)

  return successResponse(res, {
    message: "City deleted successfully",
  })
})

export const toggleCityStatus = asyncHandler(async (req, res) => {
  const city = await cityService.toggleCityStatus(req.params.id)

  return successResponse(res, {
    message: "City status updated successfully",
    data: { city },
  })
})
