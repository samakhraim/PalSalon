import { useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"

import FormPage from "@/components/common/FormPage"
import { getPageFields } from "@/features/pages/config/pageFields"
import { createPage } from "@/features/pages/pageService"

export default function CreatePagePage() {
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const fields = useMemo(() => getPageFields(), [])

  const handleSubmit = async (payload, { files }) => {
    setIsSubmitting(true)

    try {
      await createPage(payload, files)
      navigate("/pages", { replace: true })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <FormPage
      title="Create Page"
      description="Add a bilingual page with a single media-backed main image."
      formTitle="Page Details"
      formDescription="Use the shared media system for the page image and keep the page visible state under control."
      fields={fields}
      initialValues={{
        mainImageUrl: "",
        title: { en: "", ar: "" },
        slug: "",
        description: { en: "", ar: "" },
        status: true,
      }}
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
      submitLabel="Create Page"
      mode="create"
      formLayout="image-status-top"
      createSuccessMessage="Page created successfully."
      onCancel={() => navigate("/pages")}
      transformValues={(values) => ({
        title: {
          en: values.title.en.trim(),
          ar: values.title.ar.trim(),
        },
        slug: values.slug?.trim() || null,
        description: {
          en: values.description.en.trim(),
          ar: values.description.ar.trim(),
        },
        status: values.status,
      })}
    />
  )
}
