import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export default function RoleToggleGroup({
  options = [],
  selected = [],
  onChange,
  title = "Roles",
}) {
  const toggleRole = (roleName) => {
    const nextSelected = selected.includes(roleName)
      ? selected.filter((item) => item !== roleName)
      : [...selected, roleName]

    onChange(nextSelected)
  }

  return (
    <div className="space-y-3">
      <div className="text-sm font-medium">{title}</div>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const roleName = option.name || option
          const active = selected.includes(roleName)

          return (
            <Button
              key={roleName}
              type="button"
              variant={active ? "default" : "outline"}
              className={cn("min-w-24", active && "shadow-sm")}
              onClick={() => toggleRole(roleName)}
            >
              {roleName}
            </Button>
          )
        })}
      </div>
    </div>
  )
}
