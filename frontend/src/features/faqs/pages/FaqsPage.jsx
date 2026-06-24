import { useEffect, useState } from "react"
import { Pencil, Trash2 } from "lucide-react"

import IndexPage from "@/components/common/IndexPage"
import { faqColumns } from "@/features/faqs/config/faqColumns"
import { deleteFaq, getFaqs } from "@/features/faqs/faqService"
import { useToastMessage } from "@/hooks/useToastMessage"

export default function FaqsPage() {
  const { showError, showSuccess } = useToastMessage()
  const [faqs, setFaqs] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState("")

  const loadFaqs = async () => {
    setIsLoading(true)
    setErrorMessage("")

    try {
      setFaqs(await getFaqs())
    } catch (error) {
      setErrorMessage(showError(error, "Unable to load FAQs"))
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadFaqs()
  }, [])

  const handleDeleteFaq = async (faqId) => {
    try {
      await deleteFaq(faqId)
      showSuccess("FAQ deleted successfully.")
      await loadFaqs()
    } catch (error) {
      setErrorMessage(showError(error, "Unable to delete FAQ"))
    }
  }

  return (
    <IndexPage
      title="FAQ"
      description="Manage frequently asked questions and bilingual answers."
      createLabel="Add New FAQ"
      createPath="/faqs/create"
      createPermission="FAQ-manage"
      managePermission="FAQ-manage"
      data={faqs}
      columns={faqColumns}
      loading={isLoading}
      error={errorMessage}
      emptyMessage="No FAQs found."
      actions={(faq) => [
        {
          label: "Edit",
          icon: Pencil,
          to: `/faqs/${faq.id}/edit`,
          permission: "FAQ-manage",
        },
        {
          label: "Delete",
          icon: Trash2,
          destructive: true,
          confirm: true,
          confirmTitle: "Delete FAQ",
          confirmDescription: "This action will permanently remove this FAQ.",
          confirmLabel: "Delete",
          onClick: () => handleDeleteFaq(faq.id),
          permission: "FAQ-manage",
        },
      ]}
    />
  )
}
