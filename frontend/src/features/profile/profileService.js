import api from "@/services/api"

export async function getProfile() {
  const response = await api.get("/profile")
  return response.data.data.user
}

export async function updateProfile(data) {
  const response = await api.put("/profile", data)
  return response.data.data.user
}

export async function updateProfilePassword(data) {
  await api.put("/profile/password", data)
}
