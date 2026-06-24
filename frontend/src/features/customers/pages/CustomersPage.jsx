import { useEffect, useState } from "react"
import { Pencil, RefreshCcw, Trash2 } from "lucide-react"

import IndexPage from "@/components/common/IndexPage"
import { customerColumns } from "@/features/customers/config/customerColumns"
import {
  deleteCustomer,
  getCustomers,
  toggleCustomerStatus,
} from "@/features/customers/customerService"
import { useToastMessage } from "@/hooks/useToastMessage"

export default function CustomersPage() {
  const { showError, showSuccess } = useToastMessage()
  const [customers, setCustomers] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState("")

  const loadCustomers = async () => {
    setIsLoading(true)
    setErrorMessage("")

    try {
      setCustomers(await getCustomers())
    } catch (error) {
      setErrorMessage(showError(error, "Unable to load customers"))
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadCustomers()
  }, [])

  const handleDeleteCustomer = async (customerId) => {
    try {
      await deleteCustomer(customerId)
      showSuccess("Customer deleted successfully.")
      await loadCustomers()
    } catch (error) {
      setErrorMessage(showError(error, "Unable to delete customer"))
    }
  }

  const handleToggleStatus = async (customerId) => {
    try {
      await toggleCustomerStatus(customerId)
      showSuccess("Customer updated successfully.")
      await loadCustomers()
    } catch (error) {
      setErrorMessage(showError(error, "Unable to update customer status"))
    }
  }

  return (
    <IndexPage
      title="Customers"
      description="Manage mobile app customers separately from dashboard users."
      createLabel="Add New Customer"
      createPath="/customers/create"
      createPermission="Customers-manage"
      managePermission="Customers-manage"
      data={customers}
      columns={customerColumns}
      loading={isLoading}
      error={errorMessage}
      emptyMessage="No customers found."
      actions={(customer) => [
        {
          label: "Edit",
          icon: Pencil,
          to: `/customers/${customer.id}/edit`,
          permission: "Customers-manage",
        },
        {
          label: "Toggle Status",
          icon: RefreshCcw,
          onClick: () => handleToggleStatus(customer.id),
          permission: "Customers-manage",
        },
        {
          label: "Delete",
          icon: Trash2,
          destructive: true,
          confirm: true,
          confirmTitle: "Delete customer",
          confirmDescription: `This action will permanently remove ${
            [customer.first_name, customer.last_name].filter(Boolean).join(" ") ||
            "this customer"
          }.`,
          confirmLabel: "Delete",
          onClick: () => handleDeleteCustomer(customer.id),
          permission: "Customers-manage",
        },
      ]}
    />
  )
}
