import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import UserForm from "@/features/users/components/UserForm"
import {
  getAvailableRoles,
  getUserById,
  updateUser,
} from "@/features/users/userService"

export default function EditUserPage() {
  const navigate = useNavigate()
  const { id } = useParams()
  const [user, setUser] = useState(null)
  const [roleOptions, setRoleOptions] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true)
      setErrorMessage("")

      try {
        const [currentUser, roles] = await Promise.all([
          getUserById(id),
          getAvailableRoles(),
        ])
        setUser(currentUser)
        setRoleOptions(roles)
      } catch (error) {
        setErrorMessage(error?.response?.data?.message || "Unable to load user")
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [id])

  const handleSubmit = async (payload) => {
    setIsSubmitting(true)

    try {
      await updateUser(id, payload)
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
        <h1 className="text-3xl font-semibold tracking-tight">Edit User</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Update profile details and role assignments.
        </p>
      </div>

      {errorMessage && (
        <Alert variant="destructive">
          <AlertTitle>Failed to load user</AlertTitle>
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}

      {user && (
        <UserForm
          title="User Details"
          description="Edit the user and keep their role assignments in sync."
          initialValues={user}
          roleOptions={roleOptions}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          isEdit
        />
      )}
    </div>
  )
}
