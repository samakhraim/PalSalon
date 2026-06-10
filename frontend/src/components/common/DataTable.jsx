import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import ImagePreview from "@/components/common/ImagePreview"
import StatusBadge from "@/components/common/StatusBadge"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { getNestedValue } from "@/lib/object"

const formatDate = (value) => {
  if (!value) {
    return "-"
  }

  return new Intl.DateTimeFormat("en-CA").format(new Date(value))
}

const renderCellValue = (row, column) => {
  if (column.render) {
    return column.render(row)
  }

  const value = getNestedValue(row, column.key)

  switch (column.type) {
    case "image":
      return (
        <ImagePreview
          image={value}
          alt={column.alt?.(row) || column.label || column.key}
          width={column.width || 56}
          height={column.height || 40}
        />
      )
    case "status":
      return <StatusBadge value={Boolean(value)} />
    case "date":
      return formatDate(value)
    case "badges":
      return Array.isArray(value) && value.length ? (
        <div className="flex flex-wrap gap-1">
          {value.map((item) => (
            <Badge key={item} variant="secondary">
              {item}
            </Badge>
          ))}
        </div>
      ) : (
        <span className="text-muted-foreground">-</span>
      )
    default:
      return value === null || value === undefined || value === ""
        ? "-"
        : String(value)
  }
}

export default function DataTable({
  data = [],
  columns = [],
  loading = false,
  error = "",
  emptyMessage = "No data found.",
}) {
  const errorMessage =
    typeof error === "string" ? error : error?.message || error?.toString()

  if (errorMessage) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Request failed</AlertTitle>
        <AlertDescription>{errorMessage}</AlertDescription>
      </Alert>
    )
  }

  if (loading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          {columns.map((column) => (
            <TableHead key={column.key}>{column.label || column.header}</TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.length ? (
          data.map((row) => (
            <TableRow key={row.id}>
              {columns.map((column) => (
                <TableCell key={column.key}>{renderCellValue(row, column)}</TableCell>
              ))}
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={columns.length} className="text-center text-muted-foreground">
              {emptyMessage}
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  )
}
