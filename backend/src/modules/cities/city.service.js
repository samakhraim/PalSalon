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
  name: city.name,
  description: city.description,
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

  if (payload.name) {
    city.name = {
      en: payload.name.en?.trim() ?? city.name?.en ?? "",
      ar: payload.name.ar?.trim() ?? city.name?.ar ?? "",
    }
  }

  if (payload.description !== undefined) {
    city.description = normalizeLocalizedDescription(
      payload.description,
      city.description
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
