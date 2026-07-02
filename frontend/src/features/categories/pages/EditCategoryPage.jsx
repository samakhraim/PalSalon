import { useEffect, useMemo, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"

import FormPage from "@/components/common/FormPage"
import { getCategoryFields } from "@/features/categories/config/categoryFields"
import {
  getCategoryById,
  updateCategory,
} from "@/features/categories/categoryService"

export default function EditCategoryPage() {
  const navigate = useNavigate()
  const { id } = useParams()
  const [category, setCategory] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const fields = useMemo(() => getCategoryFields(), [])

  useEffect(() => {
    const loadCategory = async () => {
      setIsLoading(true)
      setErrorMessage("")

      try {
        setCategory(await getCategoryById(id))
      } catch (error) {
        setErrorMessage(error?.response?.data?.message || "Unable to load category")
      } finally {
        setIsLoading(false)
      }
    }

    loadCategory()
  }, [id])

  const handleSubmit = async (payload) => {
    setIsSubmitting(true)

    try {
      await updateCategory(id, payload)
      navigate("/categories", { replace: true })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <FormPage
      title="Edit Category"
      description="Update a service category without affecting the rest of the dashboard."
      formTitle="Category Details"
      formDescription="Adjust localized naming, descriptions, and visibility."
      fields={fields}
      initialValues={category}
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
      submitLabel="Update Category"
      loading={isLoading}
      error={errorMessage}
      hideFormOnError
      mode="edit"
      formLayout="image-status-top"
      updateSuccessMessage="Category updated successfully."
      onCancel={() => navigate("/categories")}
      transformValues={(values) => ({
        name: {
          en: values.name.en.trim(),
          ar: values.name.ar.trim(),
        },
        description: {
          en: values.description.en.trim(),
          ar: values.description.ar.trim(),
        },
        isactive: values.isactive,
      })}
    />
  )
}
