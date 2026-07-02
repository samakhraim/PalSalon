import { DataTypes } from "sequelize"

import { sequelize } from "../config/db.js"
import CategoryModel from "./category.model.js"
import CityModel from "./city.model.js"
import ContactUsModel from "./contactUs.model.js"
import CustomerModel from "./customer.model.js"
import FaqModel from "./faq.model.js"
import IntroModel from "./intro.model.js"
import MediaModel from "./media.model.js"
import PageModel from "./page.model.js"
import PermissionModel from "./permission.model.js"
import RoleModel from "./role.model.js"
import RolePermissionModel from "./rolePermission.model.js"
import SalonModel from "./salon.model.js"
import SalonOwnerModel from "./salonOwner.model.js"
import ServiceModel from "./service.model.js"
import ServicePriceOptionModel from "./servicePriceOption.model.js"
import UserModel from "./user.model.js"
import UserPermissionModel from "./userPermission.model.js"
import UserRoleModel from "./userRole.model.js"

export const User = UserModel(sequelize, DataTypes)
export const Role = RoleModel(sequelize, DataTypes)
export const Permission = PermissionModel(sequelize, DataTypes)
export const Category = CategoryModel(sequelize, DataTypes)
export const City = CityModel(sequelize, DataTypes)
export const ContactUsMessage = ContactUsModel(sequelize, DataTypes)
export const Customer = CustomerModel(sequelize, DataTypes)
export const Faq = FaqModel(sequelize, DataTypes)
export const Intro = IntroModel(sequelize, DataTypes)
export const Media = MediaModel(sequelize, DataTypes)
export const Page = PageModel(sequelize, DataTypes)
export const UserRole = UserRoleModel(sequelize, DataTypes)
export const RolePermission = RolePermissionModel(sequelize, DataTypes)
export const Salon = SalonModel(sequelize, DataTypes)
export const SalonOwner = SalonOwnerModel(sequelize, DataTypes)
export const Service = ServiceModel(sequelize, DataTypes)
export const ServicePriceOption = ServicePriceOptionModel(sequelize, DataTypes)
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

SalonOwner.hasMany(Salon, {
  foreignKey: "salon_owner_id",
  as: "salons",
})

Salon.belongsTo(SalonOwner, {
  foreignKey: "salon_owner_id",
  as: "salonOwner",
})

City.hasMany(Salon, {
  foreignKey: "city_id",
  as: "salons",
})

Salon.belongsTo(City, {
  foreignKey: "city_id",
  as: "city",
})

Salon.hasMany(Service, {
  foreignKey: "salon_id",
  as: "services",
})

Service.belongsTo(Salon, {
  foreignKey: "salon_id",
  as: "salon",
})

Category.hasMany(Service, {
  foreignKey: "category_id",
  as: "services",
})

Service.belongsTo(Category, {
  foreignKey: "category_id",
  as: "category",
})

Service.hasMany(ServicePriceOption, {
  foreignKey: "service_id",
  as: "price_options",
})

ServicePriceOption.belongsTo(Service, {
  foreignKey: "service_id",
  as: "service",
})

const db = {
  sequelize,
  Category,
  City,
  ContactUsMessage,
  Customer,
  Faq,
  Intro,
  Media,
  Page,
  Permission,
  Role,
  Salon,
  SalonOwner,
  Service,
  ServicePriceOption,
  User,
  UserPermission,
  UserRole,
  RolePermission,
}

export default db
