import { Badge } from "@/components/ui/badge"
import UserActionsDropdown from "@/features/users/components/UserActionsDropdown"

const formatDate = (value) => {
  if (!value) {
    return "-"
  }

  return new Intl.DateTimeFormat("en-CA").format(new Date(value))
}

const formatPhone = (user) => {
  if (!user.phoneCountryCode && !user.phoneNumber) {
    return "-"
  }

  return [user.phoneCountryCode, user.phoneNumber].filter(Boolean).join(" ")
}

export function getUserColumns({ canManage, onDelete }) {
  const columns = [
    {
      key: "id",
      header: "ID",
      render: (user) => user.id,
    },
    {
      key: "name",
      header: "Name",
      render: (user) => user.name,
    },
    {
      key: "email",
      header: "Email",
      render: (user) => user.email,
    },
    {
      key: "phone",
      header: "Phone",
      render: (user) => formatPhone(user),
    },
    {
      key: "roles",
      header: "Roles",
      render: (user) => (
        <div className="flex flex-wrap gap-1">
          {(user.roles || []).length ? (
            user.roles.map((role) => (
              <Badge key={role} variant="secondary">
                {role}
              </Badge>
            ))
          ) : (
            <span className="text-muted-foreground">-</span>
          )}
        </div>
      ),
    },
    {
      key: "createdAt",
      header: "Created At",
      render: (user) => formatDate(user.createdAt),
    },
  ]

  if (canManage) {
    columns.push({
      key: "actions",
      header: "Actions",
      render: (user) => (
        <UserActionsDropdown
          user={user}
          canManage={canManage}
          onDelete={onDelete}
        />
      ),
    })
  }

  return columns
}
