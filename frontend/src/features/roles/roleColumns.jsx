import RoleActionsDropdown from "@/features/roles/components/RoleActionsDropdown"

const formatDate = (value) => {
  if (!value) {
    return "-"
  }

  return new Intl.DateTimeFormat("en-CA").format(new Date(value))
}

export function getRoleColumns({ canManage, onDelete }) {
  return [
    {
      key: "id",
      header: "ID",
      render: (role) => role.id,
    },
    {
      key: "name",
      header: "Name",
      render: (role) => role.name,
    },
    {
      key: "permissionCount",
      header: "Permissions",
      render: (role) => role.permissions?.length || 0,
    },
    {
      key: "createdAt",
      header: "Created At",
      render: (role) => formatDate(role.createdAt),
    },
    {
      key: "actions",
      header: "Actions",
      render: (role) => (
        <RoleActionsDropdown
          role={role}
          canManage={canManage}
          onDelete={onDelete}
        />
      ),
    },
  ]
}
