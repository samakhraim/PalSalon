export function getRoleFields({ permissionOptions = [] } = {}) {
  return [
    {
      name: "name",
      label: "Role Name",
      type: "text",
      required: true,
    },
    {
      name: "permissions",
      label: "Permissions",
      type: "toggleGroup",
      multiple: true,
      span: 2,
      options: permissionOptions.map((permission) => ({
        label: permission.name || permission,
        value: permission.name || permission,
      })),
      groupBy: (option) => option.label.split("-")[0] || "General",
      defaultValue: [],
    },
  ]
}
