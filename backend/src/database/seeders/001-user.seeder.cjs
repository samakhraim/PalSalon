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

    await queryInterface.bulkDelete("role_permissions", null, {});
    await queryInterface.bulkDelete("user_roles", null, {});
    await queryInterface.bulkDelete("permissions", null, {});
    await queryInterface.bulkDelete("roles", null, {});
    await queryInterface.bulkDelete("users", {
      email: "admin@palsalon.com",
    });

    const hashedPassword = await bcrypt.hash("password", 10);

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

    await queryInterface.bulkInsert("roles", [
      {
        name: "Admin",
        [roleGuardColumn]: "api",
        ...timestamps(rolesTable, now),
      },
      {
        name: "User",
        [roleGuardColumn]: "api",
        ...timestamps(rolesTable, now),
      },
    ]);

    await queryInterface.bulkInsert("permissions", [
      {
        name: "Cities-view",
        [permissionGuardColumn]: "api",
        ...timestamps(permissionsTable, now),
      },
      {
        name: "Cities-manage",
        [permissionGuardColumn]: "api",
        ...timestamps(permissionsTable, now),
      },
      {
        name: "Role-view",
        [permissionGuardColumn]: "api",
        ...timestamps(permissionsTable, now),
      },
      {
        name: "Role-manage",
        [permissionGuardColumn]: "api",
        ...timestamps(permissionsTable, now),
      },
      {
        name: "Users-view",
        [permissionGuardColumn]: "api",
        ...timestamps(permissionsTable, now),
      },
      {
        name: "Users-manage",
        [permissionGuardColumn]: "api",
        ...timestamps(permissionsTable, now),
      },
    ]);

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

    if (adminUser && adminRole) {
      await queryInterface.bulkInsert("user_roles", [
        {
          [userRoleUserColumn]: adminUser.id,
          [userRoleRoleColumn]: adminRole.id,
          ...timestamps(userRolesTable, now),
        },
      ]);
    }

    if (adminRole) {
      await queryInterface.bulkInsert(
        "role_permissions",
        permissions.map((permission) => ({
          [rolePermissionRoleColumn]: adminRole.id,
          [rolePermissionPermissionColumn]: permission.id,
          ...timestamps(rolePermissionsTable, now),
        }))
      );
    }

    const usersViewPermission = permissions.find(
      (permission) => permission.name === "Users-view"
    );

    if (userRole && usersViewPermission) {
      await queryInterface.bulkInsert("role_permissions", [
        {
          [rolePermissionRoleColumn]: userRole.id,
          [rolePermissionPermissionColumn]: usersViewPermission.id,
          ...timestamps(rolePermissionsTable, now),
        },
      ]);
    }
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("role_permissions", null, {});
    await queryInterface.bulkDelete("user_roles", null, {});
    await queryInterface.bulkDelete("permissions", null, {});
    await queryInterface.bulkDelete("roles", null, {});
    await queryInterface.bulkDelete("users", {
      email: "admin@palsalon.com",
    });
  },
};