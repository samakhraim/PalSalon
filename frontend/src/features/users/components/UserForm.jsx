import { useEffect, useState } from "react"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import RoleToggleGroup from "@/features/users/components/RoleToggleGroup"
import { validateUserPayload } from "@/features/users/userValidation"

const defaultValues = {
  name: "",
  email: "",
  phoneCountryCode: "",
  phoneNumber: "",
  password: "",
  roles: [],
}

export default function UserForm({
  initialValues,
  roleOptions,
  onSubmit,
  isSubmitting,
  isEdit = false,
  title,
  description,
}) {
  const [formValues, setFormValues] = useState(defaultValues)
  const [errorMessage, setErrorMessage] = useState("")

  useEffect(() => {
    if (initialValues) {
      setFormValues({
        ...defaultValues,
        ...initialValues,
        password: "",
        roles: initialValues.roles || [],
      })
    }
  }, [initialValues])

  const updateField = (field, value) => {
    setFormValues((current) => ({
      ...current,
      [field]: value,
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    const validationError = validateUserPayload(formValues, { isEdit })

    if (validationError) {
      setErrorMessage(validationError)
      return
    }

    setErrorMessage("")

    const payload = {
      name: formValues.name.trim(),
      email: formValues.email.trim(),
      phoneCountryCode: formValues.phoneCountryCode?.trim() || null,
      phoneNumber: formValues.phoneNumber?.trim() || null,
      roles: formValues.roles,
    }

    if (formValues.password.trim()) {
      payload.password = formValues.password
    }

    try {
      await onSubmit(payload)
    } catch (error) {
      setErrorMessage(
        error?.response?.data?.message || "Unable to save user"
      )
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-6" onSubmit={handleSubmit}>
          {errorMessage && (
            <Alert variant="destructive">
              <AlertTitle>Request failed</AlertTitle>
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          )}

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={formValues.name}
                onChange={(event) => updateField("name", event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formValues.email}
                onChange={(event) => updateField("email", event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phoneCountryCode">Phone Country Code</Label>
              <Input
                id="phoneCountryCode"
                placeholder="+970"
                value={formValues.phoneCountryCode}
                onChange={(event) =>
                  updateField("phoneCountryCode", event.target.value)
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input
                id="phoneNumber"
                placeholder="599123456"
                value={formValues.phoneNumber}
                onChange={(event) => updateField("phoneNumber", event.target.value)}
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="password">
                Password {isEdit && <span className="text-muted-foreground">(optional)</span>}
              </Label>
              <Input
                id="password"
                type="password"
                value={formValues.password}
                onChange={(event) => updateField("password", event.target.value)}
              />
            </div>
          </div>

          <RoleToggleGroup
            options={roleOptions}
            selected={formValues.roles}
            onChange={(roles) => updateField("roles", roles)}
            title="Roles"
          />

          <div className="flex justify-end">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : isEdit ? "Update User" : "Create User"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
