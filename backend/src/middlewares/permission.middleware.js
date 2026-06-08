import { sequelize } from "../config/db.js"
import {
  Permission,
  Role,
  RolePermission,
  User,
  UserPermission,
  UserRole,
} from "../models/index.js"

const createHttpError = (message, statusCode) => {
  const error = new Error(message)
  error.statusCode = statusCode
  return error
}

const normalizeNames = (values = []) =>
  [...new Set(values.map((value) => value.trim()).filter(Boolean))]

const getUserWithAccess = async (userId) =>
  User.findByPk(userId, {
    include: [
      {
        model: Role,
        as: "roles",
        attributes: ["id", "name", "guardName"],
        through: { attributes: [] },
        include: [
          {
            model: Permission,
            as: "permissions",
            attributes: ["id", "name", "guardName"],
            through: { attributes: [] },
          },
        ],
      },
      {
        model: Permission,
        as: "permissions",
        attributes: ["id", "name", "guardName"],
        through: { attributes: [] },
      },
    ],
  })

export const getUserPermissions = async (userId) => {
  const user = await getUserWithAccess(userId)

  if (!user) {
    return []
  }

  const directPermissions = (user.permissions || []).map((permission) => permission.name)
  const rolePermissions = (user.roles || []).flatMap((role) =>
    (role.permissions || []).map((permission) => permission.name)
  )

  return [...new Set([...directPermissions, ...rolePermissions])]
}

export const getUserRoles = async (userId) => {
  const user = await getUserWithAccess(userId)

  if (!user) {
    return []
  }

  return [...new Set((user.roles || []).map((role) => role.name))]
}

export const userHasPermission = async (userId, permissionName) => {
  const permissions = await getUserPermissions(userId)
  return permissions.includes(permissionName)
}

export const userHasRole = async (userId, roleName) => {
  const roles = await getUserRoles(userId)
  return roles.includes(roleName)
}

const resolveRolesByName = async (roleNames, transaction) => {
  const normalizedRoleNames = normalizeNames(roleNames)

  if (normalizedRoleNames.length === 0) {
    return []
  }

  const roles = await Role.findAll({
    where: { name: normalizedRoleNames },
    transaction,
  })

  if (roles.length !== normalizedRoleNames.length) {
    const existingNames = new Set(roles.map((role) => role.name))
    const missingRole = normalizedRoleNames.find((name) => !existingNames.has(name))
    throw createHttpError(`Role '${missingRole}' does not exist`, 400)
  }

  return roles
}

const resolvePermissionsByName = async (permissionNames, transaction) => {
  const normalizedPermissionNames = normalizeNames(permissionNames)

  if (normalizedPermissionNames.length === 0) {
    return []
  }

  const permissions = await Permission.findAll({
    where: { name: normalizedPermissionNames },
    transaction,
  })

  if (permissions.length !== normalizedPermissionNames.length) {
    const existingNames = new Set(permissions.map((permission) => permission.name))
    const missingPermission = normalizedPermissionNames.find(
      (name) => !existingNames.has(name)
    )
    throw createHttpError(`Permission '${missingPermission}' does not exist`, 400)
  }

  return permissions
}

export const syncUserRoles = async (userId, roleNames = [], transaction) => {
  const run = async (activeTransaction) => {
    const user = await User.findByPk(userId, { transaction: activeTransaction })

    if (!user) {
      throw createHttpError("User not found", 404)
    }

    const roles = await resolveRolesByName(roleNames, activeTransaction)
    await user.setRoles(roles, { transaction: activeTransaction })

    return roles
  }

  if (transaction) {
    return run(transaction)
  }

  return sequelize.transaction(run)
}

export const syncUserPermissions = async (
  userId,
  permissionNames = [],
  transaction
) => {
  const run = async (activeTransaction) => {
    const user = await User.findByPk(userId, { transaction: activeTransaction })

    if (!user) {
      throw createHttpError("User not found", 404)
    }

    const permissions = await resolvePermissionsByName(
      permissionNames,
      activeTransaction
    )
    await user.setPermissions(permissions, { transaction: activeTransaction })

    return permissions
  }

  if (transaction) {
    return run(transaction)
  }

  return sequelize.transaction(run)
}

export const requirePermission = (permissionName) => async (req, res, next) => {
  try {
    const allowed = await userHasPermission(req.user.id, permissionName)

    if (!allowed) {
      throw createHttpError("You do not have the required permission", 403)
    }

    return next()
  } catch (error) {
    return next(error)
  }
}

export const requireAnyPermission =
  (permissionNames = []) =>
  async (req, res, next) => {
    try {
      const permissions = await getUserPermissions(req.user.id)
      const allowed = permissionNames.some((name) => permissions.includes(name))

      if (!allowed) {
        throw createHttpError("You do not have the required permission", 403)
      }

      return next()
    } catch (error) {
      return next(error)
    }
  }

export const requireRole = (roleName) => async (req, res, next) => {
  try {
    const allowed = await userHasRole(req.user.id, roleName)

    if (!allowed) {
      throw createHttpError("You do not have the required role", 403)
    }

    return next()
  } catch (error) {
    return next(error)
  }
}

export const countUsersByRoleId = (roleId, transaction) =>
  UserRole.count({
    where: { roleId },
    transaction,
  })

export const countAssignmentsByPermissionId = async (permissionId, transaction) => {
  const [roleAssignments, userAssignments] = await Promise.all([
    RolePermission.count({
      where: { permissionId },
      transaction,
    }),
    UserPermission.count({
      where: { permissionId },
      transaction,
    }),
  ])

  return roleAssignments + userAssignments
}
