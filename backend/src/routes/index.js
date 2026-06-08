import express from "express"

import authRoutes from "../modules/auth/auth.routes.js"
import permissionRoutes from "../modules/permissions/permission.routes.js"
import roleRoutes from "../modules/roles/role.routes.js"
import userRoutes from "../modules/users/user.routes.js"

const router = express.Router()

router.use("/auth", authRoutes)
router.use("/users", userRoutes)
router.use("/roles", roleRoutes)
router.use("/permissions", permissionRoutes)

export default router
