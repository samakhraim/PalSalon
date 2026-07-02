import { useEffect, useState } from "react"
import { Pencil, Trash2 } from "lucide-react"

import IndexPage from "@/components/common/IndexPage"
import { pageColumns } from "@/features/pages/config/pageColumns"
import { deletePage, getPages } from "@/features/pages/pageService"
import { useToastMessage } from "@/hooks/useToastMessage"

export default function PagesPage() {
  const { showError, showSuccess } = useToastMessage()
  const [pages, setPages] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState("")

  const loadPages = async () => {
    setIsLoading(true)
    setErrorMessage("")

    try {
      setPages(await getPages())
    } catch (error) {
      setErrorMessage(error?.response?.data?.message || "Unable to load pages")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadPages()
  }, [])

  const handleDeletePage = async (pageId) => {
    try {
      await deletePage(pageId)
      showSuccess("Page deleted successfully.")
      await loadPages()
    } catch (error) {
      setErrorMessage(showError(error, "Unable to delete page"))
    }
  }

  return (
    <IndexPage
      title="Pages"
      description="Manage reusable content pages and their cover images."
      createLabel="Add Page"
      createPath="/pages/create"
      createPermission="Pages-manage"
      data={pages}
      columns={pageColumns}
      loading={isLoading}
      error={errorMessage}
      emptyMessage="No pages found."
      actions={(page) => [
        {
          label: "Edit",
          icon: Pencil,
          to: `/pages/${page.id}/edit`,
          permission: "Pages-manage",
        },
        {
          label: "Delete",
          icon: Trash2,
          destructive: true,
          confirm: true,
          confirmTitle: "Delete page",
          confirmDescription: `This action will permanently remove ${page.title?.en || "this page"}.`,
          confirmLabel: "Delete",
          onClick: () => handleDeletePage(page.id),
          permission: "Pages-manage",
        },
      ]}
    />
  )
}
