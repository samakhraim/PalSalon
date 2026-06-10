export const roleColumns = [
  {
    key: "id",
    label: "ID",
  },
  {
    key: "name",
    label: "Name",
  },
  {
    key: "permissionCount",
    label: "Permissions",
    render: (role) => role.permissions?.length || 0,
  },
  {
    key: "createdAt",
    label: "Created At",
    type: "date",
  },
]
