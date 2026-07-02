import { useEffect, useMemo, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"

import FormPage from "@/components/common/FormPage"
import { getCategories } from "@/features/categories/categoryService"
import { getSalons } from "@/features/salons/salonService"
import {
  createDefaultPriceOptions,
  getServiceFields,
} from "@/features/services/config/serviceFields"
import {
  getServiceById,
  updateService,
} from "@/features/services/serviceService"

export default function EditServicePage() {
  const navigate = useNavigate()
  const { id } = useParams()
  const [service, setService] = useState(null)
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
    const loadData = async () => {
      setIsLoading(true)
      setErrorMessage("")

      try {
        const [serviceRecord, salons, categories] = await Promise.all([
          getServiceById(id),
          getSalons(),
          getCategories(),
        ])

        setService(serviceRecord)
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
        setErrorMessage(error?.response?.data?.message || "Unable to load service")
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [id])

  const initialValues = useMemo(() => {
    if (!service) {
      return null
    }

    return {
      ...service,
      salon_id: String(service.salon_id),
      category_id: String(service.category_id),
      mainImageUrl: service.imageUrl || "",
      duration_minutes:
        service.duration_minutes === null || service.duration_minutes === undefined
          ? ""
          : String(service.duration_minutes),
      price_options:
        Array.isArray(service.price_options) && service.price_options.length > 0
          ? service.price_options.map((option) => ({
              ...option,
              price:
                option.price === null || option.price === undefined
                  ? ""
                  : String(option.price),
              discount_price:
                option.discount_price === null || option.discount_price === undefined
                  ? ""
                  : String(option.discount_price),
              duration_minutes:
                option.duration_minutes === null || option.duration_minutes === undefined
                  ? ""
                  : String(option.duration_minutes),
            }))
          : createDefaultPriceOptions(),
      gallery: Array.isArray(service.gallery) ? service.gallery : [],
    }
  }, [service])

  const handleSubmit = async (payload, { files }) => {
    setIsSubmitting(true)

    try {
      await updateService(id, payload, files)
      navigate("/services", { replace: true })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <FormPage
      title="Edit Service"
      description="Update localized service content, price options, and media for an existing salon service."
      formTitle="Service Details"
      formDescription="You can replace the main image and add more gallery images without leaving the form."
      fields={fields}
      initialValues={initialValues}
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
      submitLabel="Update Service"
      loading={isLoading}
      error={errorMessage}
      hideFormOnError
      mode="edit"
      formLayout="image-status-top"
      onCancel={() => navigate("/services")}
      updateSuccessMessage="Service updated successfully."
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
          id: option.id ? Number(option.id) : undefined,
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
