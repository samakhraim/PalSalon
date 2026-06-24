export const customerColumns = [
  {
    key: "id",
    label: "#",
    sortable: true,
  },
  {
    key: "image",
    label: "Image",
    type: "image",
    alt: (customer) =>
      [customer.first_name, customer.middle_name, customer.last_name]
        .filter(Boolean)
        .join(" ") || "Customer",
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
    key: "phone",
    label: "Phone",
    sortable: true,
  },
  {
    key: "isactive",
    label: "Active Status",
    type: "status",
    sortable: true,
    searchValue: (customer) => (customer.isactive ? "Active" : "Inactive"),
    sortValue: (customer) => (customer.isactive ? 1 : 0),
  },
]
