import { useEffect, useMemo, useState } from "react"

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
import PermissionToggleGroup from "@/features/roles/components/PermissionToggleGroup"
import { validateRolePayload } from "@/features/roles/roleValidation"

const defaultValues = {
  name: "",
  permissions: [],
}

export default function RoleForm({
  initialValues,
  permissionOptions,
  onSubmit,
  isSubmitting,
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
        permissions: initialValues.permissions || [],
      })
    }
  }, [initialValues])

  const groupedPermissions = useMemo(() => {
    const groups = {}

    for (const permission of permissionOptions || []) {
      const permissionName = permission.name || permission
      const [groupName = "General"] = permissionName.split("-")

      if (!groups[groupName]) {
        groups[groupName] = []
      }

      groups[groupName].push(permissionName)
    }

    return groups
  }, [permissionOptions])

  const handleSubmit = async (event) => {
    event.preventDefault()

    const validationError = validateRolePayload(formValues)

    if (validationError) {
      setErrorMessage(validationError)
      return
    }

    setErrorMessage("")

    try {
      await onSubmit({
        name: formValues.name.trim(),
        permissions: formValues.permissions,
      })
    } catch (error) {
      setErrorMessage(error?.response?.data?.message || "Unable to save role")
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

          <div className="space-y-2">
            <Label htmlFor="roleName">Role Name</Label>
            <Input
              id="roleName"
              value={formValues.name}
              onChange={(event) =>
                setFormValues((current) => ({ ...current, name: event.target.value }))
              }
            />
          </div>

          <div className="space-y-3">
            <div className="text-sm font-medium">Permissions</div>
            <PermissionToggleGroup
              groups={groupedPermissions}
              selected={formValues.permissions}
              onChange={(permissions) =>
                setFormValues((current) => ({ ...current, permissions }))
              }
            />
          </div>

          <div className="flex justify-end">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Role"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
