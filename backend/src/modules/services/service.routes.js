import express from "express"

import authMiddleware from "../../middlewares/auth.middleware.js"
import { requirePermission } from "../../middlewares/permission.middleware.js"
import validateMiddleware from "../../middlewares/validate.middleware.js"
import { uploadMiddleware } from "../media/media.helper.js"
import {
  createService,
  deleteService,
  getService,
  listServices,
  updateService,
} from "./service.controller.js"
import {
  createServiceSchema,
  serviceIdSchema,
  updateServiceSchema,
} from "./service.validation.js"

const router = express.Router()

const uploadServiceFiles = uploadMiddleware.fields([
  { name: "main_image", maxCount: 1 },
  { name: "main_image[]", maxCount: 1 },
  { name: "gallery", maxCount: 10 },
  { name: "gallery[]", maxCount: 10 },
])

router.get("/", authMiddleware, requirePermission("Services-view"), listServices)
router.get(
  "/:id",
  authMiddleware,
  requirePermission("Services-view"),
  validateMiddleware(serviceIdSchema),
  getService
)
router.post(
  "/",
  authMiddleware,
  requirePermission("Services-manage"),
  uploadServiceFiles,
  validateMiddleware(createServiceSchema),
  createService
)
router.put(
  "/:id",
  authMiddleware,
  requirePermission("Services-manage"),
  uploadServiceFiles,
  validateMiddleware(updateServiceSchema),
  updateService
)
router.delete(
  "/:id",
  authMiddleware,
  requirePermission("Services-manage"),
  validateMiddleware(serviceIdSchema),
  deleteService
)

export default router
