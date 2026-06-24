import { SalonOwner } from "../../models/index.js"
import { hashPassword } from "../../utils/hashPassword.js"

const createHttpError = (message, statusCode) => {
  const error = new Error(message)
  error.statusCode = statusCode
  return error
}

const normalizeRequiredString = (value) => value.trim()
const normalizeEmail = (value) => value.trim().toLowerCase()

const normalizeOptionalString = (value) => {
  if (value === undefined || value === null) {
    return null
  }

  const trimmedValue = value.trim()
  return trimmedValue || null
}

const toSalonOwnerResponse = (salonOwner) => {
  if (!salonOwner) {
    return null
  }

  if (typeof salonOwner.toSafeJSON === "function") {
    return salonOwner.toSafeJSON()
  }

  const values = { ...salonOwner.get({ plain: true }) }
  delete values.password
  delete values.email_otp
  delete values.phone_otp

  return values
}

const getSalonOwnerInstanceById = async (salonOwnerId) => {
  const salonOwner = await SalonOwner.findByPk(salonOwnerId)

  if (!salonOwner) {
    throw createHttpError("Salon owner not found", 404)
  }

  return salonOwner
}

const ensureUniqueSalonOwnerFields = async ({
  email,
  phone,
  excludeSalonOwnerId,
} = {}) => {
  if (email) {
    const existingEmailSalonOwner = await SalonOwner.unscoped().findOne({
      where: { email },
    })

    if (
      existingEmailSalonOwner &&
      Number(existingEmailSalonOwner.id) !== Number(excludeSalonOwnerId)
    ) {
      throw createHttpError("Email already exists", 409)
    }
  }

  if (phone) {
    const existingPhoneSalonOwner = await SalonOwner.unscoped().findOne({
      where: { phone },
    })

    if (
      existingPhoneSalonOwner &&
      Number(existingPhoneSalonOwner.id) !== Number(excludeSalonOwnerId)
    ) {
      throw createHttpError("Phone already exists", 409)
    }
  }
}

const listSalonOwners = async () => {
  const salonOwners = await SalonOwner.findAll({
    order: [["created_at", "DESC"]],
  })

  return salonOwners.map(toSalonOwnerResponse)
}

const getSalonOwnerById = async (salonOwnerId) => {
  const salonOwner = await getSalonOwnerInstanceById(salonOwnerId)
  return toSalonOwnerResponse(salonOwner)
}

const createSalonOwner = async (payload) => {
  const normalizedEmail = normalizeEmail(payload.email)
  const normalizedPhone = normalizeRequiredString(payload.phone)

  await ensureUniqueSalonOwnerFields({
    email: normalizedEmail,
    phone: normalizedPhone,
  })

  const salonOwner = await SalonOwner.create({
    first_name: normalizeRequiredString(payload.first_name),
    middle_name: normalizeOptionalString(payload.middle_name),
    last_name: normalizeRequiredString(payload.last_name),
    country_phone_code: normalizeRequiredString(payload.country_phone_code),
    phone: normalizedPhone,
    email: normalizedEmail,
    password: await hashPassword(payload.password),
    isactive: typeof payload.isactive === "boolean" ? payload.isactive : false,
  })

  const createdSalonOwner = await SalonOwner.findByPk(salonOwner.id)
  return toSalonOwnerResponse(createdSalonOwner)
}

const updateSalonOwner = async (salonOwnerId, payload) => {
  const salonOwner = await getSalonOwnerInstanceById(salonOwnerId)
  const nextEmail =
    payload.email !== undefined ? normalizeEmail(payload.email) : undefined
  const nextPhone =
    payload.phone !== undefined ? normalizeRequiredString(payload.phone) : undefined

  await ensureUniqueSalonOwnerFields({
    email: nextEmail,
    phone: nextPhone,
    excludeSalonOwnerId: salonOwner.id,
  })

  if (payload.first_name !== undefined) {
    salonOwner.first_name = normalizeRequiredString(payload.first_name)
  }

  if (payload.middle_name !== undefined) {
    salonOwner.middle_name = normalizeOptionalString(payload.middle_name)
  }

  if (payload.last_name !== undefined) {
    salonOwner.last_name = normalizeRequiredString(payload.last_name)
  }

  if (payload.country_phone_code !== undefined) {
    salonOwner.country_phone_code = normalizeRequiredString(
      payload.country_phone_code
    )
  }

  if (payload.phone !== undefined) {
    salonOwner.phone = nextPhone
  }

  if (payload.email !== undefined) {
    salonOwner.email = nextEmail
  }

  if (payload.password) {
    salonOwner.password = await hashPassword(payload.password)
  }

  if (typeof payload.isactive === "boolean") {
    salonOwner.isactive = payload.isactive
  }

  await salonOwner.save()

  const updatedSalonOwner = await SalonOwner.findByPk(salonOwner.id)
  return toSalonOwnerResponse(updatedSalonOwner)
}

const deleteSalonOwner = async (salonOwnerId) => {
  const salonOwner = await getSalonOwnerInstanceById(salonOwnerId)
  await salonOwner.destroy()
}

export default {
  createSalonOwner,
  deleteSalonOwner,
  getSalonOwnerById,
  listSalonOwners,
  updateSalonOwner,
}
