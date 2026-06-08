import express from "express"

import authMiddleware from "../../middlewares/auth.middleware.js"
import { requirePermission } from "../../middlewares/permission.middleware.js"
import validateMiddleware from "../../middlewares/validate.middleware.js"
import {
  createUser,
  deleteUser,
  getUser,
  listUsers,
  updateUser,
} from "./user.controller.js"
import {
  createUserSchema,
  updateUserSchema,
  userIdParamSchema,
} from "./user.validation.js"

const router = express.Router()

router.get("/", authMiddleware, requirePermission("Users-view"), listUsers)
router.get(
  "/:id",
  authMiddleware,
  requirePermission("Users-view"),
  validateMiddleware(userIdParamSchema),
  getUser
)
router.post(
  "/",
  authMiddleware,
  requirePermission("Users-manage"),
  validateMiddleware(createUserSchema),
  createUser
)
router.patch(
  "/:id",
  authMiddleware,
  requirePermission("Users-manage"),
  validateMiddleware(updateUserSchema),
  updateUser
)
router.delete(
  "/:id",
  authMiddleware,
  requirePermission("Users-manage"),
  validateMiddleware(userIdParamSchema),
  deleteUser
)

export default router
