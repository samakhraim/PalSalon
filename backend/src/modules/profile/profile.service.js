import {
  getUserPermissions,
  getUserRoles,
} from "../../middlewares/permission.middleware.js"
import { User } from "../../models/index.js"
import { comparePassword, hashPassword } from "../../utils/hashPassword.js"

const createHttpError = (message, statusCode) => {
  const error = new Error(message)
  error.statusCode = statusCode
  return error
}

const normalizeEmail = (email) => email.trim().toLowerCase()

const normalizeOptionalString = (value) => {
  if (value === undefined || value === null) {
    return null
  }

  const trimmedValue = value.trim()
  return trimmedValue || null
}

const formatUser = async (user) => ({
  ...user.toSafeJSON(),
  roles: await getUserRoles(user.id),
  permissions: await getUserPermissions(user.id),
})

const getUserInstanceById = async (userId, { includePassword = false } = {}) => {
  const user = includePassword
    ? await User.scope("withPassword").findByPk(userId)
    : await User.findByPk(userId)

  if (!user) {
    throw createHttpError("User not found", 404)
  }

  return user
}

const getProfile = async (userId) => {
  const user = await getUserInstanceById(userId)
  return formatUser(user)
}

const updateProfile = async (userId, payload) => {
  const user = await getUserInstanceById(userId)

  if (payload.email !== undefined) {
    const normalizedEmail = normalizeEmail(payload.email)
    const existingUser = await User.findOne({
      where: { email: normalizedEmail },
    })

    if (existingUser && existingUser.id !== user.id) {
      throw createHttpError("Email already exists", 409)
    }

    user.email = normalizedEmail
  }

  if (payload.name !== undefined) {
    user.name = payload.name.trim()
  }

  if (payload.phoneCountryCode !== undefined) {
    user.phoneCountryCode = normalizeOptionalString(payload.phoneCountryCode)
  }

  if (payload.phoneNumber !== undefined) {
    user.phoneNumber = normalizeOptionalString(payload.phoneNumber)
  }

  await user.save()

  return formatUser(user)
}

const updatePassword = async (
  userId,
  { currentPassword, newPassword, confirmPassword }
) => {
  const user = await getUserInstanceById(userId, { includePassword: true })

  if (newPassword !== confirmPassword) {
    throw createHttpError("New password and confirm password must match", 400)
  }

  const isCurrentPasswordValid = await comparePassword(
    currentPassword,
    user.password
  )

  if (!isCurrentPasswordValid) {
    throw createHttpError("Current password is incorrect", 400)
  }

  user.password = await hashPassword(newPassword)
  await user.save()

  return formatUser(user)
}

export default {
  getProfile,
  updatePassword,
  updateProfile,
}
