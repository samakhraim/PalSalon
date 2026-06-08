import { pathToFileURL } from "node:url"

import { connectDb, sequelize } from "../../config/db.js"
import { Permission, Role, User } from "../../models/index.js"
import { hashPassword } from "../../utils/hashPassword.js"

const MINIMUM_PERMISSIONS = [
  "Role-view",
  "Role-manage",
  "Users-view",
  "Users-manage",
]

export const seedBasicRbac = async () => {
  await connectDb()

  await sequelize.transaction(async (transaction) => {
    for (const permissionName of MINIMUM_PERMISSIONS) {
      await Permission.findOrCreate({
        where: { name: permissionName },
        defaults: {
          guardName: "api",
        },
        transaction,
      })
    }

    const [adminRole] = await Role.findOrCreate({
      where: { name: "Admin" },
      defaults: {
        guardName: "api",
      },
      transaction,
    })

    const [userRole] = await Role.findOrCreate({
      where: { name: "User" },
      defaults: {
        guardName: "api",
      },
      transaction,
    })

    const allPermissions = await Permission.findAll({ transaction })
    await adminRole.setPermissions(allPermissions, { transaction })

    const usersViewPermission = allPermissions.find(
      (permission) => permission.name === "Users-view"
    )
    await userRole.setPermissions(usersViewPermission ? [usersViewPermission] : [], {
      transaction,
    })

    const [adminUser] = await User.scope("withPassword").findOrCreate({
      where: { email: "admin@palsalon.com" },
      defaults: {
        name: "Admin",
        email: "admin@palsalon.com",
        password: await hashPassword("password"),
        phoneCountryCode: null,
        phoneNumber: null,
        role: "admin",
      },
      transaction,
    })

    if (!adminUser.password || adminUser.password === "password") {
      adminUser.password = await hashPassword("password")
      adminUser.role = "admin"
      await adminUser.save({ transaction })
    }

    await adminUser.setRoles([adminRole], { transaction })
  })
}

const isDirectRun =
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href

if (isDirectRun) {
  seedBasicRbac()
    .then(() => {
      console.log("RBAC seed completed successfully")
      process.exit(0)
    })
    .catch((error) => {
      console.error("RBAC seed failed:", error.message)
      process.exit(1)
    })
}
