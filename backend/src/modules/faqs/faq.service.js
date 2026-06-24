import { Faq } from "../../models/index.js"

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

const normalizeRequiredLocalizedField = (value) => ({
  en: value.en.trim(),
  ar: value.ar?.trim() || "",
})

const normalizeUpdatedLocalizedField = (value, currentValue) => {
  if (!value) {
    return currentValue
  }

  const nextValue = {
    en: value.en?.trim() ?? currentValue.en,
    ar: value.ar?.trim() ?? currentValue.ar,
  }

  if (!nextValue.en) {
    throw createHttpError("English value is required", 400)
  }

  return nextValue
}

const toFaqResponse = (faq) => ({
  id: faq.id,
  question: normalizeLocalizedObject(faq.question, { required: true }),
  answer: normalizeLocalizedObject(faq.answer, { required: true }),
  createdAt: faq.createdAt,
  updatedAt: faq.updatedAt,
})

const getFaqInstanceById = async (faqId) => {
  const faq = await Faq.findByPk(faqId)

  if (!faq) {
    throw createHttpError("FAQ not found", 404)
  }

  return faq
}

const getFaqs = async () => {
  const faqs = await Faq.findAll({
    order: [["createdAt", "DESC"]],
  })

  return faqs.map(toFaqResponse)
}

const getFaqById = async (faqId) => {
  const faq = await getFaqInstanceById(faqId)
  return toFaqResponse(faq)
}

const createFaq = async (payload) => {
  const faq = await Faq.create({
    question: normalizeRequiredLocalizedField(payload.question),
    answer: normalizeRequiredLocalizedField(payload.answer),
  })

  return toFaqResponse(faq)
}

const updateFaq = async (faqId, payload) => {
  const faq = await getFaqInstanceById(faqId)
  const currentQuestion = normalizeLocalizedObject(faq.question, { required: true })
  const currentAnswer = normalizeLocalizedObject(faq.answer, { required: true })

  if (payload.question) {
    faq.question = normalizeUpdatedLocalizedField(payload.question, currentQuestion)
  }

  if (payload.answer) {
    faq.answer = normalizeUpdatedLocalizedField(payload.answer, currentAnswer)
  }

  await faq.save()

  return toFaqResponse(faq)
}

const deleteFaq = async (faqId) => {
  const faq = await getFaqInstanceById(faqId)
  await faq.destroy()
}

export default {
  createFaq,
  deleteFaq,
  getFaqById,
  getFaqs,
  updateFaq,
}
