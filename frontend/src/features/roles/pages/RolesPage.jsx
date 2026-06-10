import { useEffect, useState } from "react"
import { Pencil, Trash2 } from "lucide-react"

import IndexPage from "@/components/common/IndexPage"
import { roleColumns } from "@/features/roles/config/roleColumns"
import { deleteRole, getRoles } from "@/features/roles/roleService"

export default function RolesPage() {
  const [roles, setRoles] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState("")

  const loadRoles = async () => {
    setIsLoading(true)
    setErrorMessage("")

    try {
      const nextRoles = await getRoles()
      setRoles(nextRoles)
    } catch (error) {
      setErrorMessage(error?.response?.data?.message || "Unable to load roles")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadRoles()
  }, [])

  const handleDeleteRole = async (roleId) => {
    try {
      await deleteRole(roleId)
      await loadRoles()
    } catch (error) {
      setErrorMessage(error?.response?.data?.message || "Unable to delete role")
    }
  }

  return (
    <IndexPage
      title="Roles"
      description="Manage roles and permission groupings for dashboard access."
      createLabel="Create Role"
      createPath="/roles/create"
      createPermission="Role-manage"
      data={roles}
      columns={roleColumns}
      loading={isLoading}
      error={errorMessage}
      emptyMessage="No roles found."
      actions={(role) => [
        {
          label: "Edit",
          icon: Pencil,
          to: `/roles/${role.id}/edit`,
          permission: "Role-manage",
        },
        {
          label: "Delete",
          icon: Trash2,
          destructive: true,
          confirm: true,
          confirmTitle: "Delete role",
          confirmDescription: `This action will permanently remove the role ${role.name}.`,
          confirmLabel: "Delete",
          onClick: () => handleDeleteRole(role.id),
          permission: "Role-manage",
        },
      ]}
    />
  )
}
