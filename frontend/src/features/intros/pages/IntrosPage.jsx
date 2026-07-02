import { useEffect, useState } from "react"
import { Pencil, Trash2 } from "lucide-react"

import IndexPage from "@/components/common/IndexPage"
import { introColumns } from "@/features/intros/config/introColumns"
import { deleteIntro, getIntros } from "@/features/intros/introService"
import { useToastMessage } from "@/hooks/useToastMessage"

export default function IntrosPage() {
  const { showError, showSuccess } = useToastMessage()
  const [intros, setIntros] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState("")

  const loadIntros = async () => {
    setIsLoading(true)
    setErrorMessage("")

    try {
      setIntros(await getIntros())
    } catch (error) {
      setErrorMessage(error?.response?.data?.message || "Unable to load intros")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadIntros()
  }, [])

  const handleDeleteIntro = async (introId) => {
    try {
      await deleteIntro(introId)
      showSuccess("Intro deleted successfully.")
      await loadIntros()
    } catch (error) {
      setErrorMessage(showError(error, "Unable to delete intro"))
    }
  }

  return (
    <IndexPage
      title="Intros"
      description="Manage intro blocks and their main media-backed images."
      createLabel="Add Intro"
      createPath="/intros/create"
      createPermission="Intros-manage"
      data={intros}
      columns={introColumns}
      loading={isLoading}
      error={errorMessage}
      emptyMessage="No intros found."
      actions={(intro) => [
        {
          label: "Edit",
          icon: Pencil,
          to: `/intros/${intro.id}/edit`,
          permission: "Intros-manage",
        },
        {
          label: "Delete",
          icon: Trash2,
          destructive: true,
          confirm: true,
          confirmTitle: "Delete intro",
          confirmDescription: `This action will permanently remove ${intro.title?.en || "this intro"}.`,
          confirmLabel: "Delete",
          onClick: () => handleDeleteIntro(intro.id),
          permission: "Intros-manage",
        },
      ]}
    />
  )
}
