import { WalletCards } from "lucide-react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const stats = [
  { label: "Total Salons", value: "0" },
  { label: "Appointments", value: "0" },
  { label: "Customers", value: "0" },
  { label: "Revenue", value: "0 NIS" },
]

export default function DashboardCards() {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.label}>
          <CardHeader>
            <CardDescription>{stat.label}</CardDescription>
            <CardTitle className="text-3xl">{stat.value}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <WalletCards className="h-4 w-4" />
              Waiting for live business data
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
