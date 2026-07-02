import api from "@/services/api"

const appendJsonField = (formData, key, value) => {
  formData.append(key, JSON.stringify(value))
}

const buildIntroFormData = (data, files = {}) => {
  const formData = new FormData()

  appendJsonField(formData, "title", data.title)
  appendJsonField(formData, "description", data.description)

  if (files.mainImageUrl) {
    formData.append("main_image", files.mainImageUrl)
  }

  return formData
}

export async function getIntros() {
  const response = await api.get("/intros")
  return response.data.data.intros || []
}

export async function getIntroById(id) {
  const response = await api.get(`/intros/${id}`)
  return response.data.data.intro
}

export async function createIntro(data, files) {
  const response = await api.post("/intros", buildIntroFormData(data, files), {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  })

  return response.data.data.intro
}

export async function updateIntro(id, data, files) {
  const response = await api.put(
    `/intros/${id}`,
    buildIntroFormData(data, files),
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  )

  return response.data.data.intro
}

export async function deleteIntro(id) {
  await api.delete(`/intros/${id}`)
}
