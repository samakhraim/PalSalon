import api from "@/services/api"

export async function getContactMessages() {
  const response = await api.get("/contact-us")
  return response.data.data.messages || []
}

export async function getContactMessageById(id) {
  const response = await api.get(`/contact-us/${id}`)
  return response.data.data.message
}

export async function markContactAsRead(id) {
  const response = await api.patch(`/contact-us/${id}/read`)
  return response.data.data.message
}

export async function markContactAsUnread(id) {
  const response = await api.patch(`/contact-us/${id}/unread`)
  return response.data.data.message
}

export async function deleteContactMessage(id) {
  await api.delete(`/contact-us/${id}`)
}

export async function submitContactMessage(data) {
  const response = await api.post("/contact-us", data)
  return response.data.data.message
}
