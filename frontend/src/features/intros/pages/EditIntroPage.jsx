import { useEffect, useMemo, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"

import FormPage from "@/components/common/FormPage"
import { getIntroFields } from "@/features/intros/config/introFields"
import { getIntroById, updateIntro } from "@/features/intros/introService"

export default function EditIntroPage() {
  const navigate = useNavigate()
  const { id } = useParams()
  const [intro, setIntro] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const fields = useMemo(() => getIntroFields(), [])

  useEffect(() => {
    const loadIntro = async () => {
      setIsLoading(true)
      setErrorMessage("")

      try {
        setIntro(await getIntroById(id))
      } catch (error) {
        setErrorMessage(error?.response?.data?.message || "Unable to load intro")
      } finally {
        setIsLoading(false)
      }
    }

    loadIntro()
  }, [id])

  const initialValues = useMemo(() => {
    if (!intro) {
      return null
    }

    return {
      ...intro,
      mainImageUrl: intro.imageUrl || "",
    }
  }, [intro])

  const handleSubmit = async (payload, { files }) => {
    setIsSubmitting(true)

    try {
      await updateIntro(id, payload, files)
      navigate("/intros", { replace: true })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <FormPage
      title="Edit Intro"
      description="Update intro content and replace its image using the shared media flow."
      formTitle="Intro Details"
      formDescription="Keep title and description localized while reusing the dashboard image uploader."
      fields={fields}
      initialValues={initialValues}
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
      submitLabel="Update Intro"
      loading={isLoading}
      error={errorMessage}
      hideFormOnError
      mode="edit"
      formLayout="image-status-top"
      updateSuccessMessage="Intro updated successfully."
      onCancel={() => navigate("/intros")}
      transformValues={(values) => ({
        title: {
          en: values.title.en.trim(),
          ar: values.title.ar.trim(),
        },
        description: {
          en: values.description.en.trim(),
          ar: values.description.ar.trim(),
        },
      })}
    />
  )
}
