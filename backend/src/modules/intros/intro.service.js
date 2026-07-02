import { Intro } from "../../models/index.js"
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

const toIntroResponse = async (intro) => {
  const mainImage = await mediaService.getFirstMedia({
    modelType: "Intro",
    modelId: intro.id,
    collectionName: MAIN_IMAGE_COLLECTION,
  })

  return {
    id: intro.id,
    title: normalizeLocalizedObject(intro.title, { required: true }),
    description: normalizeLocalizedObject(intro.description, { required: true }),
    mainImage,
    imageUrl: mainImage?.url || null,
    created_at: intro.created_at,
    updated_at: intro.updated_at,
  }
}

const getIntroInstanceById = async (introId) => {
  const intro = await Intro.findByPk(introId)

  if (!intro) {
    throw createHttpError("Intro not found", 404)
  }

  return intro
}

const replaceIntroMainImage = async (introId, mainImageFile) => {
  if (!mainImageFile) {
    return
  }

  await mediaService.replaceSingleMedia({
    file: mainImageFile,
    modelType: "Intro",
    modelId: introId,
    collectionName: MAIN_IMAGE_COLLECTION,
  })
}

const clearIntroMedia = async (introId) => {
  const media = await mediaService.getMedia({
    modelType: "Intro",
    modelId: introId,
  })

  await Promise.all(media.map((item) => mediaService.deleteMedia(item.id)))
}

const listIntros = async () => {
  const intros = await Intro.findAll({
    order: [["created_at", "DESC"]],
  })

  return Promise.all(intros.map(toIntroResponse))
}

const getIntroById = async (introId) => {
  const intro = await getIntroInstanceById(introId)
  return toIntroResponse(intro)
}

const createIntro = async (payload, { mainImageFile } = {}) => {
  const intro = await Intro.create({
    title: normalizeLocalizedRequired(payload.title),
    description: normalizeLocalizedRequired(payload.description),
  })

  try {
    await replaceIntroMainImage(intro.id, mainImageFile)
  } catch (error) {
    await clearIntroMedia(intro.id).catch(() => {})
    await intro.destroy().catch(() => {})
    throw error
  }

  return getIntroById(intro.id)
}

const updateIntro = async (introId, payload, { mainImageFile } = {}) => {
  const intro = await getIntroInstanceById(introId)
  const currentTitle = normalizeLocalizedObject(intro.title, { required: true })
  const currentDescription = normalizeLocalizedObject(intro.description, {
    required: true,
  })

  if (payload.title) {
    intro.title = normalizeLocalizedRequired(payload.title, currentTitle)
  }

  if (payload.description) {
    intro.description = normalizeLocalizedRequired(
      payload.description,
      currentDescription
    )
  }

  await intro.save()
  await replaceIntroMainImage(intro.id, mainImageFile)

  return getIntroById(intro.id)
}

const deleteIntro = async (introId) => {
  const intro = await getIntroInstanceById(introId)
  await clearIntroMedia(introId)
  await intro.destroy()
}

export default {
  createIntro,
  deleteIntro,
  getIntroById,
  listIntros,
  updateIntro,
}
