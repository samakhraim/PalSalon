import express from "express"

import {
  createPage,
  deletePage,
  getPage,
  listPages,
  updatePage,
} from "../controllers/page.controller.js"
import authMiddleware from "../middlewares/auth.middleware.js"
import { requirePermission } from "../middlewares/permission.middleware.js"
import validateMiddleware from "../middlewares/validate.middleware.js"
import { uploadMiddleware } from "../modules/media/media.helper.js"
import {
  createPageSchema,
  pageIdSchema,
  updatePageSchema,
} from "../modules/pages/page.validation.js"

const router = express.Router()

const uploadPageFiles = uploadMiddleware.fields([
  { name: "main_image", maxCount: 1 },
  { name: "main_image[]", maxCount: 1 },
])

router.get("/", authMiddleware, requirePermission("Pages-view"), listPages)
router.get(
  "/:id",
  authMiddleware,
  requirePermission("Pages-view"),
  validateMiddleware(pageIdSchema),
  getPage
)
router.post(
  "/",
  authMiddleware,
  requirePermission("Pages-manage"),
  uploadPageFiles,
  validateMiddleware(createPageSchema),
  createPage
)
router.put(
  "/:id",
  authMiddleware,
  requirePermission("Pages-manage"),
  uploadPageFiles,
  validateMiddleware(updatePageSchema),
  updatePage
)
router.delete(
  "/:id",
  authMiddleware,
  requirePermission("Pages-manage"),
  validateMiddleware(pageIdSchema),
  deletePage
)

export default router
