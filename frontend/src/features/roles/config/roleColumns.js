export const roleColumns = [
  {
    key: "id",
    label: "ID",
    sortable: true,
  },
  {
    key: "name",
    label: "Name",
    sortable: true,
  },
  {
    key: "permissionCount",
    label: "Permissions",
    sortable: true,
    render: (role) => role.permissions?.length || 0,
    searchValue: (role) => role.permissions?.join(" ") || "",
    sortValue: (role) => role.permissions?.length || 0,
  },
  {
    key: "createdAt",
    label: "Created At",
    type: "date",
    sortable: true,
  },
]
