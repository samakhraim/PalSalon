import express from "express"

import {
  getProfile,
  updatePassword,
  updateProfile,
} from "../controllers/profile.controller.js"
import authMiddleware from "../middlewares/auth.middleware.js"
import validateMiddleware from "../middlewares/validate.middleware.js"
import {
  updatePasswordSchema,
  updateProfileSchema,
} from "../modules/profile/profile.validation.js"

const router = express.Router()

router.get("/", authMiddleware, getProfile)
router.put("/", authMiddleware, validateMiddleware(updateProfileSchema), updateProfile)
router.put(
  "/password",
  authMiddleware,
  validateMiddleware(updatePasswordSchema),
  updatePassword
)

export default router
