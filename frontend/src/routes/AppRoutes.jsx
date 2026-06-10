import { Navigate, Route, Routes } from "react-router-dom"

import PermissionRoute from "@/components/common/PermissionRoute"
import ProtectedRoute from "@/components/common/ProtectedRoute"
import MainLayout from "@/components/layout/MainLayout"
import { useAuth } from "@/hooks/useAuth"
import LoginPage from "@/features/auth/pages/LoginPage"
import CitiesPage from "@/features/cities/pages/CitiesPage"
import CreateCityPage from "@/features/cities/pages/CreateCityPage"
import EditCityPage from "@/features/cities/pages/EditCityPage"
import DashboardPage from "@/features/dashboard/pages/DashboardPage"
import CreateRolePage from "@/features/roles/pages/CreateRolePage"
import EditRolePage from "@/features/roles/pages/EditRolePage"
import RolesPage from "@/features/roles/pages/RolesPage"
import CreateUserPage from "@/features/users/pages/CreateUserPage"
import EditUserPage from "@/features/users/pages/EditUserPage"
import UsersPage from "@/features/users/pages/UsersPage"
import NotFoundPage from "@/pages/NotFoundPage"

function RootRedirect() {
  const { isAuthenticated } = useAuth()
  return <Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />
}

function LoginRoute() {
  const { isAuthenticated } = useAuth()

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  return <LoginPage />
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<RootRedirect />} />
      <Route path="/login" element={<LoginRoute />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route element={<PermissionRoute permission="Cities-view" />}>
            <Route path="/cities" element={<CitiesPage />} />
          </Route>
          <Route element={<PermissionRoute permission="Cities-manage" />}>
            <Route path="/cities/create" element={<CreateCityPage />} />
            <Route path="/cities/:id/edit" element={<EditCityPage />} />
          </Route>
          <Route element={<PermissionRoute permission="Users-view" />}>
            <Route path="/users" element={<UsersPage />} />
          </Route>
          <Route element={<PermissionRoute permission="Users-manage" />}>
            <Route path="/users/create" element={<CreateUserPage />} />
            <Route path="/users/:id/edit" element={<EditUserPage />} />
          </Route>
          <Route element={<PermissionRoute permission="Role-view" />}>
            <Route path="/roles" element={<RolesPage />} />
          </Route>
          <Route element={<PermissionRoute permission="Role-manage" />}>
            <Route path="/roles/create" element={<CreateRolePage />} />
            <Route path="/roles/:id/edit" element={<EditRolePage />} />
          </Route>
        </Route>
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
