import express from "express"

import authMiddleware from "../../middlewares/auth.middleware.js"
import validateMiddleware from "../../middlewares/validate.middleware.js"
import { login, logout, me, register } from "./auth.controller.js"
import { loginSchema, registerSchema } from "./auth.validation.js"

const router = express.Router()

router.post("/register", validateMiddleware(registerSchema), register)
router.post("/login", validateMiddleware(loginSchema), login)
router.get("/me", authMiddleware, me)
router.post("/logout", logout)

export default router
