import { Customer } from "../../models/index.js"
import { getFirstMedia } from "../media/media.helper.js"
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

const CUSTOMER_IMAGE_COLLECTION = "avatar"

const toCustomerResponse = async (customer) => {
  if (!customer) {
    return null
  }

  const values =
    typeof customer.toSafeJSON === "function"
      ? customer.toSafeJSON()
      : (() => {
          const plainValues = { ...customer.get({ plain: true }) }
          delete plainValues.password
          delete plainValues.email_otp
          delete plainValues.phone_otp

          return plainValues
        })()

  const media = await getFirstMedia("Customer", customer.id, CUSTOMER_IMAGE_COLLECTION)
  values.imageUrl = media?.url || null

  return values
}

const getCustomerInstanceById = async (customerId) => {
  const customer = await Customer.findByPk(customerId)

  if (!customer) {
    throw createHttpError("Customer not found", 404)
  }

  return customer
}

const ensureUniqueCustomerFields = async ({
  email,
  phone,
  excludeCustomerId,
} = {}) => {
  if (email) {
    const existingEmailCustomer = await Customer.unscoped().findOne({
      where: { email },
    })

    if (
      existingEmailCustomer &&
      Number(existingEmailCustomer.id) !== Number(excludeCustomerId)
    ) {
      throw createHttpError("Email already exists", 409)
    }
  }

  if (phone) {
    const existingPhoneCustomer = await Customer.unscoped().findOne({
      where: { phone },
    })

    if (
      existingPhoneCustomer &&
      Number(existingPhoneCustomer.id) !== Number(excludeCustomerId)
    ) {
      throw createHttpError("Phone already exists", 409)
    }
  }
}

const listCustomers = async () => {
  const customers = await Customer.findAll({
    order: [["created_at", "DESC"]],
  })

  return Promise.all(customers.map(toCustomerResponse))
}

const getCustomerById = async (customerId) => {
  const customer = await getCustomerInstanceById(customerId)
  return toCustomerResponse(customer)
}

const createCustomer = async (payload) => {
  const normalizedEmail = normalizeEmail(payload.email)
  const normalizedPhone = normalizeRequiredString(payload.phone)

  await ensureUniqueCustomerFields({
    email: normalizedEmail,
    phone: normalizedPhone,
  })

  const customer = await Customer.create({
    first_name: normalizeRequiredString(payload.first_name),
    middle_name: normalizeOptionalString(payload.middle_name),
    last_name: normalizeRequiredString(payload.last_name),
    country_phone_code: normalizeRequiredString(payload.country_phone_code),
    phone: normalizedPhone,
    email: normalizedEmail,
    password: await hashPassword(payload.password),
    isactive: typeof payload.isactive === "boolean" ? payload.isactive : false,
  })

  const createdCustomer = await Customer.findByPk(customer.id)
  return toCustomerResponse(createdCustomer)
}

const updateCustomer = async (customerId, payload) => {
  const customer = await getCustomerInstanceById(customerId)
  const nextEmail =
    payload.email !== undefined ? normalizeEmail(payload.email) : undefined
  const nextPhone =
    payload.phone !== undefined ? normalizeRequiredString(payload.phone) : undefined

  await ensureUniqueCustomerFields({
    email: nextEmail,
    phone: nextPhone,
    excludeCustomerId: customer.id,
  })

  if (payload.first_name !== undefined) {
    customer.first_name = normalizeRequiredString(payload.first_name)
  }

  if (payload.middle_name !== undefined) {
    customer.middle_name = normalizeOptionalString(payload.middle_name)
  }

  if (payload.last_name !== undefined) {
    customer.last_name = normalizeRequiredString(payload.last_name)
  }

  if (payload.country_phone_code !== undefined) {
    customer.country_phone_code = normalizeRequiredString(
      payload.country_phone_code
    )
  }

  if (payload.phone !== undefined) {
    customer.phone = nextPhone
  }

  if (payload.email !== undefined) {
    customer.email = nextEmail
  }

  if (payload.password) {
    customer.password = await hashPassword(payload.password)
  }

  if (typeof payload.isactive === "boolean") {
    customer.isactive = payload.isactive
  }

  await customer.save()

  const updatedCustomer = await Customer.findByPk(customer.id)
  return toCustomerResponse(updatedCustomer)
}

const deleteCustomer = async (customerId) => {
  const customer = await getCustomerInstanceById(customerId)
  await customer.destroy()
}

const toggleCustomerStatus = async (customerId) => {
  const customer = await getCustomerInstanceById(customerId)
  customer.isactive = !customer.isactive
  await customer.save()

  return toCustomerResponse(customer)
}

export default {
  createCustomer,
  deleteCustomer,
  getCustomerById,
  listCustomers,
  toggleCustomerStatus,
  updateCustomer,
}
