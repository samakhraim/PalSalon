import api from "@/services/api"

export async function getCustomers() {
  const response = await api.get("/customers")
  return response.data.data.customers || []
}

export async function getCustomerById(id) {
  const response = await api.get(`/customers/${id}`)
  return response.data.data.customer
}

export async function createCustomer(data) {
  const response = await api.post("/customers", data)
  return response.data.data.customer
}

export async function updateCustomer(id, data) {
  const response = await api.put(`/customers/${id}`, data)
  return response.data.data.customer
}

export async function deleteCustomer(id) {
  await api.delete(`/customers/${id}`)
}

export async function toggleCustomerStatus(id) {
  const response = await api.patch(`/customers/${id}/toggle-status`)
  return response.data.data.customer
}

export async function uploadCustomerImage(customerId, file) {
  const formData = new FormData()
  formData.append("file", file)
  formData.append("modelType", "Customer")
  formData.append("modelId", String(customerId))
  formData.append("collectionName", "avatar")

  const response = await api.post("/media/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  })

  return response.data.data.media
}

export async function replaceCustomerImage(customerId, file) {
  const formData = new FormData()
  formData.append("file", file)
  formData.append("modelType", "Customer")
  formData.append("modelId", String(customerId))
  formData.append("collectionName", "avatar")

  const response = await api.post("/media/replace", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  })

  return response.data.data.media
}
