import api from "@/services/api"

export async function getRoles() {
  const response = await api.get("/roles")
  return response.data.data.roles || []
}

export async function getRoleById(id) {
  const response = await api.get(`/roles/${id}`)
  return response.data.data.role
}

export async function createRole(data) {
  const response = await api.post("/roles", data)
  return response.data.data.role
}

export async function updateRole(id, data) {
  const response = await api.patch(`/roles/${id}`, data)
  return response.data.data.role
}

export async function deleteRole(id) {
  await api.delete(`/roles/${id}`)
}

export async function getPermissions() {
  const response = await api.get("/permissions")
  return response.data.data.permissions || []
}
