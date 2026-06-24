import { useEffect, useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"

import FormPage from "@/components/common/FormPage"
import { getUserFields } from "@/features/users/config/userFields"
import { createUser, getAvailableRoles } from "@/features/users/userService"

export default function CreateUserPage() {
  const navigate = useNavigate()
  const [roleOptions, setRoleOptions] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const initialValues = useMemo(
    () => ({
      name: "",
      email: "",
      phoneCountryCode: "",
      phoneNumber: "",
      user_phone_group: "",
      password: "",
      confirm_password: "",
      roles: [],
    }),
    []
  )
  const fields = useMemo(
    () => getUserFields({ roleOptions, mode: "create" }),
    [roleOptions]
  )

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

  return (
    <FormPage
      title="Create User"
      description="Add a new admin-side user and assign roles from the backend."
      formTitle="User Details"
      formDescription="Create a user and assign one or more roles."
      fields={fields}
      initialValues={initialValues}
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
      submitLabel="Create User"
      loading={isLoading}
      error={errorMessage}
      hideFormOnError
      mode="create"
      createSuccessMessage="User created successfully."
      transformValues={(values) => ({
        name: values.name.trim(),
        email: values.email.trim(),
        phoneCountryCode: values.phoneCountryCode?.trim() || null,
        phoneNumber: values.phoneNumber?.trim() || null,
        password: values.password,
        roles: values.roles || [],
      })}
    />
  )
}
