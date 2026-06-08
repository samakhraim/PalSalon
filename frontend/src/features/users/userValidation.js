export function validateUserPayload(values, { isEdit = false } = {}) {
  if (!values.name?.trim()) {
    return "Name is required"
  }

  if (!values.email?.trim()) {
    return "Email is required"
  }

  if (!isEdit && !values.password?.trim()) {
    return "Password is required"
  }

  return null
}
