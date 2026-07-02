export function getIntroFields() {
  return [
    {
      name: "mainImageUrl",
      label: "Intro Image",
      type: "image",
      span: 2,
      accept: "image/*",
      layoutArea: "mediaTop",
      previewVariant: "avatar",
      previewWidth: 112,
      previewHeight: 112,
      uploadLabel: "Upload Image",
      defaultValue: "",
    },
    {
      name: "title.en",
      label: "Title (English)",
      type: "text",
      required: true,
    },
    {
      name: "title.ar",
      label: "Title (Arabic)",
      type: "text",
      dir: "rtl",
    },
    {
      name: "description.en",
      label: "Description (English)",
      type: "textarea",
      required: true,
    },
    {
      name: "description.ar",
      label: "Description (Arabic)",
      type: "textarea",
      dir: "rtl",
    },
  ]
}
