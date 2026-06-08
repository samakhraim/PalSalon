export function validateRolePayload(values) {
  if (!values.name?.trim()) {
    return "Role name is required"
  }

  return null
}
