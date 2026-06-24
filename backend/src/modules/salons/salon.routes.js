import express from "express"

import authMiddleware from "../../middlewares/auth.middleware.js"
import { requirePermission } from "../../middlewares/permission.middleware.js"
import validateMiddleware from "../../middlewares/validate.middleware.js"
import {
  createSalon,
  deleteSalon,
  getSalon,
  incrementSalonClick,
  listSalons,
  updateSalon,
} from "./salon.controller.js"
import {
  createSalonSchema,
  salonIdSchema,
  updateSalonSchema,
} from "./salon.validation.js"

const router = express.Router()

router.get("/", authMiddleware, requirePermission("Salons-view"), listSalons)
router.get(
  "/:id",
  authMiddleware,
  requirePermission("Salons-view"),
  validateMiddleware(salonIdSchema),
  getSalon
)
router.post(
  "/",
  authMiddleware,
  requirePermission("Salons-manage"),
  validateMiddleware(createSalonSchema),
  createSalon
)
router.put(
  "/:id",
  authMiddleware,
  requirePermission("Salons-manage"),
  validateMiddleware(updateSalonSchema),
  updateSalon
)
router.delete(
  "/:id",
  authMiddleware,
  requirePermission("Salons-manage"),
  validateMiddleware(salonIdSchema),
  deleteSalon
)
router.patch("/:id/click", validateMiddleware(salonIdSchema), incrementSalonClick)

export default router
