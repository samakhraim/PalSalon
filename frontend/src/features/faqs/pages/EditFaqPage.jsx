import { useCallback, useEffect, useMemo, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"

import FormPage from "@/components/common/FormPage"
import { getFaqFields } from "@/features/faqs/config/faqFields"
import { getFaqById, updateFaq } from "@/features/faqs/faqService"

export default function EditFaqPage() {
  const navigate = useNavigate()
  const { id } = useParams()
  const [faq, setFaq] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const fields = useMemo(() => getFaqFields(), [])

  useEffect(() => {
    const loadFaq = async () => {
      setIsLoading(true)
      setErrorMessage("")

      try {
        setFaq(await getFaqById(id))
      } catch (error) {
        setErrorMessage(error?.response?.data?.message || "Unable to load FAQ")
      } finally {
        setIsLoading(false)
      }
    }

    loadFaq()
  }, [id])

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
      await updateFaq(id, payload)
      navigate("/faqs", { replace: true })
    } finally {
      setIsSubmitting(false)
    }
  }, [id, navigate])

  return (
    <FormPage
      title="Edit FAQ"
      description="Update bilingual FAQ content."
      formTitle="FAQ Details"
      formDescription="Edit the question and answer in English and Arabic."
      fields={fields}
      initialValues={faq}
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
      submitLabel="Update FAQ"
      loading={isLoading}
      error={errorMessage}
      hideFormOnError
      mode="edit"
      transformValues={transformValues}
      onCancel={() => navigate("/faqs")}
      updateSuccessMessage="FAQ updated successfully."
    />
  )
}
