import api from "@/services/api"

export async function getCities() {
  const response = await api.get("/cities")
  return response.data.data.cities || []
}

export async function getCityById(id) {
  const response = await api.get(`/cities/${id}`)
  return response.data.data.city
}

export async function createCity(data) {
  const response = await api.post("/cities", data)
  return response.data.data.city
}

export async function updateCity(id, data) {
  const response = await api.patch(`/cities/${id}`, data)
  return response.data.data.city
}

export async function deleteCity(id) {
  await api.delete(`/cities/${id}`)
}

export async function toggleCityStatus(id) {
  const response = await api.patch(`/cities/${id}/toggle-status`)
  return response.data.data.city
}

export async function uploadCityImage(cityId, file) {
  const formData = new FormData()
  formData.append("file", file)
  formData.append("modelType", "City")
  formData.append("modelId", String(cityId))
  formData.append("collectionName", "image")

  const response = await api.post("/media/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  })

  return response.data.data.media
}

export async function replaceCityImage(cityId, file) {
  const formData = new FormData()
  formData.append("file", file)
  formData.append("modelType", "City")
  formData.append("modelId", String(cityId))
  formData.append("collectionName", "image")

  const response = await api.post("/media/replace", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  })

  return response.data.data.media
}
