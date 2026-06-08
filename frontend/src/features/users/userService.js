import api from "@/services/api"

export async function getUsers() {
  const response = await api.get("/users")
  return response.data.data.users || []
}

export async function getUserById(id) {
  const response = await api.get(`/users/${id}`)
  return response.data.data.user
}

export async function createUser(data) {
  const response = await api.post("/users", data)
  return response.data.data.user
}

export async function updateUser(id, data) {
  const response = await api.patch(`/users/${id}`, data)
  return response.data.data.user
}

export async function deleteUser(id) {
  await api.delete(`/users/${id}`)
}

export async function getAvailableRoles() {
  const response = await api.get("/roles")
  return response.data.data.roles || []
}
