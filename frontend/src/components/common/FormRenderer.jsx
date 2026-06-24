import { useEffect, useMemo, useRef, useState } from "react"
import { Eye, EyeOff } from "lucide-react"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import ImagePreview from "@/components/common/ImagePreview"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import PermissionToggleGrid from "@/features/roles/components/PermissionToggleGrid"
import { useToastMessage } from "@/hooks/useToastMessage"
import {
  resolveSubmitSuccessMessage,
} from "@/lib/notifications"
import { buildValuesFromFields, getNestedValue, setNestedValue } from "@/lib/object"

const getFieldId = (fieldName) => fieldName.replace(/\./g, "-")
const EMPTY_FIELDS = Object.freeze([])
const EMPTY_INITIAL_VALUES = Object.freeze({})
const IMAGE_STATUS_TOP_LAYOUT = "image-status-top"

const isObject = (value) =>
  value !== null && typeof value === "object" && !Array.isArray(value)

const areValuesEqual = (left, right) => {
  if (Object.is(left, right)) {
    return true
  }

  if (Array.isArray(left) && Array.isArray(right)) {
    if (left.length !== right.length) {
      return false
    }

    return left.every((item, index) => areValuesEqual(item, right[index]))
  }

  if (isObject(left) && isObject(right)) {
    const leftKeys = Object.keys(left)
    const rightKeys = Object.keys(right)

    if (leftKeys.length !== rightKeys.length) {
      return false
    }

    return leftKeys.every((key) => areValuesEqual(left[key], right[key]))
  }

  return false
}

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

  if (field.type === "permissions-toggle-grid") {
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
  fields = EMPTY_FIELDS,
  initialValues = EMPTY_INITIAL_VALUES,
  onSubmit,
  isSubmitting = false,
  submitLabel = "Save",
  mode = "create",
  transformValues,
  layout = "default",
  onCancel,
  cancelLabel = "Cancel",
  successMessage,
  createSuccessMessage,
  updateSuccessMessage,
  submitErrorMessage = "Something went wrong. Please try again.",
}) {
  const { showError, showSuccess } = useToastMessage()
  const normalizedFields = fields ?? EMPTY_FIELDS
  const normalizedInitialValues = initialValues ?? EMPTY_INITIAL_VALUES
  const syncedInitialValues = useMemo(
    () => buildValuesFromFields(normalizedFields, normalizedInitialValues),
    [normalizedFields, normalizedInitialValues]
  )
  const [formValues, setFormValues] = useState(() =>
    syncedInitialValues
  )
  const [fieldErrors, setFieldErrors] = useState({})
  const [errorMessage, setErrorMessage] = useState("")
  const [files, setFiles] = useState({})
  const [previewUrls, setPreviewUrls] = useState({})
  const [passwordVisibility, setPasswordVisibility] = useState({})
  const previousSyncedValuesRef = useRef(syncedInitialValues)

  const visibleFields = useMemo(
    () => normalizedFields.filter((field) => !field.hidden),
    [normalizedFields]
  )
  const topMediaField = useMemo(() => {
    if (layout !== IMAGE_STATUS_TOP_LAYOUT) {
      return null
    }

    return (
      visibleFields.find((field) => field.layoutArea === "mediaTop") ||
      visibleFields.find((field) => field.type === "image") ||
      null
    )
  }, [layout, visibleFields])
  const topStatusField = useMemo(() => {
    if (layout !== IMAGE_STATUS_TOP_LAYOUT) {
      return null
    }

    return (
      visibleFields.find((field) => field.layoutArea === "statusTop") ||
      visibleFields.find((field) => field.type === "switch") ||
      null
    )
  }, [layout, visibleFields])
  const bodyFields = useMemo(() => {
    if (layout !== IMAGE_STATUS_TOP_LAYOUT) {
      return visibleFields
    }

    return visibleFields.filter(
      (field) =>
        field.name !== topMediaField?.name && field.name !== topStatusField?.name
    )
  }, [layout, topMediaField?.name, topStatusField?.name, visibleFields])

  useEffect(() => {
    if (areValuesEqual(previousSyncedValuesRef.current, syncedInitialValues)) {
      return
    }

    previousSyncedValuesRef.current = syncedInitialValues
    setFormValues(syncedInitialValues)
    setFieldErrors({})
    setFiles({})
    setPreviewUrls({})
    setPasswordVisibility({})
    setErrorMessage("")
  }, [syncedInitialValues])

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

  const updateMultipleFieldValues = (entries) => {
    setFormValues((current) => {
      let nextValues = current

      for (const [fieldName, value] of entries) {
        nextValues = setNestedValue(nextValues, fieldName, value)
      }

      return nextValues
    })
  }

  const clearFieldError = (fieldName) => {
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

  const togglePasswordVisibility = (fieldName) => {
    setPasswordVisibility((current) => ({
      ...current,
      [fieldName]: !current[fieldName],
    }))
  }

  const validateFields = () => {
    const nextErrors = {}

    for (const field of visibleFields) {
      if (field.type === "countryPhoneGroup") {
        const countryValue = getNestedValue(
          formValues,
          field.countryFieldName,
          field.countryDefaultValue ?? ""
        )
        const codeValue = getNestedValue(
          formValues,
          field.codeFieldName,
          field.codeDefaultValue ?? ""
        )
        const phoneValue = getNestedValue(
          formValues,
          field.phoneFieldName,
          field.phoneDefaultValue ?? ""
        )

        if (field.required) {
          if (!String(countryValue ?? "").trim()) {
            nextErrors[field.name] = field.countryRequiredMessage || "Country is required."
            continue
          }

          if (!String(codeValue ?? "").trim()) {
            nextErrors[field.name] = field.codeRequiredMessage || "Phone code is required."
            continue
          }

          if (!String(phoneValue ?? "").trim()) {
            nextErrors[field.name] = field.phoneRequiredMessage || "Phone is required."
            continue
          }
        }

        if (field.validate) {
          const validationError = field.validate(
            { country: countryValue, code: codeValue, phone: phoneValue },
            formValues,
            { files, mode }
          )

          if (validationError) {
            nextErrors[field.name] = validationError
          }
        }

        continue
      }

      if (field.type === "phoneGroup") {
        const codeValue = getNestedValue(
          formValues,
          field.codeFieldName,
          field.codeDefaultValue ?? ""
        )
        const phoneValue = getNestedValue(
          formValues,
          field.phoneFieldName,
          field.phoneDefaultValue ?? ""
        )

        if (field.required) {
          if (!String(codeValue ?? "").trim()) {
            nextErrors[field.name] = field.codeRequiredMessage || "Phone code is required."
            continue
          }

          if (!String(phoneValue ?? "").trim()) {
            nextErrors[field.name] = field.phoneRequiredMessage || "Phone is required."
            continue
          }
        }

        if (field.validate) {
          const validationError = field.validate(
            { code: codeValue, phone: phoneValue },
            formValues,
            { files, mode }
          )

          if (validationError) {
            nextErrors[field.name] = validationError
          }
        }

        continue
      }

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
      showSuccess(
        resolveSubmitSuccessMessage({
          mode,
          successMessage,
          createSuccessMessage,
          updateSuccessMessage,
        })
      )
    } catch (error) {
      const message = showError(error, submitErrorMessage)
      setErrorMessage(message)
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

  const renderSwitchField = (field, { compact = false } = {}) => {
    const fieldId = getFieldId(field.name)
    const value = getNestedValue(formValues, field.name, getDefaultFieldValue(field))
    const fieldError = fieldErrors[field.name]
    const spanClassName = field.span === 2 ? "md:col-span-2" : ""

    if (compact) {
      return (
        <div key={field.name} className="w-full justify-self-end">
          <div className="flex items-center justify-end gap-3 pt-2">
            <Label htmlFor={fieldId} className="text-sm font-medium">
              {field.label}
              {field.required && <span className="text-destructive"> *</span>}
            </Label>
            <Switch
              id={fieldId}
              checked={Boolean(value)}
              onCheckedChange={(checked) => updateFieldValue(field.name, checked)}
            />
          </div>
          {fieldError && <p className="mt-2 text-right text-sm text-destructive">{fieldError}</p>}
        </div>
      )
    }

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

  const renderImageField = (field, { compact = false } = {}) => {
    const fieldId = getFieldId(field.name)
    const value = getNestedValue(formValues, field.name, getDefaultFieldValue(field))
    const fieldError = fieldErrors[field.name]
    const spanClassName = field.span === 2 ? "md:col-span-2" : ""

    if (compact) {
      return (
        <div key={field.name} className="flex flex-col items-center gap-3 text-center">
          <Input
            id={fieldId}
            type="file"
            accept={field.accept || "image/*"}
            className="sr-only"
            onChange={(event) => updateFileValue(field.name, event.target.files?.[0] || null)}
          />
          <ImagePreview
            image={previewUrls[field.name] || value}
            alt={field.label}
            width={field.previewWidth || 112}
            height={field.previewHeight || 112}
            variant={field.previewVariant || "avatar"}
          />
          <div className="space-y-1">
            <Button asChild variant="outline" size="sm">
              <label htmlFor={fieldId} className="cursor-pointer">
                {field.uploadLabel || "Upload Image"}
              </label>
            </Button>
            {field.description && (
              <p className="text-xs text-muted-foreground">{field.description}</p>
            )}
            {files[field.name] && (
              <p className="max-w-[220px] break-words text-xs text-muted-foreground">
                {files[field.name].name}
              </p>
            )}
            {fieldError && <p className="text-sm text-destructive">{fieldError}</p>}
          </div>
        </div>
      )
    }

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

  const renderField = (field) => {
    const fieldId = getFieldId(field.name)
    const value = getNestedValue(formValues, field.name, getDefaultFieldValue(field))
    const fieldError = fieldErrors[field.name]
    const spanClassName = field.span === 2 ? "md:col-span-2" : ""

    if (field.type === "hidden") {
      return null
    }

    if (field.type === "switch") {
      return renderSwitchField(field)
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

    if (field.type === "permissions-toggle-grid") {
      return (
        <div key={field.name} className={`space-y-3 ${spanClassName}`.trim()}>
          <PermissionToggleGrid
            field={field}
            fieldId={fieldId}
            options={field.options}
            value={value}
            onChange={(nextValue) => updateFieldValue(field.name, nextValue)}
            error={fieldError}
          />
        </div>
      )
    }

    if (field.type === "image") {
      return renderImageField(field)
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
            onChange={(event) => {
              const nextValue = event.target.value
              updateFieldValue(field.name, nextValue)

              if (field.syncFields) {
                const selectedOption =
                  normalizedOptions.find((option) => option.value === nextValue) || null
                const syncedEntries = field.syncFields(selectedOption, nextValue, formValues)

                if (Array.isArray(syncedEntries) && syncedEntries.length > 0) {
                  updateMultipleFieldValues(syncedEntries)
                }
              }
            }}
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

    if (field.type === "phoneGroup") {
      const codeValue = getNestedValue(
        formValues,
        field.codeFieldName,
        field.codeDefaultValue ?? ""
      )
      const phoneValue = getNestedValue(
        formValues,
        field.phoneFieldName,
        field.phoneDefaultValue ?? ""
      )

      return (
        <div key={field.name} className={`space-y-2 ${spanClassName}`.trim()}>
          <Label htmlFor={fieldId}>
            {field.label}
            {field.required && <span className="text-destructive"> *</span>}
          </Label>
          <div className="flex items-start gap-3">
            <Input
              id={`${fieldId}-code`}
              value={codeValue}
              onChange={(event) => {
                updateFieldValue(field.codeFieldName, event.target.value)
                clearFieldError(field.name)
              }}
              placeholder={field.codePlaceholder || "+970"}
              className="w-24 shrink-0"
            />
            <Input
              id={`${fieldId}-phone`}
              value={phoneValue}
              onChange={(event) => {
                updateFieldValue(field.phoneFieldName, event.target.value)
                clearFieldError(field.name)
              }}
              placeholder={field.phonePlaceholder || "Phone number"}
              className="flex-1"
            />
          </div>
          {field.description && (
            <p className="text-sm text-muted-foreground">{field.description}</p>
          )}
          {fieldError && <p className="text-sm text-destructive">{fieldError}</p>}
        </div>
      )
    }

    if (field.type === "countryPhoneGroup") {
      const normalizedOptions = normalizeOptions(field.options)
      const countryValue = getNestedValue(
        formValues,
        field.countryFieldName,
        field.countryDefaultValue ?? ""
      )
      const codeValue = getNestedValue(
        formValues,
        field.codeFieldName,
        field.codeDefaultValue ?? ""
      )
      const phoneValue = getNestedValue(
        formValues,
        field.phoneFieldName,
        field.phoneDefaultValue ?? ""
      )

      return (
        <div key={field.name} className={`space-y-2 ${spanClassName}`.trim()}>
          <Label htmlFor={fieldId}>
            {field.label}
            {field.required && <span className="text-destructive"> *</span>}
          </Label>
          <div className="grid gap-3 md:grid-cols-2">
            <select
              id={`${fieldId}-country`}
              className="flex h-10 w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none"
              value={countryValue}
              onChange={(event) => {
                const nextCountryValue = event.target.value
                const selectedOption =
                  normalizedOptions.find((option) => option.value === nextCountryValue) ||
                  null

                updateMultipleFieldValues([
                  [field.countryFieldName, nextCountryValue],
                  [field.codeFieldName, selectedOption?.phoneCode || ""],
                ])
                clearFieldError(field.name)
              }}
            >
              <option value="">
                {field.countryPlaceholder || "Select country"}
              </option>
              {normalizedOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            <div className="flex items-start gap-3">
              <Input
                id={`${fieldId}-code`}
                value={codeValue}
                onChange={(event) => {
                  updateFieldValue(field.codeFieldName, event.target.value)
                  clearFieldError(field.name)
                }}
                placeholder={field.codePlaceholder || "+970"}
                className="w-24 shrink-0"
              />
              <Input
                id={`${fieldId}-phone`}
                value={phoneValue}
                onChange={(event) => {
                  updateFieldValue(field.phoneFieldName, event.target.value)
                  clearFieldError(field.name)
                }}
                placeholder={field.phonePlaceholder || "Phone number"}
                className="flex-1"
              />
            </div>
          </div>
          {field.description && (
            <p className="text-sm text-muted-foreground">{field.description}</p>
          )}
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

    const isPasswordField = field.type === "password"
    const resolvedInputType = isPasswordField
      ? passwordVisibility[field.name]
        ? "text"
        : "password"
      : field.type || "text"

    return (
      <div key={field.name} className={`space-y-2 ${spanClassName}`.trim()}>
        <Label htmlFor={fieldId}>
          {field.label}
          {field.required && <span className="text-destructive"> *</span>}
        </Label>
        {field.type === "textarea" ? (
          <Textarea {...sharedProps} rows={field.rows || 4} />
        ) : isPasswordField ? (
          <div className="relative">
            <Input
              {...sharedProps}
              type={resolvedInputType}
              className="pr-11"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              className="absolute right-1 top-1/2 -translate-y-1/2"
              onClick={() => togglePasswordVisibility(field.name)}
            >
              {passwordVisibility[field.name] ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
              <span className="sr-only">
                {passwordVisibility[field.name] ? "Hide password" : "Show password"}
              </span>
            </Button>
          </div>
        ) : (
          <Input {...sharedProps} type={resolvedInputType} />
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

      {layout === IMAGE_STATUS_TOP_LAYOUT && (topMediaField || topStatusField) && (
        <div className="grid gap-6 md:grid-cols-[1fr_auto_1fr] md:items-start">
          <div className="hidden md:block" />
          <div className="flex justify-center">
            {topMediaField ? renderImageField(topMediaField, { compact: true }) : null}
          </div>
          <div className="md:justify-self-end">
            {topStatusField ? renderSwitchField(topStatusField, { compact: true }) : null}
          </div>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {bodyFields.map((field) => renderField(field))}
      </div>

      <div className="flex justify-end gap-3">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            {cancelLabel}
          </Button>
        )}
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : submitLabel}
        </Button>
      </div>
    </form>
  )
}
