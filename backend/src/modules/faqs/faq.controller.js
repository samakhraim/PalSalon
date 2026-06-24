import { successResponse } from "../../utils/apiResponse.js"
import faqService from "./faq.service.js"

const asyncHandler = (handler) => (req, res, next) =>
  Promise.resolve(handler(req, res, next)).catch(next)

export const listFaqs = asyncHandler(async (req, res) => {
  const faqs = await faqService.getFaqs()

  return successResponse(res, {
    message: "FAQs fetched successfully",
    data: { faqs },
  })
})

export const getFaq = asyncHandler(async (req, res) => {
  const faq = await faqService.getFaqById(req.params.id)

  return successResponse(res, {
    message: "FAQ fetched successfully",
    data: { faq },
  })
})

export const createFaq = asyncHandler(async (req, res) => {
  const faq = await faqService.createFaq(req.body)

  return successResponse(res, {
    statusCode: 201,
    message: "FAQ created successfully",
    data: { faq },
  })
})

export const updateFaq = asyncHandler(async (req, res) => {
  const faq = await faqService.updateFaq(req.params.id, req.body)

  return successResponse(res, {
    message: "FAQ updated successfully",
    data: { faq },
  })
})

export const deleteFaq = asyncHandler(async (req, res) => {
  await faqService.deleteFaq(req.params.id)

  return successResponse(res, {
    message: "FAQ deleted successfully",
  })
})
