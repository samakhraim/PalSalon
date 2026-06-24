export const salonColumns = [
  {
    key: "id",
    label: "#",
    sortable: true,
  },
  {
    key: "imageUrl",
    label: "Main Image",
    type: "image",
    alt: (salon) => salon.name?.en || salon.name?.ar || "Salon",
  },
  {
    key: "name",
    label: "Name",
    sortable: true,
    render: (salon) => salon.name?.en || salon.name?.ar || "-",
    searchValue: (salon) =>
      [salon.name?.en, salon.name?.ar].filter(Boolean).join(" "),
    sortValue: (salon) => salon.name?.en || salon.name?.ar || "",
  },
  {
    key: "salonOwner",
    label: "Owner",
    sortable: true,
    render: (salon) => salon.salonOwner?.full_name || "-",
    searchValue: (salon) => salon.salonOwner?.full_name || "",
    sortValue: (salon) => salon.salonOwner?.full_name || "",
  },
  {
    key: "city",
    label: "City",
    sortable: true,
    render: (salon) => salon.city?.name?.en || salon.city?.name?.ar || "-",
    searchValue: (salon) =>
      [salon.city?.name?.en, salon.city?.name?.ar].filter(Boolean).join(" "),
    sortValue: (salon) => salon.city?.name?.en || salon.city?.name?.ar || "",
  },
  {
    key: "telephone",
    label: "Telephone",
    sortable: true,
    render: (salon) =>
      [salon.country_phone_code, salon.city_phone_code, salon.telephone]
        .filter(Boolean)
        .join(" ") || "-",
    searchValue: (salon) =>
      [salon.country_phone_code, salon.city_phone_code, salon.telephone]
        .filter(Boolean)
        .join(" "),
    sortValue: (salon) =>
      [salon.country_phone_code, salon.city_phone_code, salon.telephone]
        .filter(Boolean)
        .join(" "),
  },
  {
    key: "phone_number",
    label: "Phone Number",
    sortable: true,
    render: (salon) =>
      [salon.country_phone_code, salon.phone_number].filter(Boolean).join(" ") || "-",
    searchValue: (salon) =>
      [salon.country_phone_code, salon.phone_number].filter(Boolean).join(" "),
    sortValue: (salon) =>
      [salon.country_phone_code, salon.phone_number].filter(Boolean).join(" "),
  },
  {
    key: "isactive",
    label: "Active Status",
    type: "status",
    sortable: true,
    searchValue: (salon) => (salon.isactive ? "Active" : "Inactive"),
    sortValue: (salon) => (salon.isactive ? 1 : 0),
  },
  {
    key: "click_count",
    label: "Click Count",
    sortable: true,
  },
]
