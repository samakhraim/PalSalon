export function getNestedValue(object, path, fallback = undefined) {
  if (!path) {
    return object ?? fallback
  }

  const segments = Array.isArray(path) ? path : String(path).split(".")
  let current = object

  for (const segment of segments) {
    if (current === null || current === undefined) {
      return fallback
    }

    current = current[segment]
  }

  return current === undefined ? fallback : current
}

export function setNestedValue(object, path, value) {
  const segments = Array.isArray(path) ? path : String(path).split(".")

  if (segments.length === 0) {
    return value
  }

  const [head, ...rest] = segments
  const baseObject =
    object && typeof object === "object" && !Array.isArray(object) ? object : {}

  if (rest.length === 0) {
    return {
      ...baseObject,
      [head]: value,
    }
  }

  return {
    ...baseObject,
    [head]: setNestedValue(baseObject[head], rest, value),
  }
}

export function buildValuesFromFields(fields = [], initialValues = {}) {
  let nextValues = {}

  for (const field of fields) {
    if (!field?.name) {
      continue
    }

    const initialValue = getNestedValue(initialValues, field.name)
    const fallbackValue =
      field.defaultValue !== undefined
        ? typeof field.defaultValue === "function"
          ? field.defaultValue()
          : field.defaultValue
        : field.multiple
          ? []
          : field.type === "switch"
            ? false
            : ""

    nextValues = setNestedValue(
      nextValues,
      field.name,
      initialValue !== undefined ? initialValue : fallbackValue
    )
  }

  return nextValues
}
