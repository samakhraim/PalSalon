import { Badge } from "@/components/ui/badge"

export default function StatusBadge({ value }) {
  return (
    <Badge variant={value ? "default" : "secondary"}>
      {value ? "Active" : "Inactive"}
    </Badge>
  )
}
