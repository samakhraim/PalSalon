import { ContactUsMessage } from "../../models/index.js"

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

const normalizeEmail = (email) => email.trim().toLowerCase()

const toContactUsResponse = (message) => ({
  id: message.id,
  name: message.name,
  email: message.email,
  phone: message.phone,
  title: message.title,
  message: message.message,
  isRead: Boolean(message.isRead),
  createdAt: message.createdAt,
  updatedAt: message.updatedAt,
})

const getMessageInstanceById = async (messageId) => {
  const message = await ContactUsMessage.findByPk(messageId)

  if (!message) {
    throw createHttpError("Contact message not found", 404)
  }

  return message
}

const getContactMessages = async () => {
  const messages = await ContactUsMessage.findAll({
    order: [["createdAt", "DESC"]],
  })

  return messages.map(toContactUsResponse)
}

const getContactMessageById = async (messageId) => {
  const message = await getMessageInstanceById(messageId)
  return toContactUsResponse(message)
}

const createContactMessage = async (payload) => {
  const message = await ContactUsMessage.create({
    name: payload.name.trim(),
    email: normalizeEmail(payload.email),
    phone: normalizeOptionalString(payload.phone),
    title: normalizeOptionalString(payload.title),
    message: payload.message.trim(),
    isRead: false,
  })

  return toContactUsResponse(message)
}

const markContactMessageReadState = async (messageId, isRead) => {
  const message = await getMessageInstanceById(messageId)
  message.isRead = isRead
  await message.save()

  return toContactUsResponse(message)
}

const deleteContactMessage = async (messageId) => {
  const message = await getMessageInstanceById(messageId)
  await message.destroy()
}

export default {
  createContactMessage,
  deleteContactMessage,
  getContactMessageById,
  getContactMessages,
  markContactMessageReadState,
}
