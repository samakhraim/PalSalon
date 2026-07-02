export const categoryColumns = [
  {
    key: "id",
    label: "#",
    sortable: true,
  },
  {
    key: "name.en",
    label: "Category Name",
    sortable: true,
    searchValue: (category) =>
      [category.name?.en, category.name?.ar].filter(Boolean).join(" "),
  },
  {
    key: "description.en",
    label: "Description",
    sortable: false,
    render: (category) =>
      category.description?.en || category.description?.ar || "-",
    searchValue: (category) =>
      [category.description?.en, category.description?.ar].filter(Boolean).join(" "),
  },
  {
    key: "isactive",
    label: "Status",
    type: "status",
    sortable: true,
  },
  {
    key: "created_at",
    label: "Created At",
    type: "date",
    sortable: true,
  },
]
