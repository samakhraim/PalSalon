import { useEffect, useMemo, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"

import FormPage from "@/components/common/FormPage"
import { getSalonFields, createDefaultOpeningHours } from "@/features/salons/config/salonFields"
import {
  getSalonById,
  replaceSalonMainImage,
  updateSalon,
  uploadSalonGalleryImages,
} from "@/features/salons/salonService"
import { getSalonOwners } from "@/features/salonOwners/salonOwnerService"
import { getCities } from "@/features/cities/cityService"

export default function EditSalonPage() {
  const navigate = useNavigate()
  const { id } = useParams()
  const [salon, setSalon] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [salonOwnerOptions, setSalonOwnerOptions] = useState([])
  const [cityOptions, setCityOptions] = useState([])
  const fields = useMemo(
    () => getSalonFields({ salonOwnerOptions, cityOptions }),
    [salonOwnerOptions, cityOptions]
  )
  const initialValues = useMemo(() => {
    if (!salon) {
      return null
    }

    return {
      ...salon,
      mainImageUrl: salon.imageUrl || "",
      salon_phone_group: "",
      opening_hours: salon.opening_hours || createDefaultOpeningHours(),
      off_days: Array.isArray(salon.off_days) ? salon.off_days : [],
      gallery: Array.isArray(salon.gallery) ? salon.gallery : [],
    }
  }, [salon])

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true)
      setErrorMessage("")

      try {
        const [salonRecord, salonOwners, cities] = await Promise.all([
          getSalonById(id),
          getSalonOwners(),
          getCities(),
        ])

        setSalon(salonRecord)
        setSalonOwnerOptions(
          salonOwners.map((salonOwner) => ({
            label: [
              salonOwner.first_name,
              salonOwner.middle_name,
              salonOwner.last_name,
            ]
              .filter(Boolean)
              .join(" "),
            value: String(salonOwner.id),
          }))
        )
        setCityOptions(
          cities.map((city) => ({
            label: city.name?.en || city.name?.ar || `City #${city.id}`,
            value: String(city.id),
          }))
        )
      } catch (error) {
        setErrorMessage(error?.response?.data?.message || "Unable to load salon")
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [id])

  const handleSubmit = async (payload, { files }) => {
    setIsSubmitting(true)

    try {
      await updateSalon(id, payload)

      if (files.mainImageUrl) {
        await replaceSalonMainImage(id, files.mainImageUrl)
      }

      if (Array.isArray(files.gallery) && files.gallery.length > 0) {
        await uploadSalonGalleryImages(id, files.gallery)
      }

      navigate("/salons", { replace: true })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <FormPage
      title="Edit Salon"
      description="Update salon owner assignment, localized content, schedule, and media."
      formTitle="Salon Details"
      formDescription="Edit the salon and upload a new main image or more gallery images when needed."
      fields={fields}
      initialValues={initialValues}
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
      submitLabel="Update Salon"
      loading={isLoading}
      error={errorMessage}
      hideFormOnError
      mode="edit"
      formLayout="image-status-top"
      onCancel={() => navigate("/salons")}
      updateSuccessMessage="Salon updated successfully."
      transformValues={(values) => ({
        salon_owner_id: Number(values.salon_owner_id),
        city_id: values.city_id ? Number(values.city_id) : null,
        name: {
          en: values.name.en.trim(),
          ar: values.name.ar.trim(),
        },
        description: {
          en: values.description.en.trim(),
          ar: values.description.ar.trim(),
        },
        address: {
          en: values.address.en.trim(),
          ar: values.address.ar.trim(),
        },
        cancellation_policy: {
          en: values.cancellation_policy.en.trim(),
          ar: values.cancellation_policy.ar.trim(),
        },
        country_phone_code: values.country_phone_code?.trim() || null,
        telephone: values.telephone?.trim() || null,
        latitude: values.latitude?.trim() || null,
        longitude: values.longitude?.trim() || null,
        opening_hours: values.opening_hours,
        off_days: (values.off_days || []).filter(Boolean),
        isactive: values.isactive,
      })}
    />
  )
}
