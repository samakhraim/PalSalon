import { useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"

import FormPage from "@/components/common/FormPage"
import { getCustomerFields } from "@/features/customers/config/customerFields"
import {
  createCustomer,
  deleteCustomer,
  updateCustomer,
  uploadCustomerImage,
} from "@/features/customers/customerService"

export default function CreateCustomerPage() {
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const fields = useMemo(() => getCustomerFields({ mode: "create" }), [])
  const initialValues = useMemo(
    () => ({
      image: "",
      isactive: false,
      first_name: "",
      middle_name: "",
      last_name: "",
      country_phone_code: "",
      phone: "",
      email: "",
      password: "",
    }),
    []
  )

  const handleSubmit = async (payload, { files }) => {
    setIsSubmitting(true)

    try {
      const createdCustomer = await createCustomer({
        ...payload,
        image: files.image ? null : payload.image,
      })

      if (files.image) {
        try {
          const media = await uploadCustomerImage(createdCustomer.id, files.image)
          await updateCustomer(createdCustomer.id, {
            image: media.url,
          })
        } catch (error) {
          await deleteCustomer(createdCustomer.id)
          throw error
        }
      }

      navigate("/customers", { replace: true })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <FormPage
      title="Create Customer"
      description="Add a mobile app customer record with account and contact details."
      formTitle="Customer Details"
      formDescription="Create a customer account without exposing system verification fields."
      fields={fields}
      initialValues={initialValues}
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
      submitLabel="Create Customer"
      mode="create"
      formLayout="image-status-top"
      onCancel={() => navigate("/customers")}
      createSuccessMessage="Customer created successfully."
      transformValues={(values) => ({
        first_name: values.first_name.trim(),
        middle_name: values.middle_name?.trim() || null,
        last_name: values.last_name.trim(),
        country_phone_code: values.country_phone_code.trim(),
        phone: values.phone.trim(),
        email: values.email.trim(),
        password: values.password,
        isactive: values.isactive,
        image: values.image?.trim() || null,
      })}
    />
  )
}
