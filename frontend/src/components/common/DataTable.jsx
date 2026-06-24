import { useEffect, useMemo, useState } from "react"
import { Link } from "react-router-dom"
import {
  ArrowUpDown,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronsLeft,
  ChevronsRight,
  Plus,
  Search,
} from "lucide-react"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import ImagePreview from "@/components/common/ImagePreview"
import StatusBadge from "@/components/common/StatusBadge"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
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

const PAGE_SIZE_OPTIONS = [10, 25, 50, 100]

const formatDate = (value) => {
  if (!value) {
    return "-"
  }

  return new Intl.DateTimeFormat("en-CA").format(new Date(value))
}

const getRawColumnValue = (row, column) => {
  if (column.searchValue) {
    return column.searchValue(row)
  }

  if (column.sortValue) {
    return column.sortValue(row)
  }

  const value = getNestedValue(row, column.key)

  switch (column.type) {
    case "status":
      return value ? "Active" : "Inactive"
    case "date":
      return value ? new Date(value).getTime() : null
    case "badges":
      return Array.isArray(value) ? value.join(" ") : value
    default:
      return value
  }
}

const getSearchableText = (row, column) => {
  if (column.searchable === false || column.key === "actions") {
    return ""
  }

  const rawValue = column.searchValue
    ? column.searchValue(row)
    : getRawColumnValue(row, column)

  if (rawValue === null || rawValue === undefined) {
    return ""
  }

  if (Array.isArray(rawValue)) {
    return rawValue.join(" ")
  }

  if (typeof rawValue === "object") {
    return Object.values(rawValue).join(" ")
  }

  return String(rawValue)
}

const getComparableValue = (row, column) => {
  const rawValue = column.sortValue
    ? column.sortValue(row)
    : getRawColumnValue(row, column)

  if (rawValue === null || rawValue === undefined) {
    return ""
  }

  if (typeof rawValue === "number") {
    return rawValue
  }

  if (typeof rawValue === "boolean") {
    return rawValue ? 1 : 0
  }

  return String(rawValue).toLowerCase()
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

const getPaginationRange = (currentPage, totalPages) => {
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, index) => index + 1)
  }

  const startPage = Math.max(1, currentPage - 1)
  const endPage = Math.min(totalPages, startPage + 2)
  const adjustedStart = Math.max(1, endPage - 2)

  return Array.from(
    { length: endPage - adjustedStart + 1 },
    (_, index) => adjustedStart + index
  )
}

export default function DataTable({
  title,
  data = [],
  columns = [],
  loading = false,
  error = "",
  emptyMessage = "No data found.",
  addButtonLabel,
  addButtonPath,
  canCreate = false,
  canManage = true,
}) {
  const [searchTerm, setSearchTerm] = useState("")
  const [pageSize, setPageSize] = useState(10)
  const [currentPage, setCurrentPage] = useState(1)
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: null,
  })

  const errorMessage =
    typeof error === "string" ? error : error?.message || error?.toString()
  const visibleColumns = useMemo(
    () => columns.filter((column) => canManage || column.key !== "actions"),
    [canManage, columns]
  )

  const filteredRows = useMemo(() => {
    const normalizedSearchTerm = searchTerm.trim().toLowerCase()

    if (!normalizedSearchTerm) {
      return data
    }

    return data.filter((row) =>
      visibleColumns.some((column) =>
        getSearchableText(row, column).toLowerCase().includes(normalizedSearchTerm)
      )
    )
  }, [data, searchTerm, visibleColumns])

  const sortedRows = useMemo(() => {
    if (!sortConfig.key || !sortConfig.direction) {
      return filteredRows
    }

    const targetColumn = visibleColumns.find((column) => column.key === sortConfig.key)

    if (!targetColumn) {
      return filteredRows
    }

    const sorted = [...filteredRows].sort((leftRow, rightRow) => {
      const leftValue = getComparableValue(leftRow, targetColumn)
      const rightValue = getComparableValue(rightRow, targetColumn)

      if (leftValue < rightValue) {
        return sortConfig.direction === "asc" ? -1 : 1
      }

      if (leftValue > rightValue) {
        return sortConfig.direction === "asc" ? 1 : -1
      }

      return 0
    })

    return sorted
  }, [filteredRows, sortConfig.direction, sortConfig.key, visibleColumns])

  const totalEntries = sortedRows.length
  const totalPages = Math.max(1, Math.ceil(totalEntries / pageSize))
  const safeCurrentPage = Math.min(currentPage, totalPages)
  const pageStartIndex = totalEntries === 0 ? 0 : (safeCurrentPage - 1) * pageSize
  const pageEndIndex = Math.min(pageStartIndex + pageSize, totalEntries)
  const paginatedRows = sortedRows.slice(pageStartIndex, pageEndIndex)
  const pageNumbers = getPaginationRange(safeCurrentPage, totalPages)

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages)
    }
  }, [currentPage, totalPages])

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value)
    setCurrentPage(1)
  }

  const handlePageSizeChange = (event) => {
    setPageSize(Number(event.target.value))
    setCurrentPage(1)
  }

  const handleSort = (column) => {
    if (!column.sortable || column.key === "actions") {
      return
    }

    setCurrentPage(1)
    setSortConfig((current) => {
      if (current.key !== column.key) {
        return { key: column.key, direction: "asc" }
      }

      if (current.direction === "asc") {
        return { key: column.key, direction: "desc" }
      }

      if (current.direction === "desc") {
        return { key: null, direction: null }
      }

      return { key: column.key, direction: "asc" }
    })
  }

  const renderSortIcon = (column) => {
    if (!column.sortable || column.key === "actions") {
      return null
    }

    if (sortConfig.key !== column.key || !sortConfig.direction) {
      return <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground" />
    }

    return sortConfig.direction === "asc" ? (
      <ChevronUp className="h-3.5 w-3.5 text-foreground" />
    ) : (
      <ChevronDown className="h-3.5 w-3.5 text-foreground" />
    )
  }

  const showingFrom = totalEntries === 0 ? 0 : pageStartIndex + 1
  const showingTo = totalEntries === 0 ? 0 : pageEndIndex
  const entryLabel = totalEntries === 1 ? "entry" : "entries"

  return (
    <div className="space-y-4">
      {errorMessage && (
        <Alert variant="destructive">
          <AlertTitle>Request failed</AlertTitle>
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}

      <Card className="border border-border/80 shadow-none">
        <CardHeader className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle className="text-xl">{title}</CardTitle>
            {canCreate && addButtonLabel && addButtonPath && (
              <Button asChild>
                <Link to={addButtonPath}>
                  <Plus className="mr-2 h-4 w-4" />
                  {addButtonLabel}
                </Link>
              </Button>
            )}
          </div>

          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Show</span>
              <select
                className="h-9 rounded-md border border-input bg-background px-3 text-sm text-foreground outline-none"
                value={pageSize}
                onChange={handlePageSizeChange}
              >
                {PAGE_SIZE_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              <span>entries</span>
            </div>

            <div className="relative w-full md:max-w-xs">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={searchTerm}
                onChange={handleSearchChange}
                placeholder="Search..."
                className="pl-9"
              />
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {loading ? (
            <div className="space-y-3">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : (
            <>
              <div className="overflow-x-auto rounded-lg border border-border/80">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/30 hover:bg-muted/30">
                      {visibleColumns.map((column) => (
                        <TableHead
                          key={column.key}
                          className={
                            column.key === "actions" ? "text-right" : undefined
                          }
                        >
                          {column.sortable && column.key !== "actions" ? (
                            <button
                              type="button"
                              onClick={() => handleSort(column)}
                              className="flex items-center gap-2 font-semibold text-foreground"
                            >
                              <span>{column.label || column.header}</span>
                              {renderSortIcon(column)}
                            </button>
                          ) : (
                            <div
                              className={
                                column.key === "actions"
                                  ? "text-right font-semibold text-foreground"
                                  : "font-semibold text-foreground"
                              }
                            >
                              {column.label || column.header}
                            </div>
                          )}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedRows.length ? (
                      paginatedRows.map((row) => (
                        <TableRow key={row.id}>
                          {visibleColumns.map((column) => (
                            <TableCell
                              key={column.key}
                              className={
                                column.key === "actions"
                                  ? "w-[1%] whitespace-nowrap text-right"
                                  : "align-middle"
                              }
                            >
                              {renderCellValue(row, column)}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={visibleColumns.length}
                          className="py-10 text-center text-muted-foreground"
                        >
                          {emptyMessage}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>

              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <p className="text-sm text-muted-foreground">
                  {`Showing ${showingFrom} to ${showingTo} of ${totalEntries} ${entryLabel}`}
                </p>

                <div className="flex items-center gap-1">
                  <Button
                    type="button"
                    variant="outline"
                    size="icon-sm"
                    disabled={safeCurrentPage === 1}
                    onClick={() => setCurrentPage(1)}
                  >
                    <ChevronsLeft className="h-4 w-4" />
                    <span className="sr-only">First page</span>
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon-sm"
                    disabled={safeCurrentPage === 1}
                    onClick={() => setCurrentPage((current) => Math.max(1, current - 1))}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    <span className="sr-only">Previous page</span>
                  </Button>

                  {pageNumbers.map((pageNumber) => (
                    <Button
                      key={pageNumber}
                      type="button"
                      variant={pageNumber === safeCurrentPage ? "default" : "outline"}
                      size="icon-sm"
                      onClick={() => setCurrentPage(pageNumber)}
                    >
                      {pageNumber}
                    </Button>
                  ))}

                  <Button
                    type="button"
                    variant="outline"
                    size="icon-sm"
                    disabled={safeCurrentPage === totalPages || totalEntries === 0}
                    onClick={() =>
                      setCurrentPage((current) => Math.min(totalPages, current + 1))
                    }
                  >
                    <ChevronRight className="h-4 w-4" />
                    <span className="sr-only">Next page</span>
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon-sm"
                    disabled={safeCurrentPage === totalPages || totalEntries === 0}
                    onClick={() => setCurrentPage(totalPages)}
                  >
                    <ChevronsRight className="h-4 w-4" />
                    <span className="sr-only">Last page</span>
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
