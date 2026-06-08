import { Navigate, Route, Routes, Link } from "react-router-dom"

import MainLayout from "@/components/layout/MainLayout"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import DashboardPage from "@/features/dashboard/pages/DashboardPage"
import NotFoundPage from "@/pages/NotFoundPage"

function AuthPlaceholderPage({ title, description }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent className="flex gap-3">
          <Button asChild>
            <Link to="/dashboard">Go to dashboard</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/register">Open register</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route element={<MainLayout />}>
        <Route path="/dashboard" element={<DashboardPage />} />
      </Route>
      <Route
        path="/login"
        element={
          <AuthPlaceholderPage
            title="Login"
            description="Authentication is not connected yet. This route is a placeholder only."
          />
        }
      />
      <Route
        path="/register"
        element={
          <AuthPlaceholderPage
            title="Register"
            description="Registration is also a placeholder for now while the frontend shell is being prepared."
          />
        }
      />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
