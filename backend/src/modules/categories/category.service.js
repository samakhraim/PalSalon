import { Category, Service } from "../../models/index.js"

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

const toCategoryResponse = (category) => ({
  id: category.id,
  name: normalizeLocalizedObject(category.name, { required: true }),
  description: normalizeLocalizedObject(category.description),
  isactive: Boolean(category.isactive),
  created_at: category.created_at,
  updated_at: category.updated_at,
})

const getCategoryInstanceById = async (categoryId) => {
  const category = await Category.findByPk(categoryId)

  if (!category) {
    throw createHttpError("Category not found", 404)
  }

  return category
}

const listCategories = async () => {
  const categories = await Category.findAll({
    order: [["created_at", "DESC"]],
  })

  return categories.map(toCategoryResponse)
}

const getCategoryById = async (categoryId) => {
  const category = await getCategoryInstanceById(categoryId)
  return toCategoryResponse(category)
}

const createCategory = async (payload) => {
  const category = await Category.create({
    name: normalizeLocalizedRequired(payload.name),
    description: normalizeLocalizedOptional(payload.description) ?? null,
    isactive: typeof payload.isactive === "boolean" ? payload.isactive : false,
  })

  return toCategoryResponse(category)
}

const updateCategory = async (categoryId, payload) => {
  const category = await getCategoryInstanceById(categoryId)
  const currentName = normalizeLocalizedObject(category.name, { required: true })
  const currentDescription = normalizeLocalizedObject(category.description)

  if (payload.name) {
    category.name = {
      en: payload.name.en?.trim() ?? currentName.en,
      ar: payload.name.ar?.trim() ?? currentName.ar,
    }
  }

  if (payload.description !== undefined) {
    category.description = normalizeLocalizedOptional(
      payload.description,
      currentDescription
    )
  }

  if (typeof payload.isactive === "boolean") {
    category.isactive = payload.isactive
  }

  await category.save()

  return toCategoryResponse(category)
}

const deleteCategory = async (categoryId) => {
  const category = await getCategoryInstanceById(categoryId)

  const servicesCount = await Service.count({
    where: { category_id: category.id },
  })

  if (servicesCount > 0) {
    throw createHttpError(
      "Category is assigned to services and cannot be deleted",
      400
    )
  }

  await category.destroy()
}

export default {
  createCategory,
  deleteCategory,
  getCategoryById,
  listCategories,
  updateCategory,
}
