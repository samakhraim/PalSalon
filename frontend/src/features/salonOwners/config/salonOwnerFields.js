export function getSalonOwnerFields({ mode = "create" } = {}) {
  return [
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
      name: "salon_owner_phone_group",
      label: "Country Phone Code / Phone",
      type: "phoneGroup",
      required: true,
      codeFieldName: "country_phone_code",
      phoneFieldName: "phone",
      codePlaceholder: "+970",
      phonePlaceholder: "Phone number",
      codeRequiredMessage: "Country phone code is required.",
      phoneRequiredMessage: "Phone is required.",
    },
    {
      name: "country_phone_code",
      type: "hidden",
      defaultValue: "",
    },
    {
      name: "phone",
      type: "hidden",
      defaultValue: "",
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
  ]
}
