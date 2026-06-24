import { City, Salon, SalonOwner } from "../../models/index.js"
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

const normalizeOptionalString = (value) => {
  if (value === undefined || value === null) {
    return null
  }

  const trimmedValue = String(value).trim()
  return trimmedValue || null
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

const normalizeDecimal = (value) => {
  const normalizedValue = normalizeOptionalString(value)

  if (normalizedValue === null) {
    return null
  }

  const parsedValue = Number(normalizedValue)

  if (Number.isNaN(parsedValue)) {
    throw createHttpError("Latitude and longitude must be valid numbers", 400)
  }

  return parsedValue
}

const normalizeOpeningHours = (value, currentValue = null) => {
  if (value === undefined) {
    return undefined
  }

  if (value === null) {
    return null
  }

  const parsedValue = parseJsonValue(value)

  if (!parsedValue) {
    return currentValue
  }

  const normalizedValue = {}

  for (const [day, dayConfig] of Object.entries(parsedValue)) {
    const isOpen = Boolean(dayConfig?.is_open)
    normalizedValue[day] = {
      is_open: isOpen,
      opening_time: isOpen ? normalizeOptionalString(dayConfig?.opening_time) : null,
      closing_time: isOpen ? normalizeOptionalString(dayConfig?.closing_time) : null,
    }
  }

  return normalizedValue
}

const normalizeOffDays = (value) => {
  if (value === undefined) {
    return undefined
  }

  if (value === null) {
    return null
  }

  const parsedValue = Array.isArray(value) ? value : parseJsonValue(value)

  if (!Array.isArray(parsedValue)) {
    return null
  }

  const normalizedValue = parsedValue
    .map((item) => String(item || "").trim())
    .filter(Boolean)

  return normalizedValue.length > 0 ? normalizedValue : []
}

const salonInclude = [
  {
    model: SalonOwner,
    as: "salonOwner",
    attributes: ["id", "first_name", "middle_name", "last_name", "email", "phone"],
  },
  {
    model: City,
    as: "city",
    attributes: ["id", "name"],
  },
]

const toSalonResponse = async (salon) => {
  const mainImage = await mediaService.getFirstMedia({
    modelType: "Salon",
    modelId: salon.id,
    collectionName: MAIN_IMAGE_COLLECTION,
  })
  const gallery = await mediaService.getMedia({
    modelType: "Salon",
    modelId: salon.id,
    collectionName: GALLERY_COLLECTION,
  })

  return {
    id: salon.id,
    salon_owner_id: salon.salon_owner_id,
    city_id: salon.city_id,
    name: normalizeLocalizedObject(salon.name, { required: true }),
    description: normalizeLocalizedObject(salon.description),
    address: normalizeLocalizedObject(salon.address),
    cancellation_policy: normalizeLocalizedObject(salon.cancellation_policy),
    country_phone_code: salon.country_phone_code,
    telephone: salon.telephone,
    latitude: salon.latitude,
    longitude: salon.longitude,
    opening_hours: parseJsonValue(salon.opening_hours),
    off_days: Array.isArray(salon.off_days) ? salon.off_days : parseJsonValue(salon.off_days),
    click_count: Number(salon.click_count || 0),
    isactive: Boolean(salon.isactive),
    mainImage,
    imageUrl: mainImage?.url || null,
    gallery,
    salonOwner: salon.salonOwner
      ? {
          id: salon.salonOwner.id,
          first_name: salon.salonOwner.first_name,
          middle_name: salon.salonOwner.middle_name,
          last_name: salon.salonOwner.last_name,
          full_name: [
            salon.salonOwner.first_name,
            salon.salonOwner.middle_name,
            salon.salonOwner.last_name,
          ]
            .filter(Boolean)
            .join(" "),
          email: salon.salonOwner.email,
          phone: salon.salonOwner.phone,
        }
      : null,
    city: salon.city
      ? {
          id: salon.city.id,
          name: normalizeLocalizedObject(salon.city.name, { required: true }),
        }
      : null,
    created_at: salon.created_at,
    updated_at: salon.updated_at,
  }
}

const getSalonInstanceById = async (salonId) => {
  const salon = await Salon.findByPk(salonId, {
    include: salonInclude,
  })

  if (!salon) {
    throw createHttpError("Salon not found", 404)
  }

  return salon
}

const ensureSalonOwnerExists = async (salonOwnerId) => {
  const salonOwner = await SalonOwner.findByPk(salonOwnerId)

  if (!salonOwner) {
    throw createHttpError("Salon owner not found", 400)
  }
}

const ensureCityExists = async (cityId) => {
  if (!cityId) {
    return
  }

  const city = await City.findByPk(cityId)

  if (!city) {
    throw createHttpError("City not found", 400)
  }
}

const listSalons = async () => {
  const salons = await Salon.findAll({
    include: salonInclude,
    order: [["created_at", "DESC"]],
  })

  return Promise.all(salons.map(toSalonResponse))
}

const getSalonById = async (salonId) => {
  const salon = await getSalonInstanceById(salonId)
  return toSalonResponse(salon)
}

const createSalon = async (payload) => {
  await ensureSalonOwnerExists(payload.salon_owner_id)
  await ensureCityExists(payload.city_id)

  const salon = await Salon.create({
    salon_owner_id: payload.salon_owner_id,
    city_id: payload.city_id ?? null,
    name: normalizeLocalizedRequired(payload.name),
    description: normalizeLocalizedOptional(payload.description) ?? null,
    address: normalizeLocalizedOptional(payload.address) ?? null,
    cancellation_policy:
      normalizeLocalizedOptional(payload.cancellation_policy) ?? null,
    country_phone_code: normalizeOptionalString(payload.country_phone_code),
    telephone: normalizeOptionalString(payload.telephone),
    latitude: normalizeDecimal(payload.latitude),
    longitude: normalizeDecimal(payload.longitude),
    opening_hours: normalizeOpeningHours(payload.opening_hours) ?? null,
    off_days: normalizeOffDays(payload.off_days) ?? [],
    isactive: typeof payload.isactive === "boolean" ? payload.isactive : false,
  })

  const createdSalon = await getSalonInstanceById(salon.id)
  return toSalonResponse(createdSalon)
}

const updateSalon = async (salonId, payload) => {
  const salon = await getSalonInstanceById(salonId)
  const currentName = normalizeLocalizedObject(salon.name, { required: true })
  const currentDescription = normalizeLocalizedObject(salon.description)
  const currentAddress = normalizeLocalizedObject(salon.address)
  const currentCancellationPolicy = normalizeLocalizedObject(
    salon.cancellation_policy
  )

  if (payload.salon_owner_id !== undefined) {
    await ensureSalonOwnerExists(payload.salon_owner_id)
    salon.salon_owner_id = payload.salon_owner_id
  }

  if (payload.city_id !== undefined) {
    await ensureCityExists(payload.city_id)
    salon.city_id = payload.city_id ?? null
  }

  if (payload.name) {
    salon.name = {
      en: payload.name.en?.trim() ?? currentName.en,
      ar: payload.name.ar?.trim() ?? currentName.ar,
    }
  }

  if (payload.description !== undefined) {
    salon.description = normalizeLocalizedOptional(
      payload.description,
      currentDescription
    )
  }

  if (payload.address !== undefined) {
    salon.address = normalizeLocalizedOptional(payload.address, currentAddress)
  }

  if (payload.cancellation_policy !== undefined) {
    salon.cancellation_policy = normalizeLocalizedOptional(
      payload.cancellation_policy,
      currentCancellationPolicy
    )
  }

  if (payload.country_phone_code !== undefined) {
    salon.country_phone_code = normalizeOptionalString(payload.country_phone_code)
  }

  if (payload.telephone !== undefined) {
    salon.telephone = normalizeOptionalString(payload.telephone)
  }

  if (payload.latitude !== undefined) {
    salon.latitude = normalizeDecimal(payload.latitude)
  }

  if (payload.longitude !== undefined) {
    salon.longitude = normalizeDecimal(payload.longitude)
  }

  if (payload.opening_hours !== undefined) {
    salon.opening_hours = normalizeOpeningHours(
      payload.opening_hours,
      parseJsonValue(salon.opening_hours)
    )
  }

  if (payload.off_days !== undefined) {
    salon.off_days = normalizeOffDays(payload.off_days)
  }

  if (typeof payload.isactive === "boolean") {
    salon.isactive = payload.isactive
  }

  await salon.save()

  const updatedSalon = await getSalonInstanceById(salon.id)
  return toSalonResponse(updatedSalon)
}

const deleteSalon = async (salonId) => {
  const salon = await getSalonInstanceById(salonId)
  await salon.destroy()
}

const incrementSalonClick = async (salonId) => {
  const salon = await getSalonInstanceById(salonId)
  salon.click_count = Number(salon.click_count || 0) + 1
  await salon.save()

  const updatedSalon = await getSalonInstanceById(salon.id)
  return toSalonResponse(updatedSalon)
}

export default {
  createSalon,
  deleteSalon,
  getSalonById,
  incrementSalonClick,
  listSalons,
  updateSalon,
}
