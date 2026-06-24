import { useMemo } from "react"

import ActionsDropdown from "@/components/common/ActionsDropdown"
import DataTable from "@/components/common/DataTable"
import PageHeader from "@/components/common/PageHeader"
import { useAuth } from "@/hooks/useAuth"
import { hasPermission } from "@/utils/permissions"

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
  const { user } = useAuth()
  const canManage = Boolean(
    createPermission ? hasPermission(user, createPermission) : createPath
  )
  const extendedColumns = useMemo(() => {
    if (!actions || !canManage) {
      return columns
    }

    return [
      ...columns,
      {
        key: "actions",
        label: "Actions",
        sortable: false,
        searchable: false,
        render: (row) => <ActionsDropdown actions={actions(row)} />,
      },
    ]
  }, [actions, canManage, columns])

  return (
    <div className="space-y-6">
      <PageHeader
        title={title}
        description={description}
      />

      <DataTable
        title={`${title} List`}
        data={data}
        columns={extendedColumns}
        loading={loading}
        error={error}
        emptyMessage={emptyMessage}
        addButtonLabel={createLabel}
        addButtonPath={createPath}
        canCreate={canManage}
        canManage={canManage}
      />
    </div>
  )
}
