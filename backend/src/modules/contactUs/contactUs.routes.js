import express from "express"

import authMiddleware from "../../middlewares/auth.middleware.js"
import { requirePermission } from "../../middlewares/permission.middleware.js"
import validateMiddleware from "../../middlewares/validate.middleware.js"
import {
  createContactMessage,
  deleteContactMessage,
  getContactMessage,
  listContactMessages,
  markContactMessageRead,
  markContactMessageUnread,
} from "./contactUs.controller.js"
import {
  contactUsIdSchema,
  createContactUsSchema,
} from "./contactUs.validation.js"

const router = express.Router()

router.post("/", validateMiddleware(createContactUsSchema), createContactMessage)

router.get(
  "/",
  authMiddleware,
  requirePermission("ContactUs-view"),
  listContactMessages
)
router.get(
  "/:id",
  authMiddleware,
  requirePermission("ContactUs-view"),
  validateMiddleware(contactUsIdSchema),
  getContactMessage
)
router.patch(
  "/:id/read",
  authMiddleware,
  requirePermission("ContactUs-manage"),
  validateMiddleware(contactUsIdSchema),
  markContactMessageRead
)
router.patch(
  "/:id/unread",
  authMiddleware,
  requirePermission("ContactUs-manage"),
  validateMiddleware(contactUsIdSchema),
  markContactMessageUnread
)
router.delete(
  "/:id",
  authMiddleware,
  requirePermission("ContactUs-manage"),
  validateMiddleware(contactUsIdSchema),
  deleteContactMessage
)

export default router
