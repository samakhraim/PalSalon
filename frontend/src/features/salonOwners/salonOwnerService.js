import api from "@/services/api"

export async function getSalonOwners() {
  const response = await api.get("/salon-owners")
  return response.data.data.salonOwners || []
}

export async function getSalonOwnerById(id) {
  const response = await api.get(`/salon-owners/${id}`)
  return response.data.data.salonOwner
}

export async function createSalonOwner(data) {
  const response = await api.post("/salon-owners", data)
  return response.data.data.salonOwner
}

export async function updateSalonOwner(id, data) {
  const response = await api.put(`/salon-owners/${id}`, data)
  return response.data.data.salonOwner
}

export async function deleteSalonOwner(id) {
  await api.delete(`/salon-owners/${id}`)
}
