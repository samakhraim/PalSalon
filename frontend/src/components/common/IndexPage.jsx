import { useMemo } from "react"
import { Link } from "react-router-dom"
import { Plus } from "lucide-react"

import ActionsDropdown from "@/components/common/ActionsDropdown"
import DataTable from "@/components/common/DataTable"
import PageHeader from "@/components/common/PageHeader"
import PermissionButton from "@/components/common/PermissionButton"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function IndexPage({
  title,
  description,
  createLabel,
  createPath,
  createPermission,
  data,
  columns,
  actions,
  loading,
  error,
  emptyMessage,
}) {
  const extendedColumns = useMemo(() => {
    if (!actions) {
      return columns
    }

    return [
      ...columns,
      {
        key: "actions",
        label: "Actions",
        render: (row) => <ActionsDropdown actions={actions(row)} />,
      },
    ]
  }, [actions, columns])

  return (
    <div className="space-y-6">
      <PageHeader
        title={title}
        description={description}
        action={
          createLabel &&
          createPath && (
            <PermissionButton permission={createPermission}>
              <Button asChild>
                <Link to={createPath}>
                  <Plus className="mr-2 h-4 w-4" />
                  {createLabel}
                </Link>
              </Button>
            </PermissionButton>
          )
        }
      />

      <Card>
        <CardHeader>
          <CardTitle>{title} List</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            data={data}
            columns={extendedColumns}
            loading={loading}
            error={error}
            emptyMessage={emptyMessage}
          />
        </CardContent>
      </Card>
    </div>
  )
}
