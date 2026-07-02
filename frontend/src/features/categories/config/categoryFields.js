export function getCategoryFields() {
  return [
    {
      name: "name.en",
      label: "Name (English)",
      type: "text",
      required: true,
    },
    {
      name: "name.ar",
      label: "Name (Arabic)",
      type: "text",
      dir: "rtl",
    },
    {
      name: "description.en",
      label: "Description (English)",
      type: "textarea",
    },
    {
      name: "description.ar",
      label: "Description (Arabic)",
      type: "textarea",
      dir: "rtl",
    },
    {
      name: "isactive",
      label: "Status",
      description: "If active, this category can be assigned to services.",
      type: "switch",
      span: 2,
      layoutArea: "statusTop",
      defaultValue: false,
    },
  ]
}
