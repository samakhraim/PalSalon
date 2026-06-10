export const userColumns = [
  {
    key: "id",
    label: "ID",
  },
  {
    key: "name",
    label: "Name",
  },
  {
    key: "email",
    label: "Email",
  },
  {
    key: "phone",
    label: "Phone",
    render: (user) =>
      [user.phoneCountryCode, user.phoneNumber].filter(Boolean).join(" ") || "-",
  },
  {
    key: "roles",
    label: "Roles",
    type: "badges",
  },
  {
    key: "createdAt",
    label: "Created At",
    type: "date",
  },
]
