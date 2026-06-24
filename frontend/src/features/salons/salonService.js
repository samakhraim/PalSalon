import api from "@/services/api"

export async function getSalons() {
  const response = await api.get("/salons")
  return response.data.data.salons || []
}

export async function getSalonById(id) {
  const response = await api.get(`/salons/${id}`)
  return response.data.data.salon
}

export async function createSalon(data) {
  const response = await api.post("/salons", data)
  return response.data.data.salon
}

export async function updateSalon(id, data) {
  const response = await api.put(`/salons/${id}`, data)
  return response.data.data.salon
}

export async function deleteSalon(id) {
  await api.delete(`/salons/${id}`)
}

export async function incrementSalonClick(id) {
  const response = await api.patch(`/salons/${id}/click`)
  return response.data.data.salon
}

export async function uploadSalonMainImage(salonId, file) {
  const formData = new FormData()
  formData.append("file", file)
  formData.append("modelType", "Salon")
  formData.append("modelId", String(salonId))
  formData.append("collectionName", "main_image")

  const response = await api.post("/media/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  })

  return response.data.data.media
}

export async function replaceSalonMainImage(salonId, file) {
  const formData = new FormData()
  formData.append("file", file)
  formData.append("modelType", "Salon")
  formData.append("modelId", String(salonId))
  formData.append("collectionName", "main_image")

  const response = await api.post("/media/replace", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  })

  return response.data.data.media
}

export async function uploadSalonGalleryImages(salonId, files = []) {
  const formData = new FormData()
  files.forEach((file) => formData.append("files", file))
  formData.append("modelType", "Salon")
  formData.append("modelId", String(salonId))
  formData.append("collectionName", "gallery")

  const response = await api.post("/media/upload-multiple", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  })

  return response.data.data.media || []
}
