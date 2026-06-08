import { useEffect, useMemo, useState } from "react"
import { Link } from "react-router-dom"
import { Plus } from "lucide-react"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import UsersTable from "@/features/users/components/UsersTable"
import { getUserColumns } from "@/features/users/userColumns"
import { deleteUser, getUsers } from "@/features/users/userService"
import { useAuth } from "@/hooks/useAuth"
import { hasPermission } from "@/utils/permissions"

export default function UsersPage() {
  const { user } = useAuth()
  const canManage = hasPermission(user, "Users-manage")
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
      await loadUsers()
    } catch (error) {
      setErrorMessage(error?.response?.data?.message || "Unable to delete user")
    }
  }

  const columns = useMemo(
    () => getUserColumns({ canManage, onDelete: handleDeleteUser }),
    [canManage, handleDeleteUser]
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Users</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Manage admin users, roles, and direct permissions.
          </p>
        </div>
        {canManage && (
          <Button asChild>
            <Link to="/users/create">
              <Plus className="mr-2 h-4 w-4" />
              Create User
            </Link>
          </Button>
        )}
      </div>

      {errorMessage && (
        <Alert variant="destructive">
          <AlertTitle>Users request failed</AlertTitle>
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Users List</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : (
            <UsersTable data={users} columns={columns} />
          )}
        </CardContent>
      </Card>
    </div>
  )
}
