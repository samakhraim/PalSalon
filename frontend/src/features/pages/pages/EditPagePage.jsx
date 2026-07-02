import { useEffect, useMemo, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"

import FormPage from "@/components/common/FormPage"
import { getPageFields } from "@/features/pages/config/pageFields"
import { getPageById, updatePage } from "@/features/pages/pageService"

export default function EditPagePage() {
  const navigate = useNavigate()
  const { id } = useParams()
  const [page, setPage] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const fields = useMemo(() => getPageFields(), [])

  useEffect(() => {
    const loadPage = async () => {
      setIsLoading(true)
      setErrorMessage("")

      try {
        setPage(await getPageById(id))
      } catch (error) {
        setErrorMessage(error?.response?.data?.message || "Unable to load page")
      } finally {
        setIsLoading(false)
      }
    }

    loadPage()
  }, [id])

  const initialValues = useMemo(() => {
    if (!page) {
      return null
    }

    return {
      ...page,
      mainImageUrl: page.imageUrl || "",
    }
  }, [page])

  const handleSubmit = async (payload, { files }) => {
    setIsSubmitting(true)

    try {
      await updatePage(id, payload, files)
      navigate("/pages", { replace: true })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <FormPage
      title="Edit Page"
      description="Update page content and replace the main image through the existing media system."
      formTitle="Page Details"
      formDescription="Edit the page title, slug, localized description, and status."
      fields={fields}
      initialValues={initialValues}
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
      submitLabel="Update Page"
      loading={isLoading}
      error={errorMessage}
      hideFormOnError
      mode="edit"
      formLayout="image-status-top"
      updateSuccessMessage="Page updated successfully."
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
