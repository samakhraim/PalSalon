import express from "express"

import authMiddleware from "../../middlewares/auth.middleware.js"
import { requirePermission } from "../../middlewares/permission.middleware.js"
import validateMiddleware from "../../middlewares/validate.middleware.js"
import {
  createCity,
  deleteCity,
  getCity,
  listCities,
  toggleCityStatus,
  updateCity,
} from "./city.controller.js"
import {
  cityIdSchema,
  createCitySchema,
  updateCitySchema,
} from "./city.validation.js"

const router = express.Router()

router.get("/", authMiddleware, requirePermission("Cities-view"), listCities)
router.get(
  "/:id",
  authMiddleware,
  requirePermission("Cities-view"),
  validateMiddleware(cityIdSchema),
  getCity
)
router.post(
  "/",
  authMiddleware,
  requirePermission("Cities-manage"),
  validateMiddleware(createCitySchema),
  createCity
)
router.patch(
  "/:id",
  authMiddleware,
  requirePermission("Cities-manage"),
  validateMiddleware(updateCitySchema),
  updateCity
)
router.delete(
  "/:id",
  authMiddleware,
  requirePermission("Cities-manage"),
  validateMiddleware(cityIdSchema),
  deleteCity
)
router.patch(
  "/:id/toggle-status",
  authMiddleware,
  requirePermission("Cities-manage"),
  validateMiddleware(cityIdSchema),
  toggleCityStatus
)

export default router
