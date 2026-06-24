import { City } from "../../models/index.js"

const createHttpError = (message, statusCode) => {
  const error = new Error(message)
  error.statusCode = statusCode
  return error
}

const normalizeOptionalString = (value) => {
  if (value === undefined || value === null) {
    return null
  }

  const trimmedValue = value.trim()
  return trimmedValue || null
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

const normalizeLocalizedName = (name) => ({
  en: name.en.trim(),
  ar: name.ar.trim(),
})

const normalizeLocalizedDescription = (description, currentDescription = null) => {
  if (description === undefined) {
    return undefined
  }

  if (description === null) {
    return null
  }

  const normalizedDescription = {
    en: description.en?.trim() ?? currentDescription?.en ?? "",
    ar: description.ar?.trim() ?? currentDescription?.ar ?? "",
  }

  return normalizedDescription.en || normalizedDescription.ar
    ? normalizedDescription
    : null
}

const toCityResponse = (city) => ({
  id: city.id,
  name: normalizeLocalizedObject(city.name, { required: true }),
  description: normalizeLocalizedObject(city.description),
  image: city.image,
  status: Boolean(city.status),
  createdAt: city.createdAt,
  updatedAt: city.updatedAt,
})

const getCityInstanceById = async (cityId) => {
  const city = await City.findByPk(cityId)

  if (!city) {
    throw createHttpError("City not found", 404)
  }

  return city
}

const getCities = async () => {
  const cities = await City.findAll({
    order: [["createdAt", "DESC"]],
  })

  return cities.map(toCityResponse)
}

const getCityById = async (cityId) => {
  const city = await getCityInstanceById(cityId)
  return toCityResponse(city)
}

const createCity = async (payload) => {
  const city = await City.create({
    name: normalizeLocalizedName(payload.name),
    description: normalizeLocalizedDescription(payload.description) ?? null,
    image: normalizeOptionalString(payload.image),
    status: typeof payload.status === "boolean" ? payload.status : true,
  })

  return toCityResponse(city)
}

const updateCity = async (cityId, payload) => {
  const city = await getCityInstanceById(cityId)
  const currentName = normalizeLocalizedObject(city.name, { required: true })
  const currentDescription = normalizeLocalizedObject(city.description)

  if (payload.name) {
    city.name = {
      en: payload.name.en?.trim() ?? currentName.en,
      ar: payload.name.ar?.trim() ?? currentName.ar,
    }
  }

  if (payload.description !== undefined) {
    city.description = normalizeLocalizedDescription(
      payload.description,
      currentDescription
    )
  }

  if (payload.image !== undefined) {
    city.image = normalizeOptionalString(payload.image)
  }

  if (typeof payload.status === "boolean") {
    city.status = payload.status
  }

  await city.save()

  return toCityResponse(city)
}

const deleteCity = async (cityId) => {
  const city = await getCityInstanceById(cityId)
  await city.destroy()
}

const toggleCityStatus = async (cityId) => {
  const city = await getCityInstanceById(cityId)
  city.status = !city.status
  await city.save()

  return toCityResponse(city)
}

export default {
  createCity,
  deleteCity,
  getCities,
  getCityById,
  toggleCityStatus,
  updateCity,
}
