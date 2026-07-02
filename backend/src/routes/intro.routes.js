import express from "express"

import {
  createIntro,
  deleteIntro,
  getIntro,
  listIntros,
  updateIntro,
} from "../controllers/intro.controller.js"
import authMiddleware from "../middlewares/auth.middleware.js"
import { requirePermission } from "../middlewares/permission.middleware.js"
import validateMiddleware from "../middlewares/validate.middleware.js"
import { uploadMiddleware } from "../modules/media/media.helper.js"
import {
  createIntroSchema,
  introIdSchema,
  updateIntroSchema,
} from "../modules/intros/intro.validation.js"

const router = express.Router()

const uploadIntroFiles = uploadMiddleware.fields([
  { name: "main_image", maxCount: 1 },
  { name: "main_image[]", maxCount: 1 },
])

router.get("/", authMiddleware, requirePermission("Intros-view"), listIntros)
router.get(
  "/:id",
  authMiddleware,
  requirePermission("Intros-view"),
  validateMiddleware(introIdSchema),
  getIntro
)
router.post(
  "/",
  authMiddleware,
  requirePermission("Intros-manage"),
  uploadIntroFiles,
  validateMiddleware(createIntroSchema),
  createIntro
)
router.put(
  "/:id",
  authMiddleware,
  requirePermission("Intros-manage"),
  uploadIntroFiles,
  validateMiddleware(updateIntroSchema),
  updateIntro
)
router.delete(
  "/:id",
  authMiddleware,
  requirePermission("Intros-manage"),
  validateMiddleware(introIdSchema),
  deleteIntro
)

export default router
