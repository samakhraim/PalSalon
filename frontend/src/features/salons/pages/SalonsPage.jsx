import { useEffect, useState } from "react"
import { Pencil, Trash2 } from "lucide-react"

import IndexPage from "@/components/common/IndexPage"
import { salonColumns } from "@/features/salons/config/salonColumns"
import { deleteSalon, getSalons } from "@/features/salons/salonService"
import { useToastMessage } from "@/hooks/useToastMessage"

export default function SalonsPage() {
  const { showError, showSuccess } = useToastMessage()
  const [salons, setSalons] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState("")

  const loadSalons = async () => {
    setIsLoading(true)
    setErrorMessage("")

    try {
      setSalons(await getSalons())
    } catch (error) {
      setErrorMessage(showError(error, "Unable to load salons"))
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadSalons()
  }, [])

  const handleDeleteSalon = async (salonId) => {
    try {
      await deleteSalon(salonId)
      showSuccess("Salon deleted successfully.")
      await loadSalons()
    } catch (error) {
      setErrorMessage(showError(error, "Unable to delete salon"))
    }
  }

  return (
    <IndexPage
      title="Salons"
      description="Manage salons, their owner assignments, localized content, and media."
      createLabel="Add New Salon"
      createPath="/salons/create"
      createPermission="Salons-manage"
      managePermission="Salons-manage"
      data={salons}
      columns={salonColumns}
      loading={isLoading}
      error={errorMessage}
      emptyMessage="No salons found."
      actions={(salon) => [
        {
          label: "Edit",
          icon: Pencil,
          to: `/salons/${salon.id}/edit`,
          permission: "Salons-manage",
        },
        {
          label: "Delete",
          icon: Trash2,
          destructive: true,
          confirm: true,
          confirmTitle: "Delete salon",
          confirmDescription: `This action will permanently remove ${
            salon.name?.en || salon.name?.ar || "this salon"
          }.`,
          confirmLabel: "Delete",
          onClick: () => handleDeleteSalon(salon.id),
          permission: "Salons-manage",
        },
      ]}
    />
  )
}
