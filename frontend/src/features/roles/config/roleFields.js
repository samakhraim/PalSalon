export function getRoleFields({ permissionOptions = [] } = {}) {
  return [
    {
      name: "name",
      label: "Name",
      type: "text",
      required: true,
      placeholder: "Name",
      span: 2,
    },
    {
      name: "permissions",
      label: "Permissions",
      type: "permissions-toggle-grid",
      required: true,
      span: 2,
      description: "Enable the access this role should have.",
      options: permissionOptions.map((permission) => ({
        label: permission.name || permission,
        value: permission.name || permission,
      })),
      defaultValue: [],
    },
  ]
}
