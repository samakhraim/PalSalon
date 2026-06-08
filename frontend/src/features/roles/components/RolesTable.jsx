import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export default function RolesTable({ data, columns }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          {columns.map((column) => (
            <TableHead key={column.key}>{column.header}</TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.length ? (
          data.map((role) => (
            <TableRow key={role.id}>
              {columns.map((column) => (
                <TableCell key={column.key}>{column.render(role)}</TableCell>
              ))}
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={columns.length} className="text-center text-muted-foreground">
              No roles found.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  )
}
