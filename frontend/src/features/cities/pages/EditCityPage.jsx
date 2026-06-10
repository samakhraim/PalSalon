import { useEffect, useMemo, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"

import FormPage from "@/components/common/FormPage"
import { getCityFields } from "@/features/cities/config/cityFields"
import {
  getCityById,
  replaceCityImage,
  updateCity,
} from "@/features/cities/cityService"
import { useAuth } from "@/hooks/useAuth"
import { hasPermission } from "@/utils/permissions"

export default function EditCityPage() {
  const navigate = useNavigate()
  const { id } = useParams()
  const { refreshCurrentUser } = useAuth()
  const [city, setCity] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const fields = useMemo(() => getCityFields(), [])

  useEffect(() => {
    const loadCity = async () => {
      setIsLoading(true)
      setErrorMessage("")

      try {
        const currentCity = await getCityById(id)
        setCity(currentCity)
      } catch (error) {
        setErrorMessage(error?.response?.data?.message || "Unable to load city")
      } finally {
        setIsLoading(false)
      }
    }

    loadCity()
  }, [id])

  const handleSubmit = async (payload, { files }) => {
    setIsSubmitting(true)

    try {
      const nextPayload = { ...payload }

      if (files.image) {
        const media = await replaceCityImage(id, files.image)
        nextPayload.image = media.url
      }

      await updateCity(id, nextPayload)
      const nextUser = await refreshCurrentUser()
      navigate(
        hasPermission(nextUser, "Cities-view") ? "/cities" : "/dashboard",
        { replace: true }
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <FormPage
      title="Edit City"
      description="Update bilingual content, device-uploaded image, and visibility status."
      formTitle="City Details"
      formDescription="Edit the city and keep the status exactly as selected."
      fields={fields}
      initialValues={city}
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
      submitLabel="Update City"
      loading={isLoading}
      error={errorMessage}
      hideFormOnError
      mode="edit"
      transformValues={(values) => ({
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
      })}
    />
  )
}
