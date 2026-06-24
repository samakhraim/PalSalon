import express from "express"

import authMiddleware from "../../middlewares/auth.middleware.js"
import { requirePermission } from "../../middlewares/permission.middleware.js"
import validateMiddleware from "../../middlewares/validate.middleware.js"
import {
  createSalonOwner,
  deleteSalonOwner,
  getSalonOwner,
  listSalonOwners,
  updateSalonOwner,
} from "./salonOwner.controller.js"
import {
  createSalonOwnerSchema,
  salonOwnerIdSchema,
  updateSalonOwnerSchema,
} from "./salonOwner.validation.js"

const router = express.Router()

router.get("/", authMiddleware, requirePermission("SalonOwners-view"), listSalonOwners)
router.get(
  "/:id",
  authMiddleware,
  requirePermission("SalonOwners-view"),
  validateMiddleware(salonOwnerIdSchema),
  getSalonOwner
)
router.post(
  "/",
  authMiddleware,
  requirePermission("SalonOwners-manage"),
  validateMiddleware(createSalonOwnerSchema),
  createSalonOwner
)
router.put(
  "/:id",
  authMiddleware,
  requirePermission("SalonOwners-manage"),
  validateMiddleware(updateSalonOwnerSchema),
  updateSalonOwner
)
router.delete(
  "/:id",
  authMiddleware,
  requirePermission("SalonOwners-manage"),
  validateMiddleware(salonOwnerIdSchema),
  deleteSalonOwner
)

export default router
