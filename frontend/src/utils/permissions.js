export function hasPermission(user, permissionName) {
  return Boolean(user?.permissions?.includes(permissionName))
}

export function hasAnyPermission(user, permissions = []) {
  return permissions.some((permission) => hasPermission(user, permission))
}

export function hasRole(user, roleName) {
  return Boolean(user?.roles?.includes(roleName))
}
