import { successResponse } from "../../utils/apiResponse.js"
import roleService from "./role.service.js"

const asyncHandler = (handler) => (req, res, next) =>
  Promise.resolve(handler(req, res, next)).catch(next)

export const listRoles = asyncHandler(async (req, res) => {
  const roles = await roleService.listRoles()

  return successResponse(res, {
    message: "Roles fetched successfully",
    data: { roles },
  })
})

export const getRole = asyncHandler(async (req, res) => {
  const role = await roleService.getRoleById(req.params.id)

  return successResponse(res, {
    message: "Role fetched successfully",
    data: { role },
  })
})

export const createRole = asyncHandler(async (req, res) => {
  const role = await roleService.createRole(req.body)

  return successResponse(res, {
    statusCode: 201,
    message: "Role created successfully",
    data: { role },
  })
})

export const updateRole = asyncHandler(async (req, res) => {
  const role = await roleService.updateRole(req.params.id, req.body)

  return successResponse(res, {
    message: "Role updated successfully",
    data: { role },
  })
})

export const deleteRole = asyncHandler(async (req, res) => {
  await roleService.deleteRole(req.params.id)

  return successResponse(res, {
    message: "Role deleted successfully",
  })
})
