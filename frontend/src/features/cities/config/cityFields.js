export function getCityFields() {
  return [
    {
      name: "name.en",
      label: "English Name",
      type: "text",
      required: true,
    },
    {
      name: "name.ar",
      label: "Arabic Name",
      type: "text",
      required: true,
      dir: "rtl",
    },
    {
      name: "description.en",
      label: "English Description",
      type: "textarea",
    },
    {
      name: "description.ar",
      label: "Arabic Description",
      type: "textarea",
      dir: "rtl",
    },
    {
      name: "image",
      label: "City Image",
      type: "image",
      span: 2,
      accept: "image/*",
      description: "Upload an image from your device. JPG, PNG, and WEBP are supported.",
      previewWidth: 220,
      previewHeight: 160,
      defaultValue: "",
    },
    {
      name: "status",
      label: "Active",
      description: "If active, this city will be visible in other places.",
      type: "switch",
      span: 2,
      defaultValue: true,
    },
  ]
}
