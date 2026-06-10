import express from "express"

import authMiddleware from "../../middlewares/auth.middleware.js"
import validateMiddleware from "../../middlewares/validate.middleware.js"
import {
  deleteMedia,
  getMedia,
  replaceSingleMedia,
  uploadMultipleMedia,
  uploadSingleMedia,
} from "./media.controller.js"
import {
  uploadMultipleFiles,
  uploadSingleFile,
} from "./media.helper.js"
import {
  getMediaSchema,
  mediaIdParamSchema,
  uploadMediaSchema,
} from "./media.validation.js"

const router = express.Router()

router.post(
  "/upload",
  authMiddleware,
  uploadSingleFile,
  validateMiddleware(uploadMediaSchema),
  uploadSingleMedia
)

router.post(
  "/upload-multiple",
  authMiddleware,
  uploadMultipleFiles,
  validateMiddleware(uploadMediaSchema),
  uploadMultipleMedia
)

router.post(
  "/replace",
  authMiddleware,
  uploadSingleFile,
  validateMiddleware(uploadMediaSchema),
  replaceSingleMedia
)

router.get("/", authMiddleware, validateMiddleware(getMediaSchema), getMedia)
router.delete(
  "/:id",
  authMiddleware,
  validateMiddleware(mediaIdParamSchema),
  deleteMedia
)

export default router
