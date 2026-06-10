import { useMemo, useState } from "react"
import { Link } from "react-router-dom"
import { Ellipsis } from "lucide-react"

import DeleteConfirmDialog from "@/components/common/DeleteConfirmDialog"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/hooks/useAuth"
import { hasPermission } from "@/utils/permissions"

export default function ActionsDropdown({
  actions = [],
  align = "end",
  srLabel = "Row actions",
}) {
  const { user } = useAuth()
  const [confirmAction, setConfirmAction] = useState(null)

  const visibleActions = useMemo(
    () =>
      actions.filter(
        (action) => !action.permission || hasPermission(user, action.permission)
      ),
    [actions, user]
  )

  if (visibleActions.length === 0) {
    return null
  }

  const handleActionSelect = async (action) => {
    if (action.confirm) {
      setConfirmAction(action)
      return
    }

    await action.onClick?.()
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon-sm">
            <Ellipsis className="h-4 w-4" />
            <span className="sr-only">{srLabel}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align={align}>
          {visibleActions.map((action) => {
            const Icon = action.icon
            const itemClassName = action.destructive
              ? "text-destructive focus:text-destructive"
              : undefined

            if (action.to) {
              return (
                <DropdownMenuItem key={action.label} asChild className={itemClassName}>
                  <Link to={action.to}>
                    {Icon && <Icon className="mr-2 h-4 w-4" />}
                    {action.label}
                  </Link>
                </DropdownMenuItem>
              )
            }

            return (
              <DropdownMenuItem
                key={action.label}
                className={itemClassName}
                onSelect={(event) => {
                  event.preventDefault()
                  handleActionSelect(action)
                }}
              >
                {Icon && <Icon className="mr-2 h-4 w-4" />}
                {action.label}
              </DropdownMenuItem>
            )
          })}
        </DropdownMenuContent>
      </DropdownMenu>

      <DeleteConfirmDialog
        open={Boolean(confirmAction)}
        onOpenChange={(open) => {
          if (!open) {
            setConfirmAction(null)
          }
        }}
        title={confirmAction?.confirmTitle || "Confirm action"}
        description={confirmAction?.confirmDescription || "Are you sure?"}
        confirmLabel={confirmAction?.confirmLabel || "Confirm"}
        onConfirm={async () => {
          await confirmAction?.onClick?.()
          setConfirmAction(null)
        }}
      />
    </>
  )
}
