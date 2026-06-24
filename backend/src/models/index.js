import { DataTypes } from "sequelize"

import { sequelize } from "../config/db.js"
import CityModel from "./city.model.js"
import ContactUsModel from "./contactUs.model.js"
import MediaModel from "./media.model.js"
import PermissionModel from "./permission.model.js"
import RoleModel from "./role.model.js"
import RolePermissionModel from "./rolePermission.model.js"
import UserModel from "./user.model.js"
import UserPermissionModel from "./userPermission.model.js"
import UserRoleModel from "./userRole.model.js"

export const User = UserModel(sequelize, DataTypes)
export const Role = RoleModel(sequelize, DataTypes)
export const Permission = PermissionModel(sequelize, DataTypes)
export const City = CityModel(sequelize, DataTypes)
export const ContactUsMessage = ContactUsModel(sequelize, DataTypes)
export const Media = MediaModel(sequelize, DataTypes)
export const UserRole = UserRoleModel(sequelize, DataTypes)
export const RolePermission = RolePermissionModel(sequelize, DataTypes)
export const UserPermission = UserPermissionModel(sequelize, DataTypes)

User.belongsToMany(Role, {
  through: UserRole,
  as: "roles",
  foreignKey: "userId",
  otherKey: "roleId",
})

Role.belongsToMany(User, {
  through: UserRole,
  as: "users",
  foreignKey: "roleId",
  otherKey: "userId",
})

Role.belongsToMany(Permission, {
  through: RolePermission,
  as: "permissions",
  foreignKey: "roleId",
  otherKey: "permissionId",
})

Permission.belongsToMany(Role, {
  through: RolePermission,
  as: "roles",
  foreignKey: "permissionId",
  otherKey: "roleId",
})

User.belongsToMany(Permission, {
  through: UserPermission,
  as: "permissions",
  foreignKey: "userId",
  otherKey: "permissionId",
})

Permission.belongsToMany(User, {
  through: UserPermission,
  as: "users",
  foreignKey: "permissionId",
  otherKey: "userId",
})

const db = {
  sequelize,
  City,
  ContactUsMessage,
  Media,
  Permission,
  Role,
  User,
  UserPermission,
  UserRole,
  RolePermission,
}

export default db
