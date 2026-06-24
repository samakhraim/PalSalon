export const userColumns = [
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
    key: "email",
    label: "Email",
    sortable: true,
  },
  {
    key: "phone",
    label: "Phone",
    sortable: true,
    render: (user) =>
      [user.phoneCountryCode, user.phoneNumber].filter(Boolean).join(" ") || "-",
    searchValue: (user) =>
      [user.phoneCountryCode, user.phoneNumber].filter(Boolean).join(" "),
    sortValue: (user) =>
      [user.phoneCountryCode, user.phoneNumber].filter(Boolean).join(" "),
  },
  {
    key: "roles",
    label: "Roles",
    type: "badges",
    sortable: true,
  },
  {
    key: "createdAt",
    label: "Created At",
    type: "date",
    sortable: true,
  },
]
