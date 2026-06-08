import { User } from "../../models/index.js"
import {
  getUserPermissions,
  getUserRoles,
  syncUserRoles,
} from "../../middlewares/permission.middleware.js"
import { generateToken } from "../../utils/generateToken.js"
import { comparePassword, hashPassword } from "../../utils/hashPassword.js"

const buildAuthPayload = async (user) => ({
  user: {
    ...user.toSafeJSON(),
    roles: await getUserRoles(user.id),
    permissions: await getUserPermissions(user.id),
  },
  token: generateToken({
    sub: user.id,
    email: user.email,
    role: user.role,
  }),
})

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

const register = async ({
  name,
  email,
  phoneCountryCode,
  phoneNumber,
  password,
}) => {
  const normalizedEmail = normalizeEmail(email)
  const existingUser = await User.findOne({ where: { email: normalizedEmail } })

  if (existingUser) {
    throw createHttpError("Email already exists", 409)
  }

  const user = await User.create({
    name: name.trim(),
    email: normalizedEmail,
    phoneCountryCode: normalizeOptionalString(phoneCountryCode),
    phoneNumber: normalizeOptionalString(phoneNumber),
    password: await hashPassword(password),
    role: "user",
  })

  try {
    await syncUserRoles(user.id, ["User"])
  } catch (error) {
    if (error.statusCode !== 400) {
      throw error
    }
  }

  return buildAuthPayload(user)
}

const login = async ({ email, password }) => {
  const normalizedEmail = normalizeEmail(email)
  const user = await User.scope("withPassword").findOne({
    where: { email: normalizedEmail },
  })

  if (!user) {
    throw createHttpError("Invalid email or password", 401)
  }

  const isPasswordValid = await comparePassword(password, user.password)

  if (!isPasswordValid) {
    throw createHttpError("Invalid email or password", 401)
  }

  return buildAuthPayload(user)
}

const getCurrentUser = async (userId) => {
  const user = await User.findByPk(userId)

  if (!user) {
    throw createHttpError("User not found", 404)
  }

  return {
    ...user.toSafeJSON(),
    roles: await getUserRoles(user.id),
    permissions: await getUserPermissions(user.id),
  }
}

const logout = async () => ({
  success: true,
})

export default {
  register,
  login,
  getCurrentUser,
  logout,
}
