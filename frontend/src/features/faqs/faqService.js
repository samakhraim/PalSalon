import api from "@/services/api"

export async function getFaqs() {
  const response = await api.get("/faqs")
  return response.data.data.faqs || []
}

export async function getFaqById(id) {
  const response = await api.get(`/faqs/${id}`)
  return response.data.data.faq
}

export async function createFaq(data) {
  const response = await api.post("/faqs", data)
  return response.data.data.faq
}

export async function updateFaq(id, data) {
  const response = await api.put(`/faqs/${id}`, data)
  return response.data.data.faq
}

export async function deleteFaq(id) {
  await api.delete(`/faqs/${id}`)
}
