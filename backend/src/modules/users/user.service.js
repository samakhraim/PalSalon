import { sequelize } from "../../config/db.js"
import {
  getUserPermissions,
  getUserRoles,
  syncUserPermissions,
  syncUserRoles,
} from "../../middlewares/permission.middleware.js"
import { User } from "../../models/index.js"
import { hashPassword } from "../../utils/hashPassword.js"

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

const listUsers = async () => {
  const users = await User.findAll({
    order: [["id", "ASC"]],
  })

  return Promise.all(users.map(formatUser))
}

const getUserById = async (userId) => {
  const user = await User.findByPk(userId)

  if (!user) {
    throw createHttpError("User not found", 404)
  }

  return formatUser(user)
}

const createUser = async (payload) =>
  sequelize.transaction(async (transaction) => {
    const normalizedEmail = normalizeEmail(payload.email)
    const existingUser = await User.findOne({
      where: { email: normalizedEmail },
      transaction,
    })

    if (existingUser) {
      throw createHttpError("Email already exists", 409)
    }

    const user = await User.create(
      {
        name: payload.name.trim(),
        email: normalizedEmail,
        phoneCountryCode: normalizeOptionalString(payload.phoneCountryCode),
        phoneNumber: normalizeOptionalString(payload.phoneNumber),
        password: await hashPassword(payload.password),
        role: payload.roles?.includes("Admin") ? "admin" : "user",
      },
      { transaction }
    )

    await syncUserRoles(user.id, payload.roles || [], transaction)
    await syncUserPermissions(user.id, payload.permissions || [], transaction)

    const createdUser = await User.findByPk(user.id, { transaction })
    return formatUser(createdUser)
  })

const updateUser = async (userId, payload) =>
  sequelize.transaction(async (transaction) => {
    const user = await User.findByPk(userId, { transaction })

    if (!user) {
      throw createHttpError("User not found", 404)
    }

    if (payload.email) {
      const normalizedEmail = normalizeEmail(payload.email)
      const existingUser = await User.findOne({
        where: { email: normalizedEmail },
        transaction,
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

    if (payload.password) {
      user.password = await hashPassword(payload.password)
    }

    if (payload.roles) {
      user.role = payload.roles.includes("Admin") ? "admin" : "user"
    }

    await user.save({ transaction })

    if (payload.roles) {
      await syncUserRoles(user.id, payload.roles, transaction)
    }

    if (payload.permissions) {
      await syncUserPermissions(user.id, payload.permissions, transaction)
    }

    const updatedUser = await User.findByPk(user.id, { transaction })
    return formatUser(updatedUser)
  })

const deleteUser = async (userId) =>
  sequelize.transaction(async (transaction) => {
    const user = await User.findByPk(userId, { transaction })

    if (!user) {
      throw createHttpError("User not found", 404)
    }

    if (user.email === "admin@palsalon.com") {
      throw createHttpError("Default admin user cannot be deleted", 400)
    }

    await user.destroy({ transaction })
  })

export default {
  createUser,
  deleteUser,
  getUserById,
  listUsers,
  updateUser,
}
