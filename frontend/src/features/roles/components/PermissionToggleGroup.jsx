import { Button } from "@/components/ui/button"

export default function PermissionToggleGroup({
  groups = {},
  selected = [],
  onChange,
}) {
  const togglePermission = (permissionName) => {
    const nextPermissions = selected.includes(permissionName)
      ? selected.filter((item) => item !== permissionName)
      : [...selected, permissionName]

    onChange(nextPermissions)
  }

  return (
    <div className="space-y-4">
      {Object.entries(groups).map(([groupName, permissionNames]) => (
        <div key={groupName} className="space-y-2">
          <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {groupName}
          </div>
          <div className="flex flex-wrap gap-2">
            {permissionNames.map((permissionName) => {
              const active = selected.includes(permissionName)

              return (
                <Button
                  key={permissionName}
                  type="button"
                  variant={active ? "default" : "outline"}
                  onClick={() => togglePermission(permissionName)}
                >
                  {permissionName}
                </Button>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
