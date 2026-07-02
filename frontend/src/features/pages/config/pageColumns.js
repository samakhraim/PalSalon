export const pageColumns = [
  {
    key: "id",
    label: "#",
    sortable: true,
  },
  {
    key: "imageUrl",
    label: "Image",
    type: "image",
    sortable: false,
    searchable: false,
  },
  {
    key: "title.en",
    label: "Title",
    sortable: true,
    searchValue: (page) => [page.title?.en, page.title?.ar].filter(Boolean).join(" "),
  },
  {
    key: "slug",
    label: "Slug",
    sortable: true,
  },
  {
    key: "status",
    label: "Status",
    type: "status",
    sortable: true,
  },
]
