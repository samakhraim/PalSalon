import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import RoleForm from "@/features/roles/components/RoleForm"
import { getPermissions, getRoleById, updateRole } from "@/features/roles/roleService"

export default function EditRolePage() {
  const navigate = useNavigate()
  const { id } = useParams()
  const [role, setRole] = useState(null)
  const [permissionOptions, setPermissionOptions] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true)
      setErrorMessage("")

      try {
        const [currentRole, permissions] = await Promise.all([
          getRoleById(id),
          getPermissions(),
        ])
        setRole(currentRole)
        setPermissionOptions(permissions)
      } catch (error) {
        setErrorMessage(error?.response?.data?.message || "Unable to load role")
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [id])

  const handleSubmit = async (payload) => {
    setIsSubmitting(true)

    try {
      await updateRole(id, payload)
      navigate("/roles", { replace: true })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return <Skeleton className="h-[420px] w-full rounded-xl" />
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Edit Role</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Update role naming and permission assignments.
        </p>
      </div>

      {errorMessage && (
        <Alert variant="destructive">
          <AlertTitle>Failed to load role</AlertTitle>
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}

      {role && (
        <RoleForm
          title="Role Details"
          description="Edit the role and keep permission assignments in sync."
          initialValues={role}
          permissionOptions={permissionOptions}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
        />
      )}
    </div>
  )
}
