import { useEffect, useState } from "react"
import { Pencil, Trash2 } from "lucide-react"

import IndexPage from "@/components/common/IndexPage"
import { serviceColumns } from "@/features/services/config/serviceColumns"
import {
  deleteService,
  getServices,
} from "@/features/services/serviceService"
import { useToastMessage } from "@/hooks/useToastMessage"

export default function ServicesPage() {
  const { showError, showSuccess } = useToastMessage()
  const [services, setServices] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState("")

  const loadServices = async () => {
    setIsLoading(true)
    setErrorMessage("")

    try {
      setServices(await getServices())
    } catch (error) {
      setErrorMessage(error?.response?.data?.message || "Unable to load services")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadServices()
  }, [])

  const handleDeleteService = async (serviceId) => {
    try {
      await deleteService(serviceId)
      showSuccess("Service deleted successfully.")
      await loadServices()
    } catch (error) {
      setErrorMessage(showError(error, "Unable to delete service"))
    }
  }

  return (
    <IndexPage
      title="Services"
      description="Manage salon services, linked categories, pricing options, and media."
      createLabel="Add New Service"
      createPath="/services/create"
      createPermission="Services-manage"
      data={services}
      columns={serviceColumns}
      loading={isLoading}
      error={errorMessage}
      emptyMessage="No services found."
      actions={(service) => [
        {
          label: "Edit",
          icon: Pencil,
          to: `/services/${service.id}/edit`,
          permission: "Services-manage",
        },
        {
          label: "Delete",
          icon: Trash2,
          destructive: true,
          confirm: true,
          confirmTitle: "Delete service",
          confirmDescription: `This action will permanently remove ${service.name?.en || "this service"}.`,
          confirmLabel: "Delete",
          onClick: () => handleDeleteService(service.id),
          permission: "Services-manage",
        },
      ]}
    />
  )
}
