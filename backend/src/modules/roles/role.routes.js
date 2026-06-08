import express from "express"

import authMiddleware from "../../middlewares/auth.middleware.js"
import { requirePermission } from "../../middlewares/permission.middleware.js"
import validateMiddleware from "../../middlewares/validate.middleware.js"
import {
  createRole,
  deleteRole,
  getRole,
  listRoles,
  updateRole,
} from "./role.controller.js"
import {
  createRoleSchema,
  roleIdParamSchema,
  updateRoleSchema,
} from "./role.validation.js"

const router = express.Router()

router.get("/", authMiddleware, requirePermission("Role-view"), listRoles)
router.get(
  "/:id",
  authMiddleware,
  requirePermission("Role-view"),
  validateMiddleware(roleIdParamSchema),
  getRole
)
router.post(
  "/",
  authMiddleware,
  requirePermission("Role-manage"),
  validateMiddleware(createRoleSchema),
  createRole
)
router.patch(
  "/:id",
  authMiddleware,
  requirePermission("Role-manage"),
  validateMiddleware(updateRoleSchema),
  updateRole
)
router.delete(
  "/:id",
  authMiddleware,
  requirePermission("Role-manage"),
  validateMiddleware(roleIdParamSchema),
  deleteRole
)

export default router
