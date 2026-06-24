import { useEffect, useMemo, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"

import FormPage from "@/components/common/FormPage"
import { getSalonOwnerFields } from "@/features/salonOwners/config/salonOwnerFields"
import {
  getSalonOwnerById,
  updateSalonOwner,
} from "@/features/salonOwners/salonOwnerService"

export default function EditSalonOwnerPage() {
  const navigate = useNavigate()
  const { id } = useParams()
  const [salonOwner, setSalonOwner] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const fields = useMemo(() => getSalonOwnerFields({ mode: "edit" }), [])
  const initialValues = useMemo(() => {
    if (!salonOwner) {
      return null
    }

    return {
      ...salonOwner,
      salon_owner_phone_group: "",
      confirm_password: "",
    }
  }, [salonOwner])

  useEffect(() => {
    const loadSalonOwner = async () => {
      setIsLoading(true)
      setErrorMessage("")

      try {
        setSalonOwner(await getSalonOwnerById(id))
      } catch (error) {
        setErrorMessage(
          error?.response?.data?.message || "Unable to load salon owner"
        )
      } finally {
        setIsLoading(false)
      }
    }

    loadSalonOwner()
  }, [id])

  const handleSubmit = async (payload) => {
    setIsSubmitting(true)

    try {
      await updateSalonOwner(id, payload)
      navigate("/salon-owners", { replace: true })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <FormPage
      title="Edit Salon Owner"
      description="Update a salon-owner account without exposing verification fields."
      formTitle="Salon Owner Details"
      formDescription="Edit the salon owner and keep their account settings in sync."
      fields={fields}
      initialValues={initialValues}
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
      submitLabel="Update Salon Owner"
      loading={isLoading}
      error={errorMessage}
      hideFormOnError
      mode="edit"
      onCancel={() => navigate("/salon-owners")}
      updateSuccessMessage="Salon owner updated successfully."
      transformValues={(values) => {
        const payload = {
          first_name: values.first_name.trim(),
          middle_name: values.middle_name?.trim() || null,
          last_name: values.last_name.trim(),
          country_phone_code: values.country_phone_code.trim(),
          phone: values.phone.trim(),
          email: values.email.trim(),
          isactive: values.isactive,
        }

        if (values.password?.trim()) {
          payload.password = values.password
        }

        return payload
      }}
    />
  )
}
