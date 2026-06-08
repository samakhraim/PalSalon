import { Link, Navigate, Outlet } from "react-router-dom"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/useAuth"
import { hasPermission } from "@/utils/permissions"

export default function PermissionRoute({ permission, redirectTo = "/dashboard" }) {
  const { isAuthenticated, user } = useAuth()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (permission && !hasPermission(user, permission)) {
    return (
      <div className="mx-auto max-w-2xl space-y-4">
        <Alert variant="destructive">
          <AlertTitle>Access denied</AlertTitle>
          <AlertDescription>
            You do not have permission to view this page.
          </AlertDescription>
        </Alert>
        <Button asChild variant="outline">
          <Link to={redirectTo}>Return to dashboard</Link>
        </Button>
      </div>
    )
  }

  return <Outlet />
}
