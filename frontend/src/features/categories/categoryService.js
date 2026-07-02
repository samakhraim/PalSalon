import api from "@/services/api"

export async function getCategories() {
  const response = await api.get("/categories")
  return response.data.data.categories || []
}

export async function getCategoryById(id) {
  const response = await api.get(`/categories/${id}`)
  return response.data.data.category
}

export async function createCategory(data) {
  const response = await api.post("/categories", data)
  return response.data.data.category
}

export async function updateCategory(id, data) {
  const response = await api.put(`/categories/${id}`, data)
  return response.data.data.category
}

export async function deleteCategory(id) {
  await api.delete(`/categories/${id}`)
}
