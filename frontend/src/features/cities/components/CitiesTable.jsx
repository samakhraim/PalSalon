import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export default function CitiesTable({ data, columns }) {
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
          data.map((city) => (
            <TableRow key={city.id}>
              {columns.map((column) => (
                <TableCell key={column.key}>{column.render(city)}</TableCell>
              ))}
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={columns.length} className="text-center text-muted-foreground">
              No cities found.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  )
}
