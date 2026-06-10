import { promises as fsPromises } from "node:fs"
import path from "node:path"

import sharp from "sharp"

import { Media } from "../../models/index.js"
import {
  MAX_DOCUMENT_SIZE_BYTES,
  MAX_IMAGE_SIZE_BYTES,
  createHttpError,
  deletePhysicalFile,
  ensureUploadFolders,
  getAbsoluteUploadPath,
  getFirstMedia as getFirstMediaRecord,
  getFirstMediaUrl as getFirstMediaUrlFromHelper,
  getUploadDirectoryName,
  isImageMimeType,
  normalizeCollectionName,
  normalizeModelType,
  toRelativeUploadPath,
  toUploadUrl,
} from "./media.helper.js"

const IMAGE_WEBP_QUALITY = 85
const THUMBNAIL_SIZE = 300

const toMediaResponse = (media) => ({
  id: media.id,
  modelType: media.modelType,
  modelId: media.modelId,
  collectionName: media.collectionName,
  fileName: media.fileName,
  originalName: media.originalName,
  mimeType: media.mimeType,
  size: media.size,
  disk: media.disk,
  path: media.path,
  url: media.url,
  conversions: media.conversions,
  createdAt: media.createdAt,
  updatedAt: media.updatedAt,
})

const sanitizeFileNameSegment = (value, fallback) => {
  const normalizedValue = value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")

  return normalizedValue || fallback
}

const generateSafeBaseName = (collectionName) =>
  `${sanitizeFileNameSegment(collectionName, "file")}-${Date.now()}-${Math.round(
    Math.random() * 1e9
  )}`

const validateFile = (file) => {
  if (!file) {
    throw createHttpError("File is required", 400)
  }

  if (isImageMimeType(file.mimetype) && file.size > MAX_IMAGE_SIZE_BYTES) {
    throw createHttpError("Image files must be 5MB or smaller", 400)
  }

  if (!isImageMimeType(file.mimetype) && file.size > MAX_DOCUMENT_SIZE_BYTES) {
    throw createHttpError("Document files must be 10MB or smaller", 400)
  }
}

const buildStorageContext = async (modelType, collectionName) => {
  await ensureUploadFolders()

  const uploadDirectory = getUploadDirectoryName(modelType)
  const directoryPath = getAbsoluteUploadPath(uploadDirectory)
  const conversionsPath = path.join(directoryPath, "conversions")

  await fsPromises.mkdir(directoryPath, { recursive: true })
  await fsPromises.mkdir(conversionsPath, { recursive: true })

  const baseName = generateSafeBaseName(collectionName)

  return {
    uploadDirectory,
    directoryPath,
    conversionsPath,
    baseName,
  }
}

const saveImageMedia = async ({ file, modelType, modelId, collectionName }) => {
  const { uploadDirectory, directoryPath, conversionsPath, baseName } =
    await buildStorageContext(modelType, collectionName)

  const fileName = `${baseName}.webp`
  const thumbnailFileName = `${baseName}-thumb.webp`
  const fileBuffer = await sharp(file.buffer).rotate().webp({ quality: IMAGE_WEBP_QUALITY }).toBuffer()
  const thumbnailBuffer = await sharp(file.buffer)
    .rotate()
    .resize(THUMBNAIL_SIZE, THUMBNAIL_SIZE, {
      fit: "cover",
      position: "center",
    })
    .webp({ quality: IMAGE_WEBP_QUALITY })
    .toBuffer()

  await fsPromises.writeFile(path.join(directoryPath, fileName), fileBuffer)
  await fsPromises.writeFile(path.join(conversionsPath, thumbnailFileName), thumbnailBuffer)

  const relativeFilePath = toRelativeUploadPath(uploadDirectory, fileName)
  const relativeThumbnailPath = toRelativeUploadPath(
    uploadDirectory,
    "conversions",
    thumbnailFileName
  )

  const media = await Media.create({
    modelType,
    modelId,
    collectionName,
    fileName,
    originalName: file.originalname,
    mimeType: "image/webp",
    size: fileBuffer.length,
    disk: "local",
    path: relativeFilePath,
    url: toUploadUrl(uploadDirectory, fileName),
    conversions: {
      thumbnail: toUploadUrl(uploadDirectory, "conversions", thumbnailFileName),
      thumbnailPath: relativeThumbnailPath,
    },
  })

  return media
}

const saveDocumentMedia = async ({ file, modelType, modelId, collectionName }) => {
  const { uploadDirectory, directoryPath, baseName } = await buildStorageContext(
    modelType,
    collectionName
  )
  const extension = path.extname(file.originalname || "").toLowerCase()
  const fileName = `${baseName}${extension}`

  await fsPromises.writeFile(path.join(directoryPath, fileName), file.buffer)

  const relativeFilePath = toRelativeUploadPath(uploadDirectory, fileName)
  const media = await Media.create({
    modelType,
    modelId,
    collectionName,
    fileName,
    originalName: file.originalname,
    mimeType: file.mimetype,
    size: file.size,
    disk: "local",
    path: relativeFilePath,
    url: toUploadUrl(uploadDirectory, fileName),
    conversions: null,
  })

  return media
}

const persistUploadedFile = async ({ file, modelType, modelId, collectionName }) => {
  validateFile(file)

  if (isImageMimeType(file.mimetype)) {
    return saveImageMedia({ file, modelType, modelId, collectionName })
  }

  return saveDocumentMedia({ file, modelType, modelId, collectionName })
}

const removeMediaRecord = async (media) => {
  if (!media) {
    return
  }

  await deletePhysicalFile(media.path)

  if (media.conversions) {
    const conversionPaths = Object.entries(media.conversions)
      .filter(([key, value]) => key.toLowerCase().endsWith("path") && typeof value === "string")
      .map(([, value]) => value)

    if (conversionPaths.length === 0 && typeof media.conversions.thumbnail === "string") {
      const thumbnailRelativePath = media.conversions.thumbnail.replace(/^\/+/, "")
      conversionPaths.push(thumbnailRelativePath)
    }

    await Promise.all(conversionPaths.map(deletePhysicalFile))
  }

  await media.destroy()
}

const normalizeMediaScope = ({ modelType, modelId, collectionName }) => ({
  modelType: normalizeModelType(modelType),
  modelId: Number(modelId),
  collectionName: normalizeCollectionName(collectionName),
})

const uploadSingleMedia = async ({ file, modelType, modelId, collectionName }) => {
  const scope = normalizeMediaScope({ modelType, modelId, collectionName })
  const media = await persistUploadedFile({ file, ...scope })
  return toMediaResponse(media)
}

const uploadMultipleMedia = async ({ files, modelType, modelId, collectionName }) => {
  if (!Array.isArray(files) || files.length === 0) {
    throw createHttpError("At least one file is required", 400)
  }

  const scope = normalizeMediaScope({ modelType, modelId, collectionName })
  const mediaRecords = []

  for (const file of files) {
    const media = await persistUploadedFile({ file, ...scope })
    mediaRecords.push(toMediaResponse(media))
  }

  return mediaRecords
}

const replaceSingleMedia = async ({ file, modelType, modelId, collectionName }) => {
  const scope = normalizeMediaScope({ modelType, modelId, collectionName })
  const existingMedia = await Media.findAll({
    where: scope,
    order: [["id", "ASC"]],
  })

  for (const media of existingMedia) {
    await removeMediaRecord(media)
  }

  return uploadSingleMedia({ file, ...scope })
}

const getMedia = async ({ modelType, modelId, collectionName }) => {
  const where = {
    modelType: normalizeModelType(modelType),
    modelId: Number(modelId),
  }

  if (collectionName !== undefined) {
    where.collectionName = normalizeCollectionName(collectionName)
  }

  const media = await Media.findAll({
    where,
    order: [["id", "ASC"]],
  })

  return media.map(toMediaResponse)
}

const deleteMedia = async (mediaId) => {
  const media = await Media.findByPk(mediaId)

  if (!media) {
    throw createHttpError("Media not found", 404)
  }

  const response = toMediaResponse(media)
  await removeMediaRecord(media)

  return response
}

const getFirstMediaUrl = async ({ modelType, modelId, collectionName }) =>
  getFirstMediaUrlFromHelper(
    normalizeModelType(modelType),
    Number(modelId),
    normalizeCollectionName(collectionName)
  )

const getFirstMedia = async ({ modelType, modelId, collectionName }) => {
  const media = await getFirstMediaRecord(
    normalizeModelType(modelType),
    Number(modelId),
    normalizeCollectionName(collectionName)
  )

  return media ? toMediaResponse(media) : null
}

export default {
  deleteMedia,
  getFirstMedia,
  getFirstMediaUrl,
  getMedia,
  replaceSingleMedia,
  uploadMultipleMedia,
  uploadSingleMedia,
}
