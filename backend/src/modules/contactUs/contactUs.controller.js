import { successResponse } from "../../utils/apiResponse.js"
import contactUsService from "./contactUs.service.js"

const asyncHandler = (handler) => (req, res, next) =>
  Promise.resolve(handler(req, res, next)).catch(next)

export const listContactMessages = asyncHandler(async (req, res) => {
  const messages = await contactUsService.getContactMessages()

  return successResponse(res, {
    message: "Contact messages fetched successfully",
    data: { messages },
  })
})

export const getContactMessage = asyncHandler(async (req, res) => {
  const message = await contactUsService.getContactMessageById(req.params.id)

  return successResponse(res, {
    message: "Contact message fetched successfully",
    data: { message },
  })
})

export const createContactMessage = asyncHandler(async (req, res) => {
  const message = await contactUsService.createContactMessage(req.body)

  return successResponse(res, {
    statusCode: 201,
    message: "Contact message submitted successfully",
    data: { message },
  })
})

export const markContactMessageRead = asyncHandler(async (req, res) => {
  const message = await contactUsService.markContactMessageReadState(req.params.id, true)

  return successResponse(res, {
    message: "Contact message marked as read",
    data: { message },
  })
})

export const markContactMessageUnread = asyncHandler(async (req, res) => {
  const message = await contactUsService.markContactMessageReadState(
    req.params.id,
    false
  )

  return successResponse(res, {
    message: "Contact message marked as unread",
    data: { message },
  })
})

export const deleteContactMessage = asyncHandler(async (req, res) => {
  await contactUsService.deleteContactMessage(req.params.id)

  return successResponse(res, {
    message: "Contact message deleted successfully",
  })
})
