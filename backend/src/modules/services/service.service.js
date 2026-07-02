import { sequelize } from "../../config/db.js"
import {
  Category,
  Salon,
  Service,
  ServicePriceOption,
} from "../../models/index.js"
import mediaService from "../media/media.service.js"

const MAIN_IMAGE_COLLECTION = "main_image"
const GALLERY_COLLECTION = "gallery"

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

const normalizeLocalizedRequired = (value) => ({
  en: value.en.trim(),
  ar: value.ar?.trim() || "",
})

const normalizeLocalizedOptional = (value, currentValue = null) => {
  if (value === undefined) {
    return undefined
  }

  if (value === null) {
    return null
  }

  const normalizedValue = {
    en: value.en?.trim() ?? currentValue?.en ?? "",
    ar: value.ar?.trim() ?? currentValue?.ar ?? "",
  }

  return normalizedValue.en || normalizedValue.ar ? normalizedValue : null
}

const normalizeNullablePositiveInteger = (value) => {
  if (value === undefined) {
    return undefined
  }

  if (value === null || value === "") {
    return null
  }

  return Number(value)
}

const normalizeNullablePrice = (value) => {
  if (value === undefined) {
    return undefined
  }

  if (value === null || value === "") {
    return null
  }

  return Number(value).toFixed(2)
}

const getServiceInclude = () => [
  {
    model: Salon,
    as: "salon",
    attributes: ["id", "name", "isactive"],
  },
  {
    model: Category,
    as: "category",
    attributes: ["id", "name", "isactive"],
  },
  {
    model: ServicePriceOption,
    as: "price_options",
  },
]

const toPriceOptionResponse = (priceOption) => ({
  id: priceOption.id,
  name: normalizeLocalizedObject(priceOption.name, { required: true }),
  price: Number(priceOption.price),
  discount_price:
    priceOption.discount_price === null || priceOption.discount_price === undefined
      ? null
      : Number(priceOption.discount_price),
  duration_minutes:
    priceOption.duration_minutes === null || priceOption.duration_minutes === undefined
      ? null
      : Number(priceOption.duration_minutes),
  is_default: Boolean(priceOption.is_default),
  isactive: Boolean(priceOption.isactive),
  created_at: priceOption.created_at,
  updated_at: priceOption.updated_at,
})

const toServiceResponse = async (service) => {
  const mainImage = await mediaService.getFirstMedia({
    modelType: "Service",
    modelId: service.id,
    collectionName: MAIN_IMAGE_COLLECTION,
  })
  const gallery = await mediaService.getMedia({
    modelType: "Service",
    modelId: service.id,
    collectionName: GALLERY_COLLECTION,
  })
  const priceOptions = Array.isArray(service.price_options)
    ? [...service.price_options].sort((left, right) => {
        if (left.is_default === right.is_default) {
          return left.id - right.id
        }

        return left.is_default ? -1 : 1
      })
    : []

  return {
    id: service.id,
    salon_id: service.salon_id,
    category_id: service.category_id,
    name: normalizeLocalizedObject(service.name, { required: true }),
    description: normalizeLocalizedObject(service.description),
    duration_minutes:
      service.duration_minutes === null || service.duration_minutes === undefined
        ? null
        : Number(service.duration_minutes),
    isactive: Boolean(service.isactive),
    mainImage,
    imageUrl: mainImage?.url || null,
    gallery,
    salon: service.salon
      ? {
          id: service.salon.id,
          name: normalizeLocalizedObject(service.salon.name, { required: true }),
          isactive: Boolean(service.salon.isactive),
        }
      : null,
    category: service.category
      ? {
          id: service.category.id,
          name: normalizeLocalizedObject(service.category.name, { required: true }),
          isactive: Boolean(service.category.isactive),
        }
      : null,
    price_options: priceOptions.map(toPriceOptionResponse),
    created_at: service.created_at,
    updated_at: service.updated_at,
  }
}

const getServiceInstanceById = async (serviceId, transaction) => {
  const service = await Service.findByPk(serviceId, {
    include: getServiceInclude(),
    transaction,
  })

  if (!service) {
    throw createHttpError("Service not found", 404)
  }

  return service
}

const ensureSalonExists = async (salonId, transaction) => {
  const salon = await Salon.findByPk(salonId, { transaction })

  if (!salon) {
    throw createHttpError("Salon not found", 400)
  }
}

const ensureCategoryExists = async (categoryId, transaction) => {
  const category = await Category.findByPk(categoryId, { transaction })

  if (!category) {
    throw createHttpError("Category not found", 400)
  }
}

const normalizePriceOptions = (priceOptions = []) => {
  const hasDefaultOption = priceOptions.some((option) => option.is_default)

  return priceOptions.map((option, index) => ({
    name: normalizeLocalizedRequired(option.name),
    price: Number(option.price).toFixed(2),
    discount_price: normalizeNullablePrice(option.discount_price) ?? null,
    duration_minutes:
      normalizeNullablePositiveInteger(option.duration_minutes) ?? null,
    is_default: hasDefaultOption ? Boolean(option.is_default) : index === 0,
    isactive:
      typeof option.isactive === "boolean" ? option.isactive : true,
  }))
}

const syncPriceOptions = async (serviceId, priceOptions, transaction) => {
  await ServicePriceOption.destroy({
    where: { service_id: serviceId },
    transaction,
  })

  const normalizedPriceOptions = normalizePriceOptions(priceOptions)

  await ServicePriceOption.bulkCreate(
    normalizedPriceOptions.map((priceOption) => ({
      service_id: serviceId,
      ...priceOption,
    })),
    { transaction }
  )
}

const uploadServiceMedia = async (serviceId, { mainImageFile, galleryFiles }) => {
  if (mainImageFile) {
    await mediaService.replaceSingleMedia({
      file: mainImageFile,
      modelType: "Service",
      modelId: serviceId,
      collectionName: MAIN_IMAGE_COLLECTION,
    })
  }

  if (Array.isArray(galleryFiles) && galleryFiles.length > 0) {
    await mediaService.uploadMultipleMedia({
      files: galleryFiles,
      modelType: "Service",
      modelId: serviceId,
      collectionName: GALLERY_COLLECTION,
    })
  }
}

const clearServiceMedia = async (serviceId) => {
  const media = await mediaService.getMedia({
    modelType: "Service",
    modelId: serviceId,
  })

  await Promise.all(
    media.map((mediaItem) => mediaService.deleteMedia(mediaItem.id))
  )
}

const listServices = async () => {
  const services = await Service.findAll({
    include: getServiceInclude(),
    order: [["created_at", "DESC"]],
  })

  return Promise.all(services.map(toServiceResponse))
}

const getServiceById = async (serviceId) => {
  const service = await getServiceInstanceById(serviceId)
  return toServiceResponse(service)
}

const createService = async (payload, mediaFiles = {}) => {
  const service = await sequelize.transaction(async (transaction) => {
    await ensureSalonExists(payload.salon_id, transaction)
    await ensureCategoryExists(payload.category_id, transaction)

    const createdService = await Service.create(
      {
        salon_id: payload.salon_id,
        category_id: payload.category_id,
        name: normalizeLocalizedRequired(payload.name),
        description: normalizeLocalizedOptional(payload.description) ?? null,
        duration_minutes:
          normalizeNullablePositiveInteger(payload.duration_minutes) ?? null,
        isactive: typeof payload.isactive === "boolean" ? payload.isactive : false,
      },
      { transaction }
    )

    await syncPriceOptions(createdService.id, payload.price_options, transaction)

    return createdService
  })

  try {
    await uploadServiceMedia(service.id, mediaFiles)
  } catch (error) {
    await clearServiceMedia(service.id).catch(() => {})
    await Service.destroy({ where: { id: service.id } }).catch(() => {})
    throw error
  }

  return getServiceById(service.id)
}

const updateService = async (serviceId, payload, mediaFiles = {}) => {
  await sequelize.transaction(async (transaction) => {
    const service = await getServiceInstanceById(serviceId, transaction)
    const currentName = normalizeLocalizedObject(service.name, { required: true })
    const currentDescription = normalizeLocalizedObject(service.description)

    if (payload.salon_id !== undefined) {
      await ensureSalonExists(payload.salon_id, transaction)
      service.salon_id = payload.salon_id
    }

    if (payload.category_id !== undefined) {
      await ensureCategoryExists(payload.category_id, transaction)
      service.category_id = payload.category_id
    }

    if (payload.name) {
      service.name = {
        en: payload.name.en?.trim() ?? currentName.en,
        ar: payload.name.ar?.trim() ?? currentName.ar,
      }
    }

    if (payload.description !== undefined) {
      service.description = normalizeLocalizedOptional(
        payload.description,
        currentDescription
      )
    }

    if (payload.duration_minutes !== undefined) {
      service.duration_minutes = normalizeNullablePositiveInteger(
        payload.duration_minutes
      )
    }

    if (typeof payload.isactive === "boolean") {
      service.isactive = payload.isactive
    }

    await service.save({ transaction })

    if (payload.price_options) {
      await syncPriceOptions(service.id, payload.price_options, transaction)
    }
  })

  await uploadServiceMedia(serviceId, mediaFiles)

  return getServiceById(serviceId)
}

const deleteService = async (serviceId) => {
  const service = await getServiceInstanceById(serviceId)
  await clearServiceMedia(serviceId)
  await service.destroy()
}

export default {
  createService,
  deleteService,
  getServiceById,
  listServices,
  updateService,
}
