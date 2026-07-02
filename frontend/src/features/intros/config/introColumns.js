export const introColumns = [
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
    searchValue: (intro) =>
      [intro.title?.en, intro.title?.ar].filter(Boolean).join(" "),
  },
  {
    key: "description.en",
    label: "Description",
    sortable: false,
    render: (intro) => intro.description?.en || intro.description?.ar || "-",
    searchValue: (intro) =>
      [intro.description?.en, intro.description?.ar].filter(Boolean).join(" "),
  },
]
