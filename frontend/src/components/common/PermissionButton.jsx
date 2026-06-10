import { useAuth } from "@/hooks/useAuth"
import { hasAnyPermission, hasPermission } from "@/utils/permissions"

export default function PermissionButton({
  permission,
  permissions,
  fallback = null,
  children,
}) {
  const { user } = useAuth()

  if (permission && !hasPermission(user, permission)) {
    return fallback
  }

  if (permissions?.length && !hasAnyPermission(user, permissions)) {
    return fallback
  }

  return children
}
