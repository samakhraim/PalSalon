import { useEffect, useState } from "react"
import { Pencil, Trash2 } from "lucide-react"

import IndexPage from "@/components/common/IndexPage"
import { userColumns } from "@/features/users/config/userColumns"
import { deleteUser, getUsers } from "@/features/users/userService"
import { useToastMessage } from "@/hooks/useToastMessage"

export default function UsersPage() {
  const { showError, showSuccess } = useToastMessage()
  const [users, setUsers] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState("")

  const loadUsers = async () => {
    setIsLoading(true)
    setErrorMessage("")

    try {
      const nextUsers = await getUsers()
      setUsers(nextUsers)
    } catch (error) {
      setErrorMessage(error?.response?.data?.message || "Unable to load users")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadUsers()
  }, [])

  const handleDeleteUser = async (userId) => {
    try {
      await deleteUser(userId)
      showSuccess("User deleted successfully.")
      await loadUsers()
    } catch (error) {
      setErrorMessage(showError(error, "Unable to delete user"))
    }
  }

  return (
    <IndexPage
      title="Users"
      description="Manage admin users, roles, and direct permissions."
      createLabel="Create User"
      createPath="/users/create"
      createPermission="Users-manage"
      data={users}
      columns={userColumns}
      loading={isLoading}
      error={errorMessage}
      emptyMessage="No users found."
      actions={(user) => [
        {
          label: "Edit",
          icon: Pencil,
          to: `/users/${user.id}/edit`,
          permission: "Users-manage",
        },
        {
          label: "Delete",
          icon: Trash2,
          destructive: true,
          confirm: true,
          confirmTitle: "Delete user",
          confirmDescription: `This action will permanently remove ${user.name}.`,
          confirmLabel: "Delete",
          onClick: () => handleDeleteUser(user.id),
          permission: "Users-manage",
        },
      ]}
    />
  )
}
