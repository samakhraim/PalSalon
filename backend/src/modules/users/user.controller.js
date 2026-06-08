import { successResponse } from "../../utils/apiResponse.js"
import userService from "./user.service.js"

const asyncHandler = (handler) => (req, res, next) =>
  Promise.resolve(handler(req, res, next)).catch(next)

export const listUsers = asyncHandler(async (req, res) => {
  const users = await userService.listUsers()

  return successResponse(res, {
    message: "Users fetched successfully",
    data: { users },
  })
})

export const getUser = asyncHandler(async (req, res) => {
  const user = await userService.getUserById(req.params.id)

  return successResponse(res, {
    message: "User fetched successfully",
    data: { user },
  })
})

export const createUser = asyncHandler(async (req, res) => {
  const user = await userService.createUser(req.body)

  return successResponse(res, {
    statusCode: 201,
    message: "User created successfully",
    data: { user },
  })
})

export const updateUser = asyncHandler(async (req, res) => {
  const user = await userService.updateUser(req.params.id, req.body)

  return successResponse(res, {
    message: "User updated successfully",
    data: { user },
  })
})

export const deleteUser = asyncHandler(async (req, res) => {
  await userService.deleteUser(req.params.id)

  return successResponse(res, {
    message: "User deleted successfully",
  })
})
