import { useEffect, useMemo, useState } from "react"
import { Link } from "react-router-dom"
import { Plus } from "lucide-react"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useAuth } from "@/hooks/useAuth"
import { getRoleColumns } from "@/features/roles/roleColumns"
import RoleTable from "@/features/roles/components/RolesTable"
import { deleteRole, getRoles } from "@/features/roles/roleService"
import { hasPermission } from "@/utils/permissions"

export default function RolesPage() {
  const { user } = useAuth()
  const canManage = hasPermission(user, "Role-manage")
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

  const columns = useMemo(
    () => getRoleColumns({ canManage, onDelete: handleDeleteRole }),
    [canManage, handleDeleteRole]
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Roles</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Manage roles and permission groupings for dashboard access.
          </p>
        </div>
        {canManage && (
          <Button asChild>
            <Link to="/roles/create">
              <Plus className="mr-2 h-4 w-4" />
              Create Role
            </Link>
          </Button>
        )}
      </div>

      {errorMessage && (
        <Alert variant="destructive">
          <AlertTitle>Roles request failed</AlertTitle>
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Roles List</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : (
            <RoleTable data={roles} columns={columns} />
          )}
        </CardContent>
      </Card>
    </div>
  )
}
