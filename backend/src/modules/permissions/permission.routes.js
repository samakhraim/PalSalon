import express from "express"

import authMiddleware from "../../middlewares/auth.middleware.js"
import { requirePermission } from "../../middlewares/permission.middleware.js"
import validateMiddleware from "../../middlewares/validate.middleware.js"
import {
  createPermission,
  deletePermission,
  listPermissions,
  updatePermission,
} from "./permission.controller.js"
import {
  createPermissionSchema,
  permissionIdParamSchema,
  updatePermissionSchema,
} from "./permission.validation.js"

const router = express.Router()

router.get("/", authMiddleware, requirePermission("Role-view"), listPermissions)
router.post(
  "/",
  authMiddleware,
  requirePermission("Role-manage"),
  validateMiddleware(createPermissionSchema),
  createPermission
)
router.patch(
  "/:id",
  authMiddleware,
  requirePermission("Role-manage"),
  validateMiddleware(updatePermissionSchema),
  updatePermission
)
router.delete(
  "/:id",
  authMiddleware,
  requirePermission("Role-manage"),
  validateMiddleware(permissionIdParamSchema),
  deletePermission
)

export default router
