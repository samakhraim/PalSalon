import { sequelize } from "../../config/db.js"
import {
  Permission,
  Role,
  RolePermission,
  UserRole,
} from "../../models/index.js"

const createHttpError = (message, statusCode) => {
  const error = new Error(message)
  error.statusCode = statusCode
  return error
}

const normalizeName = (value) => value.trim()

const toRoleResponse = (role) => ({
  id: role.id,
  name: role.name,
  guardName: role.guardName,
  permissions: (role.permissions || []).map((permission) => permission.name),
  createdAt: role.createdAt,
  updatedAt: role.updatedAt,
})

const findPermissionsByNames = async (permissionNames = [], transaction) => {
  const uniqueNames = [...new Set(permissionNames.map((name) => name.trim()).filter(Boolean))]

  if (uniqueNames.length === 0) {
    return []
  }

  const permissions = await Permission.findAll({
    where: { name: uniqueNames },
    transaction,
  })

  if (permissions.length !== uniqueNames.length) {
    const existingNames = new Set(permissions.map((permission) => permission.name))
    const missingPermission = uniqueNames.find((name) => !existingNames.has(name))
    throw createHttpError(`Permission '${missingPermission}' does not exist`, 400)
  }

  return permissions
}

const getRoleInclude = [
  {
    model: Permission,
    as: "permissions",
    attributes: ["id", "name", "guardName"],
    through: { attributes: [] },
  },
]

const listRoles = async () => {
  const roles = await Role.findAll({
    include: getRoleInclude,
    order: [["id", "ASC"]],
  })

  return roles.map(toRoleResponse)
}

const getRoleById = async (roleId) => {
  const role = await Role.findByPk(roleId, {
    include: getRoleInclude,
  })

  if (!role) {
    throw createHttpError("Role not found", 404)
  }

  return toRoleResponse(role)
}

const createRole = async ({ name, permissions = [] }) =>
  sequelize.transaction(async (transaction) => {
    const normalizedName = normalizeName(name)
    const existingRole = await Role.findOne({
      where: { name: normalizedName },
      transaction,
    })

    if (existingRole) {
      throw createHttpError("Role name already exists", 409)
    }

    const permissionModels = await findPermissionsByNames(permissions, transaction)
    const role = await Role.create(
      { name: normalizedName, guardName: "api" },
      { transaction }
    )

    await role.setPermissions(permissionModels, { transaction })

    const createdRole = await Role.findByPk(role.id, {
      include: getRoleInclude,
      transaction,
    })

    return toRoleResponse(createdRole)
  })

const updateRole = async (roleId, payload) =>
  sequelize.transaction(async (transaction) => {
    const role = await Role.findByPk(roleId, {
      include: getRoleInclude,
      transaction,
    })

    if (!role) {
      throw createHttpError("Role not found", 404)
    }

    if (payload.name) {
      const normalizedName = normalizeName(payload.name)
      const existingRole = await Role.findOne({
        where: { name: normalizedName },
        transaction,
      })

      if (existingRole && existingRole.id !== role.id) {
        throw createHttpError("Role name already exists", 409)
      }

      role.name = normalizedName
    }

    if (payload.permissions) {
      const permissionModels = await findPermissionsByNames(
        payload.permissions,
        transaction
      )
      await role.setPermissions(permissionModels, { transaction })
    }

    await role.save({ transaction })

    const updatedRole = await Role.findByPk(role.id, {
      include: getRoleInclude,
      transaction,
    })

    return toRoleResponse(updatedRole)
  })

const deleteRole = async (roleId) =>
  sequelize.transaction(async (transaction) => {
    const role = await Role.findByPk(roleId, { transaction })

    if (!role) {
      throw createHttpError("Role not found", 404)
    }

    if (role.name === "Admin") {
      throw createHttpError("Admin role cannot be deleted", 400)
    }

    const assignedUsersCount = await UserRole.count({
      where: { roleId: role.id },
      transaction,
    })

    if (assignedUsersCount > 0) {
      throw createHttpError("Role is assigned to users and cannot be deleted", 400)
    }

    await RolePermission.destroy({
      where: { roleId: role.id },
      transaction,
    })
    await role.destroy({ transaction })
  })

export default {
  createRole,
  deleteRole,
  getRoleById,
  listRoles,
  updateRole,
}
