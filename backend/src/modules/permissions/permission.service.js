import { sequelize } from "../../config/db.js"
import {
  Permission,
  RolePermission,
  UserPermission,
} from "../../models/index.js"

const createHttpError = (message, statusCode) => {
  const error = new Error(message)
  error.statusCode = statusCode
  return error
}

const normalizeName = (value) => value.trim()

const toPermissionResponse = (permission) => ({
  id: permission.id,
  name: permission.name,
  guardName: permission.guardName,
  createdAt: permission.createdAt,
  updatedAt: permission.updatedAt,
})

const listPermissions = async () => {
  const permissions = await Permission.findAll({
    order: [["id", "ASC"]],
  })

  return permissions.map(toPermissionResponse)
}

const createPermission = async ({ name }) => {
  const normalizedName = normalizeName(name)
  const existingPermission = await Permission.findOne({
    where: { name: normalizedName },
  })

  if (existingPermission) {
    throw createHttpError("Permission name already exists", 409)
  }

  const permission = await Permission.create({
    name: normalizedName,
    guardName: "api",
  })

  return toPermissionResponse(permission)
}

const updatePermission = async (permissionId, { name }) => {
  const permission = await Permission.findByPk(permissionId)

  if (!permission) {
    throw createHttpError("Permission not found", 404)
  }

  const normalizedName = normalizeName(name)
  const existingPermission = await Permission.findOne({
    where: { name: normalizedName },
  })

  if (existingPermission && existingPermission.id !== permission.id) {
    throw createHttpError("Permission name already exists", 409)
  }

  permission.name = normalizedName
  await permission.save()

  return toPermissionResponse(permission)
}

const deletePermission = async (permissionId) =>
  sequelize.transaction(async (transaction) => {
    const permission = await Permission.findByPk(permissionId, { transaction })

    if (!permission) {
      throw createHttpError("Permission not found", 404)
    }

    const [roleAssignments, userAssignments] = await Promise.all([
      RolePermission.count({
        where: { permissionId: permission.id },
        transaction,
      }),
      UserPermission.count({
        where: { permissionId: permission.id },
        transaction,
      }),
    ])

    if (roleAssignments > 0 || userAssignments > 0) {
      throw createHttpError(
        "Permission is assigned to roles or users and cannot be deleted",
        400
      )
    }

    await permission.destroy({ transaction })
  })

export default {
  createPermission,
  deletePermission,
  listPermissions,
  updatePermission,
}
