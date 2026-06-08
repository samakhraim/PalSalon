import api from "@/services/api"

export async function loginRequest(credentials) {
  const response = await api.post("/auth/login", credentials)
  const payload = response?.data?.data

  return {
    token: payload?.token,
    user: payload?.user,
  }
}

export async function logoutRequest() {
  await api.post("/auth/logout")
}

export async function meRequest() {
  const response = await api.get("/auth/me")
  return response?.data?.data?.user
}
