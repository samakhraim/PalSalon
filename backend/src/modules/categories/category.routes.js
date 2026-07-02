import express from "express"

import authMiddleware from "../../middlewares/auth.middleware.js"
import { requirePermission } from "../../middlewares/permission.middleware.js"
import validateMiddleware from "../../middlewares/validate.middleware.js"
import {
  createCategory,
  deleteCategory,
  getCategory,
  listCategories,
  updateCategory,
} from "./category.controller.js"
import {
  categoryIdSchema,
  createCategorySchema,
  updateCategorySchema,
} from "./category.validation.js"

const router = express.Router()

router.get("/", authMiddleware, requirePermission("Categories-view"), listCategories)
router.get(
  "/:id",
  authMiddleware,
  requirePermission("Categories-view"),
  validateMiddleware(categoryIdSchema),
  getCategory
)
router.post(
  "/",
  authMiddleware,
  requirePermission("Categories-manage"),
  validateMiddleware(createCategorySchema),
  createCategory
)
router.put(
  "/:id",
  authMiddleware,
  requirePermission("Categories-manage"),
  validateMiddleware(updateCategorySchema),
  updateCategory
)
router.delete(
  "/:id",
  authMiddleware,
  requirePermission("Categories-manage"),
  validateMiddleware(categoryIdSchema),
  deleteCategory
)

export default router
