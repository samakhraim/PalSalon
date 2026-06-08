import { successResponse } from "../../utils/apiResponse.js"
import permissionService from "./permission.service.js"

const asyncHandler = (handler) => (req, res, next) =>
  Promise.resolve(handler(req, res, next)).catch(next)

export const listPermissions = asyncHandler(async (req, res) => {
  const permissions = await permissionService.listPermissions()

  return successResponse(res, {
    message: "Permissions fetched successfully",
    data: { permissions },
  })
})

export const createPermission = asyncHandler(async (req, res) => {
  const permission = await permissionService.createPermission(req.body)

  return successResponse(res, {
    statusCode: 201,
    message: "Permission created successfully",
    data: { permission },
  })
})

export const updatePermission = asyncHandler(async (req, res) => {
  const permission = await permissionService.updatePermission(
    req.params.id,
    req.body
  )

  return successResponse(res, {
    message: "Permission updated successfully",
    data: { permission },
  })
})

export const deletePermission = asyncHandler(async (req, res) => {
  await permissionService.deletePermission(req.params.id)

  return successResponse(res, {
    message: "Permission deleted successfully",
  })
})
