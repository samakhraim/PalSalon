export function getCustomerFields({ mode = "create" } = {}) {
  return [
    {
      name: "image",
      label: "Customer Image",
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
      name: "isactive",
      label: "Status",
      type: "switch",
      span: 2,
      layoutArea: "statusTop",
      defaultValue: false,
    },
    {
      name: "first_name",
      label: "First Name",
      type: "text",
      required: true,
    },
    {
      name: "middle_name",
      label: "Middle Name",
      type: "text",
    },
    {
      name: "last_name",
      label: "Last Name",
      type: "text",
      required: true,
    },
    {
      name: "country_phone_code",
      label: "Country Phone Code",
      type: "text",
      required: true,
      placeholder: "+970",
    },
    {
      name: "phone",
      label: "Phone",
      type: "text",
      required: true,
    },
    {
      name: "email",
      label: "Email",
      type: "email",
      required: true,
    },
    {
      name: "password",
      label: "Password",
      type: "password",
      required: mode === "create",
      description:
        mode === "edit" ? "Leave empty to keep the existing password." : undefined,
      span: 2,
    },
  ]
}
