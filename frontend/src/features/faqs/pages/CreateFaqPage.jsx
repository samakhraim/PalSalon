import { useCallback, useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"

import FormPage from "@/components/common/FormPage"
import { getFaqFields } from "@/features/faqs/config/faqFields"
import { createFaq } from "@/features/faqs/faqService"

export default function CreateFaqPage() {
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const fields = useMemo(() => getFaqFields(), [])
  const initialValues = useMemo(
    () => ({
      question: {
        en: "",
        ar: "",
      },
      answer: {
        en: "",
        ar: "",
      },
    }),
    []
  )

  const transformValues = useCallback((values) => ({
    question: {
      en: values.question.en.trim(),
      ar: values.question.ar.trim(),
    },
    answer: {
      en: values.answer.en.trim(),
      ar: values.answer.ar.trim(),
    },
  }), [])

  const handleSubmit = useCallback(async (payload) => {
    setIsSubmitting(true)

    try {
      await createFaq(payload)
      navigate("/faqs", { replace: true })
    } finally {
      setIsSubmitting(false)
    }
  }, [navigate])

  return (
    <FormPage
      title="Create FAQ"
      description="Add a bilingual frequently asked question and answer."
      formTitle="FAQ Details"
      formDescription="Create an FAQ entry for both English and Arabic content."
      fields={fields}
      initialValues={initialValues}
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
      submitLabel="Create FAQ"
      mode="create"
      transformValues={transformValues}
      onCancel={() => navigate("/faqs")}
      createSuccessMessage="FAQ created successfully."
    />
  )
}
