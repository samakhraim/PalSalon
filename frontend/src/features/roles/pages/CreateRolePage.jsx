import { useEffect, useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"

import FormPage from "@/components/common/FormPage"
import { getRoleFields } from "@/features/roles/config/roleFields"
import { createRole, getPermissions } from "@/features/roles/roleService"

export default function CreateRolePage() {
  const navigate = useNavigate()
  const [permissionOptions, setPermissionOptions] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const fields = useMemo(
    () => getRoleFields({ permissionOptions }),
    [permissionOptions]
  )

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

  return (
    <FormPage
      title="Create Role"
      description="Create a role and assign permissions from the backend registry."
      formTitle="Role Details"
      formDescription="Choose a role name and attach permissions."
      fields={fields}
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
      submitLabel="Save Role"
      loading={isLoading}
      error={errorMessage}
      hideFormOnError
      mode="create"
      createSuccessMessage="Role created successfully."
      transformValues={(values) => ({
        name: values.name.trim(),
        permissions: values.permissions || [],
      })}
    />
  )
}
