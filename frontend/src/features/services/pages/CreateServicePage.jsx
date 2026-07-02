import { useEffect, useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"

import FormPage from "@/components/common/FormPage"
import { getCategories } from "@/features/categories/categoryService"
import { getSalons } from "@/features/salons/salonService"
import {
  createDefaultPriceOptions,
  getServiceFields,
} from "@/features/services/config/serviceFields"
import { createService } from "@/features/services/serviceService"

export default function CreateServicePage() {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [salonOptions, setSalonOptions] = useState([])
  const [categoryOptions, setCategoryOptions] = useState([])
  const fields = useMemo(
    () => getServiceFields({ salonOptions, categoryOptions }),
    [salonOptions, categoryOptions]
  )

  useEffect(() => {
    const loadOptions = async () => {
      setIsLoading(true)
      setErrorMessage("")

      try {
        const [salons, categories] = await Promise.all([
          getSalons(),
          getCategories(),
        ])

        setSalonOptions(
          salons.map((salon) => ({
            label: salon.name?.en || salon.name?.ar || `Salon #${salon.id}`,
            value: String(salon.id),
          }))
        )
        setCategoryOptions(
          categories.map((category) => ({
            label:
              category.name?.en || category.name?.ar || `Category #${category.id}`,
            value: String(category.id),
          }))
        )
      } catch (error) {
        setErrorMessage(
          error?.response?.data?.message || "Unable to load service form options"
        )
      } finally {
        setIsLoading(false)
      }
    }

    loadOptions()
  }, [])

  const handleSubmit = async (payload, { files }) => {
    setIsSubmitting(true)

    try {
      await createService(payload, files)
      navigate("/services", { replace: true })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <FormPage
      title="Create Service"
      description="Create a salon service with bilingual content, price options, and media uploads."
      formTitle="Service Details"
      formDescription="Choose the salon and category, then add flexible price options for the service."
      fields={fields}
      initialValues={{
        mainImageUrl: "",
        isactive: false,
        salon_id: "",
        category_id: "",
        name: { en: "", ar: "" },
        description: { en: "", ar: "" },
        duration_minutes: "",
        price_options: createDefaultPriceOptions(),
        gallery: [],
      }}
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
      submitLabel="Create Service"
      loading={isLoading}
      error={errorMessage}
      hideFormOnError
      mode="create"
      formLayout="image-status-top"
      onCancel={() => navigate("/services")}
      createSuccessMessage="Service created successfully."
      transformValues={(values) => ({
        salon_id: Number(values.salon_id),
        category_id: Number(values.category_id),
        name: {
          en: values.name.en.trim(),
          ar: values.name.ar.trim(),
        },
        description: {
          en: values.description.en.trim(),
          ar: values.description.ar.trim(),
        },
        duration_minutes:
          values.duration_minutes === "" ? null : Number(values.duration_minutes),
        isactive: values.isactive,
        price_options: (values.price_options || []).map((option, index) => ({
          id: option.id,
          name: {
            en: option.name.en.trim(),
            ar: option.name.ar.trim(),
          },
          price: Number(option.price),
          discount_price:
            option.discount_price === "" ? null : Number(option.discount_price),
          duration_minutes:
            option.duration_minutes === "" ? null : Number(option.duration_minutes),
          is_default:
            index === 0 && !(values.price_options || []).some((item) => item.is_default)
              ? true
              : Boolean(option.is_default),
          isactive: Boolean(option.isactive),
        })),
      })}
    />
  )
}
