import { useEffect, useMemo, useState } from "react"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import ImagePreview from "@/components/common/ImagePreview"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { buildValuesFromFields, getNestedValue, setNestedValue } from "@/lib/object"

const getFieldId = (fieldName) => fieldName.replace(/\./g, "-")

const getDefaultFieldValue = (field) => {
  if (field.defaultValue !== undefined) {
    return typeof field.defaultValue === "function"
      ? field.defaultValue()
      : field.defaultValue
  }

  if (field.multiple) {
    return []
  }

  if (field.type === "switch") {
    return false
  }

  return ""
}

const hasValue = (value, field, files) => {
  if (field.type === "switch") {
    return typeof value === "boolean"
  }

  if (field.type === "toggleGroup" || field.type === "multiSelect") {
    return Array.isArray(value) ? value.length > 0 : Boolean(value)
  }

  if (field.type === "image") {
    return Boolean(files[field.name] || value)
  }

  return String(value ?? "").trim().length > 0
}

const normalizeOptions = (options = []) =>
  options.map((option) =>
    typeof option === "string"
      ? { label: option, value: option }
      : {
          ...option,
          label: option.label ?? option.name ?? option.value,
          value: option.value ?? option.name ?? option.label,
        }
  )

const groupOptions = (field, options = []) => {
  if (!field.groupBy) {
    return [{ label: null, options }]
  }

  const groups = new Map()

  for (const option of options) {
    const groupLabel = field.groupBy(option)

    if (!groups.has(groupLabel)) {
      groups.set(groupLabel, [])
    }

    groups.get(groupLabel).push(option)
  }

  return [...groups.entries()].map(([label, groupedOptions]) => ({
    label,
    options: groupedOptions,
  }))
}

export default function FormRenderer({
  fields = [],
  initialValues = {},
  onSubmit,
  isSubmitting = false,
  submitLabel = "Save",
  mode = "create",
  transformValues,
}) {
  const [formValues, setFormValues] = useState(() =>
    buildValuesFromFields(fields, initialValues)
  )
  const [fieldErrors, setFieldErrors] = useState({})
  const [errorMessage, setErrorMessage] = useState("")
  const [files, setFiles] = useState({})
  const [previewUrls, setPreviewUrls] = useState({})

  const visibleFields = useMemo(
    () => fields.filter((field) => !field.hidden),
    [fields]
  )

  useEffect(() => {
    setFormValues(buildValuesFromFields(fields, initialValues))
    setFieldErrors({})
    setFiles({})
    setPreviewUrls({})
    setErrorMessage("")
  }, [fields, initialValues])

  useEffect(() => {
    const nextPreviewUrls = {}

    for (const [fieldName, file] of Object.entries(files)) {
      if (!file) {
        continue
      }

      nextPreviewUrls[fieldName] = URL.createObjectURL(file)
    }

    setPreviewUrls(nextPreviewUrls)

    return () => {
      Object.values(nextPreviewUrls).forEach((previewUrl) => {
        URL.revokeObjectURL(previewUrl)
      })
    }
  }, [files])

  const updateFieldValue = (fieldName, value) => {
    setFormValues((current) => setNestedValue(current, fieldName, value))
    setFieldErrors((current) => ({
      ...current,
      [fieldName]: "",
    }))
  }

  const updateFileValue = (fieldName, file) => {
    setFiles((current) => ({
      ...current,
      [fieldName]: file,
    }))
  }

  const validateFields = () => {
    const nextErrors = {}

    for (const field of visibleFields) {
      const value = getNestedValue(formValues, field.name, getDefaultFieldValue(field))

      if (field.required && !hasValue(value, field, files)) {
        nextErrors[field.name] = `${field.label} is required.`
        continue
      }

      if (field.validate) {
        const validationError = field.validate(value, formValues, { files, mode })

        if (validationError) {
          nextErrors[field.name] = validationError
        }
      }
    }

    return nextErrors
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    const nextErrors = validateFields()

    if (Object.keys(nextErrors).length > 0) {
      setFieldErrors(nextErrors)
      setErrorMessage("Please correct the highlighted fields.")
      return
    }

    setFieldErrors({})
    setErrorMessage("")

    const payload = transformValues
      ? transformValues(formValues, { files, mode })
      : formValues

    try {
      await onSubmit(payload, { files, values: formValues, mode })
    } catch (error) {
      setErrorMessage(error?.response?.data?.message || "Unable to save")
    }
  }

  const renderToggleGroup = (field, value) => {
    const normalizedOptions = normalizeOptions(field.options)
    const groupedOptions = groupOptions(field, normalizedOptions)

    const toggleValue = (nextValue) => {
      if (field.multiple) {
        const currentValues = Array.isArray(value) ? value : []
        const nextValues = currentValues.includes(nextValue)
          ? currentValues.filter((item) => item !== nextValue)
          : [...currentValues, nextValue]

        updateFieldValue(field.name, nextValues)
        return
      }

      updateFieldValue(field.name, value === nextValue ? "" : nextValue)
    }

    return (
      <div className="space-y-4">
        {groupedOptions.map((group) => (
          <div key={group.label || "default"} className="space-y-2">
            {group.label && (
              <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {group.label}
              </div>
            )}
            <div className="flex flex-wrap gap-2">
              {group.options.map((option) => {
                const active = field.multiple
                  ? Array.isArray(value) && value.includes(option.value)
                  : value === option.value

                return (
                  <Button
                    key={option.value}
                    type="button"
                    variant={active ? "default" : "outline"}
                    onClick={() => toggleValue(option.value)}
                  >
                    {option.label}
                  </Button>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    )
  }

  const renderField = (field) => {
    const fieldId = getFieldId(field.name)
    const value = getNestedValue(formValues, field.name, getDefaultFieldValue(field))
    const fieldError = fieldErrors[field.name]
    const spanClassName = field.span === 2 ? "md:col-span-2" : ""

    if (field.type === "hidden") {
      return null
    }

    if (field.type === "switch") {
      return (
        <div key={field.name} className={spanClassName}>
          <div className="flex justify-end">
            <div className="flex max-w-sm items-start gap-4 rounded-lg border p-4 text-right">
              <div className="space-y-1">
                <Label htmlFor={fieldId}>
                  {field.label}
                  {field.required && <span className="text-destructive"> *</span>}
                </Label>
                {field.description && (
                  <p className="text-sm text-muted-foreground">{field.description}</p>
                )}
              </div>
              <Switch
                id={fieldId}
                checked={Boolean(value)}
                onCheckedChange={(checked) => updateFieldValue(field.name, checked)}
              />
            </div>
          </div>
        </div>
      )
    }

    if (field.type === "toggleGroup" || field.type === "multiSelect") {
      return (
        <div key={field.name} className={`space-y-3 ${spanClassName}`.trim()}>
          <div className="space-y-1">
            <Label htmlFor={fieldId}>
              {field.label}
              {field.required && <span className="text-destructive"> *</span>}
            </Label>
            {field.description && (
              <p className="text-sm text-muted-foreground">{field.description}</p>
            )}
          </div>
          {renderToggleGroup(field, value)}
          {fieldError && <p className="text-sm text-destructive">{fieldError}</p>}
        </div>
      )
    }

    if (field.type === "image") {
      return (
        <div key={field.name} className={`space-y-3 ${spanClassName}`.trim()}>
          <div className="space-y-1">
            <Label htmlFor={fieldId}>
              {field.label}
              {field.required && <span className="text-destructive"> *</span>}
            </Label>
            {field.description && (
              <p className="text-sm text-muted-foreground">{field.description}</p>
            )}
          </div>
          <Input
            id={fieldId}
            type="file"
            accept={field.accept || "image/*"}
            onChange={(event) => updateFileValue(field.name, event.target.files?.[0] || null)}
          />
          {files[field.name] && (
            <p className="text-sm text-muted-foreground">
              Selected file: {files[field.name].name}
            </p>
          )}
          <div className="flex justify-center">
            <ImagePreview
              image={previewUrls[field.name] || value}
              alt={field.label}
              width={field.previewWidth || 220}
              height={field.previewHeight || 160}
            />
          </div>
          {fieldError && <p className="text-sm text-destructive">{fieldError}</p>}
        </div>
      )
    }

    if (field.type === "select") {
      const normalizedOptions = normalizeOptions(field.options)

      return (
        <div key={field.name} className={`space-y-2 ${spanClassName}`.trim()}>
          <Label htmlFor={fieldId}>
            {field.label}
            {field.required && <span className="text-destructive"> *</span>}
          </Label>
          <select
            id={fieldId}
            className="flex h-10 w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none"
            value={value}
            onChange={(event) => updateFieldValue(field.name, event.target.value)}
          >
            <option value="">{field.placeholder || `Select ${field.label}`}</option>
            {normalizedOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {fieldError && <p className="text-sm text-destructive">{fieldError}</p>}
        </div>
      )
    }

    const sharedProps = {
      id: fieldId,
      dir: field.dir,
      placeholder: field.placeholder,
      required: field.required,
      "aria-invalid": Boolean(fieldError),
      value: field.type === "number" ? value ?? "" : value,
      onChange: (event) => updateFieldValue(field.name, event.target.value),
    }

    return (
      <div key={field.name} className={`space-y-2 ${spanClassName}`.trim()}>
        <Label htmlFor={fieldId}>
          {field.label}
          {field.required && <span className="text-destructive"> *</span>}
        </Label>
        {field.type === "textarea" ? (
          <Textarea {...sharedProps} rows={field.rows || 4} />
        ) : (
          <Input {...sharedProps} type={field.type || "text"} />
        )}
        {field.description && (
          <p className="text-sm text-muted-foreground">{field.description}</p>
        )}
        {fieldError && <p className="text-sm text-destructive">{fieldError}</p>}
      </div>
    )
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      {errorMessage && (
        <Alert variant="destructive">
          <AlertTitle>Request failed</AlertTitle>
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {visibleFields.map((field) => renderField(field))}
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : submitLabel}
        </Button>
      </div>
    </form>
  )
}
