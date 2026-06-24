import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

const formatPermissionLabel = (label = "") =>
  label
    .replace(/[-_]+/g, " ")
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ")

export default function PermissionToggleGrid({
  field,
  fieldId,
  options = [],
  value = [],
  onChange,
  error,
}) {
  const selectedValues = Array.isArray(value) ? value : []
  const normalizedOptions = options.map((option) =>
    typeof option === "string"
      ? { label: option, value: option }
      : {
          ...option,
          label: option.label ?? option.name ?? option.value,
          value: option.value ?? option.name ?? option.label,
        }
  )

  const optionValues = normalizedOptions.map((option) => option.value)
  const allSelected =
    optionValues.length > 0 &&
    optionValues.every((optionValue) => selectedValues.includes(optionValue))

  const handleToggleAll = (checked) => {
    onChange(checked ? optionValues : [])
  }

  const handleTogglePermission = (permissionValue, checked) => {
    if (checked) {
      onChange([...selectedValues, permissionValue])
      return
    }

    onChange(selectedValues.filter((currentValue) => currentValue !== permissionValue))
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <Label htmlFor={fieldId}>
            {field.label}
            {field.required && <span className="text-destructive"> *</span>}
          </Label>
          {field.description && (
            <p className="text-sm text-muted-foreground">{field.description}</p>
          )}
        </div>

        <div className="flex items-center gap-3 self-start sm:pt-0.5">
          <Label htmlFor={`${fieldId}-select-all`} className="text-sm font-medium">
            Select All
          </Label>
          <Switch
            id={`${fieldId}-select-all`}
            checked={allSelected}
            disabled={optionValues.length === 0}
            onCheckedChange={handleToggleAll}
          />
        </div>
      </div>

      <div className="grid gap-3 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {normalizedOptions.map((option) => {
          const checked = selectedValues.includes(option.value)

          return (
            <div
              key={option.value}
              className="flex items-center justify-between gap-4 rounded-xl border border-border bg-background px-4 py-3"
            >
              <Label
                htmlFor={`${fieldId}-${option.value}`}
                className="cursor-pointer text-sm font-medium text-foreground"
              >
                {formatPermissionLabel(option.label)}
              </Label>
              <Switch
                id={`${fieldId}-${option.value}`}
                checked={checked}
                onCheckedChange={(nextChecked) =>
                  handleTogglePermission(option.value, nextChecked)
                }
              />
            </div>
          )
        })}
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  )
}
