import { useCallback, useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"

import FormPage from "@/components/common/FormPage"
import { getCityFields } from "@/features/cities/config/cityFields"
import {
  createCity,
  deleteCity,
  updateCity,
  uploadCityImage,
} from "@/features/cities/cityService"

export default function CreateCityPage() {
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const fields = useMemo(() => getCityFields(), [])
  const initialValues = useMemo(
    () => ({
      name: {
        en: "",
        ar: "",
      },
      description: {
        en: "",
        ar: "",
      },
      image: "",
      status: true,
    }),
    []
  )

  const transformValues = useCallback((values) => ({
    name: {
      en: values.name.en.trim(),
      ar: values.name.ar.trim(),
    },
    description: {
      en: values.description.en.trim(),
      ar: values.description.ar.trim(),
    },
    image: values.image?.trim() || null,
    status: values.status,
  }), [])

  const handleSubmit = useCallback(async (payload, { files }) => {
    setIsSubmitting(true)

    try {
      const createdCity = await createCity({
        ...payload,
        image: files.image ? null : payload.image,
      })

      if (files.image) {
        try {
          const media = await uploadCityImage(createdCity.id, files.image)
          await updateCity(createdCity.id, {
            image: media.url,
          })
        } catch (error) {
          await deleteCity(createdCity.id)
          throw error
        }
      }

      navigate("/cities", { replace: true })
    } finally {
      setIsSubmitting(false)
    }
  }, [navigate])

  return (
    <FormPage
      title="Create City"
      description="Add a city with bilingual content, a device-uploaded image, and visibility status."
      formTitle="City Details"
      formDescription="Create a city and decide whether it should be visible elsewhere later."
      fields={fields}
      initialValues={initialValues}
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
      submitLabel="Create City"
      mode="create"
      transformValues={transformValues}
    />
  )
}
