import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export default function UsersTable({ data, columns }) {
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
          data.map((user) => (
            <TableRow key={user.id}>
              {columns.map((column) => (
                <TableCell key={column.key}>{column.render(user)}</TableCell>
              ))}
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={columns.length} className="text-center text-muted-foreground">
              No users found.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  )
}
