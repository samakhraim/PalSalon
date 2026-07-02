import { successResponse } from "../utils/apiResponse.js"
import profileService from "../modules/profile/profile.service.js"

const asyncHandler = (handler) => (req, res, next) =>
  Promise.resolve(handler(req, res, next)).catch(next)

export const getProfile = asyncHandler(async (req, res) => {
  const user = await profileService.getProfile(req.user.id)

  return successResponse(res, {
    message: "Profile fetched successfully",
    data: { user },
  })
})

export const updateProfile = asyncHandler(async (req, res) => {
  const user = await profileService.updateProfile(req.user.id, req.body)

  return successResponse(res, {
    message: "Profile updated successfully",
    data: { user },
  })
})

export const updatePassword = asyncHandler(async (req, res) => {
  await profileService.updatePassword(req.user.id, req.body)

  return successResponse(res, {
    message: "Password updated successfully",
  })
})
