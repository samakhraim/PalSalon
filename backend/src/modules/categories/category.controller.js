import { successResponse } from "../../utils/apiResponse.js"
import categoryService from "./category.service.js"

const asyncHandler = (handler) => (req, res, next) =>
  Promise.resolve(handler(req, res, next)).catch(next)

export const listCategories = asyncHandler(async (req, res) => {
  const categories = await categoryService.listCategories()

  return successResponse(res, {
    message: "Categories fetched successfully",
    data: { categories },
  })
})

export const getCategory = asyncHandler(async (req, res) => {
  const category = await categoryService.getCategoryById(req.params.id)

  return successResponse(res, {
    message: "Category fetched successfully",
    data: { category },
  })
})

export const createCategory = asyncHandler(async (req, res) => {
  const category = await categoryService.createCategory(req.body)

  return successResponse(res, {
    statusCode: 201,
    message: "Category created successfully",
    data: { category },
  })
})

export const updateCategory = asyncHandler(async (req, res) => {
  const category = await categoryService.updateCategory(req.params.id, req.body)

  return successResponse(res, {
    message: "Category updated successfully",
    data: { category },
  })
})

export const deleteCategory = asyncHandler(async (req, res) => {
  await categoryService.deleteCategory(req.params.id)

  return successResponse(res, {
    message: "Category deleted successfully",
  })
})
