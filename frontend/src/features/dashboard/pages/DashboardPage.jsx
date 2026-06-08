import { Info } from "lucide-react"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import DashboardCards from "@/features/dashboard/components/DashboardCards"
import DashboardOverview from "@/features/dashboard/components/DashboardOverview"
import DashboardSkeleton from "@/features/dashboard/components/DashboardSkeleton"

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Dashboard</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          A clean starting point for the PalSalon management workspace.
        </p>
      </div>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Static preview mode</AlertTitle>
        <AlertDescription>
          This dashboard is using placeholder metrics only. Backend data and APIs
          are intentionally not connected yet.
        </AlertDescription>
      </Alert>

      <DashboardCards />

      <div className="grid gap-6 xl:grid-cols-[1.75fr_1fr]">
        <DashboardOverview />

        <Card>
          <CardHeader>
            <CardTitle>Loading Preview</CardTitle>
            <CardDescription>
              Skeleton states ready for dashboard data fetching flows.
            </CardDescription>
          </CardHeader>
          <Separator />
          <CardContent className="pt-6">
            <DashboardSkeleton />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
