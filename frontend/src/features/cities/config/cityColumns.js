export const cityColumns = [
  {
    key: "id",
    label: "ID",
  },
  {
    key: "image",
    label: "Image",
    type: "image",
  },
  {
    key: "name.en",
    label: "English Name",
  },
  {
    key: "name.ar",
    label: "Arabic Name",
    render: (city) => city.name?.ar || "-",
  },
  {
    key: "status",
    label: "Status",
    type: "status",
  },
  {
    key: "createdAt",
    label: "Created At",
    type: "date",
  },
]
