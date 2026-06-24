import { useEffect, useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"

import FormPage from "@/components/common/FormPage"
import { getSalonFields, createDefaultOpeningHours } from "@/features/salons/config/salonFields"
import {
  createSalon,
  uploadSalonGalleryImages,
  uploadSalonMainImage,
} from "@/features/salons/salonService"
import { getSalonOwners } from "@/features/salonOwners/salonOwnerService"
import { getCities } from "@/features/cities/cityService"

export default function CreateSalonPage() {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [salonOwnerOptions, setSalonOwnerOptions] = useState([])
  const [cityOptions, setCityOptions] = useState([])
  const fields = useMemo(
    () => getSalonFields({ salonOwnerOptions, cityOptions }),
    [salonOwnerOptions, cityOptions]
  )
  const initialValues = useMemo(
    () => ({
      mainImageUrl: "",
      isactive: false,
      salon_owner_id: "",
      city_id: "",
      name: { en: "", ar: "" },
      description: { en: "", ar: "" },
      address: { en: "", ar: "" },
      cancellation_policy: { en: "", ar: "" },
      country_phone_code: "",
      telephone: "",
      salon_phone_group: "",
      latitude: "",
      longitude: "",
      opening_hours: createDefaultOpeningHours(),
      off_days: [],
      gallery: [],
    }),
    []
  )

  useEffect(() => {
    const loadOptions = async () => {
      setIsLoading(true)
      setErrorMessage("")

      try {
        const [salonOwners, cities] = await Promise.all([
          getSalonOwners(),
          getCities(),
        ])

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
        setErrorMessage(error?.response?.data?.message || "Unable to load salon form options")
      } finally {
        setIsLoading(false)
      }
    }

    loadOptions()
  }, [])

  const handleSubmit = async (payload, { files }) => {
    setIsSubmitting(true)

    try {
      const salon = await createSalon(payload)

      if (files.mainImageUrl) {
        await uploadSalonMainImage(salon.id, files.mainImageUrl)
      }

      if (Array.isArray(files.gallery) && files.gallery.length > 0) {
        await uploadSalonGalleryImages(salon.id, files.gallery)
      }

      navigate("/salons", { replace: true })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <FormPage
      title="Create Salon"
      description="Create a salon, assign its owner, and manage localized details and media."
      formTitle="Salon Details"
      formDescription="Set salon owner, city, weekly hours, and media using the shared dashboard tools."
      fields={fields}
      initialValues={initialValues}
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
      submitLabel="Create Salon"
      loading={isLoading}
      error={errorMessage}
      hideFormOnError
      mode="create"
      formLayout="image-status-top"
      onCancel={() => navigate("/salons")}
      createSuccessMessage="Salon created successfully."
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
