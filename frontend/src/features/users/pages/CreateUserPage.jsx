import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import UserForm from "@/features/users/components/UserForm"
import { createUser, getAvailableRoles } from "@/features/users/userService"

export default function CreateUserPage() {
  const navigate = useNavigate()
  const [roleOptions, setRoleOptions] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")

  useEffect(() => {
    const loadOptions = async () => {
      setIsLoading(true)
      setErrorMessage("")

      try {
        setRoleOptions(await getAvailableRoles())
      } catch (error) {
        setErrorMessage(
          error?.response?.data?.message || "Unable to load user form options"
        )
      } finally {
        setIsLoading(false)
      }
    }

    loadOptions()
  }, [])

  const handleSubmit = async (payload) => {
    setIsSubmitting(true)

    try {
      await createUser(payload)
      navigate("/users", { replace: true })
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
        <h1 className="text-3xl font-semibold tracking-tight">Create User</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Add a new admin-side user and assign roles from the backend.
        </p>
      </div>

      {errorMessage && (
        <Alert variant="destructive">
          <AlertTitle>Failed to load form</AlertTitle>
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}

      <UserForm
        title="User Details"
        description="Create a user and assign one or more roles."
        roleOptions={roleOptions}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />
    </div>
  )
}
