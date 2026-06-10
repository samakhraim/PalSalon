export function getUserFields({ roleOptions = [], mode = "create" } = {}) {
  return [
    {
      name: "name",
      label: "Name",
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
      name: "phoneCountryCode",
      label: "Phone Country Code",
      type: "text",
      placeholder: "+970",
    },
    {
      name: "phoneNumber",
      label: "Phone Number",
      type: "text",
      placeholder: "599123456",
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
    {
      name: "roles",
      label: "Roles",
      type: "toggleGroup",
      multiple: true,
      span: 2,
      options: roleOptions.map((role) => ({
        label: role.name || role,
        value: role.name || role,
      })),
      defaultValue: [],
    },
  ]
}
