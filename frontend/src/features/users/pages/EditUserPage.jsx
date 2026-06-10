import { useEffect, useMemo, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"

import FormPage from "@/components/common/FormPage"
import { getUserFields } from "@/features/users/config/userFields"
import {
  getAvailableRoles,
  getUserById,
  updateUser,
} from "@/features/users/userService"
import { useAuth } from "@/hooks/useAuth"
import { hasPermission } from "@/utils/permissions"

export default function EditUserPage() {
  const navigate = useNavigate()
  const { id } = useParams()
  const { user: currentUser, refreshCurrentUser } = useAuth()
  const [user, setUser] = useState(null)
  const [roleOptions, setRoleOptions] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const fields = useMemo(
    () => getUserFields({ roleOptions, mode: "edit" }),
    [roleOptions]
  )

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
      const updatedUser = await updateUser(id, payload)

      if (currentUser?.id === updatedUser.id) {
        const nextUser = await refreshCurrentUser()
        navigate(
          hasPermission(nextUser, "Users-view") ? "/users" : "/dashboard",
          { replace: true }
        )
        return
      }

      navigate("/users", { replace: true })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <FormPage
      title="Edit User"
      description="Update profile details and role assignments."
      formTitle="User Details"
      formDescription="Edit the user and keep their role assignments in sync."
      fields={fields}
      initialValues={user}
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
      submitLabel="Update User"
      loading={isLoading}
      error={errorMessage}
      hideFormOnError
      mode="edit"
      transformValues={(values) => {
        const payload = {
          name: values.name.trim(),
          email: values.email.trim(),
          phoneCountryCode: values.phoneCountryCode?.trim() || null,
          phoneNumber: values.phoneNumber?.trim() || null,
          roles: values.roles || [],
        }

        if (values.password?.trim()) {
          payload.password = values.password
        }

        return payload
      }}
    />
  )
}
