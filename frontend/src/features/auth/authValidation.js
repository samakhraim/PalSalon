export function validateLoginInput(values) {
  if (!values.email?.trim() || !values.password?.trim()) {
    return "Email and password are required"
  }

  return null
}
