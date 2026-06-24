import { useEffect, useMemo, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"

import FormPage from "@/components/common/FormPage"
import { getRoleFields } from "@/features/roles/config/roleFields"
import { getPermissions, getRoleById, updateRole } from "@/features/roles/roleService"
import { useAuth } from "@/hooks/useAuth"
import { hasPermission } from "@/utils/permissions"

export default function EditRolePage() {
  const navigate = useNavigate()
  const { id } = useParams()
  const { refreshCurrentUser } = useAuth()
  const [role, setRole] = useState(null)
  const [permissionOptions, setPermissionOptions] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const fields = useMemo(
    () => getRoleFields({ permissionOptions }),
    [permissionOptions]
  )

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
      const nextUser = await refreshCurrentUser()
      navigate(
        hasPermission(nextUser, "Role-view") ? "/roles" : "/dashboard",
        { replace: true }
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <FormPage
      title="Edit Role"
      description="Update role naming and permission assignments."
      formTitle="Role Details"
      formDescription="Edit the role and keep permission assignments in sync."
      fields={fields}
      initialValues={role}
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
      submitLabel="Save Role"
      loading={isLoading}
      error={errorMessage}
      hideFormOnError
      mode="edit"
      updateSuccessMessage="Role updated successfully."
      transformValues={(values) => ({
        name: values.name.trim(),
        permissions: values.permissions || [],
      })}
    />
  )
}
