import express from "express"

import authRoutes from "../modules/auth/auth.routes.js"
import cityRoutes from "../modules/cities/city.routes.js"
import mediaRoutes from "../modules/media/media.routes.js"
import permissionRoutes from "../modules/permissions/permission.routes.js"
import roleRoutes from "../modules/roles/role.routes.js"
import userRoutes from "../modules/users/user.routes.js"

const router = express.Router()

router.use("/auth", authRoutes)
router.use("/cities", cityRoutes)
router.use("/users", userRoutes)
router.use("/roles", roleRoutes)
router.use("/permissions", permissionRoutes)
router.use("/media", mediaRoutes)

export default router
