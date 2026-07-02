import api from "@/services/api"

const appendJsonField = (formData, key, value) => {
  formData.append(key, JSON.stringify(value))
}

const buildServiceFormData = (data, files = {}) => {
  const formData = new FormData()

  formData.append("salon_id", String(data.salon_id))
  formData.append("category_id", String(data.category_id))
  appendJsonField(formData, "name", data.name)
  appendJsonField(formData, "description", data.description)
  formData.append(
    "duration_minutes",
    data.duration_minutes === null || data.duration_minutes === undefined
      ? ""
      : String(data.duration_minutes)
  )
  formData.append("isactive", String(Boolean(data.isactive)))
  appendJsonField(formData, "price_options", data.price_options)

  if (files.mainImageUrl) {
    formData.append("main_image", files.mainImageUrl)
  }

  if (Array.isArray(files.gallery)) {
    files.gallery.forEach((file) => formData.append("gallery", file))
  }

  return formData
}

export async function getServices() {
  const response = await api.get("/services")
  return response.data.data.services || []
}

export async function getServiceById(id) {
  const response = await api.get(`/services/${id}`)
  return response.data.data.service
}

export async function createService(data, files) {
  const response = await api.post("/services", buildServiceFormData(data, files), {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  })

  return response.data.data.service
}

export async function updateService(id, data, files) {
  const response = await api.put(
    `/services/${id}`,
    buildServiceFormData(data, files),
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  )

  return response.data.data.service
}

export async function deleteService(id) {
  await api.delete(`/services/${id}`)
}
