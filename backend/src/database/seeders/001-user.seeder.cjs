"use strict";

const bcrypt = require("bcrypt");

function hasColumn(table, column) {
  return Object.prototype.hasOwnProperty.call(table, column);
}

function timestamps(table, now) {
  const data = {};

  if (hasColumn(table, "createdAt")) data.createdAt = now;
  if (hasColumn(table, "updatedAt")) data.updatedAt = now;

  if (hasColumn(table, "created_at")) data.created_at = now;
  if (hasColumn(table, "updated_at")) data.updated_at = now;

  return data;
}

function columnName(table, camelCase, snakeCase) {
  if (hasColumn(table, camelCase)) return camelCase;
  if (hasColumn(table, snakeCase)) return snakeCase;
  return camelCase;
}

async function ensureBulkInsert(queryInterface, tableName, rows) {
  if (rows.length === 0) {
    return;
  }

  await queryInterface.bulkInsert(tableName, rows);
}

module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();

    const usersTable = await queryInterface.describeTable("users");
    const rolesTable = await queryInterface.describeTable("roles");
    const permissionsTable = await queryInterface.describeTable("permissions");
    const userRolesTable = await queryInterface.describeTable("user_roles");
    const rolePermissionsTable = await queryInterface.describeTable("role_permissions");

    const roleGuardColumn = columnName(rolesTable, "guardName", "guard_name");
    const permissionGuardColumn = columnName(
      permissionsTable,
      "guardName",
      "guard_name"
    );
    const userRoleUserColumn = columnName(userRolesTable, "userId", "user_id");
    const userRoleRoleColumn = columnName(userRolesTable, "roleId", "role_id");
    const rolePermissionRoleColumn = columnName(
      rolePermissionsTable,
      "roleId",
      "role_id"
    );
    const rolePermissionPermissionColumn = columnName(
      rolePermissionsTable,
      "permissionId",
      "permission_id"
    );

    const hashedPassword = await bcrypt.hash("password", 10);

    const [existingAdminUser] = await queryInterface.sequelize.query(
      "SELECT id FROM users WHERE email = 'admin@palsalon.com' LIMIT 1",
      { type: Sequelize.QueryTypes.SELECT }
    );

    if (existingAdminUser) {
      await queryInterface.bulkUpdate(
        "users",
        {
          name: "Admin",
          password: hashedPassword,
          role: "admin",
          ...timestamps(usersTable, now),
        },
        { id: existingAdminUser.id }
      );
    } else {
      await queryInterface.bulkInsert("users", [
        {
          name: "Admin",
          email: "admin@palsalon.com",
          phoneCountryCode: null,
          phoneNumber: null,
          password: hashedPassword,
          role: "admin",
          ...timestamps(usersTable, now),
        },
      ]);
    }

    const existingRoles = await queryInterface.sequelize.query(
      "SELECT id, name FROM roles",
      { type: Sequelize.QueryTypes.SELECT }
    );

    const rolesToInsert = [
      { name: "Admin" },
      { name: "User" },
    ]
      .filter((role) => !existingRoles.some((existingRole) => existingRole.name === role.name))
      .map((role) => ({
        ...role,
        [roleGuardColumn]: "api",
        ...timestamps(rolesTable, now),
      }));

    await ensureBulkInsert(queryInterface, "roles", rolesToInsert);

    const existingPermissions = await queryInterface.sequelize.query(
      "SELECT id, name FROM permissions",
      { type: Sequelize.QueryTypes.SELECT }
    );

    const permissionNames = [
      "Categories-view",
      "Categories-manage",
      "Cities-view",
      "Cities-manage",
      "Customers-view",
      "Customers-manage",
      "Salons-view",
      "Salons-manage",
      "Services-view",
      "Services-manage",
      "SalonOwners-view",
      "SalonOwners-manage",
      "Role-view",
      "Role-manage",
      "Users-view",
      "Users-manage",
      "ContactUs-view",
      "ContactUs-manage",
      "FAQ-view",
      "FAQ-manage",
    ];

    const permissionsToInsert = permissionNames
      .filter(
        (permissionName) =>
          !existingPermissions.some(
            (existingPermission) => existingPermission.name === permissionName
          )
      )
      .map((permissionName) => ({
        name: permissionName,
        [permissionGuardColumn]: "api",
        ...timestamps(permissionsTable, now),
      }));

    await ensureBulkInsert(queryInterface, "permissions", permissionsToInsert);

    const [adminUser] = await queryInterface.sequelize.query(
      "SELECT id FROM users WHERE email = 'admin@palsalon.com' LIMIT 1",
      { type: Sequelize.QueryTypes.SELECT }
    );

    const roles = await queryInterface.sequelize.query(
      "SELECT id, name FROM roles",
      { type: Sequelize.QueryTypes.SELECT }
    );

    const permissions = await queryInterface.sequelize.query(
      "SELECT id, name FROM permissions",
      { type: Sequelize.QueryTypes.SELECT }
    );

    const adminRole = roles.find((role) => role.name === "Admin");
    const userRole = roles.find((role) => role.name === "User");

    const existingUserRoles = await queryInterface.sequelize.query(
      `SELECT ${userRoleUserColumn} AS userId, ${userRoleRoleColumn} AS roleId FROM user_roles`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    if (
      adminUser &&
      adminRole &&
      !existingUserRoles.some(
        (userRoleItem) =>
          Number(userRoleItem.userId) === Number(adminUser.id) &&
          Number(userRoleItem.roleId) === Number(adminRole.id)
      )
    ) {
      await queryInterface.bulkInsert("user_roles", [
        {
          [userRoleUserColumn]: adminUser.id,
          [userRoleRoleColumn]: adminRole.id,
          ...timestamps(userRolesTable, now),
        },
      ]);
    }

    const existingRolePermissions = await queryInterface.sequelize.query(
      `SELECT ${rolePermissionRoleColumn} AS roleId, ${rolePermissionPermissionColumn} AS permissionId FROM role_permissions`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    if (adminRole) {
      const missingAdminRolePermissions = permissions
        .filter(
          (permission) =>
            !existingRolePermissions.some(
              (rolePermission) =>
                Number(rolePermission.roleId) === Number(adminRole.id) &&
                Number(rolePermission.permissionId) === Number(permission.id)
            )
        )
        .map((permission) => ({
          [rolePermissionRoleColumn]: adminRole.id,
          [rolePermissionPermissionColumn]: permission.id,
          ...timestamps(rolePermissionsTable, now),
        }));

      await ensureBulkInsert(
        queryInterface,
        "role_permissions",
        missingAdminRolePermissions
      );
    }

    const usersViewPermission = permissions.find(
      (permission) => permission.name === "Users-view"
    );

    if (
      userRole &&
      usersViewPermission &&
      !existingRolePermissions.some(
        (rolePermission) =>
          Number(rolePermission.roleId) === Number(userRole.id) &&
          Number(rolePermission.permissionId) === Number(usersViewPermission.id)
      )
    ) {
      await queryInterface.bulkInsert("role_permissions", [
        {
          [rolePermissionRoleColumn]: userRole.id,
          [rolePermissionPermissionColumn]: usersViewPermission.id,
          ...timestamps(rolePermissionsTable, now),
        },
      ]);
    }
  },

  async down(queryInterface, Sequelize) {
    const roles = await queryInterface.sequelize.query(
      "SELECT id, name FROM roles WHERE name IN ('Admin', 'User')",
      { type: Sequelize.QueryTypes.SELECT }
    );
    const permissions = await queryInterface.sequelize.query(
      "SELECT id, name FROM permissions WHERE name IN ('Categories-view','Categories-manage','Cities-view','Cities-manage','Customers-view','Customers-manage','Salons-view','Salons-manage','Services-view','Services-manage','SalonOwners-view','SalonOwners-manage','Role-view','Role-manage','Users-view','Users-manage','ContactUs-view','ContactUs-manage','FAQ-view','FAQ-manage')",
      { type: Sequelize.QueryTypes.SELECT }
    );

    const roleIds = roles.map((role) => role.id);
    const permissionIds = permissions.map((permission) => permission.id);

    if (roleIds.length > 0) {
      await queryInterface.bulkDelete("user_roles", { roleId: roleIds });
    }

    if (roleIds.length > 0 && permissionIds.length > 0) {
      await queryInterface.bulkDelete("role_permissions", {
        roleId: roleIds,
        permissionId: permissionIds,
      });
    }

    if (permissionIds.length > 0) {
      await queryInterface.bulkDelete("permissions", { id: permissionIds });
    }

    if (roleIds.length > 0) {
      await queryInterface.bulkDelete("roles", { id: roleIds });
    }

    await queryInterface.bulkDelete("users", {
      email: "admin@palsalon.com",
    });
  },
};
