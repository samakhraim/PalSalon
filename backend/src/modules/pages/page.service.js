import { Page } from "../../models/index.js"
import mediaService from "../media/media.service.js"

const MAIN_IMAGE_COLLECTION = "main_image"

const createHttpError = (message, statusCode) => {
  const error = new Error(message)
  error.statusCode = statusCode
  return error
}

const parseJsonValue = (value) => {
  if (value === undefined || value === null) {
    return null
  }

  if (typeof value === "string") {
    try {
      return JSON.parse(value)
    } catch {
      return null
    }
  }

  return typeof value === "object" ? value : null
}

const normalizeLocalizedObject = (value, { required = false } = {}) => {
  const parsedValue = parseJsonValue(value)

  if (!parsedValue) {
    return required ? { en: "", ar: "" } : null
  }

  const normalizedValue = {
    en: typeof parsedValue.en === "string" ? parsedValue.en : "",
    ar: typeof parsedValue.ar === "string" ? parsedValue.ar : "",
  }

  if (required) {
    return normalizedValue
  }

  return normalizedValue.en || normalizedValue.ar ? normalizedValue : null
}

const normalizeLocalizedRequired = (value, currentValue = null) => ({
  en: value.en?.trim() ?? currentValue?.en ?? "",
  ar: value.ar?.trim() ?? currentValue?.ar ?? "",
})

const normalizeOptionalString = (value) => {
  if (value === undefined) {
    return undefined
  }

  if (value === null) {
    return null
  }

  const trimmedValue = String(value).trim()
  return trimmedValue || null
}

const toPageResponse = async (page) => {
  const mainImage = await mediaService.getFirstMedia({
    modelType: "Page",
    modelId: page.id,
    collectionName: MAIN_IMAGE_COLLECTION,
  })

  return {
    id: page.id,
    title: normalizeLocalizedObject(page.title, { required: true }),
    slug: page.slug,
    description: normalizeLocalizedObject(page.description, { required: true }),
    status: Boolean(page.status),
    mainImage,
    imageUrl: mainImage?.url || null,
    created_at: page.created_at,
    updated_at: page.updated_at,
  }
}

const getPageInstanceById = async (pageId) => {
  const page = await Page.findByPk(pageId)

  if (!page) {
    throw createHttpError("Page not found", 404)
  }

  return page
}

const replacePageMainImage = async (pageId, mainImageFile) => {
  if (!mainImageFile) {
    return
  }

  await mediaService.replaceSingleMedia({
    file: mainImageFile,
    modelType: "Page",
    modelId: pageId,
    collectionName: MAIN_IMAGE_COLLECTION,
  })
}

const clearPageMedia = async (pageId) => {
  const media = await mediaService.getMedia({
    modelType: "Page",
    modelId: pageId,
  })

  await Promise.all(media.map((item) => mediaService.deleteMedia(item.id)))
}

const listPages = async () => {
  const pages = await Page.findAll({
    order: [["created_at", "DESC"]],
  })

  return Promise.all(pages.map(toPageResponse))
}

const getPageById = async (pageId) => {
  const page = await getPageInstanceById(pageId)
  return toPageResponse(page)
}

const createPage = async (payload, { mainImageFile } = {}) => {
  const page = await Page.create({
    title: normalizeLocalizedRequired(payload.title),
    slug: normalizeOptionalString(payload.slug) ?? null,
    description: normalizeLocalizedRequired(payload.description),
    status: typeof payload.status === "boolean" ? payload.status : true,
  })

  try {
    await replacePageMainImage(page.id, mainImageFile)
  } catch (error) {
    await clearPageMedia(page.id).catch(() => {})
    await page.destroy().catch(() => {})
    throw error
  }

  return getPageById(page.id)
}

const updatePage = async (pageId, payload, { mainImageFile } = {}) => {
  const page = await getPageInstanceById(pageId)
  const currentTitle = normalizeLocalizedObject(page.title, { required: true })
  const currentDescription = normalizeLocalizedObject(page.description, {
    required: true,
  })

  if (payload.title) {
    page.title = normalizeLocalizedRequired(payload.title, currentTitle)
  }

  if (payload.slug !== undefined) {
    page.slug = normalizeOptionalString(payload.slug)
  }

  if (payload.description) {
    page.description = normalizeLocalizedRequired(
      payload.description,
      currentDescription
    )
  }

  if (typeof payload.status === "boolean") {
    page.status = payload.status
  }

  await page.save()
  await replacePageMainImage(page.id, mainImageFile)

  return getPageById(page.id)
}

const deletePage = async (pageId) => {
  const page = await getPageInstanceById(pageId)
  await clearPageMedia(pageId)
  await page.destroy()
}

export default {
  createPage,
  deletePage,
  getPageById,
  listPages,
  updatePage,
}
