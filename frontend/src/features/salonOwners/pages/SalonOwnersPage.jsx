import { useEffect, useState } from "react"
import { Pencil, Trash2 } from "lucide-react"

import IndexPage from "@/components/common/IndexPage"
import { salonOwnerColumns } from "@/features/salonOwners/config/salonOwnerColumns"
import {
  deleteSalonOwner,
  getSalonOwners,
} from "@/features/salonOwners/salonOwnerService"
import { useToastMessage } from "@/hooks/useToastMessage"

export default function SalonOwnersPage() {
  const { showError, showSuccess } = useToastMessage()
  const [salonOwners, setSalonOwners] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState("")

  const loadSalonOwners = async () => {
    setIsLoading(true)
    setErrorMessage("")

    try {
      setSalonOwners(await getSalonOwners())
    } catch (error) {
      setErrorMessage(showError(error, "Unable to load salon owners"))
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadSalonOwners()
  }, [])

  const handleDeleteSalonOwner = async (salonOwnerId) => {
    try {
      await deleteSalonOwner(salonOwnerId)
      showSuccess("Salon owner deleted successfully.")
      await loadSalonOwners()
    } catch (error) {
      setErrorMessage(showError(error, "Unable to delete salon owner"))
    }
  }

  return (
    <IndexPage
      title="Salon Owners"
      description="Manage salon-owner accounts separately from admin users and customers."
      createLabel="Add New Salon Owner"
      createPath="/salon-owners/create"
      createPermission="SalonOwners-manage"
      managePermission="SalonOwners-manage"
      data={salonOwners}
      columns={salonOwnerColumns}
      loading={isLoading}
      error={errorMessage}
      emptyMessage="No salon owners found."
      actions={(salonOwner) => [
        {
          label: "Edit",
          icon: Pencil,
          to: `/salon-owners/${salonOwner.id}/edit`,
          permission: "SalonOwners-manage",
        },
        {
          label: "Delete",
          icon: Trash2,
          destructive: true,
          confirm: true,
          confirmTitle: "Delete salon owner",
          confirmDescription: `This action will permanently remove ${
            [salonOwner.first_name, salonOwner.last_name]
              .filter(Boolean)
              .join(" ") || "this salon owner"
          }.`,
          confirmLabel: "Delete",
          onClick: () => handleDeleteSalonOwner(salonOwner.id),
          permission: "SalonOwners-manage",
        },
      ]}
    />
  )
}
