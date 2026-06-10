export function validateCityPayload(values) {
  if (!values.name?.en?.trim()) {
    return "English name is required"
  }

  if (!values.name?.ar?.trim()) {
    return "Arabic name is required"
  }

  return null
}
