import { useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"

import FormPage from "@/components/common/FormPage"
import { getSalonOwnerFields } from "@/features/salonOwners/config/salonOwnerFields"
import { createSalonOwner } from "@/features/salonOwners/salonOwnerService"

export default function CreateSalonOwnerPage() {
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const fields = useMemo(() => getSalonOwnerFields({ mode: "create" }), [])
  const initialValues = useMemo(
    () => ({
      isactive: false,
      first_name: "",
      middle_name: "",
      last_name: "",
      country_phone_code: "",
      phone: "",
      salon_owner_phone_group: "",
      email: "",
      password: "",
      confirm_password: "",
    }),
    []
  )

  const handleSubmit = async (payload) => {
    setIsSubmitting(true)

    try {
      await createSalonOwner(payload)
      navigate("/salon-owners", { replace: true })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <FormPage
      title="Create Salon Owner"
      description="Add a new salon-owner account without mixing it with admin users or customers."
      formTitle="Salon Owner Details"
      formDescription="Create a salon owner and keep their account details separate."
      fields={fields}
      initialValues={initialValues}
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
      submitLabel="Create Salon Owner"
      mode="create"
      onCancel={() => navigate("/salon-owners")}
      createSuccessMessage="Salon owner created successfully."
      transformValues={(values) => ({
        first_name: values.first_name.trim(),
        middle_name: values.middle_name?.trim() || null,
        last_name: values.last_name.trim(),
        country_phone_code: values.country_phone_code.trim(),
        phone: values.phone.trim(),
        email: values.email.trim(),
        password: values.password,
        isactive: values.isactive,
      })}
    />
  )
}
