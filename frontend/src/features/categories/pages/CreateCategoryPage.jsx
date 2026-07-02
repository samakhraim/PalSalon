import { useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"

import FormPage from "@/components/common/FormPage"
import { getCategoryFields } from "@/features/categories/config/categoryFields"
import { createCategory } from "@/features/categories/categoryService"

export default function CreateCategoryPage() {
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const fields = useMemo(() => getCategoryFields(), [])

  const handleSubmit = async (payload) => {
    setIsSubmitting(true)

    try {
      await createCategory(payload)
      navigate("/categories", { replace: true })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <FormPage
      title="Create Category"
      description="Add a reusable service category with localized naming and visibility state."
      formTitle="Category Details"
      formDescription="Categories group the services that each salon can offer."
      fields={fields}
      initialValues={{
        name: { en: "", ar: "" },
        description: { en: "", ar: "" },
        isactive: false,
      }}
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
      submitLabel="Create Category"
      mode="create"
      formLayout="image-status-top"
      createSuccessMessage="Category created successfully."
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
