import express from "express"

import authMiddleware from "../../middlewares/auth.middleware.js"
import { requirePermission } from "../../middlewares/permission.middleware.js"
import validateMiddleware from "../../middlewares/validate.middleware.js"
import {
  createCustomer,
  deleteCustomer,
  getCustomer,
  listCustomers,
  toggleCustomerStatus,
  updateCustomer,
} from "./customer.controller.js"
import {
  createCustomerSchema,
  customerIdSchema,
  updateCustomerSchema,
} from "./customer.validation.js"

const router = express.Router()

router.get("/", authMiddleware, requirePermission("Customers-view"), listCustomers)
router.get(
  "/:id",
  authMiddleware,
  requirePermission("Customers-view"),
  validateMiddleware(customerIdSchema),
  getCustomer
)
router.post(
  "/",
  authMiddleware,
  requirePermission("Customers-manage"),
  validateMiddleware(createCustomerSchema),
  createCustomer
)
router.put(
  "/:id",
  authMiddleware,
  requirePermission("Customers-manage"),
  validateMiddleware(updateCustomerSchema),
  updateCustomer
)
router.delete(
  "/:id",
  authMiddleware,
  requirePermission("Customers-manage"),
  validateMiddleware(customerIdSchema),
  deleteCustomer
)
router.patch(
  "/:id/toggle-status",
  authMiddleware,
  requirePermission("Customers-manage"),
  validateMiddleware(customerIdSchema),
  toggleCustomerStatus
)

export default router
