import fs from "node:fs"
import { promises as fsPromises } from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

import multer from "multer"

import { Media } from "../../models/index.js"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
export const BACKEND_ROOT = path.resolve(__dirname, "../../../")
export const UPLOADS_ROOT = path.join(BACKEND_ROOT, "uploads")

const DEFAULT_IMAGE_URL = "/uploads/defaults/default-image.png"
const DEFAULT_IMAGE_FILES = {
  avatar: "default-avatar.png",
  logo: "default-logo.png",
  cover: "default-cover.png",
}

const MODEL_UPLOAD_DIRECTORIES = {
  customer: "customers",
  user: "users",
  salon: "salons",
  service: "services",
}

const allowedMimeTypes = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-excel",
])

const allowedExtensions = new Set([
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",
  ".pdf",
  ".doc",
  ".docx",
  ".xlsx",
])

export const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024
export const MAX_DOCUMENT_SIZE_BYTES = 10 * 1024 * 1024

export const isImageMimeType = (mimeType = "") => mimeType.startsWith("image/")

export const createHttpError = (message, statusCode, errors) => {
  const error = new Error(message)
  error.statusCode = statusCode

  if (errors) {
    error.errors = errors
  }

  return error
}

export const normalizeModelType = (modelType = "") => modelType.trim()

export const normalizeCollectionName = (collectionName = "") => collectionName.trim()

export const getUploadDirectoryName = (modelType = "") =>
  MODEL_UPLOAD_DIRECTORIES[modelType.trim().toLowerCase()] || "media"

export const toRelativeUploadPath = (...segments) =>
  path.posix.join("uploads", ...segments)

export const toUploadUrl = (...segments) => `/${toRelativeUploadPath(...segments)}`

export const getAbsoluteUploadPath = (...segments) => path.join(UPLOADS_ROOT, ...segments)

export const ensureUploadFolders = async () => {
  const folders = [
    UPLOADS_ROOT,
    getAbsoluteUploadPath("defaults"),
    getAbsoluteUploadPath("media"),
    getAbsoluteUploadPath("customers"),
    getAbsoluteUploadPath("users"),
    getAbsoluteUploadPath("salons"),
    getAbsoluteUploadPath("services"),
  ]

  await Promise.all(
    folders.map((folderPath) => fsPromises.mkdir(folderPath, { recursive: true }))
  )
}

export const getDefaultImageUrl = (collectionName = "") => {
  const normalizedCollectionName = collectionName.trim().toLowerCase()
  const defaultFileName = DEFAULT_IMAGE_FILES[normalizedCollectionName]

  if (defaultFileName) {
    const absolutePath = getAbsoluteUploadPath("defaults", defaultFileName)

    if (fs.existsSync(absolutePath)) {
      return toUploadUrl("defaults", defaultFileName)
    }
  }

  return DEFAULT_IMAGE_URL
}

export const getMediaUrl = (media, collectionName = "") =>
  media?.url || getDefaultImageUrl(collectionName)

export const getFirstMedia = async (modelType, modelId, collectionName) =>
  Media.findOne({
    where: {
      modelType: normalizeModelType(modelType),
      modelId,
      collectionName: normalizeCollectionName(collectionName),
    },
    order: [["id", "ASC"]],
  })

export const getFirstMediaUrl = async (modelType, modelId, collectionName) => {
  const media = await getFirstMedia(modelType, modelId, collectionName)
  return getMediaUrl(media, collectionName)
}

export const deletePhysicalFile = async (filePath) => {
  if (!filePath) {
    return
  }

  const normalizedPath = filePath.replace(/^[/\\]+/, "")
  const absolutePath = path.isAbsolute(filePath)
    ? filePath
    : path.join(BACKEND_ROOT, normalizedPath.replace(/\//g, path.sep))

  try {
    await fsPromises.unlink(absolutePath)
  } catch (error) {
    if (error.code !== "ENOENT") {
      throw error
    }
  }
}

const fileFilter = (req, file, callback) => {
  const extension = path.extname(file.originalname || "").toLowerCase()

  if (!allowedMimeTypes.has(file.mimetype) || !allowedExtensions.has(extension)) {
    return callback(
      createHttpError(
        "Unsupported file type. Allowed: jpg, jpeg, png, webp, pdf, doc, docx, xlsx",
        400
      )
    )
  }

  return callback(null, true)
}

export const uploadMiddleware = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: MAX_DOCUMENT_SIZE_BYTES,
    files: 10,
  },
  fileFilter,
})

export const uploadSingleFile = uploadMiddleware.single("file")

export const uploadMultipleFiles = uploadMiddleware.fields([
  { name: "files", maxCount: 10 },
  { name: "files[]", maxCount: 10 },
])

export const extractUploadedFiles = (req) => {
  if (Array.isArray(req.files)) {
    return req.files
  }

  if (req.files && typeof req.files === "object") {
    return [...(req.files.files || []), ...(req.files["files[]"] || [])]
  }

  return []
}
