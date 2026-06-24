export const salonOwnerColumns = [
  {
    key: "id",
    label: "#",
    sortable: true,
  },
  {
    key: "first_name",
    label: "First Name",
    sortable: true,
  },
  {
    key: "middle_name",
    label: "Middle Name",
    sortable: true,
  },
  {
    key: "last_name",
    label: "Last Name",
    sortable: true,
  },
  {
    key: "email",
    label: "Email",
    sortable: true,
  },
  {
    key: "country_phone_code",
    label: "Country Phone Code",
    sortable: true,
  },
  {
    key: "phone",
    label: "Phone",
    sortable: true,
  },
  {
    key: "isactive",
    label: "Active Status",
    type: "status",
    sortable: true,
    searchValue: (salonOwner) => (salonOwner.isactive ? "Active" : "Inactive"),
    sortValue: (salonOwner) => (salonOwner.isactive ? 1 : 0),
  },
]
