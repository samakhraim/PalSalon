import { useEffect, useMemo, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"

import FormPage from "@/components/common/FormPage"
import { getCustomerFields } from "@/features/customers/config/customerFields"
import {
  getCustomerById,
  replaceCustomerImage,
  updateCustomer,
} from "@/features/customers/customerService"

export default function EditCustomerPage() {
  const navigate = useNavigate()
  const { id } = useParams()
  const [customer, setCustomer] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const fields = useMemo(() => getCustomerFields({ mode: "edit" }), [])

  useEffect(() => {
    const loadCustomer = async () => {
      setIsLoading(true)
      setErrorMessage("")

      try {
        setCustomer(await getCustomerById(id))
      } catch (error) {
        setErrorMessage(error?.response?.data?.message || "Unable to load customer")
      } finally {
        setIsLoading(false)
      }
    }

    loadCustomer()
  }, [id])

  const handleSubmit = async (payload, { files }) => {
    setIsSubmitting(true)

    try {
      const nextPayload = { ...payload }

      if (files.image) {
        const media = await replaceCustomerImage(id, files.image)
        nextPayload.image = media.url
      }

      await updateCustomer(id, nextPayload)
      navigate("/customers", { replace: true })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <FormPage
      title="Edit Customer"
      description="Update mobile app customer details without exposing internal verification fields."
      formTitle="Customer Details"
      formDescription="Edit customer profile information and active status."
      fields={fields}
      initialValues={customer}
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
      submitLabel="Update Customer"
      loading={isLoading}
      error={errorMessage}
      hideFormOnError
      mode="edit"
      formLayout="image-status-top"
      onCancel={() => navigate("/customers")}
      updateSuccessMessage="Customer updated successfully."
      transformValues={(values) => {
        const payload = {
          first_name: values.first_name.trim(),
          middle_name: values.middle_name?.trim() || null,
          last_name: values.last_name.trim(),
          country_phone_code: values.country_phone_code.trim(),
          phone: values.phone.trim(),
          email: values.email.trim(),
          isactive: values.isactive,
          image: values.image?.trim() || null,
        }

        if (values.password?.trim()) {
          payload.password = values.password
        }

        return payload
      }}
    />
  )
}
