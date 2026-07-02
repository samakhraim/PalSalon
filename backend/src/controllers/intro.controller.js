import { successResponse } from "../utils/apiResponse.js"
import introService from "../modules/intros/intro.service.js"

const asyncHandler = (handler) => (req, res, next) =>
  Promise.resolve(handler(req, res, next)).catch(next)

const extractMainImageFile = (req) =>
  req.files?.main_image?.[0] || req.files?.["main_image[]"]?.[0] || null

export const listIntros = asyncHandler(async (req, res) => {
  const intros = await introService.listIntros()

  return successResponse(res, {
    message: "Intros fetched successfully",
    data: { intros },
  })
})

export const getIntro = asyncHandler(async (req, res) => {
  const intro = await introService.getIntroById(req.params.id)

  return successResponse(res, {
    message: "Intro fetched successfully",
    data: { intro },
  })
})

export const createIntro = asyncHandler(async (req, res) => {
  const intro = await introService.createIntro(req.body, {
    mainImageFile: extractMainImageFile(req),
  })

  return successResponse(res, {
    statusCode: 201,
    message: "Intro created successfully",
    data: { intro },
  })
})

export const updateIntro = asyncHandler(async (req, res) => {
  const intro = await introService.updateIntro(req.params.id, req.body, {
    mainImageFile: extractMainImageFile(req),
  })

  return successResponse(res, {
    message: "Intro updated successfully",
    data: { intro },
  })
})

export const deleteIntro = asyncHandler(async (req, res) => {
  await introService.deleteIntro(req.params.id)

  return successResponse(res, {
    message: "Intro deleted successfully",
  })
})
