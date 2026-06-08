import { successResponse } from "../../utils/apiResponse.js"
import authService from "./auth.service.js"

const asyncHandler = (handler) => (req, res, next) =>
  Promise.resolve(handler(req, res, next)).catch(next)

export const register = asyncHandler(async (req, res) => {
  const data = await authService.register(req.body)

  return successResponse(res, {
    statusCode: 201,
    message: "Registration successful",
    data,
  })
})

export const login = asyncHandler(async (req, res) => {
  const data = await authService.login(req.body)

  return successResponse(res, {
    statusCode: 200,
    message: "Login successful",
    data,
  })
})

export const me = asyncHandler(async (req, res) => {
  const user = await authService.getCurrentUser(req.user.id)

  return successResponse(res, {
    statusCode: 200,
    message: "Current user fetched successfully",
    data: { user },
  })
})

export const logout = asyncHandler(async (req, res) => {
  await authService.logout()

  return successResponse(res, {
    statusCode: 200,
    message: "Logout successful",
  })
})
