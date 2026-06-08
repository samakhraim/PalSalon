import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function DashboardOverview() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Overview</CardTitle>
        <CardDescription>
          Placeholder analytics area for charts, trends, and operational
          insights.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-xl border border-dashed bg-muted/30 p-4">
          <div className="mb-4 flex items-center justify-between">
            <span className="text-sm font-medium">Performance Snapshot</span>
            <span className="text-xs text-muted-foreground">No activity yet</span>
          </div>
          <div className="space-y-3">
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-11/12" />
            <Skeleton className="h-3 w-9/12" />
            <Skeleton className="h-48 w-full rounded-xl" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
