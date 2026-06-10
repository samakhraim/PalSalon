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
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import CityImagePreview from "@/features/cities/components/CityImagePreview"
import { validateCityPayload } from "@/features/cities/cityValidation"

const defaultValues = {
  name: {
    en: "",
    ar: "",
  },
  description: {
    en: "",
    ar: "",
  },
  image: "",
  status: true,
}

export default function CityForm({
  initialValues,
  onSubmit,
  isSubmitting,
  submitLabel,
  title,
  description,
}) {
  const [formValues, setFormValues] = useState(defaultValues)
  const [selectedImageFile, setSelectedImageFile] = useState(null)
  const [selectedImagePreviewUrl, setSelectedImagePreviewUrl] = useState("")
  const [errorMessage, setErrorMessage] = useState("")
  const [fieldErrors, setFieldErrors] = useState({
    nameEn: "",
    nameAr: "",
  })

  useEffect(() => {
    if (initialValues) {
      setFormValues({
        ...defaultValues,
        ...initialValues,
        name: {
          ...defaultValues.name,
          ...(initialValues.name || {}),
        },
        description: {
          ...defaultValues.description,
          ...(initialValues.description || {}),
        },
        image: initialValues.image || "",
        status:
          typeof initialValues.status === "boolean"
            ? initialValues.status
            : defaultValues.status,
      })
      setSelectedImageFile(null)
      setSelectedImagePreviewUrl("")
    }
  }, [initialValues])

  useEffect(() => {
    if (!selectedImageFile) {
      setSelectedImagePreviewUrl("")
      return undefined
    }

    const previewUrl = URL.createObjectURL(selectedImageFile)
    setSelectedImagePreviewUrl(previewUrl)

    return () => {
      URL.revokeObjectURL(previewUrl)
    }
  }, [selectedImageFile])

  const updateNestedField = (group, field, value) => {
    setFormValues((current) => ({
      ...current,
      [group]: {
        ...current[group],
        [field]: value,
      },
    }))
  }

  const updateField = (field, value) => {
    setFormValues((current) => ({
      ...current,
      [field]: value,
    }))
  }

  const handleImageChange = (event) => {
    const nextFile = event.target.files?.[0] || null
    setSelectedImageFile(nextFile)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    const validationError = validateCityPayload(formValues)
    const nextFieldErrors = {
      nameEn: formValues.name.en.trim() ? "" : "English Name is required.",
      nameAr: formValues.name.ar.trim() ? "" : "Arabic Name is required.",
    }

    if (validationError) {
      setFieldErrors(nextFieldErrors)
      setErrorMessage(validationError)
      return
    }

    setFieldErrors({
      nameEn: "",
      nameAr: "",
    })
    setErrorMessage("")

    const payload = {
      name: {
        en: formValues.name.en.trim(),
        ar: formValues.name.ar.trim(),
      },
      description: {
        en: formValues.description.en.trim(),
        ar: formValues.description.ar.trim(),
      },
      image: formValues.image.trim() || null,
      status: Boolean(formValues.status),
    }

    try {
      await onSubmit(payload, selectedImageFile)
    } catch (error) {
      setErrorMessage(error?.response?.data?.message || "Unable to save city")
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
              <Label htmlFor="name-en">
                English Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name-en"
                required
                aria-invalid={Boolean(fieldErrors.nameEn)}
                value={formValues.name.en}
                onChange={(event) =>
                  updateNestedField("name", "en", event.target.value)
                }
              />
              {fieldErrors.nameEn && (
                <p className="text-sm text-destructive">{fieldErrors.nameEn}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="name-ar">
                Arabic Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name-ar"
                dir="rtl"
                required
                aria-invalid={Boolean(fieldErrors.nameAr)}
                value={formValues.name.ar}
                onChange={(event) =>
                  updateNestedField("name", "ar", event.target.value)
                }
              />
              {fieldErrors.nameAr && (
                <p className="text-sm text-destructive">{fieldErrors.nameAr}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="description-en">English Description</Label>
              <Textarea
                id="description-en"
                value={formValues.description.en}
                onChange={(event) =>
                  updateNestedField("description", "en", event.target.value)
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description-ar">Arabic Description</Label>
              <Textarea
                id="description-ar"
                dir="rtl"
                value={formValues.description.ar}
                onChange={(event) =>
                  updateNestedField("description", "ar", event.target.value)
                }
              />
            </div>
            <div className="space-y-3 md:col-span-2">
              <Label htmlFor="image">City Image</Label>
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
              <p className="text-sm text-muted-foreground">
                Upload an image from your device. JPG, PNG, and WEBP are supported.
              </p>
              {selectedImageFile && (
                <p className="text-sm text-muted-foreground">
                  Selected file: {selectedImageFile.name}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-5">
            <div className="flex justify-center">
              <CityImagePreview
                image={selectedImagePreviewUrl || formValues.image.trim()}
                alt={formValues.name.en || "City preview"}
              />
            </div>

            <div className="flex justify-end">
              <div className="flex max-w-sm items-start gap-4 rounded-lg border p-4 text-right">
                <div className="space-y-1">
                  <Label htmlFor="status">Active</Label>
                  <p className="text-sm text-muted-foreground">
                    If active, this city will be visible in other places.
                  </p>
                </div>
                <Switch
                  id="status"
                  checked={Boolean(formValues.status)}
                  onCheckedChange={(checked) => updateField("status", checked)}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : submitLabel}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
