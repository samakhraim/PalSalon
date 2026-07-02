import { useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"

import FormPage from "@/components/common/FormPage"
import { getIntroFields } from "@/features/intros/config/introFields"
import { createIntro } from "@/features/intros/introService"

export default function CreateIntroPage() {
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const fields = useMemo(() => getIntroFields(), [])

  const handleSubmit = async (payload, { files }) => {
    setIsSubmitting(true)

    try {
      await createIntro(payload, files)
      navigate("/intros", { replace: true })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <FormPage
      title="Create Intro"
      description="Add an intro section with bilingual content and a main image."
      formTitle="Intro Details"
      formDescription="Use the shared media flow for the intro image."
      fields={fields}
      initialValues={{
        mainImageUrl: "",
        title: { en: "", ar: "" },
        description: { en: "", ar: "" },
      }}
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
      submitLabel="Create Intro"
      mode="create"
      formLayout="image-status-top"
      createSuccessMessage="Intro created successfully."
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
