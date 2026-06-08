import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import RoleForm from "@/features/roles/components/RoleForm"
import { createRole, getPermissions } from "@/features/roles/roleService"

export default function CreateRolePage() {
  const navigate = useNavigate()
  const [permissionOptions, setPermissionOptions] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")

  useEffect(() => {
    const loadPermissions = async () => {
      setIsLoading(true)
      setErrorMessage("")

      try {
        setPermissionOptions(await getPermissions())
      } catch (error) {
        setErrorMessage(
          error?.response?.data?.message || "Unable to load permissions"
        )
      } finally {
        setIsLoading(false)
      }
    }

    loadPermissions()
  }, [])

  const handleSubmit = async (payload) => {
    setIsSubmitting(true)

    try {
      await createRole(payload)
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
        <h1 className="text-3xl font-semibold tracking-tight">Create Role</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Create a role and assign permissions from the backend registry.
        </p>
      </div>

      {errorMessage && (
        <Alert variant="destructive">
          <AlertTitle>Failed to load form</AlertTitle>
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}

      <RoleForm
        title="Role Details"
        description="Choose a role name and attach permissions."
        permissionOptions={permissionOptions}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />
    </div>
  )
}
