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
      name: "user_phone_group",
      label: "Country Phone Code / Phone",
      type: "phoneGroup",
      required: true,
      codeFieldName: "phoneCountryCode",
      phoneFieldName: "phoneNumber",
      codePlaceholder: "+970",
      phonePlaceholder: "Phone number",
      codeRequiredMessage: "Phone country code is required.",
      phoneRequiredMessage: "Phone number is required.",
    },
    {
      name: "phoneCountryCode",
      type: "hidden",
      defaultValue: "",
    },
    {
      name: "phoneNumber",
      type: "hidden",
      defaultValue: "",
    },
    {
      name: "password",
      label: "Password",
      type: "password",
      required: mode === "create",
      description:
        mode === "edit" ? "Leave empty to keep the existing password." : undefined,
    },
    {
      name: "confirm_password",
      label: "Confirm Password",
      type: "password",
      required: mode === "create",
      validate: (value, formValues) => {
        const password = formValues.password?.trim() || ""
        const confirmPassword = value?.trim() || ""

        if (mode === "create" || password) {
          if (!confirmPassword) {
            return "Confirm Password is required."
          }

          if (confirmPassword !== password) {
            return "Passwords do not match."
          }
        }

        return ""
      },
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
