import { Plus, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

const createEmptyOption = () => ({
  id: undefined,
  name: {
    en: "",
    ar: "",
  },
  price: "",
  discount_price: "",
  duration_minutes: "",
  is_default: true,
  isactive: true,
})

const normalizeOptions = (value = []) => {
  const options = Array.isArray(value) ? value : []

  if (options.length === 0) {
    return [createEmptyOption()]
  }

  const normalizedOptions = options.map((option, index) => ({
    id: option?.id,
    name: {
      en: option?.name?.en ?? "",
      ar: option?.name?.ar ?? "",
    },
    price: option?.price ?? "",
    discount_price: option?.discount_price ?? "",
    duration_minutes: option?.duration_minutes ?? "",
    is_default: Boolean(option?.is_default),
    isactive:
      typeof option?.isactive === "boolean" ? option.isactive : true,
  }))

  const hasDefault = normalizedOptions.some((option) => option.is_default)

  if (!hasDefault) {
    normalizedOptions[0].is_default = true
  }

  if (normalizedOptions.length === 1) {
    normalizedOptions[0].is_default = true
  }

  return normalizedOptions
}

export default function PriceOptionsField({
  field,
  fieldId,
  value = [],
  onChange,
  onClearError,
  error,
}) {
  const options = normalizeOptions(value)

  const updateOptions = (nextOptions) => {
    onChange(normalizeOptions(nextOptions))
    onClearError()
  }

  const updateOption = (index, updater) => {
    const nextOptions = options.map((option, optionIndex) =>
      optionIndex === index ? updater(option) : option
    )
    updateOptions(nextOptions)
  }

  const addOption = () => {
    updateOptions([
      ...options,
      {
        ...createEmptyOption(),
        is_default: false,
      },
    ])
  }

  const removeOption = (index) => {
    if (options.length === 1) {
      return
    }

    const nextOptions = options.filter((_, optionIndex) => optionIndex !== index)
    updateOptions(nextOptions)
  }

  const setDefaultOption = (index, checked) => {
    if (!checked) {
      if (options.length === 1) {
        return
      }

      const nextOptions = options.map((option, optionIndex) => ({
        ...option,
        is_default: optionIndex === 0 ? true : option.is_default,
      }))
      nextOptions[index].is_default = false

      if (!nextOptions.some((option) => option.is_default)) {
        nextOptions[0].is_default = true
      }

      updateOptions(nextOptions)
      return
    }

    updateOptions(
      options.map((option, optionIndex) => ({
        ...option,
        is_default: optionIndex === index,
      }))
    )
  }

  return (
    <div className="space-y-3">
      <div className="space-y-1">
        <Label htmlFor={fieldId}>
          {field.label}
          {field.required && <span className="text-destructive"> *</span>}
        </Label>
        {field.description && (
          <p className="text-sm text-muted-foreground">{field.description}</p>
        )}
      </div>

      <div className="space-y-4">
        {options.map((option, index) => (
          <div
            key={option.id || `${field.name}-${index}`}
            className="space-y-4 rounded-xl border border-border bg-background p-4"
          >
            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
              <div>
                <p className="text-sm font-semibold text-foreground">
                  Price Option {index + 1}
                </p>
                <p className="text-xs text-muted-foreground">
                  Set localized naming, pricing, duration, and the default option.
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={options.length === 1}
                onClick={() => removeOption(index)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Remove
              </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor={`${fieldId}-${index}-name-en`}>
                  Option Name (English) <span className="text-destructive">*</span>
                </Label>
                <Input
                  id={`${fieldId}-${index}-name-en`}
                  value={option.name.en}
                  onChange={(event) =>
                    updateOption(index, (currentOption) => ({
                      ...currentOption,
                      name: {
                        ...currentOption.name,
                        en: event.target.value,
                      },
                    }))
                  }
                  placeholder="Short Hair"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor={`${fieldId}-${index}-name-ar`}>
                  Option Name (Arabic)
                </Label>
                <Input
                  id={`${fieldId}-${index}-name-ar`}
                  dir="rtl"
                  value={option.name.ar}
                  onChange={(event) =>
                    updateOption(index, (currentOption) => ({
                      ...currentOption,
                      name: {
                        ...currentOption.name,
                        ar: event.target.value,
                      },
                    }))
                  }
                  placeholder="شعر قصير"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor={`${fieldId}-${index}-price`}>
                  Price <span className="text-destructive">*</span>
                </Label>
                <Input
                  id={`${fieldId}-${index}-price`}
                  type="number"
                  min="0"
                  step="0.01"
                  value={option.price}
                  onChange={(event) =>
                    updateOption(index, (currentOption) => ({
                      ...currentOption,
                      price: event.target.value,
                    }))
                  }
                  placeholder="80"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor={`${fieldId}-${index}-discount-price`}>
                  Discount Price
                </Label>
                <Input
                  id={`${fieldId}-${index}-discount-price`}
                  type="number"
                  min="0"
                  step="0.01"
                  value={option.discount_price}
                  onChange={(event) =>
                    updateOption(index, (currentOption) => ({
                      ...currentOption,
                      discount_price: event.target.value,
                    }))
                  }
                  placeholder="65"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor={`${fieldId}-${index}-duration`}>
                  Duration Minutes
                </Label>
                <Input
                  id={`${fieldId}-${index}-duration`}
                  type="number"
                  min="1"
                  step="1"
                  value={option.duration_minutes}
                  onChange={(event) =>
                    updateOption(index, (currentOption) => ({
                      ...currentOption,
                      duration_minutes: event.target.value,
                    }))
                  }
                  placeholder="60"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex items-center justify-between rounded-lg border px-4 py-3">
                  <Label htmlFor={`${fieldId}-${index}-default`} className="text-sm">
                    Default Option
                  </Label>
                  <Switch
                    id={`${fieldId}-${index}-default`}
                    checked={Boolean(option.is_default)}
                    onCheckedChange={(checked) => setDefaultOption(index, checked)}
                  />
                </div>

                <div className="flex items-center justify-between rounded-lg border px-4 py-3">
                  <Label htmlFor={`${fieldId}-${index}-active`} className="text-sm">
                    Active
                  </Label>
                  <Switch
                    id={`${fieldId}-${index}-active`}
                    checked={Boolean(option.isactive)}
                    onCheckedChange={(checked) =>
                      updateOption(index, (currentOption) => ({
                        ...currentOption,
                        isactive: checked,
                      }))
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Button type="button" variant="outline" onClick={addOption}>
        <Plus className="mr-2 h-4 w-4" />
        Add Price Option
      </Button>

      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  )
}
