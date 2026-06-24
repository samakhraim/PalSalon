import express from "express"

import authMiddleware from "../../middlewares/auth.middleware.js"
import { requirePermission } from "../../middlewares/permission.middleware.js"
import validateMiddleware from "../../middlewares/validate.middleware.js"
import {
  createFaq,
  deleteFaq,
  getFaq,
  listFaqs,
  updateFaq,
} from "./faq.controller.js"
import {
  createFaqSchema,
  faqIdSchema,
  updateFaqSchema,
} from "./faq.validation.js"

const router = express.Router()

router.get("/", authMiddleware, requirePermission("FAQ-view"), listFaqs)
router.get(
  "/:id",
  authMiddleware,
  requirePermission("FAQ-view"),
  validateMiddleware(faqIdSchema),
  getFaq
)
router.post(
  "/",
  authMiddleware,
  requirePermission("FAQ-manage"),
  validateMiddleware(createFaqSchema),
  createFaq
)
router.put(
  "/:id",
  authMiddleware,
  requirePermission("FAQ-manage"),
  validateMiddleware(updateFaqSchema),
  updateFaq
)
router.delete(
  "/:id",
  authMiddleware,
  requirePermission("FAQ-manage"),
  validateMiddleware(faqIdSchema),
  deleteFaq
)

export default router
