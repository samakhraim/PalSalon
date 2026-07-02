import api from "@/services/api"

const appendJsonField = (formData, key, value) => {
  formData.append(key, JSON.stringify(value))
}

const buildPageFormData = (data, files = {}) => {
  const formData = new FormData()

  appendJsonField(formData, "title", data.title)
  formData.append("slug", data.slug ?? "")
  appendJsonField(formData, "description", data.description)
  formData.append("status", String(Boolean(data.status)))

  if (files.mainImageUrl) {
    formData.append("main_image", files.mainImageUrl)
  }

  return formData
}

export async function getPages() {
  const response = await api.get("/pages")
  return response.data.data.pages || []
}

export async function getPageById(id) {
  const response = await api.get(`/pages/${id}`)
  return response.data.data.page
}

export async function createPage(data, files) {
  const response = await api.post("/pages", buildPageFormData(data, files), {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  })

  return response.data.data.page
}

export async function updatePage(id, data, files) {
  const response = await api.put(`/pages/${id}`, buildPageFormData(data, files), {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  })

  return response.data.data.page
}

export async function deletePage(id) {
  await api.delete(`/pages/${id}`)
}
