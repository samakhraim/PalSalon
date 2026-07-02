import { successResponse } from "../utils/apiResponse.js"
import pageService from "../modules/pages/page.service.js"

const asyncHandler = (handler) => (req, res, next) =>
  Promise.resolve(handler(req, res, next)).catch(next)

const extractMainImageFile = (req) =>
  req.files?.main_image?.[0] || req.files?.["main_image[]"]?.[0] || null

export const listPages = asyncHandler(async (req, res) => {
  const pages = await pageService.listPages()

  return successResponse(res, {
    message: "Pages fetched successfully",
    data: { pages },
  })
})

export const getPage = asyncHandler(async (req, res) => {
  const page = await pageService.getPageById(req.params.id)

  return successResponse(res, {
    message: "Page fetched successfully",
    data: { page },
  })
})

export const createPage = asyncHandler(async (req, res) => {
  const page = await pageService.createPage(req.body, {
    mainImageFile: extractMainImageFile(req),
  })

  return successResponse(res, {
    statusCode: 201,
    message: "Page created successfully",
    data: { page },
  })
})

export const updatePage = asyncHandler(async (req, res) => {
  const page = await pageService.updatePage(req.params.id, req.body, {
    mainImageFile: extractMainImageFile(req),
  })

  return successResponse(res, {
    message: "Page updated successfully",
    data: { page },
  })
})

export const deletePage = asyncHandler(async (req, res) => {
  await pageService.deletePage(req.params.id)

  return successResponse(res, {
    message: "Page deleted successfully",
  })
})
